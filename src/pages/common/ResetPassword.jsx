import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../../services/authApi";
import { useGetMyProfileQuery } from "../../services/customerApi";
import { ROLES, mapApiRoleToAppRole } from "../../constants/roles";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import sideImg from "../../assets/images/auth.jpg";
import auth2 from "../../assets/images/auth2.jpg";
import auth3 from "../../assets/images/auth3.jpg";

const ResetPassword = () => {
  const navigate = useNavigate();
  const loc = useLocation();
  const state = loc.state || {};
  const email = state.email || "";

  const { setRole, setUser } = useAuth();
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [shouldFetchProfile, setShouldFetchProfile] = useState(false);

  // RTK Query hooks
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  // Fetch user profile after successful password reset
  const { data: profileData, isLoading: isProfileLoading } =
    useGetMyProfileQuery(undefined, {
      skip: !shouldFetchProfile,
    });

  const loading = isLoading || isProfileLoading;

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
      toast.success("Password reset successful! Welcome back");
      window.location.href = redirectPath;
    }
  }

  const handleSubmit = async (e) => {
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

    if (!newPassword.trim()) {
      toast.error("Please enter a new password");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const result = await resetPassword({
        email: email,
        code,
        newPassword,
      }).unwrap();

      // Store token and trigger profile fetch
      if (result && result.token) {
        localStorage.setItem("token", result.token);
        setShouldFetchProfile(true);
      } else {
        toast.success("Password reset successful! Please log in.");
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Reset password error:", err);
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
        toast.error("Failed to reset password. Please try again");
      }
    }
  };

  const sliderData = [
    {
      image: sideImg,
      title: "Create New Password",
      description:
        "Enter the verification code sent to your mobile and create a new secure password for your account.",
    },
    {
      image: auth2,
      title: "Secure Your Account",
      description:
        "Choose a strong password with at least 6 characters to protect your account and personal information.",
    },
    {
      image: auth3,
      title: "Almost Done",
      description:
        "Once your password is reset, you'll be automatically logged in and can continue using our services.",
    },
  ];

  return (
    <div className="min-h-dvh grid grid-cols-1 lg:grid-cols-2 bg-white pt-24 lg:pt-0">
      {/* Left: Image panel with automatic slider */}
      <div className="relative hidden lg:block">
        <Swiper
          modules={[Autoplay]}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="h-full w-full"
        >
          {sliderData.map((slide, index) => (
            <SwiperSlide key={index} className="relative">
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-lg font-semibold tracking-tight">
                  {slide.title}
                </h3>
                <p className="text-sm text-white/85 mt-2 max-w-md">
                  {slide.description}
                </p>

                <div className="mt-6 flex items-center gap-2">
                  {sliderData.map((_, dotIndex) => (
                    <span
                      key={dotIndex}
                      className={`h-2 w-2 rounded-full ${
                        dotIndex === index ? "bg-white" : "bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Right: Form panel */}
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-10 py-10 lg:py-0">
        <div className="w-full max-w-md">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#141414]">
            Reset Your Password
          </h1>
          <p className="text-sm text-[#141414]/70 mt-2">
            Enter the verification code sent to <strong>{email}</strong> and
            create a new password.
          </p>

          <div className="mt-6 rounded-2xl border border-gray-200 shadow-sm p-6">
            <form onSubmit={handleSubmit}>
              {/* Verification Code */}
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-[#141414]">
                  Verification Code
                </label>
              </div>
              <input
                type="text"
                placeholder="Enter the code you received"
                className="mt-2 w-full h-11 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />

              {/* New Password */}
              <label className="block text-sm font-medium text-[#141414] mt-4">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password (min 6 characters)"
                className="mt-2 w-full h-11 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              {/* Confirm New Password */}
              <label className="block text-sm font-medium text-[#141414] mt-4">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Confirm your new password"
                className="mt-2 w-full h-11 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-5 h-11 w-full rounded-full text-white text-sm font-medium shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                style={{ background: "var(--gradient-main)" }}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>

            {/* Back to login */}
            <p className="mt-6 text-center text-sm text-[#141414]/80">
              Remember your password?{" "}
              <a
                href="/login"
                className="text-[#74C7F2] hover:text-[#5ba8e0] font-medium cursor-pointer transition-colors"
              >
                Back to Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
