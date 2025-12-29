import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import SetupProgress from "../../components/worker/WorkerProfile/SetupProgress";
import Step5Availability from "../../components/worker/WorkerProfile/Step5Availability";
import defaultSteps from "../../components/worker/WorkerProfile/setupSteps";
import { useGetMyProfileQuery } from "../../services/workerApi";

const ProfileSetupAvailability = () => {
  const navigate = useNavigate();
  const step5FormRef = useRef(null);

  // Fetch profile data
  const { data: profileData, isLoading, error } = useGetMyProfileQuery();

  const handleNext = async () => {
    // Save data before navigating to Step 6
    if (step5FormRef.current) {
      const saved = await step5FormRef.current.handleSave();
      if (saved) {
        navigate("/worker-setup-gig");
      }
    } else {
      navigate("/worker-setup-gig");
    }
  };

  const handleBack = () => {
    // Compute previous step in the full steps list
    const idx = defaultSteps.findIndex((s) => s.key === 5); // current is Availability (key 5)
    const prevStep = defaultSteps[idx - 1];

    // Map step key to route
    const routeMap = {
      1: "/worker-setup-basic",
      2: "/worker-setup-services",
      3: "/worker-setup-experience",
      4: "/worker-setup-location",
      5: "/worker-setup-availability",
    };

    const targetRoute = routeMap[prevStep?.key] || "/worker-setup-experience";
    navigate(targetRoute);
  };

  const handleSaveAndExit = async () => {
    // Save data before exiting
    if (step5FormRef.current) {
      const saved = await step5FormRef.current.handleSave();
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
      <SetupProgress current={5} />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Step 5 of 6: Set your working hours
          </h2>
        </div>

        <Step5Availability
          ref={step5FormRef}
          profileData={profileData?.profile}
          isLoading={isLoading}
          error={error}
        />

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
              {/* Determine previous label */}
              {(() => {
                // Determine previous step label
                const idx = defaultSteps.findIndex((s) => s.key === 5);
                const prev = defaultSteps[idx - 1];
                return `Back: ${prev?.label || "Work Experience"}`;
              })()}
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
              Next: Create Your Gig
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupAvailability;
