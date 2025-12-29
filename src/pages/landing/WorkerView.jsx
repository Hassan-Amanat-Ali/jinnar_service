import {
  ArrowLeft,
  Star,
  MapPin,
  Languages,
  MessageCircle,
  Award,
  Clock,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPublicProfileQuery } from "../../services/workerApi";
import { getFullImageUrl, reverseGeocode } from "../../utils/fileUrl.js";
import { useEffect, useState } from "react";
import OptimizedImage from "../../components/common/OptimizedImage";

/* ---------------- Rating Stars ---------------- */

const RatingStars = ({ value = 5, outOf = 5, size = 16 }) => {
  const stars = Array.from({ length: outOf }, (_, i) => i < Math.round(value));
  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      {stars.map((filled, i) => (
        <Star
          key={i}
          size={size}
          className={
            filled ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }
        />
      ))}
    </div>
  );
};

/* ---------------- Portfolio Thumb ---------------- */
const Thumb = ({ src, alt }) => (
  <figure className="aspect-video w-full overflow-hidden rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50 hover:shadow-md transition-shadow duration-200">
    <OptimizedImage 
      src={src} 
      alt={alt} 
      className="h-full w-full object-cover" 
      fallbackSrc="https://via.placeholder.com/400x225"
    />
  </figure>
);

