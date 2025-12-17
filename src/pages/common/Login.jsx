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
    refetch: refetchProfile,
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

  // Handle profile data and errors using useEffect
  useEffect(() => {
    if (!shouldFetchProfile) return;

    if (profileData?.profile) {
      const apiRole = profileData.profile.role;
      const appRole = mapApiRoleToAppRole(apiRole);

      console.log("✅ Login - API Role:", apiRole, "-> App Role:", appRole);

      if (appRole) {
        // Store role in localStorage for persistence
        localStorage.setItem("userRole", appRole);
        setRole(appRole);
        setUser(profileData.profile);

        // Navigate based on actual role from database
        const targetRoute = appRole === ROLES.CUSTOMER ? "/customer-home" : "/worker-home";
        console.log("🚀 Navigating to:", targetRoute);

        // Show success toast and navigate
        toast.success("Welcome back!");
        setShouldFetchProfile(false);

        // Navigate immediately
        navigate(targetRoute, { replace: true });
      } else {
        console.error("❌ Failed to map role:", apiRole);
        setShouldFetchProfile(false);
        toast.error("Unable to determine user role");
      }
    }

    if (profileError) {
      console.error("❌ Profile fetch error:", profileError);
      setShouldFetchProfile(false);
      toast.error("Failed to load profile");
    }
  }, [
    profileData,
    profileError,
    shouldFetchProfile,
    setRole,
    setUser,
    navigate,
  ]);

  const handleLogin = async () => {
    try {
      setShowResendVerification(false);

      // Validation
      if (!identifier.trim()) {
        toast.error("Email or phone required");
        return false;
      }

      // Basic validation: if it has '@', it's an email, otherwise it could be a phone.
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
      // Call RTK Query mutation based on role
      const loginMutation =
        role === ROLES.CUSTOMER ? customerLogin : workerLogin;
      const result = await loginMutation({
        identifier: identifier.trim(),
        password: password,
      }).unwrap();

      if (result && result.token) {
        // Store token
        localStorage.setItem("token", result.token);

        // Reset API cache to ensure fresh data for new user
        dispatch(baseApi.util.resetApiState());

        // Trigger profile fetch which will set the role from API response
        setShouldFetchProfile(true);
      } else {
        toast.error("Login failed. Please try again");
        setShouldFetchProfile(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setShouldFetchProfile(false);

      const payload = err?.data || err;
      const errorMessage = payload?.error || payload?.message || "";

      // Check for email verification error first
      if (errorMessage.toLowerCase().includes("verify your email") ||
          errorMessage.toLowerCase().includes("not verified")) {
        setShowResendVerification(true);
        toast.error("Please verify your email", {
          duration: 4000,
        });
        return false;
      }

      // Handle specific error status codes
      if (err?.status === 401 || err?.originalStatus === 401) {
        toast.error("Invalid credentials", {
          duration: 3000,
        });
        // Clear password field for security
        setPassword("");
        return false;
      }

      if (err?.status === 404 || err?.originalStatus === 404) {
        toast.error("Account not found", {
          duration: 3000,
        });
        return false;
      }

      if (err?.status === "FETCH_ERROR") {
        toast.error("Connection error", {
          duration: 3000,
        });
        return false;
      }

      // Handle different error message formats
      if (payload?.error) {
        // Shorten long error messages
        const errorMsg = payload.error.length > 50
          ? payload.error.substring(0, 50) + "..."
          : payload.error;
        toast.error(errorMsg, {
          duration: 3000,
        });
      } else if (Array.isArray(payload?.errors) && payload.errors.length > 0) {
        const firstError = payload.errors[0];
        const message = firstError.msg || firstError.message || "Invalid input";
        toast.error(message, {
          duration: 3000,
        });
      } else if (payload?.message) {
        const errorMsg = payload.message.length > 50
          ? payload.message.substring(0, 50) + "..."
          : payload.message;
        toast.error(errorMsg, {
          duration: 3000,
        });
      } else if (typeof payload === "string") {
        const errorMsg = payload.length > 50
          ? payload.substring(0, 50) + "..."
          : payload;
        toast.error(errorMsg, {
          duration: 3000,
        });
      } else {
        toast.error("Login failed", {
          duration: 3000,
        });
      }
      return false;
    }
  };

  const handleResendVerification = async () => {
    if (!identifier.trim()) {
      toast.error("Email or phone required");
      return;
    }

    try {
      const result = await resendCode({ identifier: identifier.trim() }).unwrap();
      toast.success("Code sent!");
      setShowResendVerification(false);
      navigate("/verify", { state: { identifier: identifier.trim() } });
    } catch (err) {
      console.error("Resend verification error:", err);
      const payload = err?.data || err;
      const errorMessage = payload?.error || payload?.message || "Failed to resend code";
      toast.error(errorMessage, {
        duration: 3000,
      });
    }
  };

  const sliderData = [
    {
      image: sideImg,
      title: "Book Trusted Workers Anytime",
      description:
        "Quickly connect with skilled professionals in your area to tackle any task—from home repairs to personal services—right at your fingertips.",
    },
    {
      image: auth2,
      title: "Quality Service Guaranteed",
      description:
        "All our workers are verified and rated by the community. Get peace of mind knowing you're hiring trusted professionals.",
    },
    {
      image: auth3,
      title: "Fast & Reliable Solutions",
      description:
        "Get your tasks done quickly and efficiently. Our platform ensures prompt service delivery every time.",
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

                {/* Slider dots in original position */}
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
            Welcome Back!
          </h1>
          <p className="text-sm text-[#141414]/70 mt-2">
            Login to continue booking trusted workers around you.
          </p>

          <div className="mt-6 rounded-2xl border border-gray-200 shadow-sm p-6">
            <div>
              {/* Email address */}
              <label className="block text-sm font-medium text-[#141414]">
                Email or Phone Number
              </label>
              <input
                type="text"
                placeholder="email@example.com or +255712345678"
                className="mt-2 w-full h-11 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                    e.nativeEvent.preventDefault();
                    e.nativeEvent.stopImmediatePropagation();
                    handleLogin().catch((err) => {
                      console.error("Login error caught:", err);
                    });
                  }
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                For phone numbers, include country code (e.g., +255712345678 for Tanzania)
              </p>

              {/* Password */}
              <label className="block text-sm font-medium text-[#141414] mt-4">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="mt-2 w-full h-11 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                    e.nativeEvent.preventDefault();
                    e.nativeEvent.stopImmediatePropagation();
                    handleLogin().catch((err) => {
                      console.error("Login error caught:", err);
                    });
                  }
                }}
              />

              {/* Forgot password link */}
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-[#74C7F2] hover:text-[#5ba8e0] font-medium cursor-pointer transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login button */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.preventDefault();
                  e.nativeEvent.stopImmediatePropagation();
                  // Call handleLogin without await to prevent any Promise rejection from bubbling
                  handleLogin().catch((err) => {
                    console.error("Login error caught:", err);
                  });
                  return false;
                }}
                disabled={loading}
                className="mt-5 h-11 w-full rounded-full text-white text-sm font-medium shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                style={{ background: "var(--gradient-main)" }}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

            {showResendVerification && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 disabled:cursor-wait"
                >
                  {isResending
                    ? "Sending code..."
                    : "Resend Verification Code"}
                </button>
              </div>
            )}

            {/* Signup prompt */}
            <p className="mt-6 text-center text-sm text-[#141414]/80">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-[#74C7F2] hover:text-[#5ba8e0] font-medium cursor-pointer transition-colors"
              >
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
