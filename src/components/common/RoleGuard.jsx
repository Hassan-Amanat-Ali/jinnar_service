import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { ROLES } from "../../constants/roles.js";

const RoleGuard = ({ allow, children }) => {
  const { role } = useAuth();
  const location = useLocation();
  // If no role is set (e.g., not logged in), redirect to role selection.
  if (!role) {
    return <Navigate to="/role" state={{ from: location }} replace />;
  }
  // Check if the user's current role is allowed to access this route.
  const isAllowed = Array.isArray(allow)
    ? allow.includes(role)
    : allow === role;

  if (!isAllowed) {
    // If not allowed, redirect to the user's default home page. The user
    // can then use the switch role button in their profile if they want to change roles.
    const redirect =
      role === ROLES.CUSTOMER ? "/customer-home" : "/worker-home";
    return <Navigate to={redirect} replace />;
  }

  return children;
};

export default RoleGuard;
