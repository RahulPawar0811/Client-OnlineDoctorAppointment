import React, { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import api, { imageUrl } from '../components/apiConfig';

const PrescriptionPage = () => {
  const { id } = useParams(); // patient_id
  const [data, setData] = useState(null);
  const [care, setCare] = useState('');
  const [meds, setMeds] = useState('');
  const [pdfBlob, setPdfBlob] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await api.get(`/getPatientsById/${id}`);
        if (res.data.length > 0) {
          setData(res.data[0]);
        } else {
          Swal.fire('Error', 'Patient not found.', 'error');
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to fetch patient data.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!care.trim()) {
      return Swal.fire('Missing Field', 'Care to be taken is required.', 'warning');
    }

    // Create PDF
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Prescription for ${data.name}`, 20, 20);
    doc.setFontSize(12);
    doc.text(`Patient ID: ${data.patient_id}`, 20, 30);
    doc.text(`Age: ${data.age}`, 20, 40);
    doc.text(`Email: ${data.email}`, 20, 50);
    doc.text(`Phone: ${data.phone}`, 20, 60);
    doc.text('---', 20, 70);
    doc.text('Care to be taken:', 20, 80);
    doc.text(care, 20, 90, { maxWidth: 170 });
    doc.text('Medicines:', 20, 120);
    doc.text(meds || 'N/A', 20, 130, { maxWidth: 170 });

    const pdfBlob = doc.output('blob');
    setPdfBlob(pdfBlob);

    const form = new FormData();
    form.append('patient_id', data.patient_id);
    form.append('consultation_id', data.consultation_id);
    form.append('doctor_id', data.doctor_id);
    form.append('patient_email', data.email);
    form.append('care', care);
    form.append('medicines', meds);
    form.append('prescription_pdf', pdfBlob, `prescription_${data.patient_id}.pdf`);

    try {
      await api.post('/submitPrescription', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Swal.fire('Success', 'Prescription submitted successfully.', 'success');
      navigate('/doctorPortal/patients')
    } catch (error) {
      Swal.fire('Error', 'Failed to submit prescription.', 'error');
    }
  };

  if (loading) return <div className="text-center mt-4">Loading patient data...</div>;
  if (!data) return null;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Prescription Page</h2>

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <div className="row">
            <div className="col-md-10">
              <p><strong>Name:</strong> {data.name}</p>
              <p><strong>Age:</strong> {data.age}</p>
              <p><strong>Email:</strong> {data.email}</p>
              <p><strong>Phone:</strong> {data.phone}</p>
              <p><strong>Current Illness:</strong> {data.current_illness}</p>
              <p><strong>Recent Surgery:</strong> {data.recent_surgery}</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
        <div className="mb-3">
          <label className="form-label"><strong>Care to be taken *</strong></label>
          <textarea
            className="form-control"
            rows="3"
            value={care}
            onChange={(e) => setCare(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label"><strong>Medicines</strong></label>
          <textarea
            className="form-control"
            rows="3"
            value={meds}
            onChange={(e) => setMeds(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary me-2">
          {pdfBlob ? 'Update & Resend Prescription' : 'Submit Prescription'}
        </button>

        {pdfBlob && (
          <a
            href={URL.createObjectURL(pdfBlob)}
            download={`prescription_${data.patient_id}.pdf`}
            className="btn btn-success"
          >
            Download PDF
          </a>
        )}
      </form>
    </div>
  );
};

export default PrescriptionPage;
