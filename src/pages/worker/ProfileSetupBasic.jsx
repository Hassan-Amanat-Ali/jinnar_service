import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Step1Form from "../../components/worker/WorkerProfile/Step1Form";

const ProfileSetupBasic = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/worker-setup-services");
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
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
      <div className=" px-6 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 xl:px-5">
          <div className="flex items-center justify-between">
            {/* Step 1 - Active */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#74C7F2] rounded-full flex items-center justify-center text-white text-sm font-medium">
                1
              </div>
              <span className="ml-3 text-sm font-medium text-gray-900">
                Personal Info
              </span>
            </div>

            <div className="flex-1 mx-4 h-px bg-gray-300"></div>

            {/* Step 2 */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm font-medium">
                2
              </div>
              <span className="ml-3 text-sm text-gray-500">
                Skills & Services
              </span>
            </div>

            <div className="flex-1 mx-4 h-px bg-gray-300"></div>

            {/* Step 3 */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm font-medium">
                3
              </div>
              <span className="ml-3 text-sm text-gray-500">
                Work Experience
              </span>
            </div>

            <div className="flex-1 mx-4 h-px bg-gray-300"></div>

            {/* Step 4 */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm font-medium">
                4
              </div>
              <span className="ml-3 text-sm text-gray-500">Pricing</span>
            </div>

            <div className="flex-1 mx-4 h-px bg-gray-300"></div>

            {/* Step 5 */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm font-medium">
                5
              </div>
              <span className="ml-3 text-sm text-gray-500">Availability</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 xl:px-5 py-8">
        <div className="text-center mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Step 1 of 5: Let's start with your personal information
          </h2>
        </div>

        <Step1Form />

        {/* Footer Buttons */}
        <div className="flex justify-between items-center mt-12 pt-6">
          <p className="text-xs text-gray-500">
            * Required forms keep trusts from your customers.
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleBack}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Exit
            </button>
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-[#74C7F2] text-white rounded-lg font-medium hover:bg-[#5ba8e0] transition-colors"
            >
              Next: Skills & Services →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupBasic;
