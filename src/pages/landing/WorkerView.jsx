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

/* ---------------- Rating Stars ---------------- */

const RatingStars = ({ value = 5, outOf = 5, size = 16 }) => {
  const stars = Array.from({ length: outOf }, (_, i) => i < Math.round(value));
  return (
    <div className="flex items-center gap-1">
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
  <figure className="aspect-video w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
    <img src={src} alt={alt} className="h-full w-full object-cover" />
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
      <main className="section-container pt-24 pb-6 max-w-7xl px-10">
        {/* Top nav skeleton */}
        <nav className="relative flex items-center justify-between mb-6">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="absolute left-1/2 -translate-x-1/2 h-5 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="w-[120px]" />
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* -------- Sidebar Skeleton -------- */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="h-24 w-24 rounded-full bg-gray-200 animate-pulse" />

                {/* Name */}
                <div className="mt-3 h-5 w-32 bg-gray-200 rounded animate-pulse" />

                {/* Rating */}
                <div className="mt-2 h-4 w-40 bg-gray-200 rounded animate-pulse" />

                {/* Pills */}
                <div className="mt-4 w-full space-y-2">
                  <div className="h-10 w-full bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-10 w-full bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-10 w-full bg-gray-200 rounded-full animate-pulse" />
                </div>

                {/* Message button */}
                <div className="mt-6 h-12 w-full bg-gray-200 rounded-md animate-pulse" />

                {/* Stats */}
                <div className="mt-4 h-16 w-full bg-gray-200 rounded-xl animate-pulse" />
              </div>
            </div>
          </aside>

          {/* -------- Main Content Skeleton -------- */}
          <section className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="mt-3 space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Skills */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="h-28 bg-gray-200 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* Portfolio */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-video bg-gray-200 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-24 bg-gray-200 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-[#FFFBEA] p-5 rounded-xl">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
              <div className="mt-6 h-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </section>
        </div>
      </main>
    );
  }

  /* ---------------- Error State ---------------- */
  if (error || !data?.profile) {
    return (
      <main className="section-container pt-24 max-w-7xl px-10">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-red-600 mb-2">Failed to load profile</p>
          <button
            onClick={() => navigate(-1)}
            className="text-[#74C7F2] hover:underline"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  const profile = data.profile;

  return (
    <main className="section-container pt-24 pb-6 max-w-7xl px-10">
      {/* ---------------- Top Navigation ---------------- */}
      <nav className="relative flex items-center justify-between mb-6">
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm text-[#74C7F2]"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
          Back to Services
        </button>

        <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold">
          Worker Profile
        </h1>

        <div className="w-[120px]" />
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ---------------- Sidebar ---------------- */}
        <aside className="lg:col-span-1">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
            <div className="flex flex-col items-center text-center">
              <img
                src={getFullImageUrl(
                  profile.profilePicture || "https://via.placeholder.com/150"
                )}
                alt={profile.name}
                className="h-24 w-24 rounded-full object-cover border"
              />

              <h2 className="mt-3 text-lg font-semibold">{profile.name}</h2>

              <div className="mt-1 flex items-center gap-2">
                <RatingStars value={profile.rating?.average || 0} />
                <span className="text-sm text-gray-600">
                  {profile.rating?.average?.toFixed(1) || "0.0"} ·{" "}
                  {profile.rating?.count || 0} reviews
                </span>
              </div>

              <div className="mt-4 space-y-2 w-full">
                <div className="flex items-center justify-center gap-2 bg-[#74C7F2] text-white rounded-full py-2 text-sm">
                  <Award size={16} />
                  {profile.yearsOfExperience || 0} yrs Experience
                </div>

                {profile.languages?.length > 0 && (
                  <div className="flex items-center justify-center gap-2 bg-gray-100 rounded-full py-2 text-sm">
                    <Languages size={16} />
                    {profile.languages.join(", ")}
                  </div>
                )}

                {profile.selectedAreas?.length > 0 && (
                  <div className="flex items-center justify-center gap-2 bg-gray-100 rounded-full py-2 text-sm">
                    <MapPin size={16} />
                    {location}
                  </div>
                )}
              </div>

              <button
                className="mt-6 w-full border border-[#74C7F2] text-[#74C7F2] py-3 rounded-md flex items-center justify-center gap-2"
                onClick={() =>
                  navigate(`/customer-chat?conversation=${profile._id || id}`)
                }
              >
                <MessageCircle size={18} /> Message
              </button>

              <div className="mt-4 flex justify-around w-full bg-gray-50 rounded-xl py-3">
                <div className="text-center">
                  <p className="font-bold">{profile.ordersCompleted || 0}</p>
                  <p className="text-xs text-gray-500">Jobs</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">{profile.rating?.count || 0}</p>
                  <p className="text-xs text-gray-500">Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ---------------- Main Content ---------------- */}
        <section className="lg:col-span-2 space-y-6">
          {/* About */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
            <h2 className="text-lg font-bold">About Me</h2>
            <p className="mt-3 text-gray-700">
              {profile.bio || "No bio available"}
            </p>
          </div>

          {/* Skills */}
          {profile.skills?.length > 0 && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <h2 className="text-lg font-bold">Skills</h2>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {profile.skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center bg-blue-50 rounded-xl p-4"
                  >
                    <div className="w-12 h-12 bg-[#74C7F2] text-white rounded-full flex items-center justify-center font-bold">
                      {skill[0].toUpperCase()}
                    </div>
                    <span className="mt-2 text-sm uppercase">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio */}
          {profile.portfolioImages?.length > 0 && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <h2 className="text-lg font-bold">Portfolio</h2>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                {profile.portfolioImages.map((img, idx) => (
                  <Thumb
                    key={idx}
                    src={getFullImageUrl(img.url)}
                    alt={`Work ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Availability */}
          {profile.availability?.length > 0 && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <h2 className="text-lg font-bold">Availability</h2>
              <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {profile.availability.map((slot, idx) => (
                  <div
                    key={idx}
                    className="bg-blue-50 rounded-xl p-4 border border-neutral-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={16} />
                      <span className="font-semibold">{slot.day}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {slot.timeSlots.map((t, i) => (
                        <span
                          key={i}
                          className="bg-white px-3 py-1 rounded-full text-xs"
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
