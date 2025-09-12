import worker from "../../assets/images/worker.jpg";
import worker2 from "../../assets/images/worker2.jpg";
import worker3 from "../../assets/images/worker3.jpg";
import worker4 from "../../assets/images/worker4.jpg";
import star from "../../assets/icons/star.png";
import Button from "../common/Button";

const TopWorkers = () => {
  const workers = [
    {
      id: 1,
      name: "John Mwangi",
      profession: "Electrician",
      rating: 4.8,
      image: worker, // Replace with actual worker image
      skills: ["Wiring", "Lighting"],
    },
    {
      id: 2,
      name: "Sarah Kimani",
      profession: "Plumber",
      rating: 4.9,
      image: worker2, // Replace with actual worker image
      skills: ["Repairs", "Installation"],
    },
    {
      id: 3,
      name: "David Njoroge",
      profession: "Carpenter",
      rating: 4.7,
      image: worker3, // Replace with actual worker image
      skills: ["Furniture", "Repairs"],
    },
    {
      id: 4,
      name: "Grace Wanjiku",
      profession: "Painter",
      rating: 4.8,
      image: worker4, // Replace with actual worker image
      skills: ["Interior", "Exterior"],
    },
  ];

  return (
    <section className="py-8 md:py-10 lg:py-12 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 xl:px-10">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center mb-2">
          Meet Our Top Rated Workers
        </h2>
        <p className="text-center mb-6 md:mb-8 text-sm sm:text-base text-gray-600">
          Verified professionals with proven skills and excellent ratings.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 ">
          {workers.map((worker) => (
            <div
              key={worker.id}
              className="bg-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 sm:p-6 border border-neutral-200"
            >
              {/* Worker Image */}
              <div className="w-full flex justify-center mb-4">
                <img
                  src={worker.image}
                  alt={worker.name}
                  className="rounded-full h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 object-cover border-4 border-blue-100"
                />
              </div>

              {/* Worker Name */}
              <h3 className="text-center font-semibold text-base sm:text-lg mb-2">
                {worker.name}
              </h3>

              {/* Profession and Rating */}
              <div className="flex justify-center items-center gap-2 mb-3">
                <span className="text-sm text-gray-600">
                  {worker.profession}
                </span>
                <div className="bg-gray-300 h-4 w-[1px]"></div>
                <div className="flex items-center gap-1">
                  <img
                    src={star}
                    alt="star"
                    className="h-3 w-3 sm:h-4 sm:w-4 object-cover"
                  />
                  <span className="text-xs text-gray-700">{worker.rating}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="flex justify-center mb-4">
                <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                  {worker.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-[#D9F2FF] rounded-full px-2 sm:px-3 py-1 text-xs "
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* View Profile Button */}
              <div className="flex justify-center">
                <button className="border-1 border-[#74C7F2] text-[#74C7F2] hover:bg-[#74C7F2] hover:text-black transition-colors duration-300 text-xs px-4 sm:px-6 lg:px-8 py-1 rounded-md font-medium w-full sm:w-auto">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Workers Button */}
        <div className="text-center mt-8">
          <Button title="View All Workers" />
        </div>
      </div>
    </section>
  );
};

export default TopWorkers;
