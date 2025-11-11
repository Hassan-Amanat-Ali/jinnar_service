import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { ROLES } from "../../constants/roles.js";

const RoleGuard = ({ allow, children }) => {
  const { role } = useAuth();
  const location = useLocation();

  // If no role is set, redirect to role selection
  if (!role) {
    return <Navigate to="/role" state={{ from: location }} replace />;
  }

  // Check if user is allowed to access this route
  const isAllowed = Array.isArray(allow)
    ? allow.includes(role)
    : allow === role;

  if (!isAllowed) {
    // SPECIAL CASE: Buyer trying to access Worker pages
    if (
      role === ROLES.CUSTOMER &&
      (allow === ROLES.WORKER ||
        (Array.isArray(allow) && allow.includes(ROLES.WORKER)))
    ) {
      // Redirect buyer to role selection with a flag to switch to worker
      return (
        <Navigate
          to="/role"
          state={{ from: location, switchRole: true, currentRole: role }}
          replace
        />
      );
    }

    // For worker trying to access customer-only pages, allow it (workers can access both)
    if (role === ROLES.WORKER && allow === ROLES.CUSTOMER) {
      return children;
    }

    // Default: redirect to appropriate home
    const redirect =
      role === ROLES.CUSTOMER ? "/customer-home" : "/worker-home";
    return <Navigate to={redirect} replace />;
  }

  return children;
};

export default RoleGuard;
