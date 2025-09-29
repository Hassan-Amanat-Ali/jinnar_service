import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SetupProgress from "../../components/worker/WorkerProfile/SetupProgress";
import Step5Availability from "../../components/worker/WorkerProfile/Step5Availability";

const ProfileSetupAvailability = () => {
  const navigate = useNavigate();

  const handleFinish = () => {
    // For now, navigate to worker home; replace with submit flow later.
    navigate("/worker-home");
  };

  const handleBack = () => {
    navigate("/worker-setup-pricing");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium">Back</span>
          </button>

          <h1 className="text-base sm:text-lg font-semibold text-gray-900">
            Profile Setup
          </h1>

          <button className="flex items-center gap-2 text-[#74C7F2] text-xs sm:text-sm font-medium">
            <span>Save & Exit</span>
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <SetupProgress current={5} />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Step 5 of 5: Set your working hours
          </h2>
        </div>

        <Step5Availability />

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-8 sm:mt-12 pt-6 gap-4 sm:gap-0">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            * You can update your availability anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleBack}
              className="w-full sm:w-auto px-6 py-2.5 sm:py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm sm:text-xs"
            >
              ← Back: Pricing
            </button>
            <button
              onClick={handleFinish}
              className="w-full sm:w-auto px-8 py-2.5 sm:py-2 bg-[#74C7F2] text-white rounded-lg font-medium hover:bg-[#5ba8e0] transition-colors text-sm sm:text-xs"
            >
              Finish Setup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupAvailability;
