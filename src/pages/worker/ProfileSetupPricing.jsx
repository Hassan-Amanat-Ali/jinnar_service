import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useGetMyProfileQuery } from "../../services/workerApi";
import SetupProgress from "../../components/worker/WorkerProfile/SetupProgress";
import Step4Location from "../../components/worker/WorkerProfile/Step4Location";

const ProfileSetupPricing = () => {
  const navigate = useNavigate();
  const step4Ref = useRef();

  const { data: profileData, isLoading, error } = useGetMyProfileQuery();

  const handleNext = async () => {
    // Save Step 4 data before moving to next step
    if (step4Ref.current) {
      const saved = await step4Ref.current.handleSave();
      if (saved) {
        navigate("/worker-setup-availability");
      }
    }
  };

  const handleBack = () => {
    navigate("/worker-setup-experience");
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Progress Steps */}
      <SetupProgress current={4} />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Step 4 of 5: Set your location
          </h2>
        </div>

        <Step4Location
          ref={step4Ref}
          profileData={profileData?.profile}
          isLoading={isLoading}
          error={error}
        />

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-8 sm:mt-12 pt-6 gap-4 sm:gap-0">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            * You can adjust pricing later in settings.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleBack}
              className="w-full sm:w-auto px-6 py-2.5 sm:py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm sm:text-xs"
            >
              Back: Work Experience
            </button>
            <button
              onClick={handleNext}
              className="w-full sm:w-auto px-8 py-2.5 sm:py-2 bg-[#74C7F2] text-white rounded-lg font-medium hover:bg-[#5ba8e0] transition-colors text-sm sm:text-xs"
            >
              Next: Availability
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPricing;
