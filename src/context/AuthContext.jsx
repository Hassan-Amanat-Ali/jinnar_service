import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { ROLES } from "../constants/roles.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize role from localStorage if available
  const [role, setRole] = useState(() => {
    const storedRole = localStorage.getItem("role");
    return storedRole || null;
  });

  // Store user profile data
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Persist role to localStorage whenever it changes
  useEffect(() => {
    if (role) {
      localStorage.setItem("role", role);
    } else {
      localStorage.removeItem("role");
    }
  }, [role]);

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const value = useMemo(() => ({ role, setRole, user, setUser }), [role, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const isValidRole = (maybeRole) =>
  Object.values(ROLES).includes(maybeRole);

export default AuthContext;
