import { FileText } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500">
          Read our privacy policy and understand how we protect your data.
        </p>
      </div>

      {/* Content */}
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Privacy Policy
          </h3>
          <p className="text-gray-500">
            This section is under development. Privacy policy content will be
            available soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
