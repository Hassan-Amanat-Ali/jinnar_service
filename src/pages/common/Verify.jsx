import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  useVerifySignupMutation,
  useVerifySigninMutation,
} from "../../services/authApi";
import { useGetMyProfileQuery } from "../../services/customerApi";
import { ROLES, mapApiRoleToAppRole } from "../../constants/roles";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext.jsx";

const Verify = () => {
  const loc = useLocation();
  const state = loc.state || {};
  const mobile = state.mobile || "";
  const role = state.role || ROLES.CUSTOMER;
  const action = state.action || "signup";

  const { setRole, setUser } = useAuth();
  const [code, setCode] = useState("");
  const [shouldFetchProfile, setShouldFetchProfile] = useState(false);

  // RTK Query hooks
  const [verifySignup, { isLoading: isSignupLoading }] =
    useVerifySignupMutation();
  const [verifySignin, { isLoading: isSigninLoading }] =
    useVerifySigninMutation();

  // Fetch user profile after successful verification
  const { data: profileData, isLoading: isProfileLoading } =
    useGetMyProfileQuery(undefined, {
      skip: !shouldFetchProfile,
    });

  const loading = isSignupLoading || isSigninLoading || isProfileLoading;

  // When profile data is fetched, set role and user in AuthContext
  if (profileData?.profile && shouldFetchProfile) {
    const apiRole = profileData.profile.role;
    const appRole = mapApiRoleToAppRole(apiRole);

    if (appRole) {
      setRole(appRole);
      setUser(profileData.profile);
      setShouldFetchProfile(false);

      // Navigate to the appropriate home page based on the role from API
      const redirectPath =
        appRole === ROLES.CUSTOMER ? "/customer-home" : "/worker-home";
      toast.success("Verification successful! Welcome aboard");
      window.location.href = redirectPath;
    }
  }

  const handleVerify = async (e) => {
    e?.preventDefault();

    // Validation
    if (!code.trim()) {
      toast.error("Please enter the verification code");
      return;
    }

    if (code.length < 4) {
      toast.error("Please enter a valid verification code");
      return;
    }

    try {
      let result;
      if (action === "signup") {
        result = await verifySignup({
          mobileNumber: mobile,
          code,
          role: role === ROLES.CUSTOMER ? "buyer" : "seller",
        }).unwrap();
      } else {
        result = await verifySignin({
          mobileNumber: mobile,
          code,
        }).unwrap();
      }

      // Expect token in response on successful verification
      if (result && result.token) {
        // Store token and trigger profile fetch
        localStorage.setItem("token", result.token);

        // Trigger profile fetch which will set the role from API response
        setShouldFetchProfile(true);
      } else {
        // If no token, still provide feedback and fallback
        toast.success("Verification successful!");
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Verification error:", err);
      const payload = err?.data || err;

      // Handle different error formats
      if (payload?.error) {
        toast.error(payload.error);
      } else if (Array.isArray(payload?.errors) && payload.errors.length) {
        payload.errors.forEach((e) => {
          const message = e.msg || e.message || JSON.stringify(e);
          toast.error(message);
        });
      } else if (payload?.message) {
        toast.error(payload.message);
      } else if (typeof payload === "string") {
        toast.error(payload);
      } else if (err?.status === "FETCH_ERROR") {
        toast.error("Network error. Please check your connection");
      } else if (err?.status === 400) {
        toast.error("Invalid or expired verification code");
      } else if (err?.status === 404) {
        toast.error("User not found");
      } else {
        toast.error("Verification failed. Please try again");
      }
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center pt-24">
      <div className="w-full max-w-md p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Enter verification code</h2>
        <p className="text-sm text-gray-600 mb-4">
          A verification code was sent to <strong>{mobile}</strong>. Enter it
          below.
        </p>

        <form onSubmit={handleVerify}>
          <label className="block text-sm font-medium text-gray-700">
            Verification code
          </label>
          <input
            type="text"
            placeholder="Enter the code you received"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-2 w-full h-11 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-5 h-11 w-full rounded-full text-white text-sm font-medium shadow-sm cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "var(--gradient-main)" }}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verify;
