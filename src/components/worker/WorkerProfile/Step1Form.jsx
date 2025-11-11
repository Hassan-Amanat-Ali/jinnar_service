import { Camera, User, Info, Loader2 } from "lucide-react";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import Dropdown from "../../common/DropDown.jsx";
import {
  useUpdateProfileMutation,
  useUploadProfilePictureMutation,
} from "../../../services/workerApi";
import { setProfile } from "../../../features/worker/profileSlice";

const Step1Form = forwardRef(({ profileData, isLoading, error }, ref) => {
  const dispatch = useDispatch();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [uploadProfilePicture, { isLoading: isUploading }] =
    useUploadProfilePictureMutation();

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    emailAddress: "",
    languages: ["English"],
    yearsOfExperience: "",
    dateOfBirth: "",
    shortBio: "",
    profileImage: null,
  });

  const [profileImagePreview, setProfileImagePreview] = useState(null);

  // Populate form data when profile data is loaded
  useEffect(() => {
    if (profileData) {
      console.log("Step1Form - Profile Data:", profileData);

      setFormData({
        fullName: profileData.name || "",
        phoneNumber: profileData.mobileNumber || "",
        emailAddress: profileData.email || "",
        languages: profileData.languages || ["English"],
        yearsOfExperience: profileData.yearsOfExperience
          ? `${profileData.yearsOfExperience}+ years`
          : "",
        dateOfBirth: "",
        shortBio: profileData.bio || "",
        profileImage: null,
      });

      // Set profile image preview if exists
      if (profileData.profileImage?.url) {
        console.log(
          "Setting profile image preview:",
          profileData.profileImage.url
        );
        setProfileImagePreview(profileData.profileImage.url);
      } else {
        console.log("No profile image found in profileData");
      }
    }
  }, [profileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLanguageToggle = (language) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((lang) => lang !== language)
        : [...prev.languages, language],
    }));
  };

  // Save profile data
  const handleSave = async () => {
    try {
      const loadingToast = toast.loading("Saving profile...");

      // Step 1: Upload profile picture if changed
      let profileImageData = profileData?.profileImage;
      if (formData.profileImage instanceof File) {
        const imageFormData = new FormData();
        imageFormData.append("profilePicture", formData.profileImage);

        const imageResult = await uploadProfilePicture(imageFormData).unwrap();
        profileImageData = imageResult.file; // { url, publicId }
      }

      // Step 2: Extract years of experience number
      const yearsExp = formData.yearsOfExperience
        ? parseInt(formData.yearsOfExperience.replace(/\D/g, "")) || 0
        : 0;

      // Step 3: Update profile data
      const updateData = {
        name: formData.fullName,
        bio: formData.shortBio,
        languages: formData.languages,
        yearsOfExperience: yearsExp,
      };

      // Add profile image if available
      if (profileImageData) {
        updateData.profileImage = profileImageData;
      }

      const result = await updateProfile(updateData).unwrap();

      // Update Redux store
      dispatch(setProfile(result.user));

      toast.dismiss(loadingToast);
      toast.success("Profile updated successfully!");

      return true;
    } catch (err) {
      console.error("Failed to save profile:", err);
      toast.error(
        err?.data?.error || "Failed to save profile. Please try again."
      );
      return false;
    }
  };

  const [isExpOpen, setIsExpOpen] = useState(false);

  // Expose handleSave to parent component via ref
  useImperativeHandle(ref, () => ({
    handleSave,
  }));

  // Show loading skeleton if data is still loading
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
            <div className="h-6 bg-gray-300 rounded w-32"></div>
            <div className="h-4 bg-gray-300 rounded w-64"></div>
            <div className="h-10 bg-gray-300 rounded w-32"></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-48"></div>
          <div className="h-10 bg-gray-300 rounded w-full"></div>
          <div className="h-10 bg-gray-300 rounded w-full"></div>
          <div className="h-10 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">
          Failed to load profile data. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div>
      {" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column - 3 sections */}
        <div className="space-y-6 md:space-y-8 col-span-2">
          {/* Section 1: Profile Photo */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 text-center">
            <div className="relative inline-block mb-4">
              {profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt="Profile"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mx-auto"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-linear-to-r from-[#A8D8F0] to-[#74C7F2] rounded-full flex items-center justify-center mx-auto">
                  <User className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
              )}
              <input
                type="file"
                id="profile-image-upload"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
              Profile Photo
            </h3>
            <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-6">
              Upload a professional photo to build trust with customers
            </p>

            <label
              htmlFor="profile-image-upload"
              className="inline-block px-4 py-2 border border-[#74C7F2] text-[#74C7F2] rounded-lg text-xs md:text-sm font-medium hover:bg-[#74C7F2] hover:text-white transition-colors cursor-pointer"
            >
              Upload Photo
            </label>
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
                        ? "bg-linear-to-r from-[#B6E0FE] to-[#74C7F2] text-white border-[#74C7F2]"
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
                value={formData.yearsOfExperience}
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
                value={formData.shortBio}
                onChange={handleInputChange}
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
                <User className="h-7 w-7 md:h-8 md:w-8 text-[#74C7F2]" />
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
                <Info className="w-5 h-5 text-[#74C7F2] mt-0.5 shrink-0" />
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
});

Step1Form.displayName = "Step1Form";

export default Step1Form;
