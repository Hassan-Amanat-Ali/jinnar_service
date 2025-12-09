import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";

const NotFound = () => {
  const navigate = useNavigate();
  const { role, user } = useAuth();

  const handleGoHome = () => {
    if (user) {
      // Navigate based on user role
      if (role === "worker") {
        navigate("/worker-home");
      } else if (role === "customer") {
        navigate("/customer-home");
      } else {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={logo} alt="Jinnar Logo" className="h-16 w-auto mx-auto" />
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Decorative Header */}
          <div className="h-2 bg-gradient-to-r from-[#B6E0FE] via-[#74C7F2] to-[#0EA5E9]" />

          <div className="p-8 sm:p-12 text-center">
            {/* 404 Number */}
            <div className="mb-6">
              <h1 className="text-8xl sm:text-9xl font-bold bg-gradient-to-r from-[#B6E0FE] via-[#74C7F2] to-[#0EA5E9] bg-clip-text text-transparent">
                404
              </h1>
            </div>

            {/* Error Message */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Page Not Found
              </h2>
              <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Oops! The page you're looking for doesn't exist. It might have
                been moved or deleted, or the URL might be incorrect.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGoHome}
                className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <Home size={20} />
                Go to Home
              </button>
              <button
                onClick={handleGoBack}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-[#74C7F2] hover:bg-blue-50 transition-all duration-300"
              >
                <ArrowLeft size={20} />
                Go Back
              </button>
            </div>
          </div>

          {/* Decorative Footer */}
          <div className="h-2 bg-gradient-to-r from-[#0EA5E9] via-[#74C7F2] to-[#B6E0FE]" />
        </div>

        {/* Help Text */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Need assistance?{" "}
            <button
              onClick={() => navigate("/help")}
              className="text-[#0EA5E9] font-medium hover:text-[#74C7F2] transition-colors"
            >
              Contact Support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

