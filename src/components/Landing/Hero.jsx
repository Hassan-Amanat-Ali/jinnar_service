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
        className="relative py-24 sm:py-32 lg:py-52 bg-cover bg-top"
        style={{ backgroundImage: `url(${LandingPageHeroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-8 text-white text-left drop-shadow-lg">
              Find Trusted Professionals <br /> <i className="font-serif font-normal text-blue-400">Across Africa</i> In Minutes
            </h1>

            {/* Simple Search Bar */}
            <div className="bg-white rounded-lg p-1.5 max-w-2xl shadow-2xl mb-6">
              <div className="flex items-center">
                <div className="pl-4 text-gray-400">
                  <FiSearch size={20} />
                </div>
                <input
                  className="flex-1 h-12 px-3 text-sm sm:text-base text-gray-800 placeholder-gray-500 focus:outline-none bg-transparent"
                  placeholder="What service do you need?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-12 w-12 sm:w-auto px-0 sm:px-8 rounded-[4px] font-semibold transition-colors flex items-center justify-center sm:text-base mr-1 sm:mr-0"
                >
                  <span className="sm:hidden"><FiSearch size={24} /></span>
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>

            {/* Popular Tags */}
            <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-white/90">
              <span>Popular:</span>
              <button onClick={() => { setSearchTerm("Plumbing"); handleSearch(); }} className="px-3 py-1 border border-white/30 rounded-full hover:bg-white hover:text-black transition-colors text-xs">Plumbing</button>
              <button onClick={() => { setSearchTerm("Cleaning"); handleSearch(); }} className="px-3 py-1 border border-white/30 rounded-full hover:bg-white hover:text-black transition-colors text-xs">Cleaning</button>
              <button onClick={() => { setSearchTerm("Electrician"); handleSearch(); }} className="px-3 py-1 border border-white/30 rounded-full hover:bg-white hover:text-black transition-colors text-xs">Electrician</button>
              <button onClick={() => { setSearchTerm("Cooking"); handleSearch(); }} className="px-3 py-1 border border-white/30 rounded-full hover:bg-white hover:text-black transition-colors text-xs">Cooking</button>
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