/* ---------------- Main Component ---------------- */
const WorkerView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading, error } = useGetPublicProfileQuery(id);
  console.log(data);

  const [location, setLocation] = useState(null);

  useEffect(() => {
    setLocation(reverseGeocode(data?.profile?.selectedAreas.coordinates));
  }, [data]);

  /* ---------------- Loading State ---------------- */
  if (isLoading) {
    return (
      <main className="section-container pt-20 sm:pt-24 pb-4 sm:pb-6 max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Top nav skeleton */}
        <nav className="relative flex items-center justify-between mb-4 sm:mb-6">
          <div className="h-3 sm:h-4 w-24 sm:w-32 bg-gray-200 rounded animate-pulse" />
          <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 h-4 sm:h-5 w-32 sm:w-40 bg-gray-200 rounded animate-pulse" />
          <div className="w-[80px] sm:w-[120px]" />
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* -------- Sidebar Skeleton -------- */}
          <aside className="lg:col-span-1">
            <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gray-200 animate-pulse" />

                {/* Name */}
                <div className="mt-2 sm:mt-3 h-4 sm:h-5 w-28 sm:w-32 bg-gray-200 rounded animate-pulse" />

                {/* Rating */}
                <div className="mt-1.5 sm:mt-2 h-3 sm:h-4 w-32 sm:w-40 bg-gray-200 rounded animate-pulse" />

                {/* Pills */}
                <div className="mt-3 sm:mt-4 w-full space-y-1.5 sm:space-y-2">
                  <div className="h-9 sm:h-10 w-full bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-9 sm:h-10 w-full bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-9 sm:h-10 w-full bg-gray-200 rounded-full animate-pulse" />
                </div>

                {/* Message button */}
                <div className="mt-4 sm:mt-6 h-11 sm:h-12 w-full bg-gray-200 rounded-lg animate-pulse" />

                {/* Stats */}
                <div className="mt-3 sm:mt-4 h-14 sm:h-16 w-full bg-gray-200 rounded-xl animate-pulse" />
              </div>
            </div>
          </aside>

          {/* -------- Main Content Skeleton -------- */}
          <section className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* About */}
            <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
              <div className="h-4 sm:h-5 w-20 sm:w-24 bg-gray-200 rounded animate-pulse" />
              <div className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2">
                <div className="h-3 sm:h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-3 sm:h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-3 sm:h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Skills */}
            <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
              <div className="h-4 sm:h-5 w-16 sm:w-20 bg-gray-200 rounded animate-pulse" />
              <div className="mt-3 sm:mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="h-24 sm:h-28 bg-gray-200 rounded-lg sm:rounded-xl animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* Portfolio */}
            <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
              <div className="h-4 sm:h-5 w-20 sm:w-24 bg-gray-200 rounded animate-pulse" />
              <div className="mt-3 sm:mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-video bg-gray-200 rounded-lg sm:rounded-xl animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
              <div className="h-4 sm:h-5 w-24 sm:w-32 bg-gray-200 rounded animate-pulse" />
              <div className="mt-3 sm:mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-20 sm:h-24 bg-gray-200 rounded-lg sm:rounded-xl animate-pulse"
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  /* ---------------- Error State ---------------- */
  if (error || !data?.profile) {
    return (
      <main className="section-container pt-20 sm:pt-24 max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-sm sm:text-base text-red-600 mb-2">Failed to load profile</p>
          <button
            onClick={() => navigate(-1)}
            className="text-sm sm:text-base text-[#74C7F2] hover:underline font-medium"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  const profile = data.profile;

  return (
    <main className="section-container pt-20 sm:pt-24 pb-4 sm:pb-6 max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-10">
      {/* ---------------- Top Navigation ---------------- */}
      <nav className="relative flex items-center justify-between mb-4 sm:mb-6">
        <button
          type="button"
          className="inline-flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-[#74C7F2] font-medium hover:text-[#5AB3E0] transition-colors min-h-[44px] -ml-2 pl-2 pr-3"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} className="flex-shrink-0" />
          <span className="hidden xs:inline">Back to Services</span>
          <span className="xs:hidden">Back</span>
        </button>

        <h1 className="hidden sm:block absolute left-1/2 -translate-x-1/2 text-lg sm:text-xl font-semibold text-gray-900">
          Worker Profile
        </h1>

        <div className="w-[80px] sm:w-[120px]" />
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* ---------------- Sidebar ---------------- */}
        <aside className="lg:col-span-1">
          <div className="rounded-xl sm:rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 lg:p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <OptimizedImage
                src={profile.profilePicture}
                alt={profile.name}
                className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                fallbackSrc="https://via.placeholder.com/150"
              />

              <h2 className="mt-2.5 sm:mt-3 text-base sm:text-lg lg:text-xl font-semibold text-gray-900 px-2">{profile.name}</h2>

              <div className="mt-1.5 sm:mt-2 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                <RatingStars value={profile.rating?.average || 0} size={14} />
                <span className="text-xs sm:text-sm text-gray-600 font-medium">
                  {profile.rating?.average?.toFixed(1) || "0.0"}
                </span>
                <span className="text-gray-400">·</span>
                <span className="text-xs sm:text-sm text-gray-500">
                  {profile.rating?.count || 0} reviews
                </span>
              </div>

              <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2 w-full">
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 bg-[#74C7F2] text-white rounded-full py-2 sm:py-2.5 px-3 text-xs sm:text-sm font-medium shadow-sm">
                  <Award size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>{profile.yearsOfExperience || 0} yrs Experience</span>
                </div>

                {profile.languages?.length > 0 && (
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 bg-gray-100 text-gray-700 rounded-full py-2 sm:py-2.5 px-3 text-xs sm:text-sm font-medium">
                    <Languages size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{profile.languages.join(", ")}</span>
                  </div>
                )}

                {profile.selectedAreas?.length > 0 && (
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 bg-gray-100 text-gray-700 rounded-full py-2 sm:py-2.5 px-3 text-xs sm:text-sm font-medium">
                    <MapPin size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{location}</span>
                  </div>
                )}
              </div>

              <button
                className="mt-4 sm:mt-6 w-full border-2 border-[#74C7F2] text-[#74C7F2] py-2.5 sm:py-3 rounded-lg sm:rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base font-semibold hover:bg-[#74C7F2] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md min-h-[44px]"
                onClick={() =>
                  navigate(`/customer-chat?conversation=${profile._id || id}`)
                }
              >
                <MessageCircle size={18} className="flex-shrink-0" />
                <span>Message</span>
              </button>

              <div className="mt-3 sm:mt-4 flex justify-around w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl py-3 sm:py-4 shadow-inner">
                <div className="text-center px-2">
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{profile.ordersCompleted || 0}</p>
                  <p className="text-[10px] sm:text-xs text-gray-600 font-medium mt-0.5">Jobs Done</p>
                </div>
                <div className="w-px bg-gray-300"></div>
                <div className="text-center px-2">
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{profile.rating?.count || 0}</p>
                  <p className="text-[10px] sm:text-xs text-gray-600 font-medium mt-0.5">Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ---------------- Main Content ---------------- */}
        <section className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* About */}
          <div className="rounded-xl sm:rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 lg:p-6 shadow-sm">
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">About Me</h2>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-700 leading-relaxed">
              {profile.bio || "No bio available"}
            </p>
          </div>

          {/* Skills */}
          {profile.skills?.length > 0 && (
            <div className="rounded-xl sm:rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 lg:p-6 shadow-sm">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">Skills</h2>
              <div className="mt-3 sm:mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {profile.skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#74C7F2] text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                      {skill[0].toUpperCase()}
                    </div>
                    <span className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-800 uppercase text-center leading-tight">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio */}
          {profile.portfolioImages?.length > 0 && (
            <div className="rounded-xl sm:rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 lg:p-6 shadow-sm">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">Portfolio</h2>
              <div className="mt-3 sm:mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                {profile.portfolioImages.map((img, idx) => (
                  <Thumb
                    key={idx}
                    src={img.url}
                    alt={`Work ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Availability */}
          {profile.availability?.length > 0 && (
            <div className="rounded-xl sm:rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 lg:p-6 shadow-sm">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">Availability</h2>
              <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {profile.availability.map((slot, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
                      <Clock size={14} className="sm:w-4 sm:h-4 text-[#74C7F2] flex-shrink-0" />
                      <span className="font-semibold text-sm sm:text-base text-gray-900">{slot.day}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {slot.timeSlots.map((t, i) => (
                        <span
                          key={i}
                          className="bg-white px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium text-gray-700 shadow-sm border border-gray-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default WorkerView;
