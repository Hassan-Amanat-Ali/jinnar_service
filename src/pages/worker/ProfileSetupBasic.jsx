import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import Step1Form from "../../components/worker/WorkerProfile/Step1Form";
import SetupProgress from "../../components/worker/WorkerProfile/SetupProgress";
import { useGetMyProfileQuery } from "../../services/workerApi";

const ProfileSetupBasic = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetMyProfileQuery();
  const step1FormRef = useRef();

  const handleNext = async () => {
    // Save before navigating
    if (step1FormRef.current?.handleSave) {
      const saved = await step1FormRef.current.handleSave();
      if (saved) {
        navigate("/worker-setup-services");
      }
    } else {
      navigate("/worker-setup-services");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };


  return (
    <div className="min-h-screen bg-gray-50">

      {/* Progress Steps */}
      <SetupProgress current={1} />

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-4 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Step 1 of 5: Let's start with your personal information
          </h2>
        </div>

        <Step1Form
          ref={step1FormRef}
          profileData={data?.profile}
          isLoading={isLoading}
          error={error}
        />

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-8 sm:mt-12 pt-6 gap-4 sm:gap-0">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            * Required forms keep trusts from your customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleBack}
              className="w-full sm:w-auto px-6 py-2.5 sm:py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm sm:text-xs"
            >
              Exit
            </button>
            <button
              onClick={handleNext}
              className="w-full sm:w-auto px-8 py-2.5 sm:py-2 bg-[#74C7F2] text-white rounded-lg font-medium hover:bg-[#5ba8e0] transition-colors text-sm sm:text-xs"
            >
              Next: Skills & Services
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupBasic;
