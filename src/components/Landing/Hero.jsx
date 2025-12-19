import { useState, useEffect } from "react";
import { LandingPageHeroBg } from "../../assets/index.js";
import { FiSearch, FiMapPin, FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  useGetCategoriesQuery,
  useGetSubcategoriesQuery,
} from "../../services/workerApi";
import { reverseGeocode } from "../../utils/fileUrl.js";
import { useGeocoding } from "../../hooks/useGeocoding.js";

const Hero = () => {
  const navigate = useNavigate();

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  const [selectedCategory, setSelectedCategory] = useState("");
  const { data: subcategoriesData, isLoading: subcategoriesLoading } =
    useGetSubcategoriesQuery(selectedCategory, { skip: !selectedCategory });

  const categories = categoriesData || [];
  const subcategories = subcategoriesData || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [userAddress, setUserAddress] = useState(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { suggestions, isLoading: locationLoading } =
    useGeocoding(searchLocation);

  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [minRating, setMinRating] = useState("");

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(async (pos) => {
      const address = await reverseGeocode(
        pos.coords.latitude,
        pos.coords.longitude
      );
      setUserAddress(address);
    });
  }, []);

  const formatName = (name) =>
    name?.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedSubcategory) params.set("subcategory", selectedSubcategory);
    if (sortBy) params.set("sortBy", sortBy);
    if (minRating) params.set("minRating", minRating);
    if (searchLocation || userAddress)
      params.set("address", searchLocation || userAddress);

    navigate(`/landing-services?${params.toString()}`);
  };

  return (
    <section className="relative overflow-visible">
      <div
        className="relative py-28 sm:py-32 bg-cover bg-center"
        style={{ backgroundImage: `url(${LandingPageHeroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/40 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-white text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-xs mb-4">
            <span className="opacity-80">
              Your reliable connection to skilled workers
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight">
            Find Trusted Professionals Across Africa—In Minutes
          </h1>

          <div className="h-1 w-24 sm:w-40 md:w-56 lg:w-72 bg-white/80 my-2" />

          <p className="mt-1 text-white/90 text-base sm:text-lg text center">
            Explore verified workers in every service category, compare choices
            with ease, and book confidently wherever you are on the continent.
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

          {/* SEARCH CARD */}
          <div className="mt-10 bg-white/95 rounded-2xl shadow-xl p-5 text-black">
            {/* SEARCH INPUT */}
            <div>
              <label className="block text-left text-xs font-semibold mb-1">
                Service
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-black/60">
                  <FiSearch />
                </span>
                <input
                  className="w-full h-10 sm:h-11 pl-9 pr-3 rounded-xl border border-border text-sm leading-none"
                  placeholder="Plumber, Electrician..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* GRID */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {/* LOCATION */}
              <div>
                <label className="block text-left text-xs font-semibold mb-1">
                  Location
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-black/60">
                    <FiMapPin />
                  </span>
                  <input
                    className="w-full h-10 sm:h-11 pl-9 pr-3 rounded-xl border border-border text-sm leading-none"
                    placeholder={userAddress || "Enter location"}
                    value={searchLocation}
                    onChange={(e) => {
                      setSearchLocation(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onBlur={() =>
                      setTimeout(() => setShowSuggestions(false), 150)
                    }
                  />

                  {showSuggestions && searchLocation.length > 2 && (
                    <div className="absolute z-20 mt-1 w-full bg-white border rounded-lg shadow max-h-52 overflow-y-auto">
                      {locationLoading && (
                        <div className="p-2 text-sm text-gray-500">
                          Loading...
                        </div>
                      )}
                      {suggestions.map((s) => (
                        <div
                          key={s.place_id}
                          className="p-2 text-sm hover:bg-gray-100 cursor-pointer"
                          onMouseDown={() => {
                            setSearchLocation(s.display_name);
                            setShowSuggestions(false);
                          }}
                        >
                          {s.display_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* CATEGORY */}
              <SelectBox
                label="Category"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubcategory("");
                }}
                disabled={categoriesLoading}
              >
                <option value="">Choose category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {formatName(c.name)}
                  </option>
                ))}
              </SelectBox>

              {/* SUBCATEGORY */}
              <SelectBox
                label="Subcategory"
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                disabled={!selectedCategory || subcategoriesLoading}
              >
                <option value="">All Subcategories</option>
                {subcategories.map((s) => (
                  <option key={s._id} value={s._id}>
                    {formatName(s.name)}
                  </option>
                ))}
              </SelectBox>

              {/* SORT */}
              <SelectBox
                label="Sort By"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">Relevance</option>
                <option value="rating">Highest Rated</option>
                <option value="experience">Most Experienced</option>
              </SelectBox>

              {/* RATING */}
              <SelectBox
                label="Minimum Rating"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
              >
                <option value="">Any Rating</option>
                {[4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r}+ Stars
                  </option>
                ))}
              </SelectBox>

              {/* BUTTON */}
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="btn-primary w-full h-10 sm:h-11 rounded-xl"
                >
                  <FiSearch /> Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SelectBox = ({ label, children, ...props }) => (
  <div>
    <label className="block text-left text-xs font-semibold mb-1">
      {label}
    </label>
    <div className="relative">
      <select
        {...props}
        className="appearance-none w-full h-10 sm:h-11 pl-4 pr-9 rounded-xl border border-border text-sm leading-none"
      >
        {children}
      </select>
      <span className="absolute inset-y-0 right-3 flex items-center text-black/60 pointer-events-none">
        <FiChevronDown />
      </span>
    </div>
  </div>
);

export default Hero;
