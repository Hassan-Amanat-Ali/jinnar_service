import { TerminalSquare } from "lucide-react";

const TermsAndConditions = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Terms and Conditions
        </h1>
        <p className="text-sm text-gray-500">
          Review the terms and conditions for using our platform.
        </p>
      </div>

      {/* Content */}
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <TerminalSquare size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Terms & Conditions
          </h3>
          <p className="text-gray-500">
            This section is under development. Terms and conditions will be
            available soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
