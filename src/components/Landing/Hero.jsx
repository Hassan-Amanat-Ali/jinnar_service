import { useState, useEffect } from "react";
import { LandingPageHeroBg } from "../../assets/index.js";
import {
  FiUsers,
  FiPlay,
  FiMapPin,
  FiSearch,
  FiChevronDown,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useGetCategoriesQuery } from "../../services/workerApi";

const Hero = () => {
  const navigate = useNavigate();

  // Fetch categories from API
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  // Extract categories from API response (array of category objects)
  const categories = categoriesData || [];

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [location, setLocation] = useState("");
  const [userCoords, setUserCoords] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Get user's current location on mount
  useEffect(() => {
    getUserLocation();
  }, []);

  // Function to get user's current location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser");
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ latitude, longitude });

        // Reverse geocode to get location name
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          const data = await response.json();

          // Extract city/town/village name from the response
          const locationName =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.suburb ||
            data.address?.county ||
            data.address?.state ||
            "Your Location";

          setLocation(locationName);
        } catch (error) {
          console.error("Error reverse geocoding:", error);
          setLocation("Your Location");
        }

        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error.message);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // Cache location for 5 minutes
      }
    );
  };

  // Helper function to format category names
  const formatName = (name) => {
    if (!name) return "";
    return name
      .replace(/[-_]/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category.value || category._id);
    setSelectedCategoryName(formatName(category.name));
    setCategoryOpen(false);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.append("category", selectedCategory);
    if (location.trim()) params.append("location", location.trim());

    // Pass coordinates if available for more accurate location-based search
    if (userCoords) {
      params.append("latitude", userCoords.latitude);
      params.append("longitude", userCoords.longitude);
    }

    navigate(
      `/landing-services${params.toString() ? `?${params.toString()}` : ""}`
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <section className="relative overflow-visible">
      <div
        className="relative py-28 sm:py-32 md:py-36 bg-center bg-cover"
        style={{ backgroundImage: `url(${LandingPageHeroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/35 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 h-full flex flex-col items-center justify-center text-center text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-xs mb-4">
            <span className="opacity-80">
              Your reliable connection to skilled workers
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight">
            Find Trusted Local Professionals In Minutes
          </h1>
          <div className="h-1 w-24 sm:w-40 md:w-56 lg:w-72 bg-white/80 my-2" />
          <p className="mt-1 max-w-2xl text-white/90 text-base sm:text-lg">
            Discover verified workers across every service category, compare
            options, and book confidently wherever you are in Tanzania.
          </p>

          <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              className="btn-primary"
              onClick={() => navigate("/landing-services")}
            >
              Browse Services
            </button>
            <button
              className="btn-outline"
              onClick={() => navigate("/what-is-jinnar")}
            >
              Learn about Jinnar
            </button>
          </div>

          {/* Search Card */}
          <div className="mt-8 sm:mt-10 w-full max-w-5xl bg-white/95 text-left rounded-2xl sm:rounded-[28px] shadow-xl p-4 sm:p-5 md:p-7 overflow-visible">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 sm:gap-4 items-end">
              <div
                onKeyDown={(e) => {
                  if (e.key === "Escape") setCategoryOpen(false);
                }}
              >
                <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3">
                  Service Category
                </h3>
                <div className="relative">
                  <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={categoryOpen}
                    onClick={() => setCategoryOpen((v) => !v)}
                    className="w-full h-11 sm:h-12 rounded-xl border border-border pl-4 pr-10 text-left text-sm bg-muted hover:border-secondary/50 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={categoriesLoading}
                  >
                    <span
                      className={
                        selectedCategoryName ? "text-black" : "text-black/50"
                      }
                    >
                      {categoriesLoading
                        ? "Loading categories..."
                        : selectedCategoryName || "Choose category"}
                    </span>
                    <FiChevronDown
                      className={`absolute right-3 top-1/2 -translate-y-1/2 text-black/60 pointer-events-none transition-transform duration-200 ${
                        categoryOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {categoryOpen && categories.length > 0 && (
                    <ul
                      role="listbox"
                      tabIndex={-1}
                      className="absolute z-50 mt-2 w-full max-h-56 overflow-auto scrollbar-hide rounded-xl border border-border bg-white shadow-xl text-black animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                      {categories.map((category) => (
                        <li
                          key={category._id}
                          role="option"
                          aria-selected={
                            selectedCategory ===
                            (category.value || category._id)
                          }
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleSelectCategory(category)}
                          className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                            selectedCategory ===
                            (category.value || category._id)
                              ? "bg-secondary/10 text-secondary font-medium"
                              : "hover:bg-muted hover:text-secondary/80"
                          }`}
                        >
                          {formatName(category.name)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3">
                  Location
                </h3>
                <div className="relative">
                  {isGettingLocation ? (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-black/60" />
                  )}
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full h-11 sm:h-12 rounded-xl border border-border pl-9 pr-3 text-sm text-black placeholder:text-black/50 bg-muted/60 hover:border-secondary/50 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all duration-200"
                    placeholder={
                      isGettingLocation
                        ? "Detecting location..."
                        : "Enter Your Location"
                    }
                    disabled={isGettingLocation}
                  />
                </div>
              </div>
              <div className="md:pl-2">
                <button className="btn-primary" onClick={handleSearch}>
                  <FiSearch />
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
