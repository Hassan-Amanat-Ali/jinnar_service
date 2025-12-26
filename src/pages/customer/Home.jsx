import { useState, useContext, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import { Wrench, Clock, DollarSign, ChevronDown, MapPin } from "lucide-react";

import customerHome from "../../assets/images/customer-home.jpg";
import customerHome2 from "../../assets/images/customer-home2.jpg";
import customerHome3 from "../../assets/images/customer-home3.jpg";
import customerHome4 from "../../assets/images/customer-home4.jpg";
import customerHome5 from "../../assets/images/customer-home5.jpg";

import search2 from "../../assets/icons/search2.png";
import people from "../../assets/icons/people.png";
import shield from "../../assets/icons/shield.png";
import correct from "../../assets/icons/correct.png";

import service1 from "../../assets/images/All-services-1.jpg";

import PopularServices from "../../components/Landing/PopularServices";
import TopWorkers from "../../components/Landing/TopWorkers";
import Testimonials from "../../components/Landing/Testimonials";
import JobCard from "../../components/customer/MyBookingsCard";
import Dropdown from "../../components/common/DropDown";
import Card from "../common/Card";
import { useNavigate } from "react-router-dom";
import {
  useSearchGigsQuery,
  useGetMyOrdersQuery,
  useGetMyProfileQuery,
  useFindWorkersQuery,
  useUpdateFcmTokenMutation,
} from "../../services/customerApi";
import {
  useGetCategoriesQuery,
  useGetSubcategoriesQuery,
} from "../../services/workerApi";
import AuthContext from "../../context/AuthContext";
import { requestNotificationPermission } from "../../utils/fcm";
import { useGeocoding } from "../../hooks/useGeocoding.js";
import { getFullImageUrl, reverseGeocode } from "../../utils/fileUrl.js";

const CustomerHome = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedSortBy, setSelectedSortBy] = useState("");
  const [selectedMinRating, setSelectedMinRating] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  // Geocoding hook
  const { suggestions: locationSuggestions, isLoading: locationLoading } = useGeocoding(searchLocation);

  const [locationError, setLocationError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [updateFcmToken] = useUpdateFcmTokenMutation();

  // Fetch categories and subcategories
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();
  const { data: subcategoriesData, isLoading: subcategoriesLoading } =
    useGetSubcategoriesQuery(selectedCategory, {
      skip: !selectedCategory,
    });

  const categories = categoriesData || [];
  const subcategories = subcategoriesData || [];

  // Helper function to format names
  const formatName = (name) =>
    name?.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "";

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
          setLocationError(error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // Cache location for 5 minutes
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser");
    }
  }, []);

  // API Queries - Use searchGigs with location
  const {
    data: gigsData,
    isLoading: gigsLoading,
    error: gigsError,
  } = useSearchGigsQuery({
    limit: 8,
    ...(userAddress && {
      address: userAddress,
      radius: 50, // 50km radius
    }),
  });

  const gigs = gigsData?.gigs || [];

  const {
    data: orders = [],
    isLoading: ordersLoading,
    error: ordersError,
  } = useGetMyOrdersQuery();
  const { data: profile } = useGetMyProfileQuery();
  const {
    data: workers = [],
    isLoading: workersLoading,
    error: workersError,
  } = useFindWorkersQuery({ limit: 4 });

  // Request FCM permission and update token on component mount
  useEffect(() => {
    const setupFCM = async () => {
      try {
        const token = await requestNotificationPermission();

        if (token) {
          // Send token to backend
          await updateFcmToken({ token }).unwrap();
          console.log("FCM token updated successfully");
        }
      } catch (error) {
        console.error("Error updating FCM token:", error);
      }
    };

    setupFCM();
  }, [updateFcmToken]);

  // Hero slider data - using dynamic user name
  const userName = profile?.name || user?.name || "Guest";
  const heroSlides = [
    {
      image: customerHome,
      title: `Welcome, ${userName}!`,
      subtitle: "Find Trusted Workers Anytime, Anywhere",
      description:
        "Book instantly or schedule later safe, simple, and reliable.",
    },
    {
      image: customerHome2,
      title: `Welcome, ${userName}!`,
      subtitle: "Quality Services at Your Doorstep",
      description: "Connect with verified professionals for all your needs.",
    },
    {
      image: customerHome3,
      title: `Welcome, ${userName}!`,
      subtitle: "Reliable Workers in Your Area",
      description: "Get expert help when you need it, where you need it.",
    },
    {
      image: customerHome4,
      title: `Welcome, ${userName}!`,
      subtitle: "Book Trusted Professionals",
      description: "Safe, secure, and satisfaction guaranteed.",
    },
    {
      image: customerHome5,
      title: `Welcome, ${userName}!`,
      subtitle: "Your Home Service Solution",
      description: "From repairs to cleaning, we've got you covered.",
    },
  ];

  // Dropdown options
  const budgetOptions = [
    "Under 20,000 TSH",
    "20,000 - 50,000 TSH",
    "50,000 - 100,000 TSH",
    "100,000 - 150,000 TSH",
    "150,000 - 200,000 TSH",
    "200,000 - 300,000 TSH",
    "300,000 - 500,000 TSH",
    "500,000 - 1,000,000 TSH",
    "1,000,000 - 2,000,000 TSH",
    "Above 2,000,000 TSH",
    "Negotiable",
    "Quote on request",
  ];

  // Transform gigs data for display
  const displayGigs =
    gigs?.slice(0, 8)?.map((gig) => ({
      id: gig._id,
      title: gig.title,
      img: getFullImageUrl(gig.images?.[0]?.url) || service1, // Use first image or fallback
      rating: gig.sellerId?.rating?.average || gig.averageRating || "N/A",
      description: gig.description,
      starting:
        gig.pricing?.method === "negotiable"
          ? "Negotiable"
          : `TZS ${gig.pricing?.price?.toLocaleString() || 0}`,
      status: "Available",
      gigId: gig._id,
      sellerId: gig.sellerId?._id || gig.sellerId,
      pricingMethod: gig.pricing?.method || gig.pricingMethod,
      category: gig.category?.name || null,
      subcategories: gig.subcategories || [],
    })) || [];

  const handleDropdownToggle = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  // Handle search functionality
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }
    if (selectedCategory) {
      params.set("category", selectedCategory);
    }
    if (selectedSubcategory) {
      params.set("subcategory", selectedSubcategory);
    }
    if (selectedSortBy) {
      params.set("sortBy", selectedSortBy);
    }
    if (selectedMinRating) {
      params.set("minRating", selectedMinRating);
    }
    // Use searchLocation if provided, otherwise use userAddress
    const locationToUse = searchLocation.trim() || userAddress;
    if (locationToUse) {
      params.set("address", locationToUse);
    }
    if (selectedBudget) {
      params.set("budget", selectedBudget);
    }

    // Navigate to AllServices with query parameters
    navigate(`/services?${params.toString()}`);
  };

  // Handle dropdown selection
  const handleBudgetSelect = (budget) => {
    setSelectedBudget(budget);
    setOpenDropdown(null);
  };

  // Handle viewing booking details
  const handleViewDetails = (bookingId) => {
    navigate(`/customer-booking/${bookingId}`);
  };
  return (
    <>
      <div className="relative h-fit w-full min-h-screen md:min-h-[70vh] lg:min-h-fit">
        {/* Background Image Slider */}
        <Swiper
          modules={[Autoplay]}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="absolute inset-0 h-full min-h-screen md:min-h-[70vh] lg:h-122 w-full"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <img
                src={slide.image}
                alt=""
                className="h-full min-h-screen md:min-h-[70vh] lg:h-122 w-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Static Overlay and Content */}
        <div className="bg-black/50 absolute inset-0 z-10"></div>
        <div className="absolute top-0 text-white inset-0 flex flex-col items-center justify-center px-4 md:px-6 lg:px-4 text-center z-20">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
            Welcome, {userName}!
          </h1>
          <p className="text-sm md:text-base lg:text-base">
            Find Trusted Workers Anytime, Anywhere
          </p>
          <span className="text-xs md:text-sm lg:text-xs mt-2 md:mt-3 lg:mt-4 font-light px-2">
            Book instantly or schedule later safe, simple, and reliable.
          </span>
          <div className="w-full mt-4 md:mt-5 lg:mt-6 max-w-6xl px-3 md:px-6 lg:px-0">
            <form onSubmit={handleSearch}>
              <div className="bg-white/95 backdrop-blur-sm w-full mx-auto rounded-2xl shadow-lg border border-gray-200/50 p-4 md:p-5">
                {/* Compact Filters Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Search Input */}
                  <div className="sm:col-span-2 lg:col-span-4">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm text-gray-700 placeholder-gray-400 bg-white hover:border-[#74C7F2]/60 focus:outline-none focus:ring-2 focus:ring-[#74C7F2]/20 focus:border-[#74C7F2] transition-all"
                      placeholder="Search for any service..."
                    />
                  </div>

                  {/* Location Input */}
                  <div className="sm:col-span-2 lg:col-span-2 relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <MapPin size={16} />
                    </div>
                    <input
                      type="text"
                      value={searchLocation}
                      onChange={(e) => {
                        setSearchLocation(e.target.value);
                        setShowLocationSuggestions(true);
                      }}
                      onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                      className="w-full h-10 rounded-lg border border-gray-300 pl-9 pr-3 text-sm text-gray-700 placeholder-gray-400 bg-white hover:border-[#74C7F2]/60 focus:outline-none focus:ring-2 focus:ring-[#74C7F2]/20 focus:border-[#74C7F2] transition-all"
                      placeholder={userAddress || "Enter location..."}
                    />
                    {showLocationSuggestions && searchLocation.length > 2 && (
                       <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto text-left">
                         {locationLoading && (
                           <div className="p-3 text-sm text-gray-500">Loading...</div>
                         )}
                         {!locationLoading && locationSuggestions.length === 0 && (
                           <div className="p-3 text-sm text-gray-500">No results found.</div>
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
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setSelectedSubcategory("");
                      }}
                      disabled={categoriesLoading}
                      className="appearance-none w-full h-10 rounded-lg border border-gray-300 pl-3 pr-8 text-sm text-gray-700 bg-white hover:border-[#74C7F2]/60 focus:outline-none focus:ring-2 focus:ring-[#74C7F2]/20 focus:border-[#74C7F2] transition-all disabled:bg-gray-50 disabled:text-gray-400"
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {formatName(cat.name)}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500">
                      <ChevronDown size={16} />
                    </div>
                  </div>

                  {/* Subcategory Filter */}
                  <div className="relative">
                    <select
                      value={selectedSubcategory}
                      onChange={(e) => setSelectedSubcategory(e.target.value)}
                      disabled={!selectedCategory || subcategoriesLoading}
                      className="appearance-none w-full h-10 rounded-lg border border-gray-300 pl-3 pr-8 text-sm text-gray-700 bg-white hover:border-[#74C7F2]/60 focus:outline-none focus:ring-2 focus:ring-[#74C7F2]/20 focus:border-[#74C7F2] transition-all disabled:bg-gray-50 disabled:text-gray-400"
                    >
                      <option value="">Subcategory</option>
                      {subcategories.map((sub) => (
                        <option key={sub._id} value={sub._id}>
                          {formatName(sub.name)}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500">
                      <ChevronDown size={16} />
                    </div>
                  </div>

                  {/* Sort By Filter */}
                  <div className="relative">
                    <select
                      value={selectedSortBy}
                      onChange={(e) => setSelectedSortBy(e.target.value)}
                      className="appearance-none w-full h-10 rounded-lg border border-gray-300 pl-3 pr-8 text-sm text-gray-700 bg-white hover:border-[#74C7F2]/60 focus:outline-none focus:ring-2 focus:ring-[#74C7F2]/20 focus:border-[#74C7F2] transition-all"
                    >
                      <option value="">Sort By</option>
                      <option value="rating">Top Rated</option>
                      <option value="experience">Experienced</option>
                      <option value="price_low">Price ↑</option>
                      <option value="price_high">Price ↓</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500">
                      <ChevronDown size={16} />
                    </div>
                  </div>

                  {/* Minimum Rating Filter */}
                  <div className="relative">
                    <select
                      value={selectedMinRating}
                      onChange={(e) => setSelectedMinRating(e.target.value)}
                      className="appearance-none w-full h-10 rounded-lg border border-gray-300 pl-3 pr-8 text-sm text-gray-700 bg-white hover:border-[#74C7F2]/60 focus:outline-none focus:ring-2 focus:ring-[#74C7F2]/20 focus:border-[#74C7F2] transition-all"
                    >
                      <option value="">Min Rating</option>
                      <option value="4">4★ & up</option>
                      <option value="3">3★ & up</option>
                      <option value="2">2★ & up</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                  {/* Search Button */}
                  <div className="sm:col-span-2 lg:col-span-2">
                    <button
                      type="submit"
                      className="w-full h-10 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white rounded-lg text-sm font-medium hover:from-[#74C7F2] hover:to-[#B6E0FE] transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Search Services
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* <PopularServices /> */}

      <div className="my-8 px-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-center">
          How It Works
        </h1>
        <p className="text-center text-sm sm:text-base">
          Get your task done in 4 simple steps
        </p>
        <div className="max-w-7xl bg-[#E4F6FF] min-h-[20rem]   mx-auto mt-6 sm:mt-10 rounded-2xl flex flex-col md:flex-row justify-center items-center gap-6 sm:gap-8 md:gap-10 p-6 sm:p-8 md:p-10">
          {[
            {
              id: 1,
              icon: search2,
              title: "Search Service",
              description: "Browse categories or search for what you need",
            },
            {
              id: 2,
              icon: people,
              title: "Choose Worker",
              description: "Select from verified professionals in your area",
            },
            {
              id: 3,
              icon: shield,
              title: "Secure Booking",
              description: "Safe payment and booking confirmation",
            },
            {
              id: 4,
              icon: correct,
              title: "Get It Done",
              description: "Enjoy quality service at your convenience",
            },
          ].map((step, index) => (
            <div
              key={step.id}
              className="flex flex-col md:flex-row items-center gap-4 md:gap-6"
            >
              <div className="flex flex-col items-center relative">
                <div className="bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full flex items-center justify-center p-1 shadow-2xl relative z-10">
                  <img
                    src={step.icon}
                    alt=""
                    className="w-6 h-6 sm:w-7 sm:h-7 object-cover"
                  />
                </div>
                <div className="w-fit flex flex-col items-center mt-4">
                  <div className="h-6 w-6 rounded-full bg-white text-[#74C7F2] font-bold text-sm flex items-center justify-center mb-2">
                    {step.id}
                  </div>
                  <p className="text-center text-sm font-medium mb-2">
                    {step.title}
                  </p>
                  <p className="text-center text-xs text-gray-600 max-w-[140px] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < 3 && (
                <div className="hidden md:block bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] h-0.5 w-12 lg:w-16 rounded-lg -mt-20"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl w-full px-4   mx-auto my-16 sm:my-20 lg:my-24">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 sm:px-2">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-gray-900">
              Popular Services Near You
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              {userLocation
                ? "Trending services in your area"
                : locationError
                ? "Enable location for nearby services"
                : "Getting your location..."}
            </p>
          </div>
          <button
            className="border-2 text-[#74C7F2] border-[#74C7F2] rounded-lg py-2.5 px-6 text-sm font-medium cursor-pointer hover:bg-[#74C7F2] hover:text-white hover:shadow-lg transition-all duration-300 w-fit whitespace-nowrap"
            onClick={() => {
              navigate("/services");
            }}
          >
            View All Services
          </button>
        </div>
        {gigsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-4 lg:gap-6 justify-items-center place-items-center">
            {/* Loading skeletons */}
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-full max-w-[280px] animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-3 rounded mb-1"></div>
                <div className="bg-gray-200 h-3 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : displayGigs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-4 lg:gap-6 justify-items-center place-items-center">
            {displayGigs.map((service) => (
              <div
                key={service.id}
                className="w-full max-w-[280px] flex justify-center"
              >
                <Card
                  place="customer"
                  title={service.title}
                  img={service.img}
                  rating={service.rating}
                  description={service.description}
                  starting={service.starting}
                  status={service.status}
                  gigId={service.gigId}
                  sellerId={service.sellerId}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-12 py-8">
            <p className="text-lg text-gray-500 mb-2">
              {gigsError
                ? "Failed to load services. Please try again later."
                : "No services available at the moment."}
            </p>
            <p className="text-sm text-gray-400">
              Please check back later for new services.
            </p>
          </div>
        )}
      </div>

      <TopWorkers
        workers={workers}
        isLoading={workersLoading}
        error={workersError}
      />

      <div className="max-w-7xl mx-auto my-20 px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold">
              Your Bookings
            </h1>
            <p className="text-sm sm:text-base">
              Track your ongoing and upcoming services
            </p>
          </div>
          <button
            className="border-2 text-[#74C7F2] border-[#74C7F2] rounded-md py-1.5 px-3 text-sm cursor-pointer hover:bg-[#74C7F2] hover:text-white transition-all duration-300 w-fit"
            onClick={() => navigate("/customer-bookings")}
          >
            View All Bookings
          </button>
        </div>

        {/* Bookings Grid */}
        {ordersLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
            {/* Loading skeletons for bookings */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : (orders?.orders || orders || [])?.slice(0, 6)?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
            {(orders?.orders || orders || []).slice(0, 6).map((order) => {
              // Transform API data to match JobCard component expectations
              const transformedBooking = {
                id: order._id,
                serviceImage: order.gigId?.images?.[0]?.url || null,
                serviceTitle: order.gigId?.title || "Service",
                serviceDescription:
                  order.jobDescription || "No description available",
                emergencyTag: order.emergency ? "Emergency" : null,
                statusTag:
                  order.status?.charAt(0).toUpperCase() +
                    order.status?.slice(1) || "Unknown",
                workerImage: order.sellerId?.profilePicture || null,
                workerName: order.sellerId?.name || "Worker",
                workerRating:
                  order.sellerId?.rating?.average ||
                  order.sellerId?.rating ||
                  0,
                date: order.date
                  ? new Date(order.date).toLocaleDateString()
                  : "TBD",
                time:
                  order.timeSlot?.charAt(0).toUpperCase() +
                    order.timeSlot?.slice(1) || "TBD",
                location: order.location
                  ? `${order.location.lat.toFixed(
                      4
                    )}, ${order.location.lng.toFixed(4)}`
                  : "Location TBD",
                price: order.price || "Price TBD",
                workerId: order.sellerId?._id, // Add workerId for messaging
              };

              return (
                <JobCard
                  key={transformedBooking.id}
                  serviceImage={transformedBooking.serviceImage}
                  serviceTitle={transformedBooking.serviceTitle}
                  serviceDescription={transformedBooking.serviceDescription}
                  emergencyTag={transformedBooking.emergencyTag}
                  statusTag={transformedBooking.statusTag}
                  workerImage={transformedBooking.workerImage}
                  workerName={transformedBooking.workerName}
                  workerRating={transformedBooking.workerRating}
                  date={transformedBooking.date}
                  time={transformedBooking.time}
                  location={transformedBooking.location}
                  price={transformedBooking.price}
                  bookingId={transformedBooking.id}
                  workerId={transformedBooking.workerId}
                  onViewDetails={() => handleViewDetails(transformedBooking.id)}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">
              {ordersError
                ? "Failed to load bookings. Please try again later."
                : "No bookings yet."}
            </div>
            <div className="text-gray-400 text-sm">
              {ordersError
                ? "Please check your connection and refresh the page."
                : "Start booking services to see them here!"}
            </div>
          </div>
        )}
      </div>

      <Testimonials />
    </>
  );
};

export default CustomerHome;
