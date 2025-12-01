import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { ROLES } from "../constants/roles.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
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

  // Check initial auth status from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    setUser(storedUser ? JSON.parse(storedUser) : null);
    setRole(storedRole || null);
    setLoading(false); // Finished loading
  }, []);

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

  const logout = () => {
    setUser(null);
    setRole(null);
    // The useEffects above will handle removing from localStorage
  };

  const switchRole = (newRole) => {
    setRole(newRole);
  };

  const value = useMemo(
    () => ({ loading, role, setRole, user, setUser, logout, switchRole }),
    [loading, role, user]
  );

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
