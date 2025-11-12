import React, { useState } from "react";
import {
  CreditCard,
  Trash2,
  Edit,
  Check,
  X,
  Building2,
  Smartphone,
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
              // Check if this method is currently selected
              const isSelected = selectedDefault === method.name;

              // Selected method gets bold border and colored background
              if (isSelected) {
                if (method.name === "Easypaisa") {
                  return "border-2 border-green-600 bg-green-50";
                }
                if (method.name === "JazzCash") {
                  return "border-2 border-orange-600 bg-orange-50";
                }
                if (method.name === "Bank Transfer") {
                  return "border-2 border-blue-600 bg-blue-50";
                }
                return "border-2 border-gray-900 bg-white";
              }

              // Non-selected methods - use border-2 with transparent to prevent layout shift
              if (method.name === "Easypaisa") {
                return "border-2 border-green-200 bg-white";
              }
              if (method.name === "JazzCash") {
                return "border-2 border-orange-200 bg-white";
              }
              if (method.name === "Bank Transfer") {
                return "border-2 border-blue-200 bg-white";
              }

              return "border-2 border-gray-200 bg-white";
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
                className={`rounded-lg p-4 ${getBorderColor()} cursor-pointer transition-colors duration-200 min-h-[88px]`}
                onClick={() => setSelectedDefault(method.name)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {/* Radio button indicator - fixed width */}
                    <div className="flex items-center w-4 shrink-0">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={selectedDefault === method.name}
                        onChange={() => setSelectedDefault(method.name)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      />
                    </div>
                    {/* Icon - fixed width */}
                    <div className="w-8 h-8 flex items-center justify-center shrink-0">
                      {getIcon()}
                    </div>
                    {/* Content - flexible */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {method.name}
                        </h4>
                        {method.isDefault && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium whitespace-nowrap">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {method.accountNumber}
                      </p>
                    </div>
                  </div>

                  {/* Right side - fixed width */}
                  <div className="flex items-center gap-4 shrink-0 ml-4">
                    {/* Status - fixed width */}
                    <div className="flex items-center gap-2 w-32">
                      <div className="w-4 h-4 shrink-0">
                        {method.status === "Connected" && (
                          <Check className="text-green-600" size={16} />
                        )}
                        {method.status === "Not Connected" && (
                          <X className="text-red-600" size={16} />
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium ${getStatusColor(
                          method.status
                        )} whitespace-nowrap`}
                      >
                        {method.status}
                      </span>
                    </div>

                    {/* Manage button - fixed width */}
                    <button
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium whitespace-nowrap w-20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Edit size={14} />
                      Manage
                    </button>

                    {/* Delete button - fixed width */}
                    <div className="w-4 shrink-0">
                      {method.name === "JazzCash" && (
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
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
            <div className="flex items-center gap-3 p-3 min-h-[64px]">
              <div className="flex items-center w-4 shrink-0">
                <input
                  type="radio"
                  name="defaultPayment"
                  value="Easypaisa"
                  checked={selectedDefault === "Easypaisa"}
                  onChange={(e) => setSelectedDefault(e.target.value)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  <CreditCard className="text-green-600" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">Easypaisa</div>
                  <div className="text-sm text-gray-600">03XX-XXXXXXX</div>
                </div>
              </div>
            </div>

            {/* Bank Transfer - Not Selected */}
            <div className="flex items-center gap-3 p-3 min-h-[64px]">
              <div className="flex items-center w-4 shrink-0">
                <input
                  type="radio"
                  name="defaultPayment"
                  value="Bank Transfer"
                  checked={selectedDefault === "Bank Transfer"}
                  onChange={(e) => setSelectedDefault(e.target.value)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  <Building2 className="text-blue-600" size={20} />
                </div>
                <div className="flex-1 min-w-0">
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
