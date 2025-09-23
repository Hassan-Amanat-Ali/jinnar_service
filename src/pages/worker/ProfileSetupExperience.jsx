import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SetupProgress from "../../components/worker/WorkerProfile/SetupProgress";
import Step3WorkSamples from "../../components/worker/WorkerProfile/Step3WorkSamples";

const ProfileSetupExperience = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/worker-setup-pricing");
  };

  const handleBack = () => {
    navigate("/worker-setup-services");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 xl:px-5">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <h1 className="text-lg font-semibold text-gray-900">Profile Setup</h1>

          <button className="flex items-center gap-2 text-[#74C7F2] text-sm font-medium">
            <span>Save & Exit</span>
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <SetupProgress current={3} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 xl:px-5 py-8">
        <div className="text-center mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Step 3 of 5: Showcase your work with samples
          </h2>
        </div>

        <Step3WorkSamples />

        {/* Footer Buttons */}
        <div className="flex justify-between items-center mt-12 pt-6">
          <p className="text-xs text-gray-500">
            * You can add multiple experiences.
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleBack}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-xs"
            >
              ← Back: Skills and Services
            </button>
            <button
              onClick={handleNext}
              className="px-8 py-2 bg-[#74C7F2] text-white rounded-lg font-medium hover:bg-[#5ba8e0] transition-colors text-xs"
            >
              Next: Pricing →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupExperience;
