import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import sideImg from "../../assets/images/auth.jpg";
import auth2 from "../../assets/images/auth2.jpg";
import auth3 from "../../assets/images/auth3.jpg";
import { ROLES, mapApiRoleToAppRole } from "../../constants/roles.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCustomerLoginMutation,
  useWorkerLoginMutation,
  useResendVerificationCodeMutation,
} from "../../services/authApi";
import { useGetMyProfileQuery } from "../../services/customerApi";
import { baseApi } from "../../services/baseApi";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";
import { useDispatch } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setRole, setUser } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [role, setLocalRole] = useState(
    localStorage.getItem("userRole") || ROLES.CUSTOMER
  );
  const [shouldFetchProfile, setShouldFetchProfile] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);

  // RTK Query hooks
  const [customerLogin, { isLoading: isCustomerLoading }] =
    useCustomerLoginMutation();
  const [workerLogin, { isLoading: isWorkerLoading }] =
    useWorkerLoginMutation();
  const [resendCode, { isLoading: isResending }] =
    useResendVerificationCodeMutation();

  // Fetch user profile after successful login
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
  } = useGetMyProfileQuery(undefined, {
    skip: !shouldFetchProfile,
    refetchOnMountOrArgChange: true,
  });

  const loading =
    isCustomerLoading || isWorkerLoading || isProfileLoading || isResending;

  // Prevent any accidental form submission globally on this page
  useEffect(() => {
    const preventFormSubmit = (e) => {
      if (e.target && e.target.tagName === 'FORM') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };
    document.addEventListener('submit', preventFormSubmit, true);
    return () => document.removeEventListener('submit', preventFormSubmit, true);
  }, []);

  // Handle profile data and errors
  useEffect(() => {
    if (!shouldFetchProfile) return;

    if (profileData?.profile) {
      const apiRole = profileData.profile.role;
      const appRole = mapApiRoleToAppRole(apiRole);

      if (appRole) {
        localStorage.setItem("userRole", appRole);
        setRole(appRole);
        setUser(profileData.profile);
        const targetRoute = appRole === ROLES.CUSTOMER ? "/customer-home" : "/worker-home";
        toast.success("Welcome back!");
        setShouldFetchProfile(false);
        navigate(targetRoute, { replace: true });
      } else {
        setShouldFetchProfile(false);
        toast.error("Unable to determine user role");
      }
    }

    if (profileError) {
      setShouldFetchProfile(false);
      toast.error("Failed to load profile");
    }
  }, [profileData, profileError, shouldFetchProfile, setRole, setUser, navigate]);

  const handleLogin = async () => {
    // If resend is visible, we force user to deal with verification first
    if (showResendVerification) return;

    try {
      setShowResendVerification(false);

      if (!identifier.trim()) {
        toast.error("Email or phone required");
        return false;
      }

      const isEmail = identifier.includes("@");
      const isPhone = /^\+?\d{10,15}$/.test(identifier);
      if (!isEmail && !isPhone) {
        toast.error("Invalid email or phone format");
        return false;
      }

      if (!password.trim()) {
        toast.error("Password required");
        return false;
      }

      const loginMutation = role === ROLES.CUSTOMER ? customerLogin : workerLogin;
      const result = await loginMutation({
        identifier: identifier.trim(),
        password: password,
      }).unwrap();

      if (result && result.token) {
        localStorage.setItem("token", result.token);
        dispatch(baseApi.util.resetApiState());
        setShouldFetchProfile(true);
      } else {
        toast.error("Login failed. Please try again");
        setShouldFetchProfile(false);
      }
    } catch (err) {
      setShouldFetchProfile(false);
      const payload = err?.data || err;
      const errorMessage = payload?.error || payload?.message || "";

      if (errorMessage.toLowerCase().includes("verify your email") ||
          errorMessage.toLowerCase().includes("not verified")) {
        setShowResendVerification(true);
        toast.error("Account not verified. Please verify your email.");
        return false;
      }

      if (err?.status === 401) {
        toast.error("Invalid credentials");
        setPassword("");
        return false;
      }

      toast.error(errorMessage || "Login failed");
      return false;
    }
  };

  const handleResendVerification = async () => {
    if (!identifier.trim()) {
      toast.error("Email or phone required");
      return;
    }

    try {
      await resendCode({ identifier: identifier.trim() }).unwrap();
      toast.success("Verification code sent to your email!");
      navigate("/verify", { state: { identifier: identifier.trim() } });
    } catch (err) {
      const payload = err?.data || err;
      toast.error(payload?.message || "Failed to resend code");
    }
  };

  const sliderData = [
    {
      image: sideImg,
      title: "Book Trusted Workers Anytime",
      description: "Quickly connect with skilled professionals in your area to tackle any task.",
    },
    {
      image: auth2,
      title: "Quality Service Guaranteed",
      description: "All our workers are verified and rated by the community.",
    },
    {
      image: auth3,
      title: "Fast & Reliable Solutions",
      description: "Get your tasks done quickly and efficiently.",
    },
  ];

  return (
    <div className="min-h-dvh grid grid-cols-1 lg:grid-cols-2 bg-white pt-24 lg:pt-0">
      <div className="relative hidden lg:block">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          className="h-full w-full"
        >
          {sliderData.map((slide, index) => (
            <SwiperSlide key={index} className="relative">
              <img src={slide.image} alt={slide.title} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-lg font-semibold tracking-tight">{slide.title}</h3>
                <p className="text-sm text-white/85 mt-2 max-w-md">{slide.description}</p>
                <div className="mt-6 flex items-center gap-2">
                  {sliderData.map((_, dotIndex) => (
                    <span key={dotIndex} className={`h-2 w-2 rounded-full ${dotIndex === index ? "bg-white" : "bg-white/60"}`} />
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-10 py-10 lg:py-0">
        <div className="w-full max-w-md">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#141414]">Welcome Back!</h1>
          <p className="text-sm text-[#141414]/70 mt-2">Login to continue booking trusted workers around you.</p>

          <div className="mt-6 rounded-2xl border border-gray-200 shadow-sm p-6">
            <div>
              <label className="block text-sm font-medium text-[#141414]">Email or Phone Number</label>
              <input
                type="text"
                disabled={showResendVerification}
                placeholder="email@example.com"
                className="mt-2 w-full h-11 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-[#74C7F2] disabled:bg-gray-50 disabled:text-gray-500"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />

              <label className="block text-sm font-medium text-[#141414] mt-4">Password</label>
              <input
                type="password"
                disabled={showResendVerification}
                placeholder="Enter your password"
                className="mt-2 w-full h-11 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-[#74C7F2] disabled:bg-gray-50 disabled:text-gray-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {!showResendVerification && (
                <div className="mt-2 text-right">
                  <button type="button" onClick={() => navigate("/forgot-password")} className="text-sm text-[#74C7F2] font-medium hover:underline">
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Login Button - Disabled when verification is needed */}
              {!showResendVerification ? (
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={loading}
                  className="mt-5 h-11 w-full rounded-full text-white text-sm font-medium shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                  style={{ background: "var(--gradient-main)" }}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              ) : (
                <div className="mt-6 space-y-3">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800 text-xs">
                    It looks like your account isn't verified yet. Please click below to receive a new code.
                  </div>
                  
                  {/* Prominent Resend Button */}
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="h-11 w-full rounded-full text-white text-sm font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    style={{ background: "var(--gradient-main)" }}
                  >
                    {isResending ? "Sending Code..." : "Verify My Account Now"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowResendVerification(false);
                      setPassword("");
                    }}
                    className="w-full text-xs text-gray-500 font-medium hover:text-gray-700 underline transition-colors"
                  >
                    Use a different account / Go back
                  </button>
                </div>
              )}
            </div>

            <p className="mt-6 text-center text-sm text-[#141414]/80">
              Don't have an account?{" "}
              <button type="button" onClick={() => navigate("/signup")} className="text-[#74C7F2] font-medium hover:underline">
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;