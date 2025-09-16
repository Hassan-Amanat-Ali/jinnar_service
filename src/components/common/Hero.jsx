import React from "react";
import { MapPin, Calendar, Star } from "lucide-react";
import search from "../../assets/icons/search.png";
import services1 from "../../assets/images/services-image-1.jpg";
import services2 from "../../assets/images/services-image-2.jpg";
import services3 from "../../assets/images/services-image-3.jpg";
import services4 from "../../assets/images/services-image-4.jpg";
import Dropdown from "./DropDown";

const Hero = ({
  place = "home",
  title = "Explore All Services",
  subtitle = "Find the right service for your needs from trusted local workers",
}) => {
  const [price, setPrice] = React.useState(50);
  const [openDropdown, setOpenDropdown] = React.useState(null);
  const services = ["All", "Active", "Completed", "Cancelled"];
  const [selectedService, setSelectedService] = React.useState("All");
  const handleDropdownToggle = (dropdownId) => {
    setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
  };
  return (
    <>
      <div
        class={`relative ${
          place === "home"
            ? "h-[33rem] md:h-[30rem] lg:h-[33rem]"
            : place === "Worker"
            ? "h-[15rem]"
            : "h-[28rem] md:h-[28rem] lg:h-[28rem]"
        } mb-10 w-full bg-gradient-to-b from-[#afe0f9] to-[#c4e6ff]`}
      >
        <div class="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#c4e9fb_1px,transparent_1px),linear-gradient(to_bottom,#c4e9fb_1px,transparent_1px)] bg-[size:84px_74px] ]">
          <div className=" top-0 h-auto">
            <div className="text-center mt-6 sm:mt-8 md:mt-20 px-4 z-100">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
                {title}
              </h1>
              <h4 className="text-xs sm:text-sm md:text-base text-gray-600 font-base mt-0.5 max-w-2xl mx-auto">
                {subtitle}
              </h4>
            </div>
            <div>
              {place === "home" && (
                <>
                  <div className="flex items-center justify-center relative px-4 sm:px-6 lg:px-8">
                    <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg mt-5">
                      <img
                        src={search}
                        alt=""
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 h-3 w-3"
                      />
                      <input
                        className="bg-white/70 backdrop-blur-2xl w-full h-9 sm:h-11 rounded-xl text-xs sm:text-sm px-3 pl-9 focus:outline-none border-2 border-white"
                        placeholder="Search for services..."
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 px-4 sm:px-6 lg:px-8 my-6 sm:my-8 md:my-10 lg:mt-18 w-full sm:w-[90%] md:w-[85%] lg:w-[100%] xl:w-[99%] 2xl:w-[90%] max-w-7xl mx-auto relative">
                    <div className="h-48 sm:h-56 md:h-64 lg:h-68">
                      <img
                        src={services1}
                        alt=""
                        className="rounded-xl h-full w-full object-cover"
                      />
                    </div>
                    <div className="h-40 sm:h-48 md:h-56 lg:h-60 self-end">
                      <img
                        src={services2}
                        alt=""
                        className="rounded-xl h-full w-full object-cover"
                      />
                    </div>
                    <div className="h-52 sm:h-60 md:h-68 lg:h-70">
                      <img
                        src={services3}
                        alt=""
                        className="rounded-xl h-full w-full object-cover"
                      />
                    </div>
                    <div className="h-44 sm:h-52 md:h-60 lg:h-64 self-end">
                      <img
                        src={services4}
                        alt=""
                        className="rounded-xl h-full w-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-12 sm:h-16 md:h-20 lg:h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                  </div>
                </>
              )}
            </div>
            <div>
              {place === "category" && (
                <>
                  <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-4 sm:p-6 space-y-5 mt-15">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 hover:bg-gray-100 transition">
                        <MapPin size={18} className="text-sky-500 mr-2" />
                        <input
                          type="text"
                          placeholder="Enter Location"
                          className="w-full bg-transparent text-sm focus:outline-none"
                        />
                      </div>

                      <Dropdown
                        className="text-neutral-500 text-sm"
                        icon={
                          <Calendar size={18} className="text-sky-500 mr-2" />
                        }
                        placeholder="All Availability"
                        options={["Available Now", "Weekdays", "Weekends"]}
                        isOpen={openDropdown === "availability"}
                        onToggle={() => handleDropdownToggle("availability")}
                        onSelect={(value) =>
                          console.log("Availability:", value)
                        }
                      />

                      <Dropdown
                        className="text-neutral-500 text-sm"
                        icon={<Star size={18} className="text-sky-500 mr-2" />}
                        placeholder="All Ratings"
                        options={[
                          "1+ Stars & Above",
                          "2+ Stars & Above",
                          "3+ Stars & Above",
                          "4+ Stars & Above",
                          "5 Stars Only",
                        ]}
                        isOpen={openDropdown === "ratings"}
                        onToggle={() => handleDropdownToggle("ratings")}
                        onSelect={(value) => console.log("Rating:", value)}
                        showStars={true}
                      />
                    </div>
                    <hr className="my-2 bg-neutral-500 text-neutral-300" />

                    <div className="w-full md:w-[50%]">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                          Price Range
                        </label>
                        <span className="bg-sky-100 text-sky-600 px-2 py-0.5 rounded text-xs font-sm">
                          0-{price}$
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-slider"
                          style={{
                            background: `linear-gradient(to right, #74C7F2 0%, #74C7F2 ${price}%, #e5e7eb ${price}%, #e5e7eb 100%)`,
                          }}
                        />
                        <style jsx>{`
                          .range-slider::-webkit-slider-thumb {
                            appearance: none;
                            height: 14px;
                            width: 14px;
                            border-radius: 50%;
                            background: #74c7f2;
                            cursor: pointer;
                            border: 2px solid white;
                            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                          }
                          .range-slider::-moz-range-thumb {
                            height: 14px;
                            width: 14px;
                            border-radius: 50%;
                            background: #74c7f2;
                            cursor: pointer;
                            border: 2px solid white;
                            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                          }
                        `}</style>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div>
              {place === "My Bookings" && (
                <div>
                  <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 ">
                    <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 md:gap-4 overflow-x-auto scrollbar-hide py-3">
                      {services.map((service, index) => (
                        <button
                          key={index}
                          className={`cursor-pointer flex-shrink-0 text-xs px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-2xl sm:rounded-2xl whitespace-nowrap transition-all duration-200 shadow-sm ${
                            selectedService === service
                              ? "bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium"
                              : "bg-white text-gray-500 hover:bg-neutral-200 border-1 border-neutral-300"
                          }`}
                          onClick={() => setSelectedService(service)}
                        >
                          {service}
                        </button>
                      ))}
                    </div>
                    <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg mt-5 mx-auto">
                      <img
                        src={search}
                        alt=""
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 h-3 w-3"
                      />
                      <input
                        className="bg-white/70 backdrop-blur-2xl w-full h-9 sm:h-11 rounded-xl text-xs sm:text-sm px-3 pl-9 focus:outline-none border-2 border-white"
                        placeholder="Search for bookings..."
                        type="text"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
