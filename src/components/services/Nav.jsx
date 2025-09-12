import React from "react";

const Nav = () => {
  const services = [
    "All",
    "Home Repair",
    "Cleaning",
    "Personal Care",
    "Home Improvements",
    "Automotive",
    "Plumbing",
    "Electrical Work",
  ];
  const [selectedService, setSelectedService] = React.useState("All");

  return (
    <>
      <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 ">
        <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 md:gap-4 overflow-x-auto scrollbar-hide py-3">
          {services.map((service, index) => (
            <button
              key={index}
              className={`cursor-pointer flex-shrink-0 text-xs px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-2xl sm:rounded-2xl whitespace-nowrap transition-all duration-200 ${
                selectedService === service
                  ? "bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium"
                  : "bg-[#F2F2F2] text-gray-600 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedService(service)}
            >
              {service}
            </button>
          ))}
        </div>
      </div>
      <hr className="border-[1px] border-t border-gray-200 mt-2 sm:mt-4" />
    </>
  );
};

export default Nav;
