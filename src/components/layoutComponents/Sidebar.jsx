import { useUser } from "@/context/UserContext";
import { BASE_URL } from "@/lib/utils";
import {
  BarChart4,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  ClipboardEdit,
  ClipboardList,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Stethoscope,
  UserPlus,
  Users,
  X
} from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Updated icons for better visual hierarchy
const roleBasedMenuItems = {
  Doctor: [
    {
      name: "Medical Records",
      path: "/doctor/assigned-records",
      icon: <FileText className="w-5 h-5" />,
    },
    
  ],
  HospitalAdministrator: [
    {
      name: "Hospital Overview",
      path: "/hospital-admin/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Staff Management",
      path: "/hospital-admin/staff-management",
      icon: <Users className="w-5 h-5" />,
      subLinks: [
        { 
          name: "All Staff", 
          path: "/hospital-admin/staff-management",
          icon: <Users className="w-4 h-4" /> 
        },
        { 
          name: "Add New Staff", 
          path: "/hospital-admin/add-staff",
          icon: <UserPlus className="w-4 h-4" /> 
        },
      ],
    }
  ],
  Receptionist: [
    {
      name: "Patient Registration",
      path: "/receptionist/registration",
      icon: <UserPlus className="w-5 h-5" />,
    },
  ],
  Triage: [
    {
      name: "Patient Queue",
      path: "/triage/unassigned",
      icon: <ClipboardList className="w-5 h-5" />,
    },
  ],
  LabTechnician: [
    {
      name: "Test Requests",
      path: "/laboratorist/patientList",
      icon: <ClipboardCheck className="w-5 h-5" />,
    },
  ],
};

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { userRole, setUserRole } = useUser();

  const handleMenuClick = (item, event) => {
    if (item.subLinks) {
      event.preventDefault();
      setOpenMenus((prev) => ({
        ...prev,
        [item.name]: !prev[item.name],
      }));
    } else {
      navigate(item.path);
      if (window.innerWidth < 1024) setIsCollapsed(false);
    }
  };

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
      {/* Mobile Toggle Button */}
      <button 
        className={`fixed lg:hidden z-50 top-4 left-4 p-2 rounded-lg bg-[#2E86AB] text-white shadow-md`}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <div 
        className={`
          fixed h-screen flex flex-col bg-gradient-to-b from-[#1A4E6B] to-[#0D2C3E]
          shadow-xl transition-all duration-300 ease-in-out z-40
          ${isCollapsed ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0 lg:w-72'}
        `}
      >
        {/* Logo Header */}
        <div className="h-24 px-6 flex items-center justify-between border-b border-[#2A5D7A]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Stethoscope className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide">MediCare Pro</h1>
          </div>
          <button 
            className="hidden lg:block text-white/60 hover:text-white p-1"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <X size={20} />
          </button>
        </div>

        {/* User Profile */}
        <div className="px-6 py-4 flex items-center gap-3 border-b border-[#2A5D7A]">
          <div className="w-10 h-10 rounded-full bg-[#5AC5C8] flex items-center justify-center text-white font-bold">
            {userRole?.charAt(0)}
          </div>
          <div>
            <p className="text-white font-medium">Administrator</p>
            <p className="text-xs text-white/60 capitalize">{userRole}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  onClick={(e) => handleMenuClick(item, e)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${isActive 
                      ? "bg-[#5AC5C8] text-white shadow-md" 
                      : "text-white/80 hover:bg-white/10 hover:text-white"}`
                  }
                >
                  <span className="[&>svg]:w-5 [&>svg]:h-5">
                    {item.icon}
                  </span>
                  <span className="flex-1 font-medium">{item.name}</span>
                  {item.subLinks && (
                    <span>
                      {openMenus[item.name] ? 
                        <ChevronUp className="w-4 h-4" /> : 
                        <ChevronDown className="w-4 h-4" />}
                    </span>
                  )}
                </NavLink>

                {item.subLinks && openMenus[item.name] && (
                  <ul className="ml-12 mt-1 space-y-1">
                    {item.subLinks.map((sub) => (
                      <li key={sub.name}>
                        <NavLink
                          to={sub.path}
                          className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 text-sm rounded transition-all
                            ${isActive
                              ? "text-[#5AC5C8] font-medium"
                              : "text-white/70 hover:text-white"}`
                          }
                        >
                          <span className="[&>svg]:w-4 [&>svg]:h-4">
                            {sub.icon}
                          </span>
                          {sub.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Section */}
        <div className="px-6 py-4 border-t border-[#2A5D7A]">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-white/80 hover:text-white rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
          <div className="mt-4 flex justify-center gap-4">
            <button className="text-white/50 hover:text-white">
              <Settings size={18} />
            </button>
            <button className="text-white/50 hover:text-white">
              <HelpCircle size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setIsCollapsed(false)}
        />
      )}
    </>
  );
};

export default Sidebar;