import Hero from "../../components/Landing/Hero.jsx";
import WorkerCard from "../../components/services/WorkerCard";
import {
  useSearchGigsQuery,
  useGetCategoriesQuery,
  useGetSubcategoriesQuery,
} from "../../services/workerApi";
import { useSearchParams } from "react-router-dom";
import { useGeocoding } from "../../hooks/useGeocoding.js";
import SiteFooter from "../../components/Landing/SiteFooter.jsx";
import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { Sparkles, MapPin, ChevronDown } from "lucide-react";
import { getFullImageUrl, reverseGeocode } from "../../utils/fileUrl.js";

// Helper function to format names for display
const formatName = (name) =>
  name?.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "";

// Helper function to format category/subcategory names nicely
const formatFilterName = (name) => {
  console.log(name);
  if (!name) return "";
  // Replace dashes and underscores with spaces, then capitalize each word
  return name
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const AllServicesLanding = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [userLocation, setUserLocation] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [locationStatus, setLocationStatus] = useState("loading"); // "loading" | "granted" | "denied"
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  // State for dropdowns
  const [openDropdown, setOpenDropdown] = useState(null);

  // Local state for all filters to stage changes before search submission
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [categoryId, setCategoryId] = useState(
    searchParams.get("category") || ""
  );
  const [subcategoryId, setSubcategoryId] = useState(
    searchParams.get("subcategory") || ""
  );
  const [budget, setBudget] = useState(
    searchParams.get("budget") || ""
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get("sortBy") || ""
  );
  const [minRating, setMinRating] = useState(
    searchParams.get("minRating") || ""
  );
  const [searchLocation, setSearchLocation] = useState(
    searchParams.get("address") || ""
  );
  const { suggestions: locationSuggestions, isLoading: locationLoading } =
    useGeocoding(searchLocation);

  // Fetch categories to resolve names from IDs
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  // Get user's current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserLocation(coords);

          // Convert coordinates to address
          const address = await reverseGeocode(
            coords.latitude,
            coords.longitude
          );
          setUserAddress(address);

          setLocationStatus("granted");
          console.log(
            "User location:",
            coords.latitude,
            coords.longitude,
            "Address:",
            address
          );
        },
        (error) => {
          console.error("Error getting location:", error.message);
          setLocationStatus("denied");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // Cache location for 5 minutes
        }
      );
    } else {
      setLocationStatus("denied");
    }
  }, []);

  // Fetch subcategories when a category is selected
  const { data: subcategoriesData, isLoading: subcategoriesLoading } =
    useGetSubcategoriesQuery(categoryId, {
      skip: !categoryId,
    });

  const categories = useMemo(() => categoriesData || [], [categoriesData]);
  const subcategories = useMemo(
    () => subcategoriesData || [],
    [subcategoriesData]
  );

  // Build search params for API
  const searchApiParams = useMemo(() => {
    const params = {
      limit: 50,
    };

    const locationToUse = searchLocation.trim() || userAddress;
    if (locationToUse) {
      params.address = locationToUse;
      // Only add radius if we have an address
      params.radius = 50;
    }

    // Add category filter
    if (categoryId) {
      params.category = categoryId;
    }

    // Add subcategory filter
    if (subcategoryId) {
      params.subcategory = subcategoryId;
    }

    // Add budget filter
    if (budget) {
      if (budget === "Under 20,000") {
        params.maxPrice = "20000";
      } else if (budget === "20,000 - 50,000") {
        params.minPrice = "20000";
        params.maxPrice = "50000";
      } else if (budget === "50,000 - 100,000") {
        params.minPrice = "50000";
        params.maxPrice = "100000";
      } else if (budget === "100,000+") {
        params.minPrice = "100000";
      }
      // For "Negotiable", we don't add price filters

      if (minPrice) {
        params.minPrice = minPrice;
      }
      if (maxPrice) {
        params.maxPrice = maxPrice;
      }
    }

    // Add sorting
    if (sortBy) {
      params.sortBy = sortBy;
    }

    // Add minimum rating
    if (minRating) {
      params.minRating = minRating;
    }

    // Add search term directly from URL
    if (searchTerm) {
      params.search = searchTerm;
    }

    return params;
  }, [
    userAddress,
    searchLocation,
    searchTerm,
    categoryId,
    subcategoryId,
    budget,
    sortBy,
    minRating,
  ]);

  // Log the API parameters to the console for debugging
  console.log("🚀 API Request Parameters:", searchApiParams);

  // Use searchGigs API with location and filters
  const { data, isLoading, error } = useSearchGigsQuery(searchApiParams, {
    keepUnusedDataFor: 0, // Invalidate cache when params change
  });

  // Sync URL params to local state on load
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    setCategoryId(searchParams.get("category") || "");
    setSubcategoryId(searchParams.get("subcategory") || "");
    setSortBy(searchParams.get("sortBy") || "");
    setMinRating(searchParams.get("minRating") || "");
    setSearchLocation(searchParams.get("address") || "");
    setBudget(searchParams.get("budget") || "");
  }, [searchParams]);

  // Handle search input change - will be passed to Hero
  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle search submission via button click
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const newParams = new URLSearchParams();
    if (searchTerm.trim()) newParams.set("search", searchTerm.trim());
    if (categoryId) newParams.set("category", categoryId);
    if (subcategoryId) newParams.set("subcategory", subcategoryId);
    if (sortBy) newParams.set("sortBy", sortBy);
    if (minRating) newParams.set("minRating", minRating);
    if (searchLocation.trim()) newParams.set("address", searchLocation.trim());
    if (budget) newParams.set("budget", budget);
    setSearchParams(newParams, { replace: true });
  };

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchTerm("");
    setCategoryId("");
    setSubcategoryId("");
    setSortBy("");
    setMinRating("");
    setSearchLocation("");
    setBudget("");
    setSearchParams({});
  }, [setSearchParams]);

  // Handlers for filter changes
  const handleFilterChange = (param, value) => {
    setSearchParams(
      (prev) => {
        if (value) {
          prev.set(param, value);
        } else {
          prev.delete(param);
        }

        // Reset subcategory if category changes
        if (param === "category") {
          prev.delete("subcategory");
        }

        if (param !== "budget") {
          prev.delete("minPrice");
          prev.delete("maxPrice");
        }

        return prev;
      },
      { replace: true }
    );
    setOpenDropdown(null);
  };

  const budgetOptions = [
    "Under 20,000",
    "20,000 - 50,000",
    "50,000 - 100,000",
    "100,000+",
    "Negotiable",
  ];
  const sortOptions = {
    rating: "Highest Rated",
    experience: "Most Experienced",
    price_low: "Price: Low to High",
    price_high: "Price: High to Low",
    newest: "Newest First",
  };

  // Skeleton Component
  const Skeleton = ({ className = "" }) => (
    <div className={`bg-gray-200 rounded animate-pulse ${className}`}>
      <div className="shimmer"></div>
    </div>
  );

  // Transform API data to match WorkerCard component format with gig info
  const gigsData = useMemo(
    () =>
      data?.gigs?.map((gig) => {
        const mappedGig = {
          id: gig._id,
          gigId: gig._id,
          sellerId: gig.sellerId?._id,
          name: gig.title, // Using gig title as the main name
          image:
            getFullImageUrl(gig.images?.[0]?.url) ||
            "https://via.placeholder.com/300x200",
          rating: gig.sellerId?.rating?.average || 0,
          reviews: gig.sellerId?.rating?.count || 0,
          available: true,
          experience: gig.sellerId?.yearsOfExperience || 0,
          distance:
            gig.pricing?.method === "negotiable"
              ? "Negotiable"
              : gig.pricing?.method === "hourly"
              ? `TZS ${gig.pricing?.price?.toLocaleString()}/hr`
              : `TZS ${gig.pricing?.price?.toLocaleString()}`,
          bio: gig.description,
          skills:
            gig.subcategories?.map((s) => s.name)?.slice(0, 4) ||
            gig.sellerId?.skills?.slice(0, 4) ||
            [],
          jobsCompleted: gig.sellerId?.ordersCompleted || 0,
          rate:
            gig.pricing?.method === "negotiable"
              ? "Negotiable"
              : gig.pricing?.price || 0,
          category: gig.category?.name || null,
          subcategories: gig.subcategories || [],
        };
        return mappedGig;
      }) || [],
    [data]
  );

  // Find category and subcategory names from their IDs for display
  const categoryName = useMemo(() => {
    if (!categoryId || !categoriesData) return null;
    const category = categoriesData.find((cat) => cat._id === categoryId);
    return category ? formatFilterName(category.name) : null;
  }, [categoryId, categoriesData]);

  const subcategoryName = useMemo(() => {
    if (!subcategoryId || !subcategories) return null;
    const subcategory = subcategories.find((sub) => sub._id === subcategoryId);
    return subcategory ? formatFilterName(subcategory.name) : null;
  }, [subcategoryId, subcategories]);

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        .shimmer {
          animation: shimmer 2s infinite;
          background: linear-gradient(
            to right,
            transparent 0%,
            rgba(255, 255, 255, 0.6) 50%,
            transparent 100%
          );
          background-size: 1000px 100%;
        }
      `}</style>

      {/* <Hero
        className="h-88 lg:h-140"
        // The Hero component's own search functionality will navigate here.
        // This page's search is now handled by the form below.
      /> */}

      <div className="my-6 mt-16 max-w-[1200px] mx-auto px-4">
        {/* Location Status Banner */}
        {locationStatus === "granted" && userLocation && (
          <div className="mb-4 flex items-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-2 rounded-lg">
            <MapPin size={16} />
            <span>Showing services near your location</span>
          </div>
        )}
        {locationStatus === "denied" && (
          <div className="mb-4 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-4 py-2 rounded-lg">
            <MapPin size={16} />
            <span>Enable location to see nearby services</span>
          </div>
        )}

        <form onSubmit={handleSearchSubmit}>
          {/* SEARCH & FILTERS SECTION */}
          <div className="mb-8 p-4 sm:p-5 md:p-7 bg-white/95 rounded-2xl sm:rounded-[28px] shadow-xl border border-gray-100">
            {/* Search Input */}
            <div className="mb-4">
              <label className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3 block">
                What service are you looking for?
              </label>
              <input
                type="text"
              value={searchTerm}
                onChange={handleSearchInputChange}
                placeholder="Search for services like 'plumber', 'electrician'..."
                className="w-full h-11 sm:h-12 rounded-xl border border-border pl-4 pr-10 text-left text-sm bg-muted hover:border-secondary/50 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all duration-200"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Location Input */}
              <div className="relative">
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => {
                      setSearchLocation(e.target.value);
                      setShowLocationSuggestions(true);
                    }}
                    onBlur={() =>
                      setTimeout(() => setShowLocationSuggestions(false), 200)
                    }
                    placeholder={userAddress || "Enter location..."}
                    className="w-full h-11 sm:h-12 rounded-xl border border-border pl-11 pr-4 text-left text-sm bg-muted hover:border-secondary/50 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all duration-200"
                  />
                </div>
                {showLocationSuggestions && searchLocation.length > 2 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto text-left">
                    {locationLoading && (
                      <div className="p-3 text-sm text-gray-500">
                        Loading...
                      </div>
                    )}
                    {locationSuggestions.map((suggestion) => (
                      <div
                        key={suggestion.place_id}
                        className="p-3 text-sm text-gray-800 cursor-pointer hover:bg-gray-100"
                        onMouseDown={() => {
                          setSearchLocation(suggestion.display_name);
                          setShowLocationSuggestions(false);
                        }}
                      >
                        {suggestion.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Category Filter */}
              <div className="relative">
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    setSubcategoryId(""); // Reset subcategory when category changes
                  }}
                  disabled={categoriesLoading}
                  className="appearance-none w-full h-11 sm:h-12 rounded-xl border border-border pl-4 pr-10 text-left text-sm bg-muted hover:border-secondary/50 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all duration-200"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {formatName(cat.name)}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 pt-2 flex items-center px-3 text-gray-700">
                  <ChevronDown size={20} />
                </div>
              </div>

              {/* Subcategory Filter */}
              <div className="relative">
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  Subcategory
                </label>
                <select
                  value={subcategoryId}
                  onChange={(e) => setSubcategoryId(e.target.value)}
                  disabled={!categoryId || subcategoriesLoading}
                  className="appearance-none w-full h-11 sm:h-12 rounded-xl border border-border pl-4 pr-10 text-left text-sm bg-muted hover:border-secondary/50 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all duration-200 disabled:bg-gray-200"
                >
                  <option value="">All Subcategories</option>
                  {subcategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {formatName(sub.name)}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 pt-2 flex items-center px-3 text-gray-700">
                  <ChevronDown size={20} />
                </div>
              </div>

              {/* Budget Filter - Hidden for now */}
              {/* <div className="relative">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Budget (TZS)</label>
              <select
                value={localBudget}
                onChange={(e) => setLocalBudget(e.target.value)}
                className="appearance-none w-full bg-gray-50 border border-gray-200 text-gray-800 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              >
                <option value="">Any Budget</option>
                {budgetOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 pt-5 flex items-center px-2 text-gray-700">
                <ChevronDown size={20} />
              </div>
            </div> */}

              {/* Sort By Filter */}
              <div className="relative">
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none w-full h-11 sm:h-12 rounded-xl border border-border pl-4 pr-10 text-left text-sm bg-muted hover:border-secondary/50 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all duration-200"
                >
                  <option value="">Relevance</option>
                  {Object.entries(sortOptions).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 pt-2 flex items-center px-3 text-gray-700">
                  <ChevronDown size={20} />
                </div>
              </div>
            </div>
            {/* More Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {/* Minimum Rating Filter */}
              <div className="relative">
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  Minimum Rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="appearance-none w-full h-11 sm:h-12 rounded-xl border border-border pl-4 pr-10 text-left text-sm bg-muted hover:border-secondary/50 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all duration-200"
                >
                  <option value="">Any Rating</option>
                  {[4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} star{r > 1 && "s"} & up
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 pt-5 flex items-center px-2 text-gray-700">
                  <ChevronDown size={20} />
                </div>
              </div>

              {/* Other filters like minExperience can be added here following the same pattern */}
            </div>
            {/* Search Button */}
            <div className="mt-6 text-right">
              <button type="submit" className="btn-primary">
                Search
              </button>
            </div>
          </div>
        </form>

        {/* Search results count */}
        {/* Search Info */}
        {(categoryId ||
          subcategoryId ||
          budget ||
          sortBy ||
          minRating ||
          searchLocation ||
          searchTerm) && (
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="text-gray-700 text-sm font-medium">
              Showing results for:
            </span>
            {searchTerm && (
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                "{searchTerm}"
              </span>
            )}
            {categoryId && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {categoryName || "Category"}
              </span>
            )}
            {subcategoryId && (
              <span className="bg-sky-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {subcategoryName || "Subcategory"}
              </span>
            )}
            {budget && (
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                {budget}
              </span>
            )}
            {sortBy && (
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                Sorted by: {sortOptions[sortBy]}
              </span>
            )}
            {minRating && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                {minRating}+ Stars
              </span>
            )}
            {searchLocation && (
              <span className="bg-[#B6E0FE] text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {searchLocation}
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-gray-500 hover:text-gray-700 text-sm underline ml-2"
            >
              Clear all filters
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6 place-items-center md:place-items-stretch">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex flex-col w-full max-w-sm rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
              >
                {/* Header with Avatar and Info */}
                <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3.5 flex-shrink-0">
                  {/* Avatar Skeleton */}
                  <Skeleton className="h-12 w-12 rounded-full" />

                  <div className="flex-1 min-w-0">
                    {/* Name Skeleton */}
                    <Skeleton className="h-5 w-32 mb-2" />
                    {/* Rating Skeleton */}
                    <Skeleton className="h-4 w-24" />
                  </div>

                  {/* Status Badge Skeleton */}
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                {/* Info Grid Skeleton */}
                <div className="grid grid-cols-2 gap-3 border-b border-gray-100 bg-gray-50/50 px-4 py-3 text-sm flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>

                {/* Bio Section Skeleton */}
                <div className="px-4 mt-3.5 h-10 overflow-hidden flex-shrink-0">
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-5/6" />
                </div>

                {/* Skills Section Skeleton */}
                <div className="h-16 mt-2.5 overflow-hidden px-4 flex-shrink-0">
                  <Skeleton className="h-4 w-16 mb-2" />
                  <div className="flex flex-wrap gap-1.5">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                    <Skeleton className="h-6 w-18 rounded-full" />
                  </div>
                </div>

                {/* Stats Section Skeleton */}
                <div className="mt-auto flex items-center justify-between border-y border-gray-100 bg-gray-50/50 px-4 py-3 text-sm flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-5 w-20 rounded" />
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex gap-2 px-4 py-3.5 flex-shrink-0">
                  <Skeleton className="h-10 flex-1 rounded-lg" />
                  <Skeleton className="h-10 flex-1 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-2">Failed to load services</p>
            <p className="text-gray-500">
              {error?.data?.error || "Please try again later"}
            </p>
          </div>
        ) : gigsData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-2">No services available</p>
            <p className="text-gray-500">
              {categoryId || subcategoryId || searchTerm
                ? "Try adjusting your filters or search term"
                : "Check back later for new services"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6 place-items-center md:place-items-stretch">
            {gigsData.map((gig) => (
              <WorkerCard
                key={gig.id}
                gigId={gig.gigId}
                sellerId={gig.sellerId}
                name={gig.name}
                image={gig.image}
                rating={gig.rating}
                reviews={gig.reviews}
                available={gig.available}
                experience={gig.experience}
                distance={gig.distance}
                bio={gig.bio}
                skills={gig.skills}
                jobsCompleted={gig.jobsCompleted}
                rate={gig.rate}
              />
            ))}
          </div>
        )}
      </div>
      <SiteFooter />
    </>
  );
};

export default AllServicesLanding;
