import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../../services/authApi";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import sideImg from "../../assets/images/auth.jpg";
import auth2 from "../../assets/images/auth2.jpg";
import auth3 from "../../assets/images/auth3.jpg";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  // RTK Query hooks
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e?.preventDefault();

    // Validation
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const result = await forgotPassword({ email: email.trim() }).unwrap();

      toast.success("Password reset code sent to your email");
      
      navigate("/reset-password", { 
        state: { 
          email: email.trim()
        } 
      });
    } catch (err) {
      console.error("Forgot password error:", err);
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
        toast.error("User with this email address does not exist");
      } else {
        toast.error("Failed to send reset code. Please try again");
      }
    }
  };

  const sliderData = [
    {
      image: sideImg,
      title: "Reset Your Password",
      description:
        "Enter your mobile number and we'll send you a verification code to reset your password securely.",
    },
    {
      image: auth2,
      title: "Secure & Fast",
      description:
        "Your account security is our priority. Reset your password quickly and safely with our verification system.",
    },
    {
      image: auth3,
      title: "Back to Work",
      description:
        "Once your password is reset, you'll be able to access your account and continue booking trusted services.",
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
            Forgot Password?
          </h1>
          <p className="text-sm text-[#141414]/70 mt-2">
            Enter your mobile number and we'll send you a verification code to
            reset your password.
          </p>

          <div className="mt-6 rounded-2xl border border-gray-200 shadow-sm p-6">
            <form onSubmit={handleSubmit}>
              {/* Email address */}
              <label className="block text-sm font-medium text-[#141414]">
                Email address
              </label>
              <input
                type="email"
                placeholder="Enter your email address"
                className="mt-2 w-full h-11 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-5 h-11 w-full rounded-full text-white text-sm font-medium shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                style={{ background: "var(--gradient-main)" }}
              >
                {isLoading ? "Sending..." : "Send Reset Code"}
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

export default ForgotPassword;
