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
import { useGetCategoriesQuery, useGetSubcategoriesQuery } from "../../services/workerApi";

const Hero = () => {
  const navigate = useNavigate();

  // Fetch categories from API
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();
  
  const [selectedCategory, setSelectedCategory] = useState("");
  // Fetch subcategories when a category is selected
  const { data: subcategoriesData, isLoading: subcategoriesLoading } = useGetSubcategoriesQuery(selectedCategory, { skip: !selectedCategory });

  // Extract categories from API response (array of category objects)
  const categories = categoriesData || [];
  const subcategories = subcategoriesData || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [userCoords, setUserCoords] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [minRating, setMinRating] = useState("");

  const sortOptions = {
    rating: "Highest Rated",
    experience: "Most Experienced",
    price_low: "Price: Low to High",
    price_high: "Price: High to Low",
    newest: "Newest First",
  };

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

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append("search", searchTerm.trim());
    if (selectedCategory) params.append("category", selectedCategory);
    if (selectedSubcategory) params.append("subcategory", selectedSubcategory);
    if (sortBy) params.append("sortBy", sortBy);
    if (minRating) params.append("minRating", minRating);

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
            <div className="grid grid-cols-1 md:grid-cols-1 gap-3 sm:gap-4 items-end">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3">
                  What service are you looking for?
                </h3>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-black/60" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full h-11 sm:h-12 rounded-xl border border-border pl-9 pr-3 text-sm text-black placeholder:text-black/50 bg-muted/60 hover:border-secondary/50 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all duration-200"
                    placeholder="e.g., 'plumber', 'electrician'..."
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 items-end">
              <div className="relative w-full">
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubcategory(""); // Reset subcategory
                  }}
                  disabled={categoriesLoading}
                  className="appearance-none w-full h-11 sm:h-12 rounded-xl border border-border pl-4 pr-10 text-left text-sm text-black bg-muted hover:border-secondary/50 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all duration-200 disabled:opacity-50"
                >
                  <option value="">Choose category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {formatName(category.name)}
                    </option>
                  ))}
                </select>
                <FiChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/60 pointer-events-none"
                />
              </div>
              <div className="relative w-full">
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Subcategory</label>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  disabled={!selectedCategory || subcategoriesLoading}
                  className="appearance-none w-full h-11 sm:h-12 rounded-xl border border-border pl-4 pr-10 text-left text-sm text-black bg-muted hover:border-secondary/50 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all duration-200 disabled:bg-gray-200 disabled:cursor-not-allowed"
                >
                  <option value="">All Subcategories</option>
                  {subcategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {formatName(sub.name)}
                    </option>
                  ))}
                </select>
                <FiChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/60 pointer-events-none"
                />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 items-end">
              <div className="relative w-full">
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none w-full h-11 sm:h-12 rounded-xl border border-border pl-4 pr-10 text-left text-sm text-black bg-muted hover:border-secondary/50 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all duration-200"
                >
                  <option value="">Relevance</option>
                  {Object.entries(sortOptions).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-black/60 pointer-events-none" />
              </div>
              <div className="relative w-full">
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Minimum Rating</label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="appearance-none w-full h-11 sm:h-12 rounded-xl border border-border pl-4 pr-10 text-left text-sm text-black bg-muted hover:border-secondary/50 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all duration-200"
                >
                  <option value="">Any Rating</option>
                  {[4, 3, 2, 1].map(r => (
                    <option key={r} value={r}>{r} star{r > 1 && 's'} & up</option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-black/60 pointer-events-none" />
              </div>
              <div className="md:pl-2 mt-4 sm:mt-0 w-full md:col-start-3">
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
