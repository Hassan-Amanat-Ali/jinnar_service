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
import { toast } from "react-toastify";
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

  // Handle profile data and errors using useEffect
  useEffect(() => {
    if (!shouldFetchProfile) return;

    if (profileData?.profile) {
      const apiRole = profileData.profile.role;
      const appRole = mapApiRoleToAppRole(apiRole);

      console.log("Login - API Role:", apiRole, "-> App Role:", appRole);

      if (appRole) {
        // Store role in localStorage for persistence
        localStorage.setItem("userRole", appRole);
        setRole(appRole);
        setUser(profileData.profile);
        toast.success("Welcome back! Login successful");
        setShouldFetchProfile(false);

        // Navigate based on actual role from database
        const targetRoute =
          appRole === ROLES.CUSTOMER ? "/customer-home" : "/worker-home";
        console.log("Navigating to:", targetRoute);
        navigate(targetRoute);
      } else {
        console.error("Failed to map role:", apiRole);
        setShouldFetchProfile(false);
        toast.error("Unable to determine user role. Please try again");
      }
    }

    if (profileError) {
      setShouldFetchProfile(false);
      toast.error("Failed to load user profile. Please try again");
    }
  }, [
    profileData,
    profileError,
    shouldFetchProfile,
    setRole,
    setUser,
    navigate,
  ]);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setShowResendVerification(false);

    // Validation
    if (!identifier.trim()) {
      toast.error("Please enter your email or phone number");
      return;
    }

    // Basic validation: if it has '@', it's an email, otherwise it could be a phone.
    const isEmail = identifier.includes("@");
    const isPhone = /^\+?\d{10,15}$/.test(identifier);
    if (!isEmail && !isPhone) {
      toast.error("Please enter a valid email or phone number.");
      return;
    }

    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }

    try {
      // Call RTK Query mutation based on role
      const loginMutation =
        role === ROLES.CUSTOMER ? customerLogin : workerLogin;
      const result = await loginMutation({
        identifier: identifier,
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

      if (errorMessage.toLowerCase().includes("verify your email")) {
        setShowResendVerification(true);
        toast.error(errorMessage);
        return;
      }

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
      } else if (err?.status === 404) {
        toast.error("User not found. Please sign up first");
      } else if (err?.status === 401) {
        toast.error("Invalid identifier or password");
      } else {
        toast.error("Login failed. Please try again");
      }
    }
  };

  const handleResendVerification = async () => {
    if (!identifier.trim()) {
      toast.error("Please enter your email or phone number first.");
      return;
    }

    try {
      const isEmail = identifier.includes("@");
      const result = await resendCode({ identifier }).unwrap();
      toast.success(result.message || "Verification code sent!");
      setShowResendVerification(false);
      navigate("/verify", { state: { identifier } });
    } catch (err) {
      const payload = err?.data || err;
      toast.error(payload?.error || "Failed to resend verification code.");
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
            <form onSubmit={handleLogin}>
              {/* Email address */}
              <label className="block text-sm font-medium text-[#141414]">
                Email or Phone Number
              </label>
              <input
                type="text"
                placeholder="Enter your email or phone number"
                className="mt-2 w-full h-11 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />

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
              />

              {/* Forgot password link */}
              <div className="mt-2 text-right">
                <a
                  href="/forgot-password"
                  className="text-sm text-[#74C7F2] hover:text-[#5ba8e0] font-medium cursor-pointer transition-colors"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Login button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-5 h-11 w-full rounded-full text-white text-sm font-medium shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                style={{ background: "var(--gradient-main)" }}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {showResendVerification && (
              <div className="mt-4 text-center">
                <button
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
              <a
                href="/signup"
                className="text-[#74C7F2] hover:text-[#5ba8e0] font-medium cursor-pointer transition-colors"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
