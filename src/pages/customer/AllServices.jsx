import Hero from "../../components/common/Hero";
import Nav from "../../components/services/Nav";
import WorkerCard from "../../components/services/WorkerCard";
import { useGetAllGigsQuery } from "../../services/workerApi";
import { useGetRecommendedWorkersMutation } from "../../services/recommendationApi";
import { useSearchParams } from "react-router-dom";
import { useMemo, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

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
  const [userLocation, setUserLocation] = useState(null);

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

  // Get user's current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // Cache location for 5 minutes
        }
      );
    }
  }, []);

  // Handle enable location button click
  const handleEnableLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          toast.success('Location enabled! You can now see exact distances.');
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            toast.error('Location access denied. Please enable it in your browser settings to see distances.', {
              duration: 5000,
            });
          } else if (error.code === error.TIMEOUT) {
            toast.error('Location request timed out. Please try again.', {
              duration: 4000,
            });
          } else {
            toast.error('Unable to get your location. Please try again.', {
              duration: 4000,
            });
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser.', {
        duration: 4000,
      });
    }
  };

  // Helper function to calculate distance using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    // Return formatted distance
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m Away`;
    } else {
      return `${distance.toFixed(1)}km Away`;
    }
  };

  // Skeleton Component
  const Skeleton = ({ className = "" }) => (
    <div className={`bg-gray-200 rounded animate-pulse ${className}`}>
      <div className="shimmer"></div>
    </div>
  );

  // Helper function to format pricing display
  const formatPricing = (pricing) => {
    if (!pricing) return "N/A";
    
    // Check which pricing options are enabled
    const options = [];
    
    if (pricing.fixed?.enabled && pricing.fixed?.price) {
      options.push(`TZS ${pricing.fixed.price.toLocaleString()}`);
    }
    
    if (pricing.hourly?.enabled && pricing.hourly?.rate) {
      options.push(`TZS ${pricing.hourly.rate.toLocaleString()}/hr`);
    }
    
    if (pricing.inspection?.enabled && options.length === 0) {
      return "Inspection Required";
    }
    
    // If multiple options, show the first one with a note
    if (options.length > 1) {
      return `From ${options[0]}`;
    } else if (options.length === 1) {
      return options[0];
    }
    
    return "Contact for pricing";
  };

  // Transform API data to match WorkerCard component format with gig info
  const allGigsData = useMemo(
    () =>
      data?.gigs?.map((gig) => {
        const rate = formatPricing(gig.pricing);
        
        // Calculate distance from user to gig seller
        // Sellers store their work locations in selectedAreas array
        let distance = "Nearby";
        if (userLocation && gig.sellerId?.selectedAreas?.length > 0) {
          const firstArea = gig.sellerId.selectedAreas[0];
          if (firstArea?.coordinates?.length === 2) {
            const [sellerLng, sellerLat] = firstArea.coordinates;
            distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              sellerLat,
              sellerLng
            ) || "Nearby";
          }
        }
        
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
          distance: distance,
          bio: gig.description,
          skills: gig.sellerId?.skills?.slice(0, 4) || [],
          jobsCompleted: gig.sellerId?.ordersCompleted || 0,
          rate: rate,
          sellerSkills: gig.sellerId?.skills || [],
          sellerAreas: gig.sellerId?.selectedAreas || [],
        };
        return mappedGig;
      }) || [],
    [data, userLocation]
  );

  // Transform recommended gigs data from the new API response structure
  const recommendedGigsData = useMemo(() => {
    if (!recommendedData) return { topRecommended: [], otherGigs: [] };

    const transformGig = (gig) => {
      const rate = formatPricing(gig.pricing);
      
      // Calculate distance from user to gig seller
      // Sellers store their work locations in selectedAreas array
      let distance = "Nearby";
      if (userLocation && gig.sellerId?.selectedAreas?.length > 0) {
        const firstArea = gig.sellerId.selectedAreas[0];
        if (firstArea?.coordinates?.length === 2) {
          const [sellerLng, sellerLat] = firstArea.coordinates;
          distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            sellerLat,
            sellerLng
          ) || "Nearby";
        }
      }
      
      return {
        id: gig._id,
        gigId: gig._id,
        sellerId: gig.sellerId?._id,
        name: gig.title,
        image: gig.images?.[0]?.url,
        rating: gig.sellerId?.rating?.average || 0,
        reviews: gig.sellerId?.rating?.count || 0,
        available: true,
        experience: gig.sellerId?.yearsOfExperience || 0,
        distance: distance,
        bio: gig.description,
        skills: gig.skills?.slice(0, 4) || [],
        jobsCompleted: gig.sellerId?.ordersCompleted || 0,
        rate: rate,
        sellerSkills: gig.sellerId?.skills || [],
        sellerAreas: gig.sellerId?.selectedAreas || [],
        matchScore: gig.matchScore || 0,
        isRecommended: true,
        isTopRecommended: gig.isTopRecommended || false,
        sellerName: gig.sellerId?.name || "Unknown Seller",
        sellerVerified: gig.sellerId?.isVerified || false,
      };
    };

    return {
      topRecommended: recommendedData.topRecommended?.map(transformGig) || [],
      otherGigs: recommendedData.otherGigs?.map(transformGig) || [],
    };
  }, [recommendedData, userLocation]);

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
        {/* Location Permission Banner */}
        {!userLocation && (
          <div className="mb-6 bg-gradient-to-r from-[#82CCF4]/10 to-[#82CCF4]/5 border border-[#82CCF4]/30 rounded-lg p-4 flex items-start gap-3 shadow-sm">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-[#82CCF4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Enable Location for Better Results</h3>
              <p className="text-xs text-gray-600 mb-2">
                Allow location access to see exact distances and find services near you.
              </p>
              <button
                onClick={handleEnableLocation}
                className="text-xs font-medium text-[#82CCF4] hover:text-[#74C7F2] underline"
              >
                Enable Location
              </button>
            </div>
          </div>
        )}

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
