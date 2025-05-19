import { useUser } from "@/context/UserContext";
import { BASE_URL } from "@/lib/utils";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Stethoscope,
  UserPlus,
  Users,
  ClipboardList,
  ClipboardCheck,
  HelpCircle,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const roleBasedMenuItems = {
  Doctor: [
    {
      name: "Records",
      path: "/doctor/assigned-records",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      name: "Dashboard",
      path: "/doctor/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Profile",
      path: "/doctor/profile",
      icon: <Stethoscope className="w-5 h-5" />,
    },
  ],
  HospitalAdministrator: [
    {
      name: "Dashboard",
      path: "/hospital-admin/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Staff",
      path: "/hospital-admin/staff-management",
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: "Add Staff",
      path: "/hospital-admin/add-staff",
      icon: <UserPlus className="w-5 h-5" />,
    },
  ],
  Receptionist: [
    {
      name: "Register",
      path: "/receptionist/registration",
      icon: <UserPlus className="w-5 h-5" />,
    },
    {
      name: "Dashboard",
      path: "/receptionist/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
  ],
  Triage: [
    {
      name: "Queue",
      path: "/triage/unassigned",
      icon: <ClipboardList className="w-5 h-5" />,
    },
    {
      name: "Dashboard",
      path: "/triage/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
  ],
  LabTechnician: [
    {
      name: "Tests",
      path: "/laboratorist/patientList",
      icon: <ClipboardCheck className="w-5 h-5" />,
    },
    {
      name: "Dashboard",
      path: "/laboratorist/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
  ],
};

const BottomNav = () => {
  const navigate = useNavigate();
  const { userRole, setUserRole } = useUser();
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUserRole(null);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const menuItems = roleBasedMenuItems[userRole] || [];

  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex justify-around items-center h-16">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
                    isActive
                      ? "text-[#5AC5C8]"
                      : "text-gray-500 hover:text-[#5AC5C8]"
                  }`
                }
              >
                <span className="[&>svg]:w-6 [&>svg]:h-6">{item.icon}</span>
                <span className="text-xs mt-1 font-medium">{item.name}</span>
              </NavLink>
            ))}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-[#5AC5C8] transition-colors duration-200"
            >
              <Settings className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">More</span>
            </button>
          </div>
        </div>
      </div>

      {/* Settings Menu */}
      {showSettings && (
        <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="max-w-screen-xl mx-auto px-4 py-4">
            <div className="flex flex-col space-y-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <HelpCircle className="w-5 h-5" />
                <span>Help & Support</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {showSettings && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setShowSettings(false)}
        />
      )}
    </>
  );
};

export default BottomNav; 