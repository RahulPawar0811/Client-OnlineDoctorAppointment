import React, { useState, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import api from '../components/apiConfig';
import { usePatient } from '../context/PatientContext';

const ConsultationForm = () => {
  const { id } = useParams(); // Get the doctor ID from the URL
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    illnessHistory: '',
    recentSurgery: '',
    surgeryTimeSpan: '',
    familyHistory: '',
    diabetes: '',
    allergies: '',
    otherConditions: '',
    paymentTransactionId: '',
  });
  const [doctor, setDoctor] = useState({ name: '', specialty: '' });
  const {patient} = usePatient();
  const navigate = useNavigate();
  

  // Fetch doctor data by ID when component mounts
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await api.get(`/getDoctorById/${id}`);
        setDoctor(response.data); // Assume the doctor data is in response.data
      } catch (error) {
        console.error('Error fetching doctor details:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to fetch doctor details.',
        });
      }
    };
    fetchDoctorDetails();
  }, [id]);

  // Step 1: Handle changes in form data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Step 2: Handle radio button for diabetes
  const handleRadioChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      diabetes: e.target.value,
    }));
  };

  // Step 3: Go to the next step
  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  // Step 4: Go to the previous step
  const previousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  // Step 5: Submit the form data to the backend
const handleSubmit = async (e) => {
  e.preventDefault();

  // Create a new FormData object
  const formDataToSend = new FormData();

  // Append the state values to the FormData object
  formDataToSend.append('patient_id', patient.id); // Assuming patient.id is available
  formDataToSend.append('doctor_id', id); // Assuming doctorId is available
  formDataToSend.append('current_illness', formData.illnessHistory);
  formDataToSend.append('recent_surgery', formData.recentSurgery);
  formDataToSend.append('surgery_timespan', formData.surgeryTimeSpan);
  formDataToSend.append('family_history_diabetes', formData.diabetes);
  formDataToSend.append('allergies', formData.allergies);
  formDataToSend.append('others', formData.otherConditions);
  formDataToSend.append('payment_transaction_id', formData.paymentTransactionId);

  try {
    const response = await api.post('/submitConsultation', formDataToSend, {
      headers: {
        'Content-Type': 'application/json', // This is important for FormData
      },
    });

    Swal.fire({
      icon: 'success',
      title: 'Consultation Submitted!',
      text: response.data.message || 'Your consultation has been successfully submitted.',
    });
    navigate('/patientPortal/doctors')
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.response?.data?.message || 'Something went wrong.',
    });
  }
};



  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Doctor's Consultation Form</h2>

      {/* Doctor Info */}
      {doctor.name && doctor.specialty && (
        <div className="alert alert-info mb-4">
          <h5>Consulting: Dr. {doctor.name}</h5>
          <p><strong>Specialty:</strong> {doctor.specialty}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Step 1 */}
        {currentStep === 1 && (
          <div>
            <h3>Step 1: Current Illness & Recent Surgery</h3>

            <div className="mb-3">
              <label htmlFor="illnessHistory" className="form-label">Current Illness History</label>
              <textarea
                id="illnessHistory"
                name="illnessHistory"
                className="form-control"
                value={formData.illnessHistory}
                onChange={handleInputChange}
                placeholder="Describe your current illness history"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="recentSurgery" className="form-label">Recent Surgery</label>
              <textarea
                id="recentSurgery"
                name="recentSurgery"
                className="form-control"
                value={formData.recentSurgery}
                onChange={handleInputChange}
                placeholder="Describe your recent surgery"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="surgeryTimeSpan" className="form-label">Surgery Time Span</label>
              <input
                id="surgeryTimeSpan"
                type="text"
                name="surgeryTimeSpan"
                className="form-control"
                value={formData.surgeryTimeSpan}
                onChange={handleInputChange}
                placeholder="How long ago was your surgery?"
              />
            </div>

            <div className="text-center">
              <button type="button" className="btn btn-primary" onClick={nextStep}>Next</button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <div>
            <h3>Step 2: Family Medical History</h3>

            <div className="mb-3">
              <label className="form-label">Diabetic or Non-Diabetic:</label>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  id="diabetic"
                  name="diabetes"
                  value="Diabetic"
                  checked={formData.diabetes === 'Diabetic'}
                  onChange={handleRadioChange}
                  className="form-check-input"
                />
                <label htmlFor="diabetic" className="form-check-label">Diabetic</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  id="non-diabetic"
                  name="diabetes"
                  value="Non-Diabetic"
                  checked={formData.diabetes === 'Non-Diabetic'}
                  onChange={handleRadioChange}
                  className="form-check-input"
                />
                <label htmlFor="non-diabetic" className="form-check-label">Non-Diabetic</label>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="allergies" className="form-label">Any Allergies</label>
              <input
                id="allergies"
                type="text"
                name="allergies"
                className="form-control"
                value={formData.allergies}
                onChange={handleInputChange}
                placeholder="List any allergies"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="otherConditions" className="form-label">Other Conditions</label>
              <input
                id="otherConditions"
                type="text"
                name="otherConditions"
                className="form-control"
                value={formData.otherConditions}
                onChange={handleInputChange}
                placeholder="Other family medical conditions"
              />
            </div>

            <div className="text-center">
              <button type="button" className="btn btn-secondary" onClick={previousStep}>Previous</button>
              <button type="button" className="btn btn-primary" onClick={nextStep}>Next</button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <div>
            <h3>Step 3: Payment</h3>

            <div className="mb-3">
              <label htmlFor="paymentTransactionId" className="form-label">Payment Transaction ID</label>
              <input
                id="paymentTransactionId"
                type="text"
                name="paymentTransactionId"
                className="form-control"
                value={formData.paymentTransactionId}
                onChange={handleInputChange}
                placeholder="Enter your transaction ID"
                required
              />
            </div>

            <div className="mb-3 text-center">
              <h4>QR Code for Payment</h4>
              <img src="/images/download.png" alt="QR Code for Payment" className="img-fluid" />
            </div>

            <div className="text-center">
              <button type="button" className="btn btn-secondary" onClick={previousStep}>Previous</button>
              <button type="submit" className="btn btn-success">Submit</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ConsultationForm;
