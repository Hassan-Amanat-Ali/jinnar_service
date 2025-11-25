import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import sideImg from "../../assets/images/auth.jpg";
import auth2 from "../../assets/images/auth2.jpg";
import auth3 from "../../assets/images/auth3.jpg";
import { useState } from "react";
import {
  useCustomerSignupMutation,
  useWorkerSignupMutation,
} from "../../services/authApi";
import { ROLES } from "../../constants/roles.js";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState(
    localStorage.getItem("userRole") || ROLES.CUSTOMER
  );

  // RTK Query hooks
  const [customerSignup, { isLoading: isCustomerLoading }] =
    useCustomerSignupMutation();
  const [workerSignup, { isLoading: isWorkerLoading }] =
    useWorkerSignupMutation();

  const loading = isCustomerLoading || isWorkerLoading;

  const handleSignup = async (e) => {
    e?.preventDefault();

    // Validation
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!mobile.trim()) {
      toast.error("Please enter your mobile number");
      return;
    }

   if (!/^\+[1-9]\d{7,14}$/.test(mobile)) {
  toast.error("Please enter a valid phone number in international format (e.g., +12345678901)");
  return;
}


    try {
      const backendRole = role === ROLES.CUSTOMER ? "buyer" : "seller";
      const signupMutation =
        role === ROLES.CUSTOMER ? customerSignup : workerSignup;

      const result = await signupMutation({
        name: name.trim(),
        mobileNumber: mobile,
        role: backendRole,
      }).unwrap();

      // If backend returns token immediately, save and redirect
      if (result && result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("role", role);
        toast.success("Account created successfully!");
        if (role === ROLES.CUSTOMER) {
          window.location.href = "/customer-home";
        } else {
          window.location.href = "/worker-home";
        }
      } else {
        // No token -> OTP sent, navigate to verify page
        toast.info("Verification code sent to your mobile");
        navigate("/verify", { state: { name: name.trim(), mobile, role, action: "signup" } });
      }
    } catch (err) {
      console.error("Signup error:", err);
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
      } else if (err?.status === 409) {
        toast.error("Mobile number already registered. Please login");
      } else if (err?.status === 400) {
        toast.error("Invalid input. Please check your details");
      } else {
        toast.error("Signup failed. Please try again");
      }
    }
  };
  const sliderData = [
    {
      image: sideImg,
      title: "Join Our Community Today",
      description:
        "Create your account and connect with thousands of verified professionals ready to help with any task you need.",
    },
    {
      image: auth2,
      title: "Trusted & Secure Platform",
      description:
        "Your safety is our priority. All workers are background-checked and rated by real customers for your peace of mind.",
    },
    {
      image: auth3,
      title: "Start Booking Instantly",
      description:
        "Once registered, you can immediately start booking services and get your tasks completed by skilled professionals.",
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
            Create Your Account
          </h1>
          <p className="text-sm text-[#141414]/70 mt-2">
            Join our community and start booking trusted workers today.
          </p>

          <div className="mt-6 rounded-2xl border border-gray-200 shadow-sm p-6">
            {/* Role is selected on the /role page. We read it from localStorage and don't show role options here. */}

            {/* Errors are displayed via toast notifications */}

            <form onSubmit={handleSignup}>
              {/* Name */}
              <label className="block text-sm font-medium text-[#141414]">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="mt-2 w-full h-11 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              {/* Mobile */}
              <label className="block text-sm font-medium text-[#141414] mt-4">
                Mobile number
              </label>
              <input
                type="text"
                placeholder="Enter your mobile (e.g. +9230...)"
                className="mt-2 w-full h-11 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />

              {/* Signup button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-5 h-11 w-full rounded-full text-white text-sm font-medium shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                style={{ background: "var(--gradient-main)" }}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </form>

            {/* Login prompt */}
            <p className="mt-6 text-center text-sm text-[#141414]/80">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#74C7F2] hover:text-[#5ba8e0] font-medium cursor-pointer transition-colors"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
