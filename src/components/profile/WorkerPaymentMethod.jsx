import React, { useState } from "react";
import {
  CreditCard,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  Building2,
  Smartphone,
  Wallet,
  DollarSign,
} from "lucide-react";

const WorkerPaymentMethod = () => {
  const [paymentMethods] = useState([
    {
      id: 1,
      type: "mobile",
      name: "Easypaisa",
      accountNumber: "Ali Raza • XXXX XXXXXX",
      accountName: "Ali Raza",
      isDefault: true,
      isActive: true,
      status: "Connected",
    },
    {
      id: 2,
      type: "mobile",
      name: "JazzCash",
      accountNumber: "Ali Raza • XXXX XXXXXX",
      accountName: "Ali Raza",
      isDefault: false,
      isActive: false,
      status: "Not Connected",
    },
    {
      id: 3,
      type: "bank",
      name: "Bank Transfer",
      accountNumber: "Ali Raza • XXXX-XXXX-XXXX-1234",
      accountName: "Ali Raza",
      isDefault: false,
      isActive: true,
      status: "Connected",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDefault, setSelectedDefault] = useState("Easypaisa");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Payment Methods
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Manage how you receive payments
        </p>
      </div>

      {/* Current Payment Methods */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Current Payment Methods
        </h3>

        <div className="space-y-3">
          {paymentMethods.map((method) => {
            const getStatusColor = (status) => {
              return status === "Connected" ? "text-green-600" : "text-red-600";
            };

            const getBorderColor = () => {
              // Default/selected method gets black border with green background (Easypaisa)
              if (method.isDefault && method.name === "Easypaisa") {
                return "border-2 border-gray-900 bg-green-50";
              }

              // Default method with different provider
              if (method.isDefault) {
                return "border-2 border-gray-900 bg-white";
              }

              // Other methods get colored backgrounds based on type/status
              if (method.name === "JazzCash") {
                return "border border-orange-200 bg-orange-50";
              }
              if (method.name === "Bank Transfer") {
                return "border border-blue-200 bg-blue-50";
              }

              return "border border-gray-200 bg-gray-50";
            };

            const getIcon = () => {
              if (method.name === "Easypaisa") {
                return <CreditCard className="text-green-600" size={20} />;
              }
              if (method.name === "JazzCash") {
                return <Smartphone className="text-orange-600" size={20} />;
              }
              if (method.name === "Bank Transfer") {
                return <Building2 className="text-blue-600" size={20} />;
              }
              return <CreditCard className="text-gray-600" size={20} />;
            };

            return (
              <div
                key={method.id}
                className={`rounded-lg p-4 ${getBorderColor()}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center">
                      {getIcon()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">
                          {method.name}
                        </h4>
                        {method.isDefault && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {method.accountNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {method.status === "Connected" && (
                        <Check className="text-green-600" size={16} />
                      )}
                      {method.status === "Not Connected" && (
                        <X className="text-red-600" size={16} />
                      )}
                      <span
                        className={`text-sm font-medium ${getStatusColor(
                          method.status
                        )}`}
                      >
                        {method.status}
                      </span>
                    </div>

                    <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium">
                      <Edit size={14} />
                      Manage
                    </button>

                    {method.name === "JazzCash" && (
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add New Payment Method */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Add New Payment Method
          </h3>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            + Add Payment Method
          </button>
        </div>

        {/* Default Payment Method */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Default Payment Method
          </h3>

          <div className="space-y-3">
            {/* Easypaisa - Selected */}
            <div className="flex items-center gap-3 p-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="defaultPayment"
                  value="Easypaisa"
                  checked={selectedDefault === "Easypaisa"}
                  onChange={(e) => setSelectedDefault(e.target.value)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  <CreditCard className="text-green-600" size={20} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Easypaisa</div>
                  <div className="text-sm text-gray-600">03XX-XXXXXXX</div>
                </div>
              </div>
            </div>

            {/* Bank Transfer - Not Selected */}
            <div className="flex items-center gap-3 p-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="defaultPayment"
                  value="Bank Transfer"
                  checked={selectedDefault === "Bank Transfer"}
                  onChange={(e) => setSelectedDefault(e.target.value)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  <Building2 className="text-blue-600" size={20} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Bank Transfer</div>
                  <div className="text-sm text-gray-600">
                    XXXX-XXXX-XXXX-1234
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Processing */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 flex items-center justify-center mt-1">
              <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">i</span>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">
                Payment Processing:
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Payments are processed within 24-48 hours after job completion.
                Make sure your payment method details are accurate to avoid
                delays.
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button className="bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm">
            Save Changes
          </button>
          <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-400 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkerPaymentMethod;
