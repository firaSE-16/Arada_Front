import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./Component/Layout/Layout";
import Sidebar from "./components/layoutComponents/Sidebar";
import About from "./pages/About/About";
import AuthPage from "./pages/Auth/Auth";
import Contact from "./pages/Contact/Contact";
import Department from "./pages/Department/Department";
import AssignedRecords from "./pages/Doctor/AssignedRecords";
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
import NotFound from "./pages/Notfound";
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

  // Function to get dashboard route based on user role
  const getDashboardRoute = () => {
    switch(userRole) {
      case "HospitalAdministrator":
        return "/hospital-admin/dashboard";
      case "Receptionist":
        return "/receptionist/registration";
      case "Triage":
        return "/triage/unassigned";
      case "Doctor":
        return "/doctor/assigned-records";
      case "LabTechnician":
        return "/laboratorist/patientList";
      case "Patient":
        return "/user";
      default:
        return "/";
    }
  };

 const ProtectedRoute = ({ children }) => {
  if (userRole === null) {
    // Still loading auth state, show nothing (or a loader)
    return null;
  }

  if (!isStaffUser && !isPatient) {
    return <Navigate to="/" replace />;
  }

  return children;
};

  // PublicRoute component for non-authenticated users
  const PublicRoute = ({ children }) => {
    if (isStaffUser || isPatient) {
      return <Navigate to={getDashboardRoute()} replace />;
    }
    return children;
  };

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
          {/* Public Routes - only accessible when not logged in */}
          <Route path="/" element={
            <PublicRoute>
              <Layout><Home /></Layout>
            </PublicRoute>
          } />
          <Route path="/department" element={
            <PublicRoute>
              <Layout><Department /></Layout>
            </PublicRoute>
          } />
          <Route path="/about" element={
            <PublicRoute>
              <Layout><About /></Layout>
            </PublicRoute>
          } />
          <Route path="/contact" element={
            <PublicRoute>
              <Layout><Contact /></Layout>
            </PublicRoute>
          } />
          <Route path="/showDoctor" element={
            <PublicRoute>
              <Layout><Doctor /></Layout>
            </PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          } />

          {/* Hospital Admin Routes */}
          <Route path="/hospital-admin/dashboard" element={
            <ProtectedRoute>
              <HospitalAdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/hospital-admin/add-staff" element={
            <ProtectedRoute>
              <AddNewStaff />
            </ProtectedRoute>
          } />
          <Route path="/hospital-admin/edit-staff" element={
            <ProtectedRoute>
              <EditViewStaff />
            </ProtectedRoute>
          } />
          <Route path="/hospital-admin/staff-management" element={
            <ProtectedRoute>
              <StaffManagement />
            </ProtectedRoute>
          } />
          <Route path="/hospital-admin/view-records" element={
            <ProtectedRoute>
              <ViewRecords />
            </ProtectedRoute>
          } />
          <Route path="/hospital-admin" element={
            <ProtectedRoute>
              <Navigate to="/hospital-admin/dashboard" replace />
            </ProtectedRoute>
          } />

          {/* Receptionist Routes */}
          <Route path="/receptionist/registration" element={
            <ProtectedRoute>
              <PatientRegistration />
            </ProtectedRoute>
          } />
          <Route path="/receptionist/registered/:faydaID" element={
            <ProtectedRoute>
              <RegisteredPatient />
            </ProtectedRoute>
          } />
          <Route path="/receptionist/newRegistration" element={
            <ProtectedRoute>
              <NewRegistration />
            </ProtectedRoute>
          } />
          <Route path="/receptionist" element={
            <ProtectedRoute>
              <Navigate to="/receptionist/registration" replace />
            </ProtectedRoute>
          } />

          {/* Triage Routes */}
          <Route path="/triage/process/:id" element={
            <ProtectedRoute>
              <ProcessPatient />
            </ProtectedRoute>
          } />
          <Route path="/triage/unassigned" element={
            <ProtectedRoute>
              <UnassignedPatients />
            </ProtectedRoute>
          } />
          <Route path="/triage" element={
            <ProtectedRoute>
              <Navigate to="/triage/unassigned" replace />
            </ProtectedRoute>
          } />

          {/* Doctor Routes */}
          <Route path="/doctor/assigned-records" element={
            <ProtectedRoute>
              <AssignedRecords />
            </ProtectedRoute>
          } />
          <Route path="/doctor/records/:patientId" element={
            <ProtectedRoute>
              <PatientDetail />
            </ProtectedRoute>
          } />
          <Route path="/doctor" element={
            <ProtectedRoute>
              <Navigate to="/doctor/assigned-records" replace />
            </ProtectedRoute>
          } />

          {/* Lab Technician Routes */}
          <Route path="/laboratorist/patientList" element={
            <ProtectedRoute>
              <LabRequests />
            </ProtectedRoute>
          } />
          <Route path="/laboratorist/requests/:id" element={
            <ProtectedRoute>
              <LabForm />
            </ProtectedRoute>
          } />
          <Route path="/laboratorist" element={
            <ProtectedRoute>
              <Navigate to="/laboratorist/patientList" replace />
            </ProtectedRoute>
          } />

          {/* Patient Route */}
          <Route path="/user" element={
            <ProtectedRoute>
              <Patient />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default AppRoutes;