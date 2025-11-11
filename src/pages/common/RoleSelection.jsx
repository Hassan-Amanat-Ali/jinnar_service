import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { ROLES } from "../../constants/roles.js";
import {
  User,
  Lightbulb,
  ArrowRight,
  UserRound,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";

const RoleSelection = () => {
  const { setRole, setUser, role: currentRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  // Check if this is a role switch attempt from a buyer trying to access worker pages
  const isSwitchingRole = location.state?.switchRole;
  const previousRole = location.state?.currentRole;

  // next indicates whether user intended to login or signup
  const next = (location.state && location.state.next) || "login";

  const handleRoleSelection = (role) => {
    // If buyer is trying to switch to worker, show confirmation modal
    if (
      isSwitchingRole &&
      previousRole === ROLES.CUSTOMER &&
      role === ROLES.WORKER
    ) {
      setSelectedRole(role);
      setShowConfirmModal(true);
      return;
    }

    // Normal flow: Store role and navigate
    localStorage.setItem("userRole", role);
    setRole(role);
    navigate(next === "signup" ? "/signup" : "/login");
  };

  const handleConfirmRoleSwitch = () => {
    // Clear all user data
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setRole(null);
    setUser(null);

    // Store new role
    localStorage.setItem("userRole", selectedRole);
    setRole(selectedRole);

    // Close modal and redirect to login
    setShowConfirmModal(false);
    navigate("/login", {
      state: { message: "Please login with your worker account" },
    });
  };

  const handleCancelRoleSwitch = () => {
    setShowConfirmModal(false);
    // Redirect back to customer home
    navigate("/customer-home");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Warning Banner for Role Switch */}
        {isSwitchingRole && previousRole === ROLES.CUSTOMER && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-amber-900 mb-1">
                  Switch to Worker Account
                </h3>
                <p className="text-sm text-amber-800">
                  You're currently logged in as a Customer. To access worker
                  features, you'll need to logout and login again with a Worker
                  account.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isSwitchingRole ? "Switch Your Role" : "Choose Your Role"}
          </h1>
          <p className="text-base text-gray-600">
            {isSwitchingRole
              ? "Select Worker to logout and login with a worker account"
              : "Select how you want to use our platform."}
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-lg transition-shadow">
            {/* Icon */}
            <div className="w-20 h-20 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2]  rounded-full flex items-center justify-center mx-auto mb-6">
              <UserRound className="text-white" size={40} />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              I'm Customer
            </h2>

            {/* Description */}
            <p className="text-gray-600 mb-6">
              Book trusted workers for any service you need quickly and
              securely.
            </p>

            {/* Features List */}
            <ul className="text-sm text-left text-gray-600 space-y-2 mb-8">
              <li>• Browse verified professionals</li>
              <li>• Compare prices and reviews</li>
              <li>• Secure payment protection</li>
              <li>• 24/7 customer support</li>
            </ul>

            {/* Button */}
            <button
              onClick={() => handleRoleSelection(ROLES.CUSTOMER)}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium px-8 py-3 rounded-lg hover:opacity-90 transition-opacity w-full"
            >
              Continue as Customer
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Worker Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-lg transition-shadow">
            {/* Icon */}
            <div className="w-20 h-20 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] rounded-full flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="text-white" size={40} />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              I'm Worker
            </h2>

            {/* Description */}
            <p className="text-gray-600 mb-6">
              Offer your skills and connect with customers in your area.
            </p>

            {/* Features List */}
            <ul className="text-sm text-left text-gray-600 space-y-2 mb-8">
              <li>• Create your professional profile</li>
              <li>• Set your own rates</li>
              <li>• Get matched with local jobs</li>
              <li>• Fast and secure payments</li>
            </ul>

            {/* Button */}
            <button
              onClick={() => handleRoleSelection(ROLES.WORKER)}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium px-8 py-3 rounded-lg hover:opacity-90 transition-opacity w-full"
            >
              Continue as Worker
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            {isSwitchingRole
              ? "Cancel to return to your customer dashboard"
              : "You can change your role type anytime in your account settings"}
          </p>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Switch to Worker Account?
                </h3>
                <p className="text-sm text-gray-600">
                  This will log you out of your current customer account. You'll
                  need to login again with your worker credentials to access
                  worker features.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> If you don't have a worker account yet,
                you'll need to sign up as a worker after being logged out.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelRoleSwitch}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRoleSwitch}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Logout & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSelection;
