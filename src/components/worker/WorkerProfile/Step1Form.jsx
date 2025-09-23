import { Camera, User, Info } from "lucide-react";
import { useState } from "react";
import user from "../../../assets/icons/user-image.png";
import Dropdown from "../../common/DropDown.jsx";

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
  const [isExpOpen, setIsExpOpen] = useState(false);
  return (
    <div>
      {" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column - 3 sections */}
        <div className="space-y-6 md:space-y-8 col-span-2">
          {/* Section 1: Profile Photo */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-[#A8D8F0] to-[#74C7F2] rounded-full flex items-center justify-center mx-auto">
                <User className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>

            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
              Profile Photo
            </h3>
            <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-6">
              Upload a professional photo to build trust with customers
            </p>

            <button className="px-4 py-2 border border-[#74C7F2] text-[#74C7F2] rounded-lg text-xs md:text-sm font-medium hover:bg-[#74C7F2] hover:text-white transition-colors">
              Upload Photo
            </button>
          </div>

          {/* Section 2: Personal Information Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6">
              Personal Information
            </h3>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
                  placeholder="Michael Rodriguez"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
                  placeholder="+1 (555) 234-5678"
                />
                <p className="text-[11px] md:text-xs text-gray-500 mt-1">
                  We'll send you call for verification purposes
                </p>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
                  placeholder="your.email@example.com"
                />
                <p className="text-[11px] md:text-xs text-gray-500 mt-1">
                  Your login credentials connect you for detailed purposes
                </p>
              </div>
            </div>
            {/* Languages */}
            <div className="my-6">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-3">
                Languages Spoken *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
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
                    className={`px-3 py-2 rounded-md text-[11px] md:text-xs font-medium border transition-colors ${
                      formData.languages.includes(language)
                        ? "bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white border-[#74C7F2]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-[#74C7F2]"
                    }`}
                  >
                    {language}
                  </button>
                ))}
              </div>
              <p className="text-[11px] md:text-xs text-gray-500 mt-2">
                Select any 1 language that customize communicate with clients
                and locals
              </p>
            </div>

            {/* Years of Experience */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Years of Experience *
              </label>
              <Dropdown
                placeholder="Select your experience level"
                options={["0-1 years", "2-5 years", "6-10 years", "10+ years"]}
                isOpen={isExpOpen}
                onToggle={() => setIsExpOpen((v) => !v)}
                onSelect={(opt) =>
                  setFormData((prev) => ({
                    ...prev,
                    yearsOfExperience: opt,
                  }))
                }
                className="w-full text-xs md:text-sm"
              />
              <p className="text-[11px] md:text-xs text-gray-500 mt-1">
                This helps potential customers understand your expertise level
              </p>
            </div>

            {/* Short Bio */}
            <div className="mt-6">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Short Bio (Optional)
              </label>
              <textarea
                name="shortBio"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent text-sm"
                placeholder="Tell customers a bit about yourself and what makes you effective"
              />
            </div>
          </div>
        </div>

        {/* Right Column - 2 sections */}
        <div className="space-y-4 md:space-y-6 col-span-1">
          {/* Section 1: Build Your Professional Profile */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="text-center ">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-[#DBEAFE] rounded-full flex items-center justify-center mx-auto mb-4">
                <img
                  src={user}
                  alt="User"
                  className="h-7 w-7 md:h-8 md:w-8 object-contain"
                />
              </div>
              <h3 className="text-base md:text-lg font-medium text-gray-900">
                Build Your Professional Profile
              </h3>
              <p className="text-xs md:text-sm text-gray-600 mt-2">
                Start by sharing your basic information. This helps customers
                get to know you and builds trust in your services.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-5 mt-4 md:mt-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-[#74C7F2] mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs md:text-sm font-medium text-[#74C7F2] mb-2">
                    💡 Pro Tip
                  </h4>
                  <p className="text-xs md:text-sm text-gray-700">
                    Profiles with photos get 40% more bookings. Make sure to
                    upload a clear, professional photo!
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Section 2: Pro Tip */}
        </div>
      </div>
    </div>
  );
};

export default Step1Form;
