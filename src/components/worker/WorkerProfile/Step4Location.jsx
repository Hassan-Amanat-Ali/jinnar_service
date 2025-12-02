import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import {
  Info,
  MapPin,
  Navigation,
  Plus,
  X,
  Map as MapIcon,
  Globe,
} from "lucide-react";
import { useUpdateProfileMutation } from "../../../services/workerApi";
import { setProfile } from "../../../features/worker/profileSlice";
import LocationPicker from "../../common/LocationPicker";

const Step4Location = forwardRef(({ profileData, isLoading, error }, ref) => {
  const dispatch = useDispatch();
  const [updateProfile] = useUpdateProfileMutation();
  console.log("Step4Location - profileData:................", profileData);

  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [editingLocationIndex, setEditingLocationIndex] = useState(null);
  const [selectedAreas, setSelectedAreas] = useState([]);

  // Populate form data when profile data is loaded
  useEffect(() => {
    if (profileData) {
      if (profileData.selectedAreas && profileData.selectedAreas.length > 0) {
        // Backend returns GeoJSON Point format: {type: "Point", coordinates: [lng, lat]} or legacy format: {lat, lng}
        const areasWithAddresses = profileData.selectedAreas.map(
          async (area) => {
            try {
              // Handle multiple formats: GeoJSON Point, plain coordinates, or legacy format
              let lat, lng;
              if (
                area.type === "Point" &&
                area.coordinates &&
                Array.isArray(area.coordinates)
              ) {
                // GeoJSON Point format: {type: "Point", coordinates: [lng, lat]}
                lng = area.coordinates[0];
                lat = area.coordinates[1];
              } else if (area.coordinates && Array.isArray(area.coordinates)) {
                // Plain coordinates format: {coordinates: [lng, lat]}
                lng = area.coordinates[0];
                lat = area.coordinates[1];
              } else {
                // Legacy format: {lat, lng}
                lat = area.lat;
                lng = area.lng;
              }

              // Use reverse geocoding to get address
              const geocoder = new window.google.maps.Geocoder();
              const location = { lat, lng };

              return new Promise((resolve) => {
                geocoder.geocode({ location }, (results, status) => {
                  if (status === "OK" && results[0]) {
                    resolve({
                      lat,
                      lng,
                      address: results[0].formatted_address,
                    });
                  } else {
                    // Fallback if geocoding fails
                    resolve({
                      lat,
                      lng,
                      address: `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
                    });
                  }
                });
              });
            } catch (error) {
              console.error("Reverse geocoding error:", error);
              // Handle multiple formats for error case too
              let lat, lng;
              if (
                area.type === "Point" &&
                area.coordinates &&
                Array.isArray(area.coordinates)
              ) {
                lng = area.coordinates[0];
                lat = area.coordinates[1];
              } else if (area.coordinates && Array.isArray(area.coordinates)) {
                lng = area.coordinates[0];
                lat = area.coordinates[1];
              } else {
                lat = area.lat;
                lng = area.lng;
              }

              return {
                lat,
                lng,
                address: `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
              };
            }
          }
        );

        // Wait for all geocoding to complete
        Promise.all(areasWithAddresses).then((areas) => {
          setSelectedAreas(areas);
          console.log("Step4Location - populated selectedAreas:", areas);
        });
      }
    }
  }, [profileData]);

  // Save profile data
  const handleSave = async () => {
    let loadingToast = null;
    try {
      console.log("Step4Location - Starting save process");

      if (selectedAreas.length === 0) {
        toast.error("Please add at least one service location");
        return false;
      }

      loadingToast = toast.loading("Saving service locations...");

      // Backend expects address strings - it will handle geocoding automatically
      const updateData = {
        selectedAreas: selectedAreas.map(
          (area) => area.address || "Location on map"
        ),
      };

      console.log("Sending update data:", updateData);
      const result = await updateProfile(updateData).unwrap();
      console.log("Update result:", result);

      // Update Redux store
      dispatch(setProfile(result.user));

      toast.dismiss(loadingToast);
      toast.success("Service locations saved successfully!");

      return true;
    } catch (err) {
      console.error("Failed to save service locations:", err);
      if (loadingToast) {
        toast.dismiss(loadingToast);
      }
      toast.error(
        err?.data?.error ||
          "Failed to save service locations. Please try again."
      );
      return false;
    }
  };

  // Expose handleSave to parent component via ref
  useImperativeHandle(ref, () => ({
    handleSave,
  }));

  const handleAddLocation = () => {
    setEditingLocationIndex(null);
    setShowLocationPicker(true);
  };

  const handleEditLocation = (index) => {
    setEditingLocationIndex(index);
    setShowLocationPicker(true);
  };

  const handleLocationSelect = (locationData) => {
    const newLocation = {
      lat: locationData.lat,
      lng: locationData.lng,
      address: locationData.address, // For display only, not sent to backend
    };

    if (editingLocationIndex !== null) {
      const updated = [...selectedAreas];
      updated[editingLocationIndex] = newLocation;
      setSelectedAreas(updated);
    } else {
      setSelectedAreas([...selectedAreas, newLocation]);
    }

    setShowLocationPicker(false);
    setEditingLocationIndex(null);
  };

  const handleRemoveLocation = (index) => {
    setSelectedAreas(selectedAreas.filter((_, i) => i !== index));
  };

  // Show loading skeleton if data is still loading
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="space-y-4">
            <div className="h-6 bg-gray-300 rounded w-48"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
          </div>
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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top helper */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-start gap-2 text-[#2E90FA] mb-4">
          <Info className="w-5 h-5" />
          <div>
            <div className="text-sm font-semibold text-gray-900">
              Set Your Service Locations
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Add the areas where you provide your services. Customers in these
              locations will be able to find and book you. You can add multiple
              locations.
            </p>
          </div>
        </div>
      </div>

      {!showLocationPicker ? (
        <>
          {/* Selected Locations List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Your Service Locations ({selectedAreas.length})
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Customers in these areas can find you
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddLocation}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                <Plus size={16} />
                Add Location
              </button>
            </div>

            {selectedAreas.length === 0 ? (
              <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-xl">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900 mb-1">
                  No Service Locations Added
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Add locations where you provide your services
                </p>
                <button
                  type="button"
                  onClick={handleAddLocation}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus size={16} />
                  Add Your First Location
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedAreas.map((location, index) => (
                  <div
                    key={index}
                    className="group flex items-start gap-3 p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-all"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[#74C7F2]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        Service Area {index + 1}
                      </p>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {location.address}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditLocation(index)}
                        className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveLocation(index)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50 py-8 text-center space-y-2">
              <div className="text-sm font-semibold text-blue-800 flex flex-col items-center gap-3">
                <MapIcon className="w-6 h-6" />
                Multiple Locations
              </div>
              <p className="text-sm text-blue-800/80 px-4">
                Add all areas where you offer services
              </p>
            </div>
            {/* Card 2 */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 py-8 text-center space-y-2">
              <div className="text-sm font-semibold text-emerald-800 flex flex-col items-center gap-3">
                <Navigation className="w-6 h-6" />
                Easy to Find
              </div>
              <p className="text-sm text-emerald-800/80 px-4">
                Customers nearby can discover you easily
              </p>
            </div>
            {/* Card 3 */}
            <div className="rounded-2xl border border-purple-200 bg-purple-50 py-8 text-center space-y-2">
              <div className="text-sm font-semibold text-purple-800 flex flex-col items-center gap-3">
                <Globe className="w-6 h-6" />
                Expand Coverage
              </div>
              <p className="text-sm text-purple-800/80 px-4">
                Update locations anytime to grow reach
              </p>
            </div>
          </div>
        </>
      ) : (
        /* Location Picker */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingLocationIndex !== null
                ? "Edit Service Location"
                : "Add Service Location"}
            </h3>
            <button
              type="button"
              onClick={() => {
                setShowLocationPicker(false);
                setEditingLocationIndex(null);
              }}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <LocationPicker
            onLocationSelect={handleLocationSelect}
            initialLocation={
              editingLocationIndex !== null
                ? selectedAreas[editingLocationIndex]
                : null
            }
          />
        </div>
      )}
    </div>
  );
});

Step4Location.displayName = "Step4Location";

export default Step4Location;
