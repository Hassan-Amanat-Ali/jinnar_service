import { useState, useCallback, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { MapPin, Search, Navigation } from "lucide-react";

const libraries = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
};

const defaultCenter = {
  lat: -6.7924, // Dar es Salaam, Tanzania
  lng: 39.2083,
};

const LocationPicker = ({ onLocationSelect, initialLocation = null }) => {
  const [selectedLocation, setSelectedLocation] = useState(
    initialLocation || defaultCenter
  );
  const [address, setAddress] = useState("");
  const [mapCenter, setMapCenter] = useState(initialLocation || defaultCenter);
  const autocompleteRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const onMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const location = { lat, lng };

    setSelectedLocation(location);
    setMapCenter(location);

    // Reverse geocode to get address
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location }, (results, status) => {
      if (status === "OK" && results[0]) {
        setAddress(results[0].formatted_address);
      }
    });
  }, []);

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setSelectedLocation(location);
        setMapCenter(location);
        setAddress(place.formatted_address || "");
      }
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setSelectedLocation(location);
          setMapCenter(location);

          // Reverse geocode
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location }, (results, status) => {
            if (status === "OK" && results[0]) {
              setAddress(results[0].formatted_address);
            }
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const handleConfirm = () => {
    if (onLocationSelect) {
      onLocationSelect({
        ...selectedLocation,
        address: address || "Location selected on map",
      });
    }
  };

  if (loadError) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading Google Maps. Please check your API key.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="text-center p-4">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#74C7F2]"></div>
        <p className="mt-2 text-gray-600">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Box */}
      <div className="relative">
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={onPlaceChanged}
        >
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search for a location..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
            />
          </div>
        </Autocomplete>
      </div>

      {/* Current Location Button */}
      <button
        type="button"
        onClick={getCurrentLocation}
        className="flex items-center gap-2 px-4 py-2 text-sm text-[#74C7F2] border border-[#74C7F2] rounded-lg hover:bg-blue-50 transition-colors"
      >
        <Navigation size={16} />
        Use Current Location
      </button>

      {/* Map */}
      <div className="relative rounded-lg overflow-hidden border border-gray-300">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={13}
          center={mapCenter}
          onClick={onMapClick}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          {selectedLocation && (
            <Marker
              position={selectedLocation}
              animation={window.google.maps.Animation.DROP}
            />
          )}
        </GoogleMap>
      </div>

      {/* Selected Location Info */}
      {address && (
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <MapPin className="text-[#74C7F2] mt-1 flex-shrink-0" size={18} />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 mb-1">
              Selected Location
            </p>
            <p className="text-xs text-gray-600">{address}</p>
            <p className="text-xs text-gray-500 mt-1">
              Lat: {selectedLocation.lat.toFixed(6)}, Lng:{" "}
              {selectedLocation.lng.toFixed(6)}
            </p>
          </div>
        </div>
      )}

      {/* Confirm Button */}
      <button
        type="button"
        onClick={handleConfirm}
        className="w-full px-4 py-3 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium rounded-lg hover:from-[#74C7F2] hover:to-[#B6E0FE] transition-all duration-200"
      >
        Confirm Location
      </button>
    </div>
  );
};

export default LocationPicker;
