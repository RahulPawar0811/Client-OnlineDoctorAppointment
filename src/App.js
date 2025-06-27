import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import DoctorSignUp from './pages/DoctorSignUp';
import DoctorSignIn from './pages/DoctorSignIn';
import PatientSignUp from './pages/PatientSignUp';
import PatientSignIn from './pages/PatientSignIn';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import ConsultationForm from './pages/ConsultationForm';
import Doctors from './components/Doctors';
import Patients from './components/Patients';
import PrescriptionPage from './pages/PrescriptionPage';
import AllPatients from './components/AllPatients';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/doctorSignUp" element={<DoctorSignUp />} />
        <Route path="/doctorSignIn" element={<DoctorSignIn />} />
        <Route path="/patientSignUp" element={<PatientSignUp />} />
        <Route path="/patientSignIn" element={<PatientSignIn />} />

        {/* Doctor Routes */}
        <Route path="/doctorPortal" element={<DoctorDashboard />} >
          <Route path='patients/:id' element={<Patients/>}/>
          <Route path='AllPatients' element={<AllPatients/>}/>
          <Route path="prescriptions/:id" element={<PrescriptionPage />} />
        </Route>

        {/* Patient Routes */}
        
        <Route path="/patientPortal" element={<PatientDashboard />}>
         <Route path="doctors" element={<Doctors />}/>
          <Route path="consultationForm/:id" element={<ConsultationForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
