import React, { useEffect, useRef, useState } from 'react';
import { useNavigate , Outlet} from 'react-router-dom';
import api from './apiConfig';
import { useDoctor } from '../context/DoctorContext';
import Swal from 'sweetalert2';
import { imageUrl } from './apiConfig';
const DoctorDashboard = () => {
  const {setDoctor} = useDoctor();
  const {doctor} = useDoctor();
  const navigate = useNavigate();
    const [showLogout, setShowLogout] = useState(false);

  const toggleLogout = () => {
    setShowLogout(!showLogout);
  };

    const onLogout = async () => {
    try {
      const response = await api.get("/doctorLogout", { withCredentials: true });

      if (response.status === 200) {
        await Swal.fire({
          icon: 'success',
          title: 'Logged out!',
          text: 'You have been successfully logged out.',
          timer: 2000,
          showConfirmButton: false,
        });

        // Redirect after alert closes
        window.location.href = "/doctorSignIn"; // Adjust path as needed
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
    if (doctor) return; // Prevent unnecessary API calls
  
    api.get('/doctorPortal', { withCredentials: true })
      .then((res) => {
        if (res.data.Success === "Success") {
          // Assuming your API returns the doctor object with these fields:
          // id, profile_picture, name, specialty, email, phone, years_of_experience
          const doctorData = {
            id: res.data.id,
            profile_picture: res.data.profile_picture,
            name: res.data.name,
            specialty: res.data.specialty,
            email: res.data.email,
            phone: res.data.phone,
            years_of_experience: res.data.years_of_experience,
            // created_at, updated_at are usually not needed in frontend state
          };
  
          setDoctor(doctorData);
  
          if (window.location.pathname === "/doctorSignIn") {
            navigate("/");
          }
        } else {
          navigate("/doctorSignIn");
        }
      })
      .catch((error) => {
        console.error("Error fetching doctor data:", error);
        if (error.response?.status === 401) {
          navigate("/doctorSignIn ");
        }
      });
  }, [doctor, navigate]);
  

  if (!doctor) {
    return <div>Loading doctor information...</div>;
  }

  return (
    <>
<nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
        <div className="container-fluid">
          <div className="navbar-brand d-flex flex-column">
            <span className="fs-4 fw-bold">{doctor.name}</span>
            <small>{doctor.email}</small>
            <small>{doctor.phone}</small>
          </div>

          <div className="dropdown">
            <img
              src={`${imageUrl}/uploads/doctors/${doctor.profile_picture}`}
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
            </>
  );
};

export default DoctorDashboard;
