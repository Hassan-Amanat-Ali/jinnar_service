import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROLES } from '../../constants/roles.js';

const RoleGuard = ({ allow, children }) => {
  const { role } = useAuth();
  const location = useLocation();

  if (!role) {
    return <Navigate to='/role' state={{ from: location }} replace />;
  }

  if (Array.isArray(allow) ? !allow.includes(role) : allow !== role) {
    const redirect = role === ROLES.CUSTOMER ? '/c' : '/w';
    return <Navigate to={redirect} replace />;
  }

  return children;
};

export default RoleGuard;
