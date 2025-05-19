import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";
import getUser from "./lib/getUser";
import AppRoutes from "./routes";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "./context/UserContext";

function App() {
  const { userRole, setUserRole } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser();
        setUserRole(user?.role || null);
      } catch (error) {
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setUserRole]);

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <AppRoutes userRole={userRole} />
    </BrowserRouter>
  );
}

export default App;