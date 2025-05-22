import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";
import getUser from "./lib/getUser";
import AppRoutes from "./routes";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "./context/UserContext";

function App() {
  const { userRole, setUserRole } = useUser();
  const [authChecked, setAuthChecked] = useState(false); // Track auth state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser();
        setUserRole(user?.role || null);
      } catch (error) {
        setUserRole(null);
      } finally {
        setAuthChecked(true); // Auth check complete
      }
    };

    fetchUser();
  }, [setUserRole]);

  // Wait until auth check is done before rendering routes
  if (!authChecked) {
    return (
      <div className="grid place-items-center h-screen">
        
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ToastContainer />
      <AppRoutes userRole={userRole} />
    </BrowserRouter>
  );
}
export default App;