import { HelpCircle } from "lucide-react";

const HelpAndSupport = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Help and Support
        </h1>
        <p className="text-sm text-gray-500">
          Get help and contact our support team for assistance.
        </p>
      </div>

      {/* Content */}
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <HelpCircle size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Help & Support Center
          </h3>
          <p className="text-gray-500">
            This section is under development. Help and support features will be
            available soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpAndSupport;
