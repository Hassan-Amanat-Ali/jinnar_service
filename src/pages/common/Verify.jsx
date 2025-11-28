import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useVerifyCodeMutation } from "../../services/authApi";
import { toast } from "react-toastify";

const Verify = () => {
  const loc = useLocation();
  const state = loc.state || {};
  const email = state.email || "";

  const [code, setCode] = useState("");

  // RTK Query hooks
  const [verifyCode, { isLoading }] = useVerifyCodeMutation();

  const loading = isLoading;

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
      await verifyCode({
        email: email,
        code,
      }).unwrap();

      // Verification successful, navigate to login
      toast.success("Email verified successfully! You can now log in.");
      window.location.href = "/login";
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
          A verification code was sent to <strong>{email}</strong>. Enter the code from your email below.
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
