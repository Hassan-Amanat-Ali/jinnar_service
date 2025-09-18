import { useState } from "react";
import { User, Mail, Phone, MapPin, Edit, Bell } from "lucide-react";

const ProfileOverview = () => {
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-sm text-gray-500">
          Your account information and personal details.
        </p>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8 p-6 rounded-2xl border border-neutral-100 shadow-sm">
        <div className="relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#B6E0FE] to-[#74C7F2] rounded-full flex items-center justify-center">
            <span className="text-xl sm:text-2xl font-bold text-white">SJ</span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            Sarah Johnson
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Mail size={14} />
              sarah.johnson@gmail.com
            </span>
            <span className="flex items-center gap-1">
              <Phone size={14} />
              +1 (555) 123-4567
            </span>
          </div>
          <p className="text-xs text-black mt-1 border border-neutral-300 w-fit px-2 py-1 rounded-md bg-neutral-50 shadow-sm">
            Member since March 2024
          </p>
        </div>
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className="px-4 py-2 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white text-sm font-medium rounded-lg hover:from-[#74C7F2] hover:to-[#B6E0FE] transition-all duration-200 flex items-center gap-2"
        >
          <Edit size={16} />
          {isEditMode ? "Cancel Edit" : "Edit Profile"}
        </button>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Info */}
        <div className="border-neutral-100 shadow-sm p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <User size={20} className="text-[#74C7F2]" />
            <h3 className="text-lg font-semibold text-gray-900">
              Personal Info
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              {isEditMode ? (
                <input
                  type="text"
                  defaultValue="Sarah Johnson"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent bg-white"
                />
              ) : (
                <p className="text-gray-900 py-3">Sarah Johnson</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              {isEditMode ? (
                <input
                  type="email"
                  defaultValue="sarah.johnson@gmail.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent bg-white"
                />
              ) : (
                <p className="text-gray-900 py-3">sarah.johnson@gmail.com</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              {isEditMode ? (
                <input
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent bg-white"
                />
              ) : (
                <p className="text-gray-900 py-3">+1 (555) 123-4567</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              {isEditMode ? (
                <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent bg-white">
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <p className="text-gray-900 py-3">Female</p>
              )}
            </div>
          </div>
        </div>

        {/* Address Info */}
        <div className="border-neutral-100 shadow-sm p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={20} className="text-[#74C7F2]" />
            <h3 className="text-lg font-semibold text-gray-900">
              Address Info
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              {isEditMode ? (
                <textarea
                  defaultValue="123 Main Street, Downtown Area, New York, NY 10001"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent bg-white resize-none"
                  rows={4}
                />
              ) : (
                <p className="text-gray-900 py-3">
                  123 Main Street, Downtown Area, New York, NY 10001
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="border-neutral-100 shadow-sm p-6 rounded-2xl mt-5">
        <div className="flex items-center gap-2 mb-6">
          <Bell size={20} className="text-[#74C7F2]" />
          <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notifications
            </label>
            {isEditMode ? (
              <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent bg-white">
                <option value="email-sms">Email & SMS</option>
                <option value="email">Email Only</option>
                <option value="sms">SMS Only</option>
                <option value="none">None</option>
              </select>
            ) : (
              <p className="text-gray-900 py-3">Email & SMS</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            {isEditMode ? (
              <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent bg-white">
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
              </select>
            ) : (
              <p className="text-gray-900 py-3">English</p>
            )}
          </div>
        </div>
      </div>

      {/* Save Button - Only visible in edit mode */}
      {isEditMode && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => {
                // Save logic would go here
                setIsEditMode(false);
              }}
              className="px-6 py-3 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium rounded-lg hover:from-[#74C7F2] hover:to-[#B6E0FE] transition-all duration-200"
            >
              Save Profile
            </button>
            <button
              onClick={() => setIsEditMode(false)}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileOverview;
