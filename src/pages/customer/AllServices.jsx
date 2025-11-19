import Hero from "../../components/common/Hero";
import Nav from "../../components/services/Nav";
import WorkerCard from "../../components/services/WorkerCard";
import { useGetAllGigsQuery } from "../../services/workerApi";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

const AllServices = () => {
  const { data, isLoading, error } = useGetAllGigsQuery();
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");
  const location = searchParams.get("location");

  // Skeleton Component
  const Skeleton = ({ className = "" }) => (
    <div className={`bg-gray-200 rounded animate-pulse ${className}`}>
      <div className="shimmer"></div>
    </div>
  );

  // Transform API data to match WorkerCard component format with gig info
  const allGigsData = useMemo(
    () =>
      data?.gigs?.map((gig) => {
        const mappedGig = {
          id: gig._id,
          gigId: gig._id,
          sellerId: gig.sellerId?._id,
          name: gig.title, // Using gig title as the main name
          image: gig.images?.[0]?.url || "https://via.placeholder.com/300x200",
          rating: gig.sellerId?.rating?.average || 0,
          reviews: gig.sellerId?.rating?.count || 0,
          available: true,
          experience: gig.sellerId?.yearsOfExperience || 0,
          distance:
            gig.pricing?.method === "negotiable"
              ? "Negotiable"
              : gig.pricing?.method === "hourly"
              ? `TZS ${gig.pricing?.price}/hr`
              : `TZS ${gig.pricing?.price}`,
          bio: gig.description,
          skills: gig.sellerId?.skills?.slice(0, 4) || [],
          jobsCompleted: gig.sellerId?.ordersCompleted || 0,
          rate:
            gig.pricing?.method === "negotiable"
              ? "Negotiable"
              : gig.pricing?.price || 0,
          sellerSkills: gig.sellerId?.skills || [],
          sellerAreas: gig.sellerId?.selectedAreas || [],
        };
        return mappedGig;
      }) || [],
    [data]
  );

  // Filter gigs based on search params
  const gigsData = useMemo(() => {
    let filtered = allGigsData;

    // Filter by category (skill)
    if (category) {
      filtered = filtered.filter((gig) => {
        const categoryLower = category.toLowerCase();
        return (
          gig.name.toLowerCase().includes(categoryLower) ||
          gig.sellerSkills.some((skill) =>
            skill.toLowerCase().includes(categoryLower)
          ) ||
          gig.bio?.toLowerCase().includes(categoryLower)
        );
      });
    }

    // Filter by location (if you have location data in your gigs)
    if (location) {
      filtered = filtered.filter((gig) => {
        const locationLower = location.toLowerCase();
        return (
          gig.sellerAreas?.some((area) =>
            area.name?.toLowerCase().includes(locationLower)
          ) || gig.bio?.toLowerCase().includes(locationLower)
        );
      });
    }

    return filtered;
  }, [allGigsData, category, location]);

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        .shimmer {
          animation: shimmer 2s infinite;
          background: linear-gradient(
            to right,
            transparent 0%,
            rgba(255, 255, 255, 0.6) 50%,
            transparent 100%
          );
          background-size: 1000px 100%;
        }
      `}</style>

      <Hero className="h-88 lg:h-140" />
      <Nav />

      <div className="my-6 mt-16 max-w-[1200px] mx-auto">
        {/* Search Info */}
        {(category || location) && (
          <div className="mb-6 flex flex-wrap items-center gap-5">
            <span className="text-gray-700 font-medium">
              Showing results for:
            </span>
            {category && (
              <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
            )}
            {location && (
              <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium">
                {location}
              </span>
            )}
            <button
              onClick={() => (window.location.href = "/services")}
              className="text-gray-500 hover:text-gray-700 text-sm underline ml-2"
            >
              Clear filters
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6 place-items-center md:place-items-stretch">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex flex-col w-full max-w-sm rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
              >
                {/* Header with Avatar and Info */}
                <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3.5 flex-shrink-0">
                  {/* Avatar Skeleton */}
                  <Skeleton className="h-12 w-12 rounded-full" />

                  <div className="flex-1 min-w-0">
                    {/* Name Skeleton */}
                    <Skeleton className="h-5 w-32 mb-2" />
                    {/* Rating Skeleton */}
                    <Skeleton className="h-4 w-24" />
                  </div>

                  {/* Status Badge Skeleton */}
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                {/* Info Grid Skeleton */}
                <div className="grid grid-cols-2 gap-3 border-b border-gray-100 bg-gray-50/50 px-4 py-3 text-sm flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>

                {/* Bio Section Skeleton */}
                <div className="px-4 mt-3.5 h-10 overflow-hidden flex-shrink-0">
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-5/6" />
                </div>

                {/* Skills Section Skeleton */}
                <div className="h-16 mt-2.5 overflow-hidden px-4 flex-shrink-0">
                  <Skeleton className="h-4 w-16 mb-2" />
                  <div className="flex flex-wrap gap-1.5">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                    <Skeleton className="h-6 w-18 rounded-full" />
                  </div>
                </div>

                {/* Stats Section Skeleton */}
                <div className="mt-auto flex items-center justify-between border-y border-gray-100 bg-gray-50/50 px-4 py-3 text-sm flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-5 w-20 rounded" />
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex gap-2 px-4 py-3.5 flex-shrink-0">
                  <Skeleton className="h-10 flex-1 rounded-lg" />
                  <Skeleton className="h-10 flex-1 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-2">Failed to load services</p>
            <p className="text-gray-500">
              {error?.data?.error || "Please try again later"}
            </p>
          </div>
        ) : gigsData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-2">No services available</p>
            <p className="text-gray-500">Check back later for new services</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6 place-items-center md:place-items-stretch">
            {gigsData.map((gig) => (
              <WorkerCard
                key={gig.id}
                gigId={gig.gigId}
                sellerId={gig.sellerId}
                name={gig.name}
                image={gig.image}
                rating={gig.rating}
                reviews={gig.reviews}
                available={gig.available}
                experience={gig.experience}
                distance={gig.distance}
                bio={gig.bio}
                skills={gig.skills}
                jobsCompleted={gig.jobsCompleted}
                rate={gig.rate}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AllServices;
