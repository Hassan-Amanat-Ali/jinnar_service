import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import Step2Fom from "../../components/worker/WorkerProfile/Step2Fom";
import SetupProgress from "../../components/worker/WorkerProfile/SetupProgress";
import { useGetMyProfileQuery } from "../../services/workerApi";

const ProfileSetupServices = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetMyProfileQuery();
  const step2FormRef = useRef();

  const handleNext = async () => {
    // Save before navigating
    if (step2FormRef.current?.handleSave) {
      const saved = await step2FormRef.current.handleSave();
      if (saved) {
        navigate("/worker-setup-experience");
      }
    } else {
      navigate("/worker-setup-experience");
    }
  };

  const handleBack = () => {
    navigate("/worker-setup-basic");
  };

  const handleSaveAndExit = async () => {
    // Save before exiting
    if (step2FormRef.current?.handleSave) {
      const saved = await step2FormRef.current.handleSave();
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
      <SetupProgress current={2} />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Step 2 of 5: Add your skills & services
          </h2>
        </div>

        <Step2Fom
          ref={step2FormRef}
          profileData={data?.profile}
          isLoading={isLoading}
          error={error}
        />

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-8 sm:mt-12 pt-6 gap-4 sm:gap-0">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            * Add at least one service to proceed to the next step.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleBack}
              className="w-full sm:w-auto px-6 py-2.5 sm:py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm sm:text-xs"
            >
              Back: Personal Info
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
              Next: Work Experience
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupServices;
