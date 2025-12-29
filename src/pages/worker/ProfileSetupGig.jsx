import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import Step6Gig from "../../components/worker/WorkerProfile/Step6Gig";
import SetupProgress from "../../components/worker/WorkerProfile/SetupProgress";

const ProfileSetupGig = () => {
  const navigate = useNavigate();
  const step6FormRef = useRef();

  const handleFinish = async () => {
    // Save gig before finishing
    if (step6FormRef.current?.handleSave) {
      const saved = await step6FormRef.current.handleSave();
      if (saved) {
        navigate("/worker-home");
      }
    } else {
      navigate("/worker-home");
    }
  };

  const handleSkip = () => {
    // Skip gig creation and go to worker home
    navigate("/worker-home");
  };

  const handleBack = () => {
    navigate("/worker-setup-availability");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Steps */}
      <SetupProgress current={6} />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Step 6 of 6: Create Your First Professional Gig
          </h2>
          <p className="text-sm text-gray-600">
            Make yourself visible to customers! Create a professional gig to showcase your services.
          </p>
        </div>

        <Step6Gig ref={step6FormRef} />

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-8 sm:mt-12 pt-6 gap-4 sm:gap-0">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            * You can create more gigs later from your profile.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleBack}
              className="w-full sm:w-auto px-6 py-2.5 sm:py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm sm:text-xs"
            >
              Back: Availability
            </button>
            <button
              onClick={handleSkip}
              className="w-full sm:w-auto px-6 py-2.5 sm:py-2 border border-[#74C7F2] text-[#74C7F2] rounded-lg font-medium hover:bg-sky-50 transition-colors text-sm sm:text-xs"
            >
              Skip for Now
            </button>
            <button
              onClick={handleFinish}
              className="w-full sm:w-auto px-8 py-2.5 sm:py-2 bg-[#74C7F2] text-white rounded-lg font-medium hover:bg-[#5ba8e0] transition-colors text-sm sm:text-xs"
            >
              Create Gig & Finish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupGig;
