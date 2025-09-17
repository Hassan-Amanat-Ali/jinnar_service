import React from "react";
import Hero from "../../components/common/Hero";
import Dropdown from "../../components/common/DropDown";
import { MapPin } from "lucide-react";
import WorkerCard from "../../components/services/WorkerCard";
import worker from "../../assets/images/worker-card.jpg";

const CategoryService = () => {
  const [openDropdown, setOpenDropdown] = React.useState(null);

  const handleDropdownToggle = (dropdownId) => {
    setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
  };

  const dummyWorkers = [
    {
      id: 1,
      name: "Ali Hassan",
      image: worker,
      rating: 4.9,
      reviews: 172,
      available: true,
      experience: "8 Years",
      distance: "1.2 Km",
      bio: "Expert in pipe repair, installations & emergency fixes",
      skills: ["Emergency Repair", "Pipe Installation", "Leak Detection"],
      jobsCompleted: 245,
      rate: 45,
    },
    {
      id: 2,
      name: "Mohammed Said",
      image: worker,
      rating: 4.7,
      reviews: 89,
      available: true,
      experience: "5 Years",
      distance: "2.1 Km",
      bio: "Specialized in bathroom and kitchen plumbing solutions",
      skills: ["Bathroom Fitting", "Kitchen Plumbing", "Water Heater"],
      jobsCompleted: 156,
      rate: 40,
    },
    {
      id: 3,
      name: "John Mwamba",
      image: worker,
      rating: 4.8,
      reviews: 203,
      available: false,
      experience: "12 Years",
      distance: "0.8 Km",
      bio: "Professional plumber with expertise in commercial projects",
      skills: ["Commercial Plumbing", "Drain Cleaning", "Pipe Repair"],
      jobsCompleted: 387,
      rate: 55,
    },
    {
      id: 4,
      name: "Grace Kimani",
      image: worker,
      rating: 4.6,
      reviews: 134,
      available: true,
      experience: "6 Years",
      distance: "3.5 Km",
      bio: "Reliable plumber specializing in residential services",
      skills: ["Residential Plumbing", "Fixture Installation", "Maintenance"],
      jobsCompleted: 198,
      rate: 42,
    },
    {
      id: 5,
      name: "David Mpesa",
      image: worker,
      rating: 4.9,
      reviews: 298,
      available: true,
      experience: "10 Years",
      distance: "1.7 Km",
      bio: "Expert plumber with 24/7 emergency service availability",
      skills: ["Emergency Service", "Sewer Line", "Water Systems"],
      jobsCompleted: 456,
      rate: 50,
    },
    {
      id: 6,
      name: "Sarah Muthoni",
      image: worker,
      rating: 4.5,
      reviews: 76,
      available: true,
      experience: "4 Years",
      distance: "2.9 Km",
      bio: "Young professional with modern plumbing techniques",
      skills: ["Modern Techniques", "Eco-friendly Solutions", "Smart Fixtures"],
      jobsCompleted: 123,
      rate: 38,
    },
  ];
  return (
    <>
      <Hero
        place="category"
        title="Plumbing Services"
        subtitle="Choose from trusted workers near you"
      />
      <div className="max-w-6xl mx-auto mb-2 px-4 sm:px-6 lg:px-8 text-neutral-500 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <h2 className="order-2 sm:order-1">
          Found {dummyWorkers.length} workers for plumbing services
        </h2>
        <div className="order-1 sm:order-2 flex items-center gap-2 justify-start sm:justify-center w-full sm:w-auto">
          <h2 className="text-xs sm:text-sm">Sort by:</h2>
          <div className="min-w-0 flex-1 sm:flex-none sm:w-40 md:w-48">
            <Dropdown
              className="w-full text-neutral-500 text-xs"
              placeholder="Select Price"
              options={["Price: Low to High", "Price: High to Low"]}
              isOpen={openDropdown === "locations"}
              onToggle={() => handleDropdownToggle("locations")}
              onSelect={(value) => console.log("Location:", value)}
            />
          </div>
        </div>
      </div>

      <div className="mx-4 lg:mx-0">
        <hr className="border-[1px] border-t border-gray-200" />
      </div>

      <div className="my-6 sm:my-8 md:my-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6 place-items-center md:place-items-stretch">
          {dummyWorkers.map((worker) => (
            <WorkerCard
              key={worker.id}
              name={worker.name}
              image={worker.image}
              rating={worker.rating}
              reviews={worker.reviews}
              available={worker.available}
              experience={worker.experience}
              distance={worker.distance}
              bio={worker.bio}
              skills={worker.skills}
              jobsCompleted={worker.jobsCompleted}
              rate={worker.rate}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoryService;
