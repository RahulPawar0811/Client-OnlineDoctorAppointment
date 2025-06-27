import React, { useEffect, useState } from 'react';
import { Link, useNavigate,Outlet } from 'react-router-dom';
import api from './apiConfig';
import Swal from 'sweetalert2';
import { imageUrl } from './apiConfig';
const Doctors = () => {
      const [doctors,setDoctors] = useState([]);

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

  return (
     <main className="container py-4">
        <div className="row g-4 justify-content-center">
          {doctors.map((doc) => (
            <div key={doc.id} className="col-sm-6 col-md-4 col-lg-3">
              <div className="card shadow-sm h-100 border-0 rounded-3">
                <img
                  src={`${imageUrl}/uploads/doctors/${doc.profile_picture}`}
                  className="card-img-top rounded-top"
                  alt={doc.name}
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{doc.name}</h5>
                  <p className="card-text mb-1">
                    <strong>Specialty:</strong> {doc.specialty}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Email:</strong> {doc.email}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Phone:</strong> {doc.phone}
                  </p>
                  <p className="card-text mb-3">
                    <strong>Experience:</strong> {doc.years_of_experience} years
                  </p>
                  <Link className="btn btn-primary " to={`/patientPortal/consultationForm/${doc.id}`}>
                    Consult
                  </Link>

                </div>
              </div>
            </div>
          ))}
        </div>
         
      </main>
  )
}

export default Doctors