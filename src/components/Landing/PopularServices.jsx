import cleaning from "../../assets/images/house-cleaning.jpg";
import carepentry from "../../assets/images/carpenter.jpg";
import tailoring from "../../assets/images/tailring.jpg";
import electrical from "../../assets/images/electrical-work.jpg";
import plumbing from "../../assets/images/plmbing.jpg";
import homeRepair from "../../assets/images/home-repair.jpg";
import autoRepair from "../../assets/images/auto-repairing.jpg";
import petCare from "../../assets/images/pet-care.jpg";

import plumbingIcon from "../../assets/icons/plumbing.png";
import electricalIcon from "../../assets/icons/electrical.png";
import cleaningIcon from "../../assets/icons/cleaning.png";
import tailoringIcon from "../../assets/icons/scissors.png";
import repairIcon from "../../assets/icons/home-repair.png";
import petIcon from "../../assets/icons/pet.png";
import car from "../../assets/icons/car.png";
import carepentryIcon from "../../assets/icons/carpentry.png";
import Button from "../common/Button";

const PopularServices = () => {
  const services = [
    { icon: cleaningIcon, image: cleaning, name: "House Cleaning", jobs: 1200 },
    { icon: carepentryIcon, image: carepentry, name: "Carpentry", jobs: 800 },
    {
      icon: tailoringIcon,
      image: tailoring,
      name: "Tailoring & Alteration",
      jobs: 950,
    },
    {
      icon: electricalIcon,
      image: electrical,
      name: "Electrical Work",
      jobs: 720,
    },
    { icon: plumbingIcon, image: plumbing, name: "Plumbing", jobs: 680 },
    { icon: repairIcon, image: homeRepair, name: "Home Repair", jobs: 890 },
    { icon: car, image: autoRepair, name: "Auto Repairing", jobs: 540 },
    { icon: petIcon, image: petCare, name: "Pet Care", jobs: 420 },
  ];
  return (
    <section className="py-8 md:py-12 lg:py-16 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center mb-2">
          Popular Services Near You
        </h2>
        <p className="text-center text-gray-600 mb-6 md:mb-8 text-sm sm:text-base">
          Discover the most requested services in your area with verified
          professionals
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {services.map((service, i) => (
            <a
              key={i}
              href="/landing-services"
              className="aspect-square bg-white border border-border rounded-lg sm:rounded-xl shadow-sm overflow-hidden relative cursor-pointer hover:shadow-md transition-all duration-300 group"
            >
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Icon overlay */}
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/30 backdrop-blur-sm p-1.5 sm:p-2 rounded-md sm:rounded-lg shadow-sm">
                <img
                  src={service.icon}
                  alt=""
                  className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 object-contain"
                />
              </div>

              {/* Text overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 sm:p-3 lg:p-4">
                <h3 className="text-xs sm:text-sm lg:text-base xl:text-lg font-semibold text-white leading-tight mb-0.5 sm:mb-1">
                  {service.name}
                </h3>
                <p className="text-white/90 text-xs sm:text-xs lg:text-sm font-medium">
                  {service.jobs}+ Jobs
                </p>
              </div>
            </a>
          ))}
        </div>
        <div className="text-center mt-6 md:mt-8">
          <a href="/landing-services" className="inline-block">
            <Button title="View All Services" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default PopularServices;
