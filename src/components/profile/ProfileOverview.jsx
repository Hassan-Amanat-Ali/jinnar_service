import { useState, useEffect } from "react";
import { User, MapPin, Edit, Plus, Camera } from "lucide-react";
import { toast } from "react-hot-toast";
import LocationPicker from "../common/LocationPicker";
import {
  useGetMyProfileQuery as useGetCustomerProfileQuery,
  useUpdateProfileMutation as useUpdateCustomerProfileMutation,
  useUploadProfilePictureMutation as useUploadCustomerProfilePictureMutation,
} from "../../services/customerApi";
import {
  useGetMyProfileQuery as useGetWorkerProfileQuery,
  useUpdateProfileMutation as useUpdateWorkerProfileMutation,
  useUploadProfilePictureMutation as useUploadWorkerProfilePictureMutation,
} from "../../services/workerApi";
import {
  useInitiateContactChangeMutation,
  useVerifyContactChangeMutation,
} from "../../services/authApi";
import { getFullImageUrl, reverseGeocode } from "../../utils/fileUrl";
import { ROLES } from "../../constants/roles";
import VerificationSection from "./VerificationSection";

const ProfileOverview = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [editingLocationIndex, setEditingLocationIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    selectedAreas: [],
    preferredAreas: [],
    languages: [],
    notifications: [],
    profilePicture: null,
  });
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [locationAddresses, setLocationAddresses] = useState({});

  // Contact change verification state
  const [showContactModal, setShowContactModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [contactChangeType, setContactChangeType] = useState(null); // 'email' or 'mobileNumber'
  const [newContactValue, setNewContactValue] = useState("");
  const [pendingUpdateData, setPendingUpdateData] = useState(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const role = localStorage.getItem("role");
  const isCustomer = role === ROLES.CUSTOMER;

  const customerProfile = useGetCustomerProfileQuery(undefined, {
    skip: !isCustomer,
  });
  const workerProfile = useGetWorkerProfileQuery(undefined, {
    skip: isCustomer,
  });

  const [updateCustomerProfile] = useUpdateCustomerProfileMutation();
  const [updateWorkerProfile] = useUpdateWorkerProfileMutation();
  const [uploadCustomerProfilePicture] =
    useUploadCustomerProfilePictureMutation();
  const [uploadWorkerProfilePicture] = useUploadWorkerProfilePictureMutation();

  const [initiateContactChange] = useInitiateContactChangeMutation();
  const [verifyContactChange] = useVerifyContactChangeMutation();

  const {
    data: profileData,
    isLoading,
    error,
    refetch,
  } = isCustomer ? customerProfile : workerProfile;

  const updateProfile = isCustomer
    ? updateCustomerProfile
    : updateWorkerProfile;

  const uploadProfilePicture = isCustomer
    ? uploadCustomerProfilePicture
    : uploadWorkerProfilePicture;

  useEffect(() => {
    if (profileData?.profile) {
      const profile = profileData.profile;
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        mobileNumber: profile.mobileNumber || "",
        selectedAreas: profile.selectedAreas || [],
        preferredAreas: profile.preferredAreas || [],
        languages: profile.languages || [],
        notifications: profile.notifications || [],
        profilePicture: null,
      });

      // Set profile image preview if exists
      if (profile.profilePicture) {
        setProfileImagePreview(getFullImageUrl(profile.profilePicture));
      }

      // Reverse geocode all location coordinates to get readable addresses
      const fetchAddresses = async () => {
        const areas = isCustomer ? profile.preferredAreas : profile.selectedAreas;
        if (areas && areas.length > 0) {
          const addresses = {};
          for (let i = 0; i < areas.length; i++) {
            const area = areas[i];
            if (area.coordinates && area.coordinates.length === 2) {
              const [lng, lat] = area.coordinates;
              const address = await reverseGeocode(lat, lng);
              addresses[i] = address || area.address || "Location on map";
            } else {
              addresses[i] = area.address || "Location on map";
            }
          }
          setLocationAddresses(addresses);
        }
      };
      fetchAddresses();
    }
  }, [profileData, isCustomer]);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image (JPG or PNG)");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setFormData({ ...formData, profilePicture: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddLocation = () => {
    setEditingLocationIndex(null);
    setShowLocationPicker(true);
  };

  const handleEditLocation = (index) => {
    setEditingLocationIndex(index);
    setShowLocationPicker(true);
  };

  const handleLocationSelect = (locationData) => {
    const fieldName = isCustomer ? "preferredAreas" : "selectedAreas";
    // Store both formats: GeoJSON for backend, and display data for UI
    const newLocation = {
      type: "Point",
      coordinates: [locationData.lng, locationData.lat], // GeoJSON format: [longitude, latitude]
      address: locationData.address, // For display purposes
    };

    setFormData((prev) => {
      const updated = [...prev[fieldName]];
      if (editingLocationIndex !== null) {
        updated[editingLocationIndex] = newLocation;
      } else {
        updated.push(newLocation);
      }
      return { ...prev, [fieldName]: updated };
    });

    setShowLocationPicker(false);
    setEditingLocationIndex(null);
  };

  const handleRemoveLocation = (index) => {
    const fieldName = isCustomer ? "preferredAreas" : "selectedAreas";
    setFormData((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index),
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

  const handleCloseContactModal = () => {
    setShowContactModal(false);
    setContactChangeType(null);
    setNewContactValue("");
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.trim().length === 0) {
      toast.error("Please enter the verification code");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      // Verify the OTP
      await verifyContactChange({ code: otpCode.trim() }).unwrap();

      toast.success(
        `${contactChangeType === "email" ? "Email" : "Phone number"} updated successfully`
      );

      // Update form data with new value
      if (contactChangeType === "email") {
        setFormData((prev) => ({ ...prev, email: newContactValue }));
      } else {
        setFormData((prev) => ({ ...prev, mobileNumber: newContactValue }));
      }

      // Now proceed with the rest of the profile update if there's pending data
      if (pendingUpdateData) {
        try {
          const result = await updateProfile(pendingUpdateData).unwrap();
          toast.success(result.message || "Profile updated successfully");
          setIsEditMode(false);
          refetch();
        } catch (updateErr) {
          console.error(
            "Profile update error after contact change:",
            updateErr
          );
          toast.error("Contact updated but failed to update other fields");
        }
      } else {
        // If no pending update, just refetch to sync with backend
        refetch();
      }

      // Reset state
      setShowOtpModal(false);
      setOtpCode("");
      setContactChangeType(null);
      setNewContactValue("");
      setPendingUpdateData(null);
    } catch (err) {
      console.error("OTP verification error:", err);
      const payload = err?.data || err;

      if (payload?.error) {
        toast.error(payload.error);
      } else if (payload?.message) {
        toast.error(payload.message);
      } else {
        toast.error("Invalid verification code");
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleCloseOtpModal = () => {
    setShowOtpModal(false);
    setOtpCode("");
    setContactChangeType(null);
    setNewContactValue("");
    setPendingUpdateData(null);
  };

  const handleResendOtp = async () => {
    try {
      await initiateContactChange({
        newIdentifier: newContactValue,
        type: contactChangeType,
      }).unwrap();

      toast.success("Verification code resent successfully");
    } catch (err) {
      console.error("Resend OTP error:", err);
      const payload = err?.data || err;
      toast.error(
        payload?.error || payload?.message || "Failed to resend code"
      );
    }
  };

  const handleSave = async () => {
    try {
      // Step 1: Upload profile picture if changed
      if (formData.profilePicture instanceof File) {
        const imageFormData = new FormData();
        imageFormData.append("profilePicture", formData.profilePicture);

        await uploadProfilePicture(imageFormData).unwrap();
      }

      // Step 2: Prepare update data
      const updateData = {
        name: formData.name,
      };

      // Add areas based on role
      if (isCustomer) {
        updateData.preferredAreas = formData.preferredAreas;
      } else {
        updateData.selectedAreas = formData.selectedAreas;
      }

      // Step 3: Update profile (email/phone changes are handled separately via "Change" button)
      const result = await updateProfile(updateData).unwrap();
      toast.success(result.message || "Profile updated successfully");
      setIsEditMode(false);
      refetch();
    } catch (err) {
      console.error("Profile update error:", err);
      const payload = err?.data || err;

      if (payload?.error) {
        toast.error(payload.error);
      } else if (payload?.message) {
        toast.error(payload.message);
      } else {
        toast.error("Failed to update profile");
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#74C7F2]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
        <div className="text-center py-12">
          <p className="text-red-600">Failed to load profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-sm text-gray-500">
          Your account information and personal details.
        </p>
      </div>

      {/* Profile Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8 p-6 rounded-2xl border border-neutral-100 shadow-sm">
        <div className="relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#B6E0FE] to-[#74C7F2] rounded-full flex items-center justify-center overflow-hidden">
            {profileImagePreview ? (
              <img
                src={profileImagePreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl sm:text-2xl font-bold text-white">
                {getInitials(formData.name)}
              </span>
            )}
          </div>
          {isEditMode && (
            <>
              <button
                onClick={() =>
                  document.getElementById("profile-image-upload").click()
                }
                className="absolute bottom-0 right-0 bg-[#74C7F2] text-white p-2 rounded-full hover:bg-[#5bb3e0] transition-colors"
              >
                <Camera size={16} />
              </button>
              <input
                id="profile-image-upload"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageChange}
                className="hidden"
              />
            </>
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {formData.name || "Your Name"}
          </h2>
          <p className="text-sm text-gray-500">
            Member since{" "}
            {profileData?.profile?.createdAt
              ? formatDate(profileData.profile.createdAt)
              : "Recently"}
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

      {/* Profile Content */}
      <div className="grid grid-cols-1 gap-8">
        {/* Personal Info and Address Section */}
        <div className="border border-neutral-100 shadow-sm p-6 rounded-2xl">
          {/* Personal Info */}
          <div className="mb-8">
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
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent bg-white"
                  />
                ) : (
                  <p className="text-gray-900 py-3">{formData.name || "N/A"}</p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={() => handleChangeContact("email")}
                      className="text-sm text-[#74C7F2] font-medium hover:underline"
                    >
                      Change
                    </button>
                  )}
                </div>
                {isEditMode ? (
                  <>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Used for login and notifications. Click "Change" to update.
                    </p>
                  </>
                ) : (
                  <p className="text-gray-900 py-3">
                    {formData.email || "N/A"}
                  </p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={() => handleChangeContact("mobileNumber")}
                      className="text-sm text-[#74C7F2] font-medium hover:underline"
                    >
                      Change
                    </button>
                  )}
                </div>
                {isEditMode ? (
                  <>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Used for login and notifications. Click "Change" to update.
                    </p>
                  </>
                ) : (
                  <p className="text-gray-900 py-3">
                    {formData.mobileNumber || "N/A"}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <VerificationSection user={profileData?.profile} />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* Address Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={20} className="text-[#74C7F2]" />
              <h3 className="text-lg font-semibold text-gray-900">Address</h3>
            </div>

            <div className="space-y-4">
              {!showLocationPicker ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {isCustomer
                        ? "Your Address Locations"
                        : "Your Address Locations"}
                    </label>

                    {isEditMode ? (
                      <div className="space-y-3">
                        {(() => {
                          const areas = isCustomer
                            ? formData.preferredAreas
                            : formData.selectedAreas;
                          return (
                            <>
                              {areas.map((area, index) => (
                                <div
                                  key={index}
                                  className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg border border-gray-200"
                                >
                                  <MapPin
                                    className="text-[#74C7F2] mt-1 flex-shrink-0"
                                    size={18}
                                  />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                      {locationAddresses[index] || area.address || "Location on map"}
                                    </p>

                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleEditLocation(index)}
                                      className="px-3 py-1 text-xs text-[#74C7F2] hover:bg-blue-100 rounded transition-colors"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveLocation(index)
                                      }
                                      className="px-3 py-1 text-xs text-red-600 hover:bg-red-100 rounded transition-colors"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={handleAddLocation}
                                className="w-full px-4 py-3 text-sm text-[#74C7F2] border-2 border-dashed border-[#74C7F2] rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                              >
                                <Plus size={18} />
                                Add New Address
                              </button>
                            </>
                          );
                        })()}
                      </div>
                    ) : (
                      <div className="text-gray-500 py-3 text-sm">
                        {(() => {
                          const areas = isCustomer
                            ? formData.preferredAreas
                            : formData.selectedAreas;
                          if (areas && areas.length > 0) {
                            return (
                              <div className="space-y-3">
                                {areas.map((area, index) => (
                                  <div
                                    key={index}
                                    className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg"
                                  >

                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
                                        {locationAddresses[index] || area.address || "Location on map"}
                                      </p>

                                    </div>
                                  </div>
                                ))}
                              </div>
                            );
                          }
                          return (
                            <p>
                              No addresses saved. Click &quot;Edit
                              Profile&quot; to add locations.
                            </p>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      {editingLocationIndex !== null
                        ? "Edit Location"
                        : "Add New Location"}
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setShowLocationPicker(false);
                        setEditingLocationIndex(null);
                      }}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                  </div>
                  <LocationPicker
                    onLocationSelect={handleLocationSelect}
                    initialLocation={
                      editingLocationIndex !== null
                        ? (isCustomer
                          ? formData.preferredAreas
                          : formData.selectedAreas)[editingLocationIndex]
                        : null
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save/Cancel Buttons */}
      {isEditMode && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium rounded-lg hover:from-[#74C7F2] hover:to-[#B6E0FE] transition-all duration-200 cursor-pointer"
            >
              Save Profile
            </button>
            <button
              onClick={() => setIsEditMode(false)}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
              We&apos;ve sent a verification code to your new{" "}
              {contactChangeType === "email" ? "email" : "phone number"}:{" "}
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
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium rounded-lg hover:from-[#74C7F2] hover:to-[#B6E0FE] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
};

export default ProfileOverview;

