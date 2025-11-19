import { useState, useContext, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import { Wrench, MapPin, Clock, DollarSign, Sheet } from "lucide-react";

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
import BookingCard from "../../components/customer/BookinCard";
import Dropdown from "../../components/common/DropDown";
import Card from "../common/Card";
import { useNavigate } from "react-router-dom";
import { useGetGigsQuery, useGetMyOrdersQuery, useGetMyProfileQuery, useFindWorkersQuery, useUpdateFcmTokenMutation } from "../../services/customerApi";
import AuthContext from "../../context/AuthContext";
import { requestNotificationPermission } from "../../utils/fcm";

const CustomerHome = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [updateFcmToken] = useUpdateFcmTokenMutation();

  // API Queries
  const { data: gigs = [], isLoading: gigsLoading, error: gigsError } = useGetGigsQuery({ limit: 8 });
  const { data: orders = [], isLoading: ordersLoading, error: ordersError } = useGetMyOrdersQuery();
  const { data: profile } = useGetMyProfileQuery();
  const { data: workers = [], isLoading: workersLoading, error: workersError } = useFindWorkersQuery({ limit: 4 });

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
  const serviceOptions = [
    "Home Cleaning",
    "Deep Cleaning",
    "Office Cleaning",
    "Plumbing",
    "Emergency Plumbing",
    "Drain Cleaning",
    "Electrical Work",
    "Electrical Repair",
    "Wiring Installation",
    "Carpentry",
    "Furniture Repair",
    "Custom Furniture",
    "Pet Care",
    "Pet Grooming",
    "Pet Sitting",
    "Auto Repair",
    "Car Maintenance",
    "Tire Service",
    "Tailoring",
    "Alterations",
    "Custom Clothing",
    "Home Repair",
    "Roof Repair",
    "Painting",
    "Garden Maintenance",
    "Landscaping",
  ];

  const locationOptions = [
    "Dar es Salaam - Kinondoni",
    "Dar es Salaam - Ilala",
    "Dar es Salaam - Temeke",
    "Dar es Salaam - Ubungo",
    "Arusha - Central",
    "Arusha - Meru",
    "Mwanza - Nyamagana",
    "Mwanza - Ilemela",
    "Dodoma - Central",
    "Dodoma - Bahi",
    "Mbeya - Central",
    "Mbeya - Rungwe",
    "Morogoro - Central",
    "Morogoro - Mvomero",
    "Tanga - Central",
    "Tanga - Muheza",
    "Moshi - Central",
    "Moshi - Hai",
    "Zanzibar - Stone Town",
    "Zanzibar - Unguja",
  ];

  const scheduleOptions = [
    "Now (ASAP)",
    "Within 30 minutes",
    "Within 1 hour",
    "Within 2 hours",
    "Within 3 hours",
    "Later today",
    "Tomorrow morning (8-12 PM)",
    "Tomorrow afternoon (12-5 PM)",
    "Tomorrow evening (5-8 PM)",
    "This week",
    "Next week",
    "Weekends only",
    "Weekdays only",
    "Custom date & time",
  ];

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
  const displayGigs = (gigs?.gigs || gigs || [])?.slice(0, 8)?.map(gig => ({
    id: gig._id,
    title: gig.title,
    img: gig.images?.[0]?.url || service1, // Use first image or fallback
    rating: gig.averageRating || "N/A",
    description: gig.description,
    starting: `$${gig.price || 0}`,
    status: "Available",
    gigId: gig._id,
    sellerId: gig.sellerId?._id || gig.sellerId,
    pricingMethod: gig.pricingMethod
  })) || [];

  const handleDropdownToggle = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
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
          <div className="w-full mt-4 md:mt-5 lg:mt-6 max-w-7xl px-3 md:px-6 lg:px-0">
            <div className="bg-white w-full md:w-[90%] lg:w-[60%] mx-auto h-auto lg:h-22 rounded-t-2xl shadow-lg">
              <div className="text-black p-3 md:p-4 lg:p-4 whitespace-nowrap">
                {/* Mobile Grid Layout */}
                <div className="grid grid-cols-2 gap-2 sm:hidden">
                  <div className="flex text-xs flex-col items-start gap-1">
                    <p className="flex items-center gap-1 text-gray-600">
                      <Wrench size={12} style={{ color: "#74C7F2" }} />
                      Service
                    </p>
                    <Dropdown
                      placeholder="Choose Service"
                      options={serviceOptions}
                      isOpen={openDropdown === "mobile-service"}
                      onToggle={() => handleDropdownToggle("mobile-service")}
                      className="w-full  font-light text-xs text-start h-8 max-sm:w-[100px] max-sm:px-1"
                    />
                  </div>
                  <div className="flex text-xs flex-col items-start gap-1">
                    <p className="flex items-center gap-1 text-gray-600">
                      <MapPin size={12} style={{ color: "#74C7F2" }} />
                      Location
                    </p>
                    <Dropdown
                      placeholder="Your Area"
                      options={locationOptions}
                      isOpen={openDropdown === "mobile-location"}
                      onToggle={() => handleDropdownToggle("mobile-location")}
                      className="w-full font-light text-xs text-start h-8  max-sm:w-[100px] max-sm:px-1"
                    />
                  </div>
                  <div className="flex text-xs flex-col items-start gap-1">
                    <p className="flex items-center gap-1 text-gray-600">
                      <Clock size={12} style={{ color: "#74C7F2" }} />
                      When
                    </p>
                    <Dropdown
                      placeholder="Schedule"
                      options={scheduleOptions}
                      isOpen={openDropdown === "mobile-schedule"}
                      onToggle={() => handleDropdownToggle("mobile-schedule")}
                      className="w-full font-light text-xs text-start h-8  max-sm:w-[100px] max-sm:px-1"
                    />
                  </div>
                  <div className="flex text-xs flex-col items-start gap-1">
                    <p className="flex items-center gap-1 text-gray-600">
                      <DollarSign size={12} style={{ color: "#74C7F2" }} />
                      Budget
                    </p>
                    <Dropdown
                      placeholder="Price Range"
                      options={budgetOptions}
                      isOpen={openDropdown === "mobile-budget"}
                      onToggle={() => handleDropdownToggle("mobile-budget")}
                      className="w-full font-light text-xs text-start h-8  max-sm:w-[100px] max-sm:px-1"
                    />
                  </div>
                </div>

                {/* Medium+ Screens: Improved Layout */}
                <div className="hidden sm:grid sm:grid-cols-2 sm:gap-3 md:flex md:flex-row md:justify-between md:items-start md:gap-3 lg:gap-4">
                  <div className="flex text-xs flex-col items-start gap-1 flex-1">
                    <p className="flex items-center gap-1 text-gray-600">
                      <Wrench size={14} style={{ color: "#74C7F2" }} />
                      Select Service
                    </p>
                    <Dropdown
                      placeholder="Choose Service"
                      options={serviceOptions}
                      isOpen={openDropdown === "service"}
                      onToggle={() => handleDropdownToggle("service")}
                      className="w-full font-light text-xs text-start md:w-[166px]"
                    />
                  </div>
                  <div className="flex text-xs flex-col items-start gap-1 flex-1">
                    <p className="flex items-center gap-1 text-gray-600">
                      <MapPin size={14} style={{ color: "#74C7F2" }} />
                      Location
                    </p>
                    <Dropdown
                      placeholder="Your Area"
                      options={locationOptions}
                      isOpen={openDropdown === "location"}
                      onToggle={() => handleDropdownToggle("location")}
                      className="w-full font-light text-xs text-start md:w-[166px]"
                    />
                  </div>
                  <div className="flex text-xs flex-col items-start gap-1 flex-1">
                    <p className="flex items-center gap-1 text-gray-600">
                      <Clock size={14} style={{ color: "#74C7F2" }} />
                      When
                    </p>
                    <Dropdown
                      placeholder="Schedule"
                      options={scheduleOptions}
                      isOpen={openDropdown === "schedule"}
                      onToggle={() => handleDropdownToggle("schedule")}
                      className="w-full font-light text-xs text-start md:w-[166px]"
                    />
                  </div>
                  <div className="flex text-xs flex-col items-start gap-1 flex-1">
                    <p className="flex items-center gap-1 text-gray-600">
                      <DollarSign size={14} style={{ color: "#74C7F2" }} />
                      Price
                    </p>
                    <Dropdown
                      placeholder="Budget"
                      options={budgetOptions}
                      isOpen={openDropdown === "budget"}
                      onToggle={() => handleDropdownToggle("budget")}
                      className="w-full font-light text-xs text-start md:w-[166px]"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white w-full md:w-[90%] lg:w-[60%] mx-auto h-auto lg:h-14 rounded-b-2xl shadow-lg mt-1">
              <div className="w-full h-full p-3 flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-3">
                <input
                  type="text"
                  className="w-full sm:w-[70%] md:w-[74%] h-10 sm:h-10 md:h-8 outline-none px-3 md:px-4 bg-[#f9fafb] rounded-lg border border-gray-300 text-black text-xs placeholder-gray-500 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                  placeholder="Search for any service..."
                />
                <button className="w-full sm:w-[28%] md:w-[30%] h-10 sm:h-10 md:h-8 bg-gradient-to-r from-[#A7E3F2] to-[#74C7F2] text-white rounded-lg text-xs md:text-xs font-medium hover:from-[#96D9F0] hover:to-[#63B8E8] transition-all duration-200 shadow-sm">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PopularServices />

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
              Trending services in your area
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
              {gigsError ? "Failed to load services. Please try again later." : "No services available at the moment."}
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
        <div className="flex flex-col gap-6 mt-6">
          {ordersLoading ? (
            // Loading skeletons for bookings
            [...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-32 rounded-lg"></div>
              </div>
            ))
          ) : (orders?.orders || orders || [])?.slice(0, 3)?.length > 0 ? (
            (orders?.orders || orders || []).slice(0, 3).map((order) => (
              <BookingCard
                key={order._id}
                image={order.gigId?.images?.[0]?.url || service1}
                title={order.gigId?.title || "Service"}
                workerName={order.sellerId?.name || "Unknown Worker"}
                time={new Date(order.createdAt).toLocaleDateString()}
                category={order.gigId?.category || "General"}
                status={order.status || "Pending"}
                price={order.totalAmount || "0"}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">
                {ordersError ? "Failed to load bookings. Please try again later." : "No bookings yet."}
              </p>
              <p className="text-sm text-gray-400">
                {ordersError ? "Please check your connection and refresh the page." : "Start booking services to see them here!"}
              </p>
            </div>
          )}
        </div>
      </div>

      <Testimonials />
    </>
  );
};

export default CustomerHome;
