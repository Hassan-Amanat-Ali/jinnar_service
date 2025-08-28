import { useAuth } from '../context/AuthContext.jsx';

const useAuthRole = () => {
  const { role } = useAuth();
  return role;
};

export default useAuthRole;
