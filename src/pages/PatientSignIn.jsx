import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../css/PatientSignIn.css'; // patient-specific CSS
import api from '../components/apiConfig';

const PatientSignIn = () => {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      // Allow digits only
      const onlyNums = value.replace(/\D/g, '');
      setFormData((prev) => ({ ...prev, phone: onlyNums }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Optional: showLoader();

    try {
      const response = await api.post('/patientLogin', {
        phone: formData.phone,
        password: formData.password,
      }, {
        withCredentials: true
      });

      Swal.fire({
        icon: 'success',
        title: 'Welcome back!',
        text: 'You have successfully signed in',
        timer: 1500,
        showConfirmButton: false,
      });

      // Optional: hideLoader();

      navigate('/patientPortal/doctors');
    } catch (error) {
      // Optional: hideLoader();

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.data?.message || 'Sign in failed. Please try again.',
      });
    }
  };

  return (
    <div className="patient-signin-container">
      <h2>Patient Sign In</h2>
      <form onSubmit={handleSubmit} className="patient-signin-form">
        <div className="form-group">
          <label>
            Phone Number <span className="required">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            required
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </div>

        <div className="form-group">
          <label>
            Password <span className="required">*</span>
          </label>
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

        <p className="signup-redirect">
          Don't have an account? <Link to="/patientSignUp">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default PatientSignIn;
