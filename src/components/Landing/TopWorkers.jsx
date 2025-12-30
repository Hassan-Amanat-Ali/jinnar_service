import { useNavigate } from "react-router-dom";
import { useFindWorkersQuery } from "../../services/workerApi";
import Button from "../common/Button";
import OptimizedImage from "../common/OptimizedImage";
import star from "../../assets/icons/star.png";

const TopWorkers = ({ isLanding }) => {
  const navigate = useNavigate();

  const {
    data: apiData,
    isLoading,
    isError,
  } = useFindWorkersQuery({
    sortBy: "rating.average",
    sortOrder: "desc",
    limit: 4,
  });

  const workers = apiData?.data || [];


  return (
    <section id="top-workers" className="py-8 md:py-10 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center mb-2">
          Meet Our Top Rated Workers
        </h2>
        <p className="text-center mb-6 md:mb-8 text-sm sm:text-base text-gray-600">
          Verified professionals with proven skills and excellent ratings.
        </p>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200 animate-pulse"
              >
                <div className="flex justify-center mb-4">
                  <div className="h-24 w-24 rounded-full bg-gray-200" />
                </div>
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto mb-4" />
                <div className="h-8 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && !isLoading && (
          <div className="text-center py-10 text-gray-500">
            Failed to load workers. Please try again later.
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && workers.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No workers found.
          </div>
        )}

        {/* Workers */}
        {!isLoading && !isError && workers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {workers.map((worker) => {
              const rating =
                typeof worker.rating === "number"
                  ? worker.rating
                  : worker.rating?.average || 0;

              return (
                <div
                  key={worker._id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 sm:p-6 border border-neutral-200"
                >
                  {/* Image */}
                  <div className="flex justify-center mb-4">
                    <OptimizedImage
                      src={worker.profilePicture}
                      alt={worker.name || "Worker profile"}
                      fallbackSrc="/placeholder-avatar.jpg"
                      className="rounded-full h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 object-cover border-4 border-blue-100"
                    />
                  </div>

                  {/* Name */}
                  <h3 className="text-center font-semibold text-base sm:text-lg mb-2">
                    {worker.name || "Unnamed Worker"}
                  </h3>

                  {/* Profession & Rating */}
                  <div className="flex justify-center items-center gap-2 mb-3">
                    <span className="text-xs text-center text-gray-600 capitalize">
                      {worker.categories?.[0]?.name
                        ? worker.categories[0].name.split(",")[0].trim()
                        : worker.skills?.[0] || "Professional"}
                    </span>

                    <div className="bg-gray-300 h-4 w-px" />
                    <div className="flex items-center gap-1">
                      <img src={star} alt="star" className="h-4 w-4" />
                      <span className="text-xs text-gray-700">
                        {rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="min-h-[42px]">
                    {worker.skills?.length > 0 && (
                      <div className="flex justify-center mb-4 capitalize">
                        <div className="flex flex-wrap gap-2 justify-center">
                          {worker.skills.slice(0, 2).map((skill, index) => (
                            <span
                              key={index}
                              className="bg-[#D9F2FF] rounded-full px-3 py-1 text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Button */}
                  <div className="flex justify-center">
                    <button
                      className="border border-[#74C7F2] text-[#74C7F2] hover:bg-[#74C7F2] hover:text-black transition-colors duration-300 text-xs px-6 py-1 rounded-md font-medium w-full sm:w-auto"
                      onClick={() =>
                        navigate(
                          isLanding
                     ?    `/landing-worker-profile/${worker.id}`
                            : `/worker-profile/${worker.id}`
                        )
                      }
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All */}
        <div className="text-center mt-8" onClick={() => navigate(`${isLanding ? "landing-workers" : "workers"}`)}>
          <Button title="View All Workers" />
        </div>
      </div>
    </section>
  );
};

export default TopWorkers;
