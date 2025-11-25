import worker from "../../assets/images/worker.jpg";
import worker2 from "../../assets/images/worker2.jpg";
import worker3 from "../../assets/images/worker3.jpg";
import worker4 from "../../assets/images/worker4.jpg";
import star from "../../assets/icons/star.png";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";
import { useFindWorkersQuery } from "../../services/workerApi";

const TopWorkers = () => {
  const navigate = useNavigate();

  // Fetch workers using the API
  const {
    data: apiData,
    isLoading,
    error,
  } = useFindWorkersQuery({
    sortBy: "rating.average",
    sortOrder: "desc",
    limit: 4,
  });

  // Fallback data for when no workers are provided
  const fallbackWorkers = [
    {
      id: 1,
      name: "John Mwangi",
      profession: "Electrician",
      rating: 4.8,
      image: worker,
      skills: ["Wiring", "Lighting"],
    },
    {
      id: 2,
      name: "Sarah Kimani",
      profession: "Plumber",
      rating: 4.9,
      image: worker2,
      skills: ["Repairs", "Installation"],
    },
    {
      id: 3,
      name: "David Njoroge",
      profession: "Carpenter",
      rating: 4.7,
      image: worker3,
      skills: ["Furniture", "Repairs"],
    },
    {
      id: 4,
      name: "Grace Wanjiku",
      profession: "Painter",
      rating: 4.8,
      image: worker4,
      skills: ["Interior", "Exterior"],
    },
  ];

  // Transform API workers data for display
  const displayWorkers = apiData?.data || [];
  const workersToShow =
    displayWorkers.length > 0
      ? displayWorkers.map((worker) => ({
          id: worker._id,
          name: worker.name || "Unknown Worker",
          profession: worker.skills?.[0] || "Professional",
          rating: worker.rating?.average || 4.5,
          image:
            worker.profilePicture ||
            worker.profileImage?.url ||
            fallbackWorkers[0].image,
          skills: worker.skills?.slice(0, 2) || ["Professional"],
        }))
      : fallbackWorkers;

  return (
    <section id="top-workers" className="py-8 md:py-10 lg:py-12 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 ">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center mb-2">
          Meet Our Top Rated Workers
        </h2>
        <p className="text-center mb-6 md:mb-8 text-sm sm:text-base text-gray-600">
          Verified professionals with proven skills and excellent ratings.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 ">
          {isLoading ? (
            // Loading skeletons
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-neutral-200 animate-pulse"
              >
                <div className="w-full flex justify-center mb-4">
                  <div className="rounded-full h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 bg-gray-200"></div>
                </div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-3 rounded mb-3 w-3/4 mx-auto"></div>
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-200 h-6 rounded w-20"></div>
                </div>
                <div className="bg-gray-200 h-8 rounded"></div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">
                Failed to load workers. Using sample data.
              </p>
            </div>
          ) : (
            workersToShow.map((worker) => (
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
                    <span className="text-xs text-gray-700">
                      {worker.rating}
                    </span>
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
                  <button
                    className="border-1 border-[#74C7F2] text-[#74C7F2] hover:bg-[#74C7F2] hover:text-black transition-colors duration-300 text-xs px-4 sm:px-6 lg:px-8 py-1 rounded-md font-medium w-full sm:w-auto cursor-pointer"
                    onClick={() => {
                      navigate(`/worker-profile/${worker.id}`);
                    }}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* View All Workers Button */}
        <div
          className="text-center mt-8"
          onClick={() => {
            window.location.href = "/landing-services";
          }}
        >
          <Button title="View All Workers" />
        </div>
      </div>
    </section>
  );
};

export default TopWorkers;
