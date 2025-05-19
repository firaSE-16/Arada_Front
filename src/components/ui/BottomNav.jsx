import { Home, User, ClipboardList, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/doctor/dashboard" },
    { icon: User, label: "Patients", path: "/doctor/patients" },
    { icon: ClipboardList, label: "Records", path: "/doctor/records" },
    { icon: Settings, label: "Settings", path: "/doctor/settings" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
                  isActive
                    ? "text-[#5AC5C8]"
                    : "text-gray-500 hover:text-[#5AC5C8]"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 w-12 h-1 bg-[#5AC5C8] rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav; 