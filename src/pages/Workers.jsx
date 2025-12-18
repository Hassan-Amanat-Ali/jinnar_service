import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFindWorkersQuery } from "../services/workerApi";
import { getFullImageUrl } from "../utils/fileUrl.js";
import { Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import star from "../assets/icons/star.png";
import worker from "../assets/images/worker.jpg";
import worker2 from "../assets/images/worker2.jpg";
import worker3 from "../assets/images/worker3.jpg";
import worker4 from "../assets/images/worker4.jpg";
import SiteFooter from "../components/Landing/SiteFooter.jsx"

const Workers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  // Fetch workers using the API
  const {
    data: apiData,
    isLoading,
    error,
  } = useFindWorkersQuery({
    sortBy: "rating.average",
    sortOrder: "desc",
    page,
    limit: itemsPerPage,
  });

  // Fallback data
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
  const shouldUseFallback = !isLoading && !error && displayWorkers.length === 0;
  const workersList = shouldUseFallback ? fallbackWorkers : displayWorkers;

  const mappedWorkers =
    workersList.map((worker) => ({
          id: worker._id || worker.id,
          name: worker.name || "Unknown Worker",
          profession: worker.categories?.[0]?.name || worker.skills?.[0] || worker.profession || "Professional",
          rating: (typeof worker.rating === 'number' ? worker.rating : worker.rating?.average) || 4.5,
          image:
            getFullImageUrl(worker.profilePicture) ||
            getFullImageUrl(worker.profileImage?.url) ||
            (worker.image && typeof worker.image === 'string' && worker.image.startsWith('/') ? worker.image : null) ||
            worker.image ||
            fallbackWorkers[0].image,
          skills: worker.skills?.slice(0, 2) || [],
        }));

  const workersToShow = mappedWorkers.filter((worker) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      worker.name.toLowerCase().includes(term) ||
      worker.profession.toLowerCase().includes(term)
    );
  });

  return (
    <div className="mt-[60px] min-h-screen bg-gray-50 py-8 md:py-12 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find Skilled Workers
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our community of verified professionals ready to help with your next project.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or profession..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-10 py-3 rounded-full border border-gray-300 focus:border-[#74C7F2] focus:ring-2 focus:ring-[#B6E0FE] outline-none transition-all shadow-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {isLoading ? (
            // Loading skeletons
            [...Array(8)].map((_, i) => (
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
            <div className="col-span-full text-center py-12">
              <p className="text-red-500">
                Failed to load workers. Please try again later.
              </p>
            </div>
          ) : (
            <>
              {workersToShow.length > 0 ? (
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
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No workers found matching "{searchTerm}"
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && !error && !shouldUseFallback && displayWorkers.length > 0 && (
          <div className="mt-12 flex justify-center items-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-gray-600 font-medium">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={displayWorkers.length < itemsPerPage}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
       <SiteFooter />
    </div>
    
  );
};

export default Workers;