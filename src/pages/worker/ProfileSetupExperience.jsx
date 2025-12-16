import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import SetupProgress from "../../components/worker/WorkerProfile/SetupProgress";
import Step3WorkSamples from "../../components/worker/WorkerProfile/Step3WorkSamples";
import { useGetMyProfileQuery } from "../../services/workerApi";

const ProfileSetupExperience = () => {
  const navigate = useNavigate();
  const step3FormRef = useRef(null);

  // Fetch profile data
  const { data: profileData, isLoading, error } = useGetMyProfileQuery();

  const handleNext = async () => {
    // Save data before navigating
    if (step3FormRef.current) {
      const saved = await step3FormRef.current.handleSave();
      if (saved) {
        navigate("/worker-setup-pricing");
      }
    } else {
      navigate("/worker-setup-pricing");
    }
  };

  const handleBack = () => {
    navigate("/worker-setup-services");
  };

  const handleSaveAndExit = async () => {
    // Save data before exiting
    if (step3FormRef.current) {
      const saved = await step3FormRef.current.handleSave();
      if (saved) {
        navigate("/worker-home");
      }
    } else {
      navigate("/worker-home");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Progress Steps */}
      <SetupProgress current={3} />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Step 3 of 5: Showcase your work with samples
          </h2>
        </div>

        <Step3WorkSamples
          ref={step3FormRef}
          profileData={profileData?.profile}
          isLoading={isLoading}
          error={error}
        />

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-8 sm:mt-12 pt-6 gap-4 sm:gap-0">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            * You can add multiple experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleBack}
              className="w-full sm:w-auto px-6 py-2.5 sm:py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm sm:text-xs"
            >
              Back: Skills and Services
            </button>
            <button
              onClick={handleSaveAndExit}
              className="w-full sm:w-auto px-6 py-2.5 sm:py-2 border border-[#74C7F2] text-[#74C7F2] rounded-lg font-medium hover:bg-sky-50 transition-colors text-sm sm:text-xs"
            >
              Save & Exit
            </button>
            <button
              onClick={handleNext}
              className="w-full sm:w-auto px-8 py-2.5 sm:py-2 bg-[#74C7F2] text-white rounded-lg font-medium hover:bg-[#5ba8e0] transition-colors text-sm sm:text-xs"
            >
              Next: Pricing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupExperience;
