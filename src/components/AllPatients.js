import React, { useEffect, useState } from 'react';
import api from './apiConfig';
import { imageUrl } from './apiConfig';
import {Link, useParams} from 'react-router-dom'
import { useDoctor } from '../context/DoctorContext';

const AllPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  const {doctor} = useDoctor();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get(`/getAllPatients`);
        setPatients(response.data);
      } catch (err) {
        setError('Failed to load patients.');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const toggleDetails = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) return <div className="text-center mt-4">Loading patients...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  return (
    <div className="container mt-4">
  <div className="d-flex justify-content-between align-items-center mb-4">
    <h2>All Patients List</h2>
    <Link to={`/doctorPortal/patients/${doctor.id}`} className="btn btn-primary">
      View My Patients
    </Link>
  </div>

  {patients.length === 0 ? (
    <p>No patients found.</p>
  ) : (
    <div className="list-group">
      {patients.map((item) => (
        <div key={item.id} className="list-group-item mb-3 shadow-sm rounded">
          <div className="d-flex align-items-center mb-3">
            <img
              src={`${imageUrl}/uploads/patients/${item.profile_picture}`}
              alt={item.name}
              className="rounded-circle me-3"
              width={60}
              height={60}
            />
            <div>
              <h5 className="mb-1">{item.name}</h5>
              <p className="mb-0 text-muted small">
                Email: {item.email} | Phone: {item.phone} | Age: {item.age}
              </p>
            </div>
          </div>

          <button
            className="btn btn-sm btn-primary mb-3"
            onClick={() => toggleDetails(item.id)}
          >
            {expanded[item.id] ? 'Hide Symptoms/Details' : 'View Symptoms/Details'}
          </button>

          {expanded[item.id] && (
            <div className="border rounded p-3 bg-light">
              <p><strong>Current Illness:</strong> {item.current_illness || 'N/A'}</p>
              <p><strong>Recent Surgery:</strong> {item.recent_surgery || 'N/A'}</p>
              <p><strong>Surgery Timespan:</strong> {item.surgery_timespan || 'N/A'}</p>
              <p><strong>Family History of Diabetes:</strong> {item.family_history_diabetes || 'N/A'}</p>
              <p><strong>Allergies:</strong> {item.allergies || 'N/A'}</p>
              <p><strong>Other Conditions:</strong> {item.others || 'N/A'}</p>
              <p className="text-muted small">
                <em>Record created at: {new Date(item.created_at).toLocaleString()}</em>
              </p>

              {/* Add prescription link/button */}
              <Link to={`/doctorPortal/prescriptions/${item.patient_id}`} className="btn btn-sm btn-success">
                Give Prescription
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  )}
</div>

  );
};

export default AllPatients;
