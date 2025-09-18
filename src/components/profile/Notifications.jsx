import { useState } from "react";
import {
  Bell,
  Calendar,
  Briefcase,
  Gift,
  Smartphone,
  Mail,
  MessageSquare,
} from "lucide-react";

const Notifications = () => {
  const [settings, setSettings] = useState({
    // Booking Notifications
    newBookingRequests: true,
    bookingConfirmations: true,
    bookingCancellations: true,

    // Job & Earnings Updates
    jobCompletionAlerts: true,
    paymentReceivedAlerts: true,
    weeklyEarningsSummary: false,

    // Promotions & Announcements
    platformAnnouncements: false,
    specialOffersRebates: false,

    // Notification Methods
    mobilePushNotifications: true,
    emailNotifications: true,
    smsAlerts: false,
  });

  const handleToggle = (setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleSave = () => {
    // Save settings logic
    console.log("Saving notification settings:", settings);
  };

  const handleCancel = () => {
    // Reset to previous settings or default
    console.log("Cancelling changes");
  };

  const ToggleSwitch = ({ enabled, onToggle }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:ring-offset-2 ${
        enabled ? "bg-[#74C7F2]" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  const Checkbox = ({ checked, onToggle }) => (
    <button
      onClick={onToggle}
      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:ring-offset-2 ${
        checked
          ? "bg-[#74C7F2] border-[#74C7F2] text-white"
          : "border-gray-300 bg-white"
      }`}
    >
      {checked && (
        <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h1>
        <p className="text-sm text-gray-500">Manage how you receive updates.</p>
      </div>

      <div className="space-y-8">
        {/* Booking Notifications */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={20} className="text-[#74C7F2]" />
            <h3 className="text-lg font-semibold text-gray-900">
              Booking Notifications
            </h3>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Manage notifications about your job requests and bookings.
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">
                  New Booking Requests
                </p>
                <p className="text-sm text-gray-500">
                  Get notified when customers request your services
                </p>
              </div>
              <ToggleSwitch
                enabled={settings.newBookingRequests}
                onToggle={() => handleToggle("newBookingRequests")}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">
                  Booking Confirmations
                </p>
                <p className="text-sm text-gray-500">
                  Get notified when bookings are confirmed
                </p>
              </div>
              <ToggleSwitch
                enabled={settings.bookingConfirmations}
                onToggle={() => handleToggle("bookingConfirmations")}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">
                  Booking Cancellations
                </p>
                <p className="text-sm text-gray-500">
                  Get notified when bookings are cancelled by customers
                </p>
              </div>
              <ToggleSwitch
                enabled={settings.bookingCancellations}
                onToggle={() => handleToggle("bookingCancellations")}
              />
            </div>
          </div>
        </div>

        {/* Job & Earnings Updates */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Briefcase size={20} className="text-[#74C7F2]" />
            <h3 className="text-lg font-semibold text-gray-900">
              Job & Earnings Updates
            </h3>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Stay updated on your earnings and job completions.
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">
                  Job Completion Alerts
                </p>
                <p className="text-sm text-gray-500">
                  Get notified when jobs are completed
                </p>
              </div>
              <ToggleSwitch
                enabled={settings.jobCompletionAlerts}
                onToggle={() => handleToggle("jobCompletionAlerts")}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">
                  Payment Received Alerts
                </p>
                <p className="text-sm text-gray-500">
                  Get notified when payments are received
                </p>
              </div>
              <ToggleSwitch
                enabled={settings.paymentReceivedAlerts}
                onToggle={() => handleToggle("paymentReceivedAlerts")}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">
                  Weekly Earnings Summary
                </p>
                <p className="text-sm text-gray-500">
                  Receive weekly earnings summary
                </p>
              </div>
              <ToggleSwitch
                enabled={settings.weeklyEarningsSummary}
                onToggle={() => handleToggle("weeklyEarningsSummary")}
              />
            </div>
          </div>
        </div>

        {/* Promotions & Announcements */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Gift size={20} className="text-[#74C7F2]" />
            <h3 className="text-lg font-semibold text-gray-900">
              Promotions & Announcements
            </h3>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Receive promotional offers and service announcements.
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">
                  Platform Announcements
                </p>
                <p className="text-sm text-gray-500">
                  Important platform updates and announcements
                </p>
              </div>
              <ToggleSwitch
                enabled={settings.platformAnnouncements}
                onToggle={() => handleToggle("platformAnnouncements")}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">
                  Special Offers & Rebates
                </p>
                <p className="text-sm text-gray-500">
                  Promotions and special offers opportunities
                </p>
              </div>
              <ToggleSwitch
                enabled={settings.specialOffersRebates}
                onToggle={() => handleToggle("specialOffersRebates")}
              />
            </div>
          </div>
        </div>

        {/* Notification Methods */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Bell size={20} className="text-[#74C7F2]" />
            <h3 className="text-lg font-semibold text-gray-900">
              Notification Methods
            </h3>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Choose how you want to receive notifications.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={settings.mobilePushNotifications}
                onToggle={() => handleToggle("mobilePushNotifications")}
              />
              <Smartphone size={16} className="text-gray-500" />
              <span className="text-gray-900 font-medium">
                Mobile Push Notifications
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                checked={settings.emailNotifications}
                onToggle={() => handleToggle("emailNotifications")}
              />
              <Mail size={16} className="text-gray-500" />
              <span className="text-gray-900 font-medium">
                Email Notifications
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                checked={settings.smsAlerts}
                onToggle={() => handleToggle("smsAlerts")}
              />
              <MessageSquare size={16} className="text-gray-500" />
              <span className="text-gray-900 font-medium">SMS Alerts</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium rounded-lg hover:from-[#74C7F2] hover:to-[#B6E0FE] transition-all duration-200"
          >
            Save Preferences
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 sm:flex-none px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
