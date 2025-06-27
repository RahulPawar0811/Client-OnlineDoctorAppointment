import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import '../css/Patient.css';
import { Link } from 'react-router-dom';
import api from '../components/apiConfig';

const PatientSignUp = () => {
  const [formData, setFormData] = useState({
    profilePicture: null,
    name: '',
    age: '',
    email: '',
    phone: '',
    surgeryHistory: '',
    illnessHistory: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePicture') {
      setFormData((prev) => ({ ...prev, profilePicture: files[0] }));
    } else if (name === 'phone' || name === 'age') {
      // Allow only numbers for phone and age
      const onlyNums = value.replace(/\D/g, '');
      setFormData((prev) => ({ ...prev, [name]: onlyNums }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    return Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Passwords do not match!',
    });
  }

  try {
    const data = new FormData();

    // Append image
    if (formData.profilePicture) {
      data.append('profilePicture', formData.profilePicture);
    }

    // Append other fields
    data.append('name', formData.name);
    data.append('age', formData.age);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('history_of_surgery', formData.surgeryHistory || '');
    data.append('history_of_illness', formData.illnessHistory || '');
    data.append('password', formData.password);

    // 🔍 LOG: Show what's being sent
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    await api.post('/patientRegister', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    Swal.fire('Success!', 'Patient registered successfully.', 'success');

    // // Clear form after submission
    setFormData({
      profilePicture: null,
      name: '',
      age: '',
      email: '',
      phone: '',
      surgeryHistory: '',
      illnessHistory: '',
      password: '',
      confirmPassword: '',
    });
  } catch (error) {
    console.error('Registration Error:', error);
    Swal.fire(
      'Error',
      error.response?.data?.message || 'Something went wrong',
      'error'
    );
  }
};



  // Convert illness history string to array
  const illnessList = formData.illnessHistory
    .split(',')
    .map((ill) => ill.trim())
    .filter((ill) => ill.length > 0);

  return (
    <div className="patient-signup-container">
      <h2>Patient Sign Up</h2>
      <form onSubmit={handleSubmit} className="patient-signup-form" encType="multipart/form-data">
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
          Age <span className="required">*</span>
          <input
            type="text"
            name="age"
            placeholder="Enter your age"
            value={formData.age}
            onChange={handleChange}
            required
            maxLength={3}
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
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </label>

        <label>
          History of Surgery
          <input
            type="text"
            name="surgeryHistory"
            placeholder="Describe any surgery history"
            value={formData.surgeryHistory}
            onChange={handleChange}
          />
        </label>

        <label>
          History of Illness (separate by commas)
          <input
            type="text"
            name="illnessHistory"
            placeholder="e.g. diabetes, asthma"
            value={formData.illnessHistory}
            onChange={handleChange}
          />
        </label>

        {illnessList.length > 0 && (
          <div className="illness-panel">
            <strong>Illness History:</strong>
            <ul>
              {illnessList.map((ill, idx) => (
                <li key={idx}>{ill}</li>
              ))}
            </ul>
          </div>
        )}

        <label>
          Password <span className="required">*</span>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Confirm Password <span className="required">*</span>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </label>

        <label className="custom-file-upload">
          Upload Profile Picture <span className="required">*</span>
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" className="submit-btn">
          Sign Up
        </button>
        <p className="login-redirect">
  Already have an account? <Link to="/patientSignIn">Sign In</Link>
</p>
      </form>
    </div>
  );
};

export default PatientSignUp;
