import React from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';

const Dashboard = () => {

  return (
    <div className="homepage-container">
      <h1 className="homepage-heading">Welcome to CareConnect</h1>
      <div className="button-container">
        <Link className="btn patient-btn" to='/patientSignIn'>
          Patient Login
        </Link>
        <Link className="btn doctor-btn" to='/doctorSignIn'>
          Doctor Login
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
