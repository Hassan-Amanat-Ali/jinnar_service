import { Camera, User, Info, Loader2 } from "lucide-react";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import Dropdown from "../../common/DropDown.jsx";
import {
  useUpdateProfileMutation,
  useUploadProfilePictureMutation,
} from "../../../services/workerApi";
import {
  useInitiateContactChangeMutation,
  useVerifyContactChangeMutation,
} from "../../../services/authApi";
import { setProfile } from "../../../features/worker/profileSlice";
import { getFullImageUrl } from "../../../utils/fileUrl.js";

const Step1Form = forwardRef(({ profileData, isLoading, error }, ref) => {
  const dispatch = useDispatch();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [uploadProfilePicture, { isLoading: isUploading }] =
    useUploadProfilePictureMutation();
  const [initiateContactChange] = useInitiateContactChangeMutation();
  const [verifyContactChange] = useVerifyContactChangeMutation();

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

  // Contact change state
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactChangeType, setContactChangeType] = useState(null); // 'email' or 'mobileNumber'
  const [newContactValue, setNewContactValue] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

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
      if (profileData.profilePicture) {
        console.log(
          "Setting profile image preview:",
          profileData.profilePicture
        );
        setProfileImagePreview(getFullImageUrl(profileData.profilePicture));
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

  // Contact change handlers
  const handleChangeContact = (type) => {
    setContactChangeType(type);
    setNewContactValue(""); // Start with empty input for new value
    setShowContactModal(true);
  };

  const handleInitiateChange = async () => {
    const trimmedValue = newContactValue.trim();

    if (!trimmedValue || trimmedValue.length === 0) {
      toast.error(`Please enter your new ${contactChangeType === "email" ? "email address" : "phone number"}`);
      return;
    }

    // Basic validation
    if (contactChangeType === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedValue)) {
        toast.error("Please enter a valid email address");
        return;
      }
    } else if (contactChangeType === "mobileNumber") {
      // More flexible phone validation - check if it starts with + and has enough digits
      const phoneRegex = /^\+[1-9]\d{10,14}$/;
      if (!phoneRegex.test(trimmedValue)) {
        toast.error("Phone number must be in E.164 format starting with + (e.g., +255712345678)");
        return;
      }
    }

    try {
      const loadingToast = toast.loading("Sending verification code...");

      await initiateContactChange({
        newIdentifier: trimmedValue,
        type: contactChangeType,
      }).unwrap();

      toast.dismiss(loadingToast);
      toast.success(`Verification code sent to your new ${contactChangeType === "email" ? "email" : "phone number"}`);
      setShowContactModal(false);
      setShowOtpModal(true);
    } catch (err) {
      console.error("Initiate contact change error:", err);
      const payload = err?.data || err;
      toast.error(payload?.error || payload?.message || "Failed to send verification code");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.trim().length === 0) {
      toast.error("Please enter the verification code");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const loadingToast = toast.loading("Verifying code...");

      await verifyContactChange({ code: otpCode.trim() }).unwrap();

      toast.dismiss(loadingToast);
      toast.success(`${contactChangeType === "email" ? "Email" : "Phone number"} updated successfully`);

      // Update form data with new value
      if (contactChangeType === "email") {
        setFormData((prev) => ({ ...prev, emailAddress: newContactValue }));
      } else {
        setFormData((prev) => ({ ...prev, phoneNumber: newContactValue }));
      }

      // Reset state
      setShowOtpModal(false);
      setOtpCode("");
      setContactChangeType(null);
      setNewContactValue("");
    } catch (err) {
      console.error("OTP verification error:", err);
      const payload = err?.data || err;
      toast.error(payload?.error || payload?.message || "Invalid verification code");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const loadingToast = toast.loading("Resending code...");

      await initiateContactChange({
        newIdentifier: newContactValue,
        type: contactChangeType,
      }).unwrap();

      toast.dismiss(loadingToast);
      toast.success("Verification code resent successfully");
    } catch (err) {
      console.error("Resend OTP error:", err);
      const payload = err?.data || err;
      toast.error(payload?.error || payload?.message || "Failed to resend code");
    }
  };

  const handleCloseContactModal = () => {
    setShowContactModal(false);
    setContactChangeType(null);
    setNewContactValue("");
  };

  const handleCloseOtpModal = () => {
    setShowOtpModal(false);
    setOtpCode("");
    setContactChangeType(null);
    setNewContactValue("");
  };

  // Save profile data
  const handleSave = async () => {
    try {
      const loadingToast = toast.loading("Saving profile...");

      // Step 1: Upload profile picture if changed
      let profileImageData = profileData?.profilePicture;
      if (formData.profileImage instanceof File) {
        const imageFormData = new FormData();
        imageFormData.append("profilePicture", formData.profileImage);

        const imageResult = await uploadProfilePicture(imageFormData).unwrap();
        profileImageData = imageResult.file;
      }

      // Step 2: Extract years of experience number
      const yearsExp = formData.yearsOfExperience
        ? parseInt(formData.yearsOfExperience) ?? 0
        : 0;

      // Step 3: Update profile data
      const updateData = {
        name: formData.fullName,
        mobileNumber: formData.phoneNumber,
        bio: formData.shortBio,
        languages: formData.languages,
        yearsOfExperience: yearsExp,
      };

      // Add profile image if available
      if (profileImageData) {
        updateData.profilePicture = profileImageData;
      }

      console.log("Sending update data:", updateData);
      const result = await updateProfile(updateData).unwrap();
      console.log("Update result:", result);

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
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs md:text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <button
                  type="button"
                  onClick={() => handleChangeContact("mobileNumber")}
                  className="text-xs md:text-sm text-[#74C7F2] font-medium hover:underline"
                >
                  Change
                </button>
              </div>
                <div className="relative">
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    readOnly
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                    placeholder="+1 (555) 234-5678"
                  />
                </div>
                <p className="text-[11px] md:text-xs text-gray-500 mt-1">Used for login and notifications. Requires verification to change.</p>
              </div>

              {/* Email Address */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs md:text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <button
                    type="button"
                    onClick={() => handleChangeContact("email")}
                    className="text-xs md:text-sm text-[#74C7F2] font-medium hover:underline"
                  >
                    Change
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    readOnly
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                    placeholder="your.email@example.com"
                  />
                </div>
                <p className="text-[11px] md:text-xs text-gray-500 mt-1">
                  Used for login and notifications. Requires verification to change.
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
                    A complete profile with a professional photo increases your
                    chances of getting hired by up to 80%!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Pro Tip */}
        </div>
      </div>

      {/* Contact Change Modal */}
      {showContactModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Change {contactChangeType === "email" ? "Email" : "Phone Number"}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Enter your new {contactChangeType === "email" ? "email address" : "phone number"}.
              We&apos;ll send you a verification code.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New {contactChangeType === "email" ? "Email Address" : "Phone Number"}
              </label>
              <input
                type={contactChangeType === "email" ? "email" : "tel"}
                value={newContactValue}
                onChange={(e) => setNewContactValue(e.target.value)}
                placeholder={contactChangeType === "email" ? "your.email@example.com" : "+255712345678"}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
              />
              {contactChangeType === "mobileNumber" && (
                <p className="text-xs text-gray-500 mt-1">
                  Use E.164 format (e.g., +255712345678)
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleInitiateChange}
                className="flex-1 px-6 py-3 bg-linear-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium rounded-lg hover:from-[#74C7F2] hover:to-[#B6E0FE] transition-all duration-200"
              >
                Send Code
              </button>
              <button
                onClick={handleCloseContactModal}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Verify {contactChangeType === "email" ? "Email" : "Phone Number"}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              We&apos;ve sent a verification code to:{" "}
              <span className="font-semibold">{newContactValue}</span>
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Verification Code
              </label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Enter code"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleVerifyOtp}
                disabled={isVerifyingOtp}
                className="flex-1 px-6 py-3 bg-linear-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium rounded-lg hover:from-[#74C7F2] hover:to-[#B6E0FE] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifyingOtp ? "Verifying..." : "Verify"}
              </button>
              <button
                onClick={handleCloseOtpModal}
                disabled={isVerifyingOtp}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>

            <button
              onClick={handleResendOtp}
              className="w-full mt-4 text-sm text-[#74C7F2] hover:underline"
            >
              Resend Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

Step1Form.displayName = "Step1Form";

export default Step1Form;

