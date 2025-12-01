import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { ROLES, mapApiRoleToAppRole } from "../constants/roles.js";
import { useSwitchRoleMutation } from "../services/authApi.js";
import { baseApi } from "../services/baseApi.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(() => localStorage.getItem("role") || null);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [switchRoleMutation, { isLoading: isSwitchingRole }] =
    useSwitchRoleMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    setUser(storedUser ? JSON.parse(storedUser) : null);
    setRole(storedRole || null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (role) {
      localStorage.setItem("role", role);
    } else {
      localStorage.removeItem("role");
    }
  }, [role]);

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
    localStorage.removeItem("token");
  };

  const switchRole = async (newRole) => {
    const apiRole = newRole === ROLES.CUSTOMER ? "buyer" : "seller";
    try {
      const result = await switchRoleMutation({ newRole: apiRole }).unwrap();
      
      if (result.token) {
        localStorage.setItem("token", result.token);
        
        const appRole = mapApiRoleToAppRole(result.role);
        
        // Don't set the role here, return it to the caller
        toast.success(result.message || `Switched to ${appRole} role`);
        return appRole; 
      }
    } catch (err) {
      toast.error(err?.data?.error || "Failed to switch role.");
      throw err; 
    }
  };

  const value = useMemo(
    () => ({
      loading,
      role,
      setRole,
      user,
      setUser,
      logout,
      switchRole,
      isSwitchingRole,
    }),
    [loading, role, user, isSwitchingRole]
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

