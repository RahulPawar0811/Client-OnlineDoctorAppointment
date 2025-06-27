import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import '../css/DoctorSignUp.css'; // Reusing signup styles
import useFullPageLoader from '../components/useFullPageLoader';
import api from '../components/apiConfig';

const DoctorSignIn = () => {
  const navigate = useNavigate();
  const [loader,showLoader,hideLoader] = useFullPageLoader();

  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    showLoader();

    try {
      const res = await api.post(
        '/doctorLogin',
        formData, // ✅ This is the request body
        {
          withCredentials: true, // ✅ This is the config (for cookies)
        }
      );

      hideLoader();

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        timer: 1500,
        showConfirmButton: false,
      });

      navigate('/doctorPortal/AllPatients');
    } catch (error) {
      hideLoader();

      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text:
          error.response?.data?.message ||
          'Invalid phone number or password. Please try again.',
      });
    }
  };

  return (
    <div className="signup-container">
      <h2>Doctor Sign In</h2>
      <form onSubmit={handleSubmit} className="signup-form">
      <div className="form-group">
        <label>
            Phone Number <span className="required">*</span>
        </label>
        <input
        type="tel"
        name="phone"
        placeholder="Enter your phone number"
        value={formData.phone}
        onChange={(e) => {
            const onlyNums = e.target.value.replace(/\D/g, ''); // keep only digits
            setFormData(prev => ({ ...prev, phone: onlyNums }));
        }}
        required
        inputMode="numeric"
        pattern="[0-9]*"
        />

        </div>


        <div className="form-group">
          <label>Password <span className="required">*</span></label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Sign In
        </button>
        <p className="login-redirect">
      Don't have an account? <Link to="/doctorSignUp">Sign Up</Link>
    </p>
      </form>
    </div>
  );
};

export default DoctorSignIn;
