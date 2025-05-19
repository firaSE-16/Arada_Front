import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./Component/Layout/Layout";
import Sidebar from "./components/layoutComponents/Sidebar";
import About from "./pages/About/About";
import AuthPage from "./pages/Auth/Auth";
import Contact from "./pages/Contact/Contact";
import Department from "./pages/Department/Department";
import AssignedRecords from "./pages/doctor/AssignedRecords";
import PatientDetail from "./pages/Doctor/PatientDetail";
import Doctor from "./pages/Doctors/Doctor";
import Home from "./pages/Home/Home";
import AddNewStaff from "./pages/hospitalAdmin/AddNewStaff";
import HospitalAdminDashboard from "./pages/hospitalAdmin/Dashboard";
import EditViewStaff from "./pages/hospitalAdmin/EditViewStaff";
import StaffManagement from "./pages/hospitalAdmin/StaffManagement";
import ViewRecords from "./pages/hospitalAdmin/ViewRecords";
import LabForm from "./pages/labratorist/LabForm";
import LabRequests from "./pages/labratorist/LabRequests";
import NotFound from "./pages/NotFound";
import Patient from "./pages/Patient/Patient";
import NewRegistration from "./pages/receptionist/NewRegistration";
import PatientRegistration from "./pages/receptionist/PatientRegistration";
import RegisteredPatient from "./pages/receptionist/RegisteredPatient";
import ProcessPatient from "./pages/triage/PatientForm";
import UnassignedPatients from "./pages/triage/UnassignedPatient";

const AppRoutes = ({ userRole }) => {
  const staffRoles = [
    "Admin",
    "HospitalAdministrator",
    "Receptionist",
    "Doctor",
    "Triage",
    "LabTechnician"
  ];

  const isStaffUser = staffRoles.includes(userRole);
  const isPatient = userRole === "Patient";

  return (
    <div className="flex">
      {/* Sidebar only for staff users on their routes */}
      {isStaffUser && (
        <div className="fixed top-0 left-0 h-full w-80 z-50 overflow-hidden">
          <Sidebar />
        </div>
      )}

      <div className={`flex-1 ${isStaffUser ? "ml-80" : ""}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/department" element={<Layout><Department /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/showDoctor" element={<Layout><Doctor /></Layout>} />
          <Route path="/login" element={<AuthPage />} />

          

          {/* Hospital Admin Routes */}
          {isStaffUser && userRole === "HospitalAdministrator" && (
            <>
              <Route path="/hospital-admin/dashboard" element={<HospitalAdminDashboard />} />
              <Route path="/hospital-admin/add-staff" element={<AddNewStaff />} />
              <Route path="/hospital-admin/edit-staff" element={<EditViewStaff />} />
              <Route path="/hospital-admin/staff-management" element={<StaffManagement />} />
              <Route path="/hospital-admin/view-records" element={<ViewRecords />} />
              <Route path="/hospital-admin" element={<Navigate to="/hospital-admin/dashboard" />} />
            </>
          )}

          {/* Receptionist Routes */}
          {isStaffUser && userRole === "Receptionist" && (
            <>
              <Route path="/receptionist/registration" element={<PatientRegistration />} />
              <Route path="/receptionist/registered/:faydaID" element={<RegisteredPatient />} />
              <Route path="/receptionist/newRegistration" element={<NewRegistration />} />
              <Route path="/receptionist" element={<Navigate to="/receptionist/dashboard" />} />
            </>
          )}

          {/* Triage Routes */}
          {isStaffUser && userRole === "Triage" && (
            <>
              <Route path="/triage/process/:id" element={<ProcessPatient />} />
              <Route path="/triage/unassigned" element={<UnassignedPatients />} />
              <Route path="/triage" element={<Navigate to="/triage/dashboard" />} />
            </>
          )}

          {/* Doctor Routes */}
          {isStaffUser && userRole === "Doctor" && (
            <>
              <Route path="/doctor/assigned-records" element={<AssignedRecords />} />
              <Route path="/doctor/records/:patientId" element={<PatientDetail />} />
              <Route path="/doctor" element={<Navigate to="/doctor/dashboard" />} />
            </>
          )}

          {/* Lab Technician Routes */}
          {isStaffUser && userRole === "LabTechnician" && (
            <>
              <Route path="/laboratorist/patientList" element={<LabRequests />} />
              <Route path="/laboratorist/requests/:id" element={<LabForm />} />
              <Route path="/laboratorist" element={<Navigate to="/laboratorist/dashboard" />} />
            </>
          )}

          {/* Patient Route */}
          {isPatient && (
            <Route path="/user" element={<Patient />} />
          )}

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default AppRoutes;