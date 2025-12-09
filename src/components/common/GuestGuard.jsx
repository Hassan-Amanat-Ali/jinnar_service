import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";

const GuestGuard = () => {
  const { loading } = useAuth();

  // Wait until authentication status is confirmed
  if (loading) {
    return <LoadingSpinner />;
  }

  // Allow both logged-in and logged-out users to access landing pages
  return <Outlet />;
};

export default GuestGuard;