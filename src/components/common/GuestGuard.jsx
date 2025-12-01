import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { ROLES } from "../../constants/roles.js";
import LoadingSpinner from "./LoadingSpinner.jsx";

const GuestGuard = () => {
  const { user, role, loading } = useAuth();

  // Wait until authentication status is confirmed
  if (loading) {
    return <LoadingSpinner />;
  }

  // If user is logged in, redirect them from guest pages
  if (user && role) {
    // Redirect to the appropriate dashboard based on role
    const homePath = role === ROLES.WORKER ? "/worker-home" : "/customer-home";
    return <Navigate to={homePath} replace />;
  }

  // If not logged in, show the guest page (Login, Signup, etc.)
  return <Outlet />;
};

export default GuestGuard;