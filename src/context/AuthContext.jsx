import { createContext, useContext, useMemo, useState } from 'react';
import { ROLES } from '../constants/roles.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null); // 'customer' | 'worker' | null

  const value = useMemo(() => ({ role, setRole }), [role]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const isValidRole = (maybeRole) =>
  Object.values(ROLES).includes(maybeRole);

export default AuthContext;
