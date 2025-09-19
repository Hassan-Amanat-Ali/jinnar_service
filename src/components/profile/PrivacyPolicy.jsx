import { ArrowLeft, Shield, Info } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
            <p className="text-sm text-gray-500">
              Get assistance and find answers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowLeft size={16} className="text-black" />
          <Shield size={16} className="text-[#38BDF8]" />
          <span className="text-lg text-black mt-1 font-bold">
            Privacy Policy
          </span>
        </div>
        <p className="text-sm mt-1">
          Your data security and privacy is our priority.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Effective Date */}
        <div className="border border-gray-200 rounded-xl p-5 shadow-md">
          <p className="text-sm font-medium text-gray-900 mb-4">
            Effective Date: January 1, 2024
          </p>

          {/* Introduction */}

          <p className="text-sm text-gray-700 leading-relaxed">
            This Privacy Policy explains how ServiceMart ("we," "our," or "us")
            collects, uses, and protects your personal information when you use
            our marketplace platform that connects customers with service
            providers.
          </p>
        </div>

        {/* Information We Collect */}
        <div className="border border-gray-200 rounded-xl p-5 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Info size={16} className="text-[#38BDF8]" />
            <h2 className="text-lg font-semibold text-gray-900">
              Information We Collect
            </h2>
          </div>

          <div className="space-y-4 ml-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Personal Information:
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                We collect information you provide directly, including your
                name, email address, phone number, address, and payment
                information when you create an account or book services.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Usage Information:
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                We automatically collect information about your interactions
                with our platform, including pages visited, services viewed, and
                booking history.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Location Information:
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                With your permission, we collect location data to match you with
                nearby service providers and improve our services.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Communication Data:
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                We store messages between customers and service providers to
                ensure service quality and resolve disputes.
              </p>
            </div>
          </div>
        </div>

        {/* How We Use Your Information */}
        <div className="border border-gray-200 rounded-xl p-5 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Info size={16} className="text-[#38BDF8]" />
            <h2 className="text-lg font-semibold text-gray-900">
              How We Use Your Information
            </h2>
          </div>

          <div className="space-y-4 ml-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Service Provision:
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                We use your information to facilitate bookings, match you with
                appropriate service providers, and process payments.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Settings */}
        <div className="pt-6 border-t border-gray-200">
          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#74C7F2] transition-colors">
            <ArrowLeft size={16} />
            Back to Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
