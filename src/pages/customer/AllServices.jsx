import Hero from "../../components/common/Hero";
import Nav from "../../components/services/Nav";
import WorkerCard from "../../components/services/WorkerCard";
import { useGetAllGigsQuery } from "../../services/workerApi";
import { useGetRecommendedWorkersMutation } from "../../services/recommendationApi";
import { useSearchParams } from "react-router-dom";
import { useMemo, useState, useEffect, useCallback } from "react";

import { Sparkles } from "lucide-react";

const AllServices = () => {
  const { data, isLoading, error } = useGetAllGigsQuery();
  console
  const [
    getRecommendations,
    { data: recommendedData, isLoading: isRecommending },
  ] = useGetRecommendedWorkersMutation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);

  const categoryId = searchParams.get("category");
  const subcategoryId = searchParams.get("subcategory");
  const searchParam = searchParams.get("search");
  const budget = searchParams.get("budget");

  // Initialize search term from URL parameter
  useEffect(() => {
    if (searchParam) {
      setSearchTerm(searchParam);
      setDebouncedSearchTerm(searchParam);
    }
  }, [searchParam]);

  // Debounce search term to improve performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Trigger recommendations when search term changes
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      const jobRequest = {
        title: debouncedSearchTerm,
        description: debouncedSearchTerm,
      };
      getRecommendations(jobRequest);
      setShowRecommendations(true);
    } else {
      setShowRecommendations(false);
    }
  }, [debouncedSearchTerm, getRecommendations]);

  // Handle search input change - will be passed to Hero
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setSearchParams({});
  }, [setSearchParams]);

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
          name: gig.title,
          image: gig.images?.[0]?.url,
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

  // Transform recommended gigs data from the new API response structure
  const recommendedGigsData = useMemo(() => {
    if (!recommendedData) return { topRecommended: [], otherGigs: [] };

    const transformGig = (gig) => ({
      id: gig._id,
      gigId: gig._id,
      sellerId: gig.sellerId?._id,
      name: gig.title,
      image: gig.images?.[0]?.url,
      rating: gig.sellerId?.rating?.average || 0,
      reviews: gig.sellerId?.rating?.count || 0,
      available: true,
      experience: gig.sellerId?.yearsOfExperience || 0,
      distance: gig.pricing?.method === "negotiable" 
        ? "Negotiable" 
        : gig.pricing?.method === "hourly"
        ? `TZS ${gig.pricing?.price}/hr`
        : `TZS ${gig.pricing?.price}`,
      bio: gig.description,
      skills: gig.skills?.slice(0, 4) || [],
      jobsCompleted: gig.sellerId?.ordersCompleted || 0,
      rate: gig.pricing?.method === "negotiable" 
        ? "Negotiable" 
        : gig.pricing?.price || 0,
      sellerSkills: gig.sellerId?.skills || [],
      sellerAreas: gig.sellerId?.selectedAreas || [],
      matchScore: gig.matchScore || 0,
      isRecommended: true,
      isTopRecommended: gig.isTopRecommended || false,
      sellerName: gig.sellerId?.name || "Unknown Seller",
      sellerVerified: gig.sellerId?.isVerified || false,
    });

    return {
      topRecommended: recommendedData.topRecommended?.map(transformGig) || [],
      otherGigs: recommendedData.otherGigs?.map(transformGig) || [],
    };
  }, [recommendedData]);

  // Filter gigs based on search params and search term
  const gigsData = useMemo(() => {
    let filtered = allGigsData;

    // Filter by search term (debounced)
    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase().trim();
      filtered = filtered.filter((gig) => {
        return (
          gig.name.toLowerCase().includes(searchLower) ||
          gig.bio?.toLowerCase().includes(searchLower) ||
          gig.sellerSkills.some((skill) =>
            skill.toLowerCase().includes(searchLower)
          )
        );
      });
    }

    // Filter by category ID
    if (categoryId) {
      filtered = filtered.filter((gig) => {
        return gig.category === categoryId;
      });
    }

    // Filter by subcategory ID
    if (subcategoryId) {
      filtered = filtered.filter((gig) => {
        return gig.subcategories.some((sub) => sub._id === subcategoryId);
      });
    }

    return filtered;
  }, [allGigsData, debouncedSearchTerm, categoryId, subcategoryId]);

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

      <Hero
        className="h-88 lg:h-140"
        onSearchChange={handleSearchChange}
        searchValue={searchTerm}
      />
      <Nav />

      <div className="my-6 mt-16 max-w-[1200px] mx-auto">
        {/* Recommended Gigs Section */}
        {showRecommendations && (recommendedGigsData.topRecommended.length > 0 || recommendedGigsData.otherGigs.length > 0) && (
          <div className="mb-8">
            {/* Simple Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="text-[#74C7F2]" size={20} />
                <h2 className="text-2xl font-bold text-gray-900">
                  Recommended for You
                </h2>
              </div>
              <p className="text-sm text-gray-600">
                Based on your search: "{debouncedSearchTerm}"
              </p>
            </div>

            {isRecommending ? (
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex flex-col w-full max-w-sm rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
                  >
                    <Skeleton className="h-64 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6 place-items-center md:place-items-stretch">
                {/* Render Top Recommended first */}
                {recommendedGigsData.topRecommended.map((gig) => (
                  <div key={gig.id} className="relative">
                    {/* Simple Match Score Badge */}
                    <div className="absolute -top-2 -right-2 z-10 bg-[#74C7F2] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                      {gig.matchScore}% Match
                    </div>

                    <WorkerCard
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
                  </div>
                ))}
                
                {/* Render Other Gigs */}
                {recommendedGigsData.otherGigs.slice(0, 6).map((gig) => (
                  <div key={gig.id} className="relative">
                    {/* Simple Match Score Badge */}
                    <div className="absolute -top-2 -right-2 z-10 bg-[#74C7F2] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                      {gig.matchScore}% Match
                    </div>

                    <WorkerCard
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
                  </div>
                ))}
              </div>
            )}

            {/* Simple Divider */}
            <div className="mt-8 mb-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mt-6">
                All Services
              </h3>
            </div>
          </div>
        )}

        {/* Search results count */}
        {debouncedSearchTerm.trim() && !showRecommendations && (
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">
              {gigsData.length} results found for "{debouncedSearchTerm}"
            </p>
          </div>
        )}



        {/* Search Info */}
        {(categoryId ||
          budget ||
          (debouncedSearchTerm.trim() && !showRecommendations)) && (
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="text-gray-700 text-sm font-medium">
              Showing results for:
            </span>
            {debouncedSearchTerm.trim() && (
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                "{debouncedSearchTerm}"
              </span>
            )}
            {categoryId && (
              <span className="bg-[#B6E0FE] text-gray-700 px-3 py-1 rounded-full text-sm font-medium">Category</span>
            )}
            {budget && (
              <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                {budget}
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-gray-500 hover:text-gray-700 text-sm underline ml-2"
            >
              Clear all filters
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
