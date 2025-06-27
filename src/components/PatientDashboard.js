import React, { useEffect, useState } from 'react';
import { Link, useNavigate,Outlet } from 'react-router-dom';
import api from './apiConfig';
import { usePatient } from '../context/PatientContext';
import Swal from 'sweetalert2';
import { imageUrl } from './apiConfig';


const PatientDashboard = () => {
  const navigate = useNavigate();
  const {patient,setPatient} = usePatient();
  const [showLogout, setShowLogout] = useState(false);
  const [doctors,setDoctors] = useState([]);

  const onLogout = async () => {
    try {
      const response = await api.get("/patientLogout", { withCredentials: true });

      if (response.status === 200) {
        await Swal.fire({
          icon: 'success',
          title: 'Logged out!',
          text: 'You have been successfully logged out.',
          timer: 2000,
          showConfirmButton: false,
        });

        // Redirect after alert closes
        window.location.href = "/patientSignIn"; // Adjust path as needed
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Logout failed',
          text: 'Please try again.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred during logout.',
      });
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    if (patient) return; // Prevent unnecessary API calls

    api.get('/patientPortal', { withCredentials: true })
      .then((res) => {
        if (res.data.Success === "Success") {
          // Map your patient data according to your backend response
          const patientData = {
            id: res.data.id,
            profile_picture: res.data.profile_picture,
            name: res.data.name,
            age: res.data.age,
            email: res.data.email,
            phone: res.data.phone,
            history_of_surgery: res.data.history_of_surgery,
            history_of_illness: res.data.history_of_illness,
          };

          setPatient(patientData);

          if (window.location.pathname === "/patientSignIn") {
            navigate("/");
          }
        } else {
          navigate("/patientSignIn");
        }
      })
      .catch((error) => {
        console.error("Error fetching patient data:", error);
        if (error.response?.status === 401) {
          navigate("/patientSignIn");
        }
      });
  }, [patient, navigate]);

  const toggleLogout = () => {
    setShowLogout(!showLogout);
  };

  const loadDoctors = async () => {
    try {
      const res = await api.get('/getAllDoctors');
      const doctors = res.data;
      // Use doctors data as needed, e.g., set state:
       setDoctors(doctors);
      console.log(doctors);
    } catch (error) {
      console.error("Failed to load doctors:", error);
    }
  };

  useEffect(()=>{
    loadDoctors();
  },[])

  if (!patient) {
    return <div>Loading patient information...</div>;
  }

  return (
    <>
      {/* Navbar */}
      {/* Bootstrap Navbar */}
      
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
        <div className="container-fluid">
          <div className="navbar-brand d-flex flex-column">
            <span className="fs-4 fw-bold">{patient.name}</span>
            <small>{patient.email}</small>
            <small>{patient.phone}</small>
          </div>

          <div className="dropdown">
            <img
              src={`${imageUrl}/uploads/patients/${patient.profile_picture}`}
              alt="Patient Profile"
              className="rounded-circle"
              style={{ width: 50, height: 50, objectFit: "cover", cursor: "pointer" }}
              id="profileDropdown"
              onClick={toggleLogout}
            />
            <ul
              className={`dropdown-menu dropdown-menu-end${showLogout ? " show" : ""}`}
              aria-labelledby="profileDropdown"
              style={{ minWidth: "8rem" }}
            >
              <li>
                <button className="dropdown-item" onClick={onLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Outlet />

      {/* Doctors Cards */}
     

     </>

    
  );
};

export default PatientDashboard;
