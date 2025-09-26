import Hero from "../../components/common/Hero";
import Nav from "../../components/services/Nav";
import Card from "../common/Card";
import service1 from "../../assets/images/All-services-1.jpg";
import service2 from "../../assets/images/all-services-2.jpg";
import service3 from "../../assets/images/all-services-3.jpg";
import service4 from "../../assets/images/all-services-4.jpg";

const AllServices = () => {
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
    {
      id: 9,
      title: "Carpentry",
      img: service4,
      rating: "4.9",
      description: "Custom furniture, repairs, and wood working services.",
    },
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

  return (
    <>
      <Hero className="h-[22rem] lg:h-[35rem]" />
      <Nav />
      <div className="my-6 mt-16 px-4 sm:px-6 md:px-8 lg:px-4 xl:px-0 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-8 justify-items-center">
          {servicesData.map((service) => (
            <Card
              key={service.id}
              title={service.title}
              img={service.img}
              rating={service.rating}
              description={service.description}
              staritems={true}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default AllServices;
