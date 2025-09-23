import { Camera, User, Info } from "lucide-react";
import React, { useState } from "react";

const Step1Form = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    emailAddress: "",
    languages: ["English"],
    yearsOfExperience: "",
    dateOfBirth: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLanguageToggle = (language) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((lang) => lang !== language)
        : [...prev.languages, language],
    }));
  };
  return (
    <div>
      {" "}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - 3 sections */}
        <div className="space-y-8">
          {/* Section 1: Profile Photo */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-gradient-to-r from-[#A8D8F0] to-[#74C7F2] rounded-full flex items-center justify-center mx-auto">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>

            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Profile Photo
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Upload a professional photo to build trust with customers
            </p>

            <button className="px-4 py-2 border border-[#74C7F2] text-[#74C7F2] rounded-lg text-sm font-medium hover:bg-[#74C7F2] hover:text-white transition-colors">
              Upload Photo
            </button>
          </div>

          {/* Section 2: Personal Information Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Personal Information
            </h3>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
                  placeholder="Michael Rodriguez"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
                  placeholder="+1 (555) 234-5678"
                />
                <p className="text-xs text-gray-500 mt-1">
                  We'll send you call for verification purposes
                </p>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
                  placeholder="your.email@example.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your login credentials connect you for detailed purposes
                </p>
              </div>
            </div>
            {/* Languages */}
            <div className="my-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Languages Spoken *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  "English",
                  "Spanish",
                  "French",
                  "Portuguese",
                  "Arabic",
                  "Swahili",
                  "Mandarin",
                  "Japanese",
                  "Korean",
                  "Russian",
                  "German",
                  "Italian",
                ].map((language) => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => handleLanguageToggle(language)}
                    className={`px-3 py-2 rounded-md text-xs font-medium border transition-colors ${
                      formData.languages.includes(language)
                        ? "bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white border-[#74C7F2]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-[#74C7F2]"
                    }`}
                  >
                    {language}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Select any 1 language that customize communicate with clients
                and locals
              </p>
            </div>

            {/* Years of Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience *
              </label>
              <select
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
              >
                <option value="">Select your experience level</option>
                <option value="0-1">0-1 years</option>
                <option value="2-5">2-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="10+">10+ years</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                This helps potential customers understand your expertise level
              </p>
            </div>

            {/* Short Bio */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Bio (Optional)
              </label>
              <textarea
                name="shortBio"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
                placeholder="Tell customers a bit about yourself and what makes you effective"
              />
            </div>
          </div>
        </div>

        {/* Right Column - 2 sections */}
        <div className="space-y-8">
          {/* Section 1: Build Your Professional Profile */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#A8D8F0] to-[#74C7F2] rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Build Your Professional Profile
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Start by sharing your basic information. This helps customers
                get to know you and builds trust in your services.
              </p>
            </div>
          </div>

          {/* Section 2: Pro Tip */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-[#74C7F2] mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-[#74C7F2] mb-2">
                  💡 Pro Tip
                </h4>
                <p className="text-sm text-gray-700">
                  Profiles with photos get 40% more bookings. Make sure to
                  upload a clear, professional photo!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1Form;
