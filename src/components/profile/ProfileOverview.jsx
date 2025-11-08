import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Edit, Plus } from "lucide-react";
import {
  useGetMyProfileQuery as useGetCustomerProfileQuery,
  useUpdateProfileMutation as useUpdateCustomerProfileMutation,
} from "../../services/customerApi";
import {
  useGetMyProfileQuery as useGetWorkerProfileQuery,
  useUpdateProfileMutation as useUpdateWorkerProfileMutation,
} from "../../services/workerApi";
import { ProfileSkeleton } from "../common/SkeletonLoader";
import { ROLES } from "../../constants/roles";
import { toast } from "react-toastify";
import LocationPicker from "../common/LocationPicker";

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
  });

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

  const {
    data: profileData,
    isLoading,
    error,
    refetch,
  } = isCustomer ? customerProfile : workerProfile;

  const updateProfile = isCustomer
    ? updateCustomerProfile
    : updateWorkerProfile;

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
      });
    }
  }, [profileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    const newLocation = {
      lat: locationData.lat,
      lng: locationData.lng,
      address: locationData.address,
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

  const handleSave = async () => {
    try {
      const updateData = {
        name: formData.name,
      };

      if (isCustomer) {
        if (formData.preferredAreas.length > 0) {
          updateData.preferredAreas = formData.preferredAreas;
        }
      } else {
        if (formData.selectedAreas.length > 0) {
          updateData.selectedAreas = formData.selectedAreas;
        }
      }

      const result = await updateProfile(updateData).unwrap();
      toast.success(result.message || "Profile updated successfully");
      setIsEditMode(false);
      refetch();
    } catch (err) {
      console.error("Update profile error:", err);
      const payload = err?.data || err;

      if (payload?.error) {
        toast.error(payload.error);
      } else if (payload?.message) {
        toast.error(payload.message);
      } else {
        toast.error("Failed to update profile. Please try again");
      }
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Failed to load profile</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white text-sm font-medium rounded-lg hover:from-[#74C7F2] hover:to-[#B6E0FE] transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
      {}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-sm text-gray-500">
          Your account information and personal details.
        </p>
      </div>

      {}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8 p-6 rounded-2xl border border-neutral-100 shadow-sm">
        <div className="relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#B6E0FE] to-[#74C7F2] rounded-full flex items-center justify-center">
            <span className="text-xl sm:text-2xl font-bold text-white">
              {getInitials(formData.name)}
            </span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {formData.name || "User"}
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
            {formData.email && (
              <span className="flex items-center gap-1">
                <Mail size={14} />
                {formData.email}
              </span>
            )}
            {formData.mobileNumber && (
              <span className="flex items-center gap-1">
                <Phone size={14} />
                {formData.mobileNumber}
              </span>
            )}
          </div>
          <p className="text-xs text-black mt-1 border border-neutral-300 w-fit px-2 py-1 rounded-md bg-neutral-50 shadow-sm">
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

      {}
      <div className="grid grid-cols-1 gap-8">
        {}
        <div className="border-neutral-100 shadow-sm p-6 rounded-2xl">
          {}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <p className="text-gray-500 py-3 text-sm">
                  {formData.email || "N/A"}
                  <span className="text-xs ml-2">(Cannot be changed)</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <p className="text-gray-500 py-3 text-sm">
                  {formData.mobileNumber || "N/A"}
                  <span className="text-xs ml-2">(Cannot be changed)</span>
                </p>
              </div>
            </div>
          </div>

          {}
          <div className="border-t border-gray-200 my-6"></div>

          {}
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
                                      {area.address || "Location on map"}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Lat: {area.lat?.toFixed(6)}, Lng:{" "}
                                      {area.lng?.toFixed(6)}
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
                                    <MapPin
                                      className="text-[#74C7F2] mt-1 flex-shrink-0"
                                      size={18}
                                    />
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
                                        {area.address || "Location on map"}
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        Lat: {area.lat?.toFixed(6)}, Lng:{" "}
                                        {area.lng?.toFixed(6)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            );
                          }
                          return (
                            <p>
                              No addresses saved. Click "Edit Profile" to add
                              locations.
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

      {}
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
    </div>
  );
};

export default ProfileOverview;
