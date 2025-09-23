import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import sideImg from "../../assets/images/auth.jpg";

const Signup = () => {
  return (
    <div className="min-h-dvh grid grid-cols-1 lg:grid-cols-2 bg-white pt-24 lg:pt-0">
      {/* Left: Image panel with overlay text */}
      <div className="relative hidden lg:block">
        <img
          src={sideImg}
          alt="People collaborating"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h3 className="text-lg font-semibold tracking-tight">
            Book Trusted Workers Anytime
          </h3>
          <p className="text-sm text-white/85 mt-2 max-w-md">
            Find reliable workers near you.
          </p>
          <div className="mt-6 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white/60" />
            <span className="h-2 w-2 rounded-full bg-white" />
            <span className="h-2 w-2 rounded-full bg-white/60" />
          </div>
        </div>
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
            {/* Email */}
            <label className="block text-sm font-medium text-[#141414]">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email or mobile"
              className="mt-2 w-full h-11 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
            />

            {/* Password */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-[#141414]">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter Your Password"
                className="mt-2 w-full h-11 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
              />
            </div>

            {/* Confirm Password */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-[#141414]">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Enter Your Password"
                className="mt-2 w-full h-11 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
              />
            </div>

            {/* Signup button */}
            <button
              className="mt-5 h-11 w-full rounded-full text-white text-sm font-medium shadow-sm"
              style={{ background: "var(--gradient-main)" }}
            >
              Login
            </button>

            {/* Divider */}
            <div className="mt-6 flex items-center gap-3">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-xs text-gray-500">or continue with</span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>

            {/* Social buttons */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="h-10 rounded-lg border border-gray-300 flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-50">
                <FcGoogle className="text-lg" />
                Google
              </button>
              <button className="h-10 rounded-lg border border-gray-300 flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-50">
                <FaFacebook className="text-[#1877F2] text-lg" />
                Facebook
              </button>
            </div>

            {/* Login prompt */}
            <p className="mt-6 text-center text-sm text-[#141414]/80">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#74C7F2] hover:text-[#5ba8e0] font-medium"
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
