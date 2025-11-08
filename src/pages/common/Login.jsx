import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import sideImg from "../../assets/images/auth.jpg";
import auth2 from "../../assets/images/auth2.jpg";
import auth3 from "../../assets/images/auth3.jpg";
import { ROLES } from "../../constants/roles.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCustomerLoginMutation,
  useWorkerLoginMutation,
} from "../../services/authApi";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState(
    localStorage.getItem("userRole") || ROLES.CUSTOMER
  );

  // RTK Query hooks
  const [customerLogin, { isLoading: isCustomerLoading }] =
    useCustomerLoginMutation();
  const [workerLogin, { isLoading: isWorkerLoading }] =
    useWorkerLoginMutation();

  const loading = isCustomerLoading || isWorkerLoading;

  const handleLogin = async (e) => {
    e?.preventDefault();

    // Validation
    if (!mobile.trim()) {
      toast.error("Please enter your mobile number");
      return;
    }

    if (!/^\+[1-9]\d{1,14}$/.test(mobile)) {
      toast.error("Please enter a valid mobile number (e.g., +923001234567)");
      return;
    }

    try {
      // Call RTK Query mutation based on role
      const loginMutation =
        role === ROLES.CUSTOMER ? customerLogin : workerLogin;
      const result = await loginMutation({ mobileNumber: mobile }).unwrap();

      if (result && result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("role", role);
        toast.success("Welcome back! Login successful");
        if (role === ROLES.CUSTOMER) {
          window.location.href = "/customer-home";
        } else {
          window.location.href = "/worker-home";
        }
      } else {
        toast.info("Verification code sent to your mobile");
        navigate("/verify", { state: { mobile, role, action: "signin" } });
      }
    } catch (err) {
      console.error("Login error:", err);
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
      } else if (err?.status === 404) {
        toast.error("User not found. Please sign up first");
      } else if (err?.status === 401) {
        toast.error("Invalid credentials");
      } else {
        toast.error("Login failed. Please try again");
      }
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
            {/* Role is selected on the /role page. We read it from localStorage and don't show role options here. */}

            {/* Errors are displayed via toast notifications */}

            <form onSubmit={handleLogin}>
              {/* Email / Phone */}
              <label className="block text-sm font-medium text-[#141414]">
                Mobile number
              </label>
              <input
                type="text"
                placeholder="Enter mobile number (e.g. +9230...)"
                className="mt-2 w-full h-11 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />

              {/* Passwordless login via mobile + OTP (no password input) */}

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

            {/* Divider */}
            <div className="mt-6 flex items-center gap-3">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-xs text-gray-500">or continue with</span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>

            {/* Social buttons */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="h-10 rounded-lg border border-gray-300 flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-50 cursor-pointer transition-colors">
                <FcGoogle className="text-lg" />
                Google
              </button>
              <button className="h-10 rounded-lg border border-gray-300 flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-50 cursor-pointer transition-colors">
                <FaFacebook className="text-[#1877F2] text-lg" />
                Facebook
              </button>
            </div>

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
