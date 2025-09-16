import customerHome from "../../assets/images/customer-home.jpg";
import Dropdown from "../../components/common/DropDown";
import { Wrench, MapPin, Clock, DollarSign, Sheet } from "lucide-react";
import { useState } from "react";
import PopularServices from "../../components/Landing/PopularServices";
import search2 from "../../assets/icons/search2.png";
import people from "../../assets/icons/people.png";
import shield from "../../assets/icons/shield.png";
import correct from "../../assets/icons/correct.png";
import Card from "../common/Card";
import service1 from "../../assets/images/All-services-1.jpg";
import service2 from "../../assets/images/all-services-2.jpg";
import service3 from "../../assets/images/all-services-3.jpg";
import service4 from "../../assets/images/all-services-4.jpg";
import TopWorkers from "../../components/Landing/TopWorkers";
import Testimonials from "../../components/Landing/Testimonials";
import BookingCard from "../../components/customer/BookinCard";

const CustomerHome = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

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

  const servicesData = [
    {
      id: 1,
      title: "House Cleaning",
      img: service1,
      rating: "4.8",
      description:
        "Professional home cleaning services including deep cleaning, regular maintenance, and sanitization for your entire house.",
    },
    {
      id: 2,
      title: "Plumbing Services",
      img: service2,
      rating: "4.6",
      description:
        "Expert plumbing repairs, installations, and maintenance. From leaky faucets to complete bathroom renovations.",
    },
    {
      id: 3,
      title: "Electrical Work",
      img: service3,
      rating: "4.7",
      description:
        "Licensed electricians for all your electrical needs. Wiring, repairs, installations, and safety inspections.",
    },
    {
      id: 4,
      title: "Carpentry",
      img: service4,
      rating: "4.9",
      description: "Custom furniture, repairs, and woodworking services.",
    },
    {
      id: 5,
      title: "House Cleaning",
      img: service1,
      rating: "4.8",
      description:
        "Professional home cleaning services including deep cleaning, regular maintenance, and sanitization for your entire house.",
    },
    {
      id: 6,
      title: "Plumbing Services",
      img: service2,
      rating: "4.6",
      description:
        "Expert plumbing repairs, installations, and maintenance. From leaky faucets to complete bathroom renovations.",
    },
    {
      id: 7,
      title: "Electrical Work",
      img: service3,
      rating: "4.7",
      description:
        "Licensed electricians for all your electrical needs. Wiring, repairs, installations, and safety inspections.",
    },
    {
      id: 8,
      title: "Carpentry",
      img: service4,
      rating: "4.9",
      description: "Custom furniture, repairs, and wood working services.",
    },
    // {
    //   id: 9,
    //   title: "Carpentry",
    //   img: service4,
    //   rating: "4.9",
    //   description: "Custom furniture, repairs, and wood working services.",
    // },
    // {
    //   id: 5,
    //   title: "Auto Repair",
    //   img: autoRepair,
    //   rating: "4.5",
    //   description:
    //     "Complete automotive repair services including engine repair, brake service, and regular maintenance.",
    // },
    // {
    //   id: 6,
    //   title: "Home Repair",
    //   img: homeRepair,
    //   rating: "4.4",
    //   description:
    //     "General home repair and maintenance services. Fixing, painting, and maintaining your property.",
    // },
    // {
    //   id: 7,
    //   title: "Pet Care",
    //   img: petCare,
    //   rating: "4.8",
    //   description:
    //     "Professional pet care services including grooming, walking, feeding, and pet sitting for your beloved animals.",
    // },
    // {
    //   id: 8,
    //   title: "Tailoring",
    //   img: tailoring,
    //   rating: "4.6",
    //   description:
    //     "Custom tailoring and alterations. Professional clothing adjustments and bespoke garment creation.",
    // },
    // {
    //   id: 9,
    //   title: "Premium Cleaning",
    //   img: service1,
    //   rating: "4.7",
    //   description:
    //     "High-end cleaning services with premium products and attention to detail for luxury properties.",
    // },
    // {
    //   id: 10,
    //   title: "Quick Repairs",
    //   img: service2,
    //   rating: "4.3",
    //   description:
    //     "Fast and efficient repair services for urgent household issues and emergency maintenance needs.",
    // },
    // {
    //   id: 11,
    //   title: "Garden Care",
    //   img: service3,
    //   rating: "4.5",
    //   description:
    //     "Professional landscaping and garden maintenance including pruning, planting, and lawn care services.",
    // },
    // {
    //   id: 12,
    //   title: "Tech Support",
    //   img: service4,
    //   rating: "4.8",
    //   description:
    //     "Computer and technology support services including setup, troubleshooting, and repair of electronic devices.",
    // },
    // {
    //   id: 13,
    //   title: "Event Services",
    //   img: service5,
    //   rating: "4.6",
    //   description:
    //     "Professional event planning and management services for parties, weddings, and corporate events.",
    // },
  ];

  const handleDropdownToggle = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };
  return (
    <>
      <div className="relative h-fit w-full min-h-screen md:min-h-[70vh] lg:min-h-fit">
        <div className="bg-black/50 absolute inset-0"></div>
        <img
          src={customerHome}
          alt=""
          className="h-full min-h-screen md:min-h-[70vh] lg:h-122 w-full object-cover"
        />
        <div className="absolute top-0 text-white inset-0 flex flex-col items-center justify-center px-4 md:px-6 lg:px-4 text-center ">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
            Welcome, Sarah!
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
          <button className="border-2 text-[#74C7F2] border-[#74C7F2] rounded-lg py-2.5 px-6 text-sm font-medium cursor-pointer hover:bg-[#74C7F2] hover:text-white hover:shadow-lg transition-all duration-300 w-fit whitespace-nowrap">
            View All Services
          </button>
        </div>
        {servicesData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-4 lg:gap-6 justify-items-center place-items-center">
            {servicesData.map((service) => (
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
                  starting={"$25"}
                  status={"Available"}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-12 py-8">
            <p className="text-lg text-gray-500 mb-2">
              No services available at the moment.
            </p>
            <p className="text-sm text-gray-400">
              Please check back later for new services.
            </p>
          </div>
        )}
      </div>

      <TopWorkers />

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
          <button className="border-2 text-[#74C7F2] border-[#74C7F2] rounded-md py-1.5 px-3 text-sm cursor-pointer hover:bg-[#74C7F2] hover:text-white transition-all duration-300 w-fit">
            View All Bookings
          </button>
        </div>
        <div className="flex flex-col gap-6 mt-6">
          <BookingCard
            image={service1}
            title="Web Design"
            workerName="John Doe"
            time="2 hours ago"
            category="Design"
            status="Confirmed"
            price="50"
          />
          <BookingCard
            image={service1}
            title="Web Design"
            workerName="John Doe"
            time="2 hours ago"
            category="Design"
            status="Confirmed"
            price="50"
          />
          <BookingCard
            image={service1}
            title="Web Design"
            workerName="John Doe"
            time="2 hours ago"
            category="Design"
            status="Confirmed"
            price="50"
          />
        </div>
      </div>

      <Testimonials />
    </>
  );
};

export default CustomerHome;
