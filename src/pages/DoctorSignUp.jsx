import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../css/DoctorSignUp.css';
import { Link } from 'react-router-dom';
import api from '../components/apiConfig';

const DoctorSignUp = () => {
    const [formData, setFormData] = useState({
        profilePicture: null,
        name: '',
        specialty: '',
        email: '',
        phone: '',
        experience: '',
        password: '',
        confirmPassword: '',
      });
      

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePicture') {
      setFormData({ ...formData, profilePicture: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Passwords do not match. Please try again.',
      });
      return;
    }
  
    const data = new FormData();
    data.append('profilePicture', formData.profilePicture);
    data.append('name', formData.name);
    data.append('specialty', formData.specialty);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('experience', formData.experience);
    data.append('password', formData.password); // Include password
  
    try {
      const res = await api.post('/registerDoctor', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Doctor signed up successfully',
      });
  
      setFormData({
        profilePicture: null,
        name: '',
        specialty: '',
        email: '',
        phone: '',
        experience: '',
        password: '',
        confirmPassword: '',
      });
  
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text:
          error.response?.data?.message ||
          'Something went wrong! Please try again.',
      });
    }
  };
  

  return (
<div className="signup-container">
  <h2>Doctor Sign Up</h2>
  <form onSubmit={handleSubmit} className="signup-form">
    <label>
      Full Name <span className="required">*</span>
      <input
        type="text"
        name="name"
        placeholder="Enter your full name"
        value={formData.name}
        onChange={handleChange}
        required
      />
    </label>

    <label>
      Specialty <span className="required">*</span>
      <input
        type="text"
        name="specialty"
        placeholder="e.g. Cardiologist"
        value={formData.specialty}
        onChange={handleChange}
        required
      />
    </label>

    <label>
      Email <span className="required">*</span>
      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        required
      />
    </label>

    <label>
      Phone Number <span className="required">*</span>
      <input
        type="tel"
        name="phone"
        placeholder="Enter your phone number"
        value={formData.phone}
        onChange={handleChange}
        required
      />
    </label>

    <label>
      Years of Experience <span className="required">*</span>
      <input
        type="text"
        name="experience"
        placeholder="e.g. 1.5"
        value={formData.experience}
        onChange={handleChange}
        required
        pattern="^\d+(\.\d{1,2})?$"
        title="Enter a valid number like 1, 2.5, etc."
      />
    </label>

    <label className="custom-file-upload">
      Upload Profile Picture
      <input
        type="file"
        name="profilePicture"
        accept="image/*"
        onChange={handleChange}
        required
      />
    </label>

    <label>
  Password <span className="required">*</span>
  <input
    type="password"
    name="password"
    placeholder="Enter your password"
    value={formData.password}
    onChange={handleChange}
    required
    minLength={6}
  />
</label>

<label>
  Confirm Password <span className="required">*</span>
  <input
    type="password"
    name="confirmPassword"
    placeholder="Re-enter your password"
    value={formData.confirmPassword}
    onChange={handleChange}
    required
  />
</label>


    <button type="submit" className="submit-btn">
      Sign Up
    </button>

    <p className="login-redirect">
      Already have an account? <Link to="/doctorSignIn">Sign In</Link>
    </p>
  </form>
</div>
  );
};

export default DoctorSignUp;
