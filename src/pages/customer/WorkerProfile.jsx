import {
  ArrowLeft,
  Star,
  MapPin,
  Languages,
  MessageCircle,
  CalendarCheck,
  BadgeDollarSign,
  ShieldCheck,
  Wrench,
  Droplets,
  Plug,
  Home,
  Camera,
  Award,
  Clock,
  DollarSign,
  Handshake,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPublicProfileQuery } from "../../services/workerApi";

const RatingStars = ({ value = 5, outOf = 5, size = 16 }) => {
  const stars = Array.from({ length: outOf }, (_, i) => i < Math.round(value));
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${value} out of ${outOf} stars`}
    >
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

const ServiceItem = (props) => {
  const { icon: IconComp, title } = props;
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-[#F3F3F3] p-4 ">
      <div className="rounded-xl bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] p-3 shadow-sm">
        <IconComp className="text-white" size={24} />
      </div>
      <span className="mt-2 text-sm font-medium text-gray-500 text-center">
        {title}
      </span>
    </div>
  );
};

const Thumb = ({ src, alt }) => (
  <figure className="aspect-video w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
    <img src={src} alt={alt} className="h-full w-full object-cover" />
  </figure>
);

const WorkerProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading, error } = useGetPublicProfileQuery(id);

  if (isLoading) {
    return (
      <main className="section-container py-4 md:py-6 lg:py-8 max-w-7xl">
        {/* Back link skeleton */}
        <nav className="relative flex items-center justify-between px-4 mb-5">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="absolute left-1/2 -translate-x-1/2 h-6 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="w-[120px] sm:w-[150px]" />
        </nav>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 w-full">
          {/* Sidebar skeleton */}
          <aside className="grid md:col-span-1 h-fit">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col items-center text-center">
                {/* Avatar skeleton */}
                <div className="h-24 w-24 rounded-full bg-gray-200 animate-pulse" />

                {/* Name skeleton */}
                <div className="mt-3 h-6 w-32 bg-gray-200 rounded animate-pulse" />

                {/* Rating skeleton */}
                <div className="mt-2 h-4 w-40 bg-gray-200 rounded animate-pulse" />

                {/* Badges skeleton */}
                <div className="mt-4 grid w-full grid-cols-1 gap-2">
                  <div className="h-10 w-full bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-10 w-full bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-10 w-full bg-gray-200 rounded-full animate-pulse" />
                </div>

                <div className="h-px w-full mt-10 bg-gray-200" />

                {/* Buttons skeleton */}
                <div className="mt-10 grid w-full grid-cols-1 gap-3">
                  <div className="h-12 w-full bg-gray-200 rounded-md animate-pulse" />
                  <div className="h-12 w-full bg-gray-200 rounded-md animate-pulse" />
                </div>

                {/* Stats skeleton */}
                <div className="mt-4 w-full h-20 bg-gray-100 rounded-xl animate-pulse" />
              </div>
            </div>
          </aside>

          {/* Main content skeleton */}
          <section className="space-y-6 grid md:col-span-2">
            {/* About Me skeleton */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="mt-3 space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Services skeleton */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-28 bg-gray-200 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* Portfolio skeleton */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-video w-full bg-gray-200 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* Availability skeleton */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-gray-200 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* Reviews skeleton */}
            <div className="bg-gray-100 p-5 rounded-xl">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
              <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[280px,1fr]">
                <div className="h-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-32 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (error || !data?.profile) {
    return (
      <main className="section-container py-4 md:py-6 lg:py-8 max-w-7xl">
        <div className="flex flex-col items-center justify-center min-h-screen">
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
    <main className="section-container py-4 md:py-6 lg:py-8 max-w-7xl">
      {/* Back link */}
      <nav
        className="relative flex items-center justify-between px-4 mb-5"
        aria-label="Breadcrumb"
      >
        {/* Left: Back button */}
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm text-[#74C7F2] hover:text-[#469DD7]"
          onClick={() => history.back()}
        >
          <ArrowLeft size={16} />
          <span>Back to Services</span>
        </button>

        {/* Center: Title */}
        <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold tracking-tight text-gray-900">
          Worker Profile
        </h1>

        <div className="w-[120px] sm:w-[150px]" />
      </nav>

      {/* Header */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 w-full">
        {/* Sidebar profile card */}
        <aside
          aria-label="Worker summary"
          className="grid md:col-span-1 h-fit whitespace-nowrap"
        >
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="h-24 w-24 overflow-hidden rounded-full border border-gray-200 shadow-sm">
                <img
                  src={
                    profile.profilePicture || "https://via.placeholder.com/150"
                  }
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <h2 className="mt-3 text-lg font-semibold text-gray-900">
                {profile.name}
              </h2>
              <div className="mt-1 flex items-center gap-2">
                <RatingStars value={profile.rating?.average || 0} />
                <span className="text-sm text-gray-600">
                  {profile.rating?.average?.toFixed(1) || "0.0"} ·{" "}
                  {profile.rating?.count || 0} reviews
                </span>
              </div>

              <div className="mt-4 grid w-full grid-cols-1 gap-2">
                <div className="flex items-center justify-center gap-2 rounded-full bg-[#74C7F2] px-3 py-2.5 text-sm text-white">
                  <Award size={16} className="text-white" />
                  {profile.yearsOfExperience || 0} yrs Experience
                </div>
                {profile.languages && profile.languages.length > 0 && (
                  <div className="flex items-center justify-center gap-2 rounded-full bg-[#E6E6E6] px-3 py-2.5 text-sm text-gray-700">
                    <Languages size={16} className="text-gray-500" />
                    {profile.languages.join(", ")}
                  </div>
                )}
                {profile.selectedAreas && profile.selectedAreas.length > 0 && (
                  <div className="flex items-center justify-center gap-2 rounded-full bg-[#E6E6E6] px-3 py-2.5 text-sm text-gray-700">
                    <MapPin size={16} className="text-gray-500" />
                    {profile.selectedAreas.length} location
                    {profile.selectedAreas.length > 1 ? "s" : ""}
                  </div>
                )}
              </div>
              <hr className="h-10 w-full mt-10 text-gray-300" />

              <div className="mt-10 w-full">
                <button
                  className="w-full justify-center rounded-md border border-[#74C7F2] bg-white px-4 py-3 text-sm font-semibold text-[#74C7F2] shadow-sm hover:bg-gray-50 inline-flex items-center gap-2 cursor-pointer"
                  aria-label="Message Worker"
                  onClick={() => navigate("/chat")}
                >
                  <MessageCircle size={18} /> Message
                </button>
              </div>

              <div className="flex justify-around items-center mt-4 bg-gray-50 rounded-xl p-2 text-xs py-3.5 w-full">
                <div className="text-center">
                  <p className="font-semibold text-lg">
                    {profile.ordersCompleted || 0}
                  </p>
                  <p className="text-gray-500">Jobs Done</p>
                </div>
                <div className="w-px bg-gray-200 h-6" />
                <div className="text-center">
                  <p className="font-semibold text-lg">
                    {profile.rating?.count || 0}
                  </p>
                  <p className="text-gray-500">Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <section className="space-y-6 grid md:col-span-2 ">
          {/* About Me */}
          <section
            aria-labelledby="about-title"
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <h2 id="about-title" className="text-lg font-bold text-gray-900">
              About Me
            </h2>
            <p className="mt-3 text-[16px] leading-6 text-gray-700 ">
              {profile.bio || "No bio available"}
            </p>
          </section>

          {/* Services Offer */}
          {profile.skills && profile.skills.length > 0 && (
            <section
              aria-labelledby="services-title"
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <h2
                id="services-title"
                className="text-lg font-bold text-gray-900"
              >
                Services Offer
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {profile.skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE] p-4 hover:shadow-md transition-all duration-300 border border-[#B6E0FE]/30"
                  >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] flex items-center justify-center shadow-sm mb-3">
                      <span className="text-white text-xl font-bold">
                        {skill.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 text-center uppercase">
                      {skill}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Work Samples */}
          {profile.portfolioImages && profile.portfolioImages.length > 0 && (
            <section
              aria-labelledby="samples-title"
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h2
                  id="samples-title"
                  className="text-lg font-bold text-gray-900"
                >
                  Portfolio
                </h2>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-3">
                {profile.portfolioImages.map((img, idx) => (
                  <Thumb key={idx} src={img.url} alt={`Portfolio ${idx + 1}`} />
                ))}
              </div>
            </section>
          )}

          {/* Certificates */}
          {profile.certificates && profile.certificates.length > 0 && (
            <section
              aria-labelledby="certificates-title"
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <h2
                id="certificates-title"
                className="text-lg font-bold text-gray-900"
              >
                Certificates
              </h2>
              <div className="mt-4 space-y-2">
                {profile.certificates.map((cert, idx) => (
                  <a
                    key={idx}
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <Award size={20} className="text-[#74C7F2]" />
                    <span className="text-sm text-gray-700">
                      Certificate {idx + 1}
                    </span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Active Gigs */}
          {profile.activeGigs && profile.activeGigs.length > 0 && (
            <section
              aria-labelledby="gigs-title"
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <h2 id="gigs-title" className="text-lg font-bold text-gray-900">
                Active Services
              </h2>
              <div className="mt-4 space-y-3">
                {profile.activeGigs.map((gig) => (
                  <div
                    key={gig._id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                  >
                    <h3 className="font-semibold text-gray-900">{gig.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {gig.description}
                    </p>
                    {gig.pricing && (
                      <p className="text-sm text-[#74C7F2] font-medium mt-2">
                        {gig.pricing.method === "negotiable"
                          ? "Negotiable"
                          : gig.pricing.method === "hourly"
                          ? `TZS ${gig.pricing.price}/hr`
                          : `TZS ${gig.pricing.price}`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Availability */}
          {profile.availability && profile.availability.length > 0 && (
            <section
              aria-labelledby="availability-title"
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <h2
                id="availability-title"
                className="text-lg font-bold text-gray-900"
              >
                Availability
              </h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {profile.availability.map((slot, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gradient-to-br from-[#E0F2FE] to-[#BAE6FD] rounded-xl border border-[#74C7F2]/20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={18} className="text-[#74C7F2]" />
                      <h3 className="font-semibold text-gray-900">
                        {slot.day}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {slot.timeSlots.map((time, timeIdx) => (
                        <span
                          key={timeIdx}
                          className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm"
                        >
                          {time.charAt(0).toUpperCase() + time.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          <section
            aria-labelledby="reviews-title"
            className="bg-[#FFFBEA] p-5 "
          >
            <h2
              id="reviews-title"
              className="text-lg sm:text-xl font-bold text-gray-900"
            >
              Reviews & Ratings
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[280px,1fr]">
              {/* Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Overall score */}
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl sm:text-4xl font-semibold text-gray-900">
                      {profile.rating?.average?.toFixed(1) || "0.0"}
                    </span>
                    <Star className="text-yellow-400 fill-yellow-400 w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-gray-500">
                    {profile.rating?.count || 0} reviews
                  </p>
                </div>

                {/* Rating distribution - Placeholder as detailed breakdown not in API */}
                <div className="sm:col-span-2 flex flex-col justify-center mt-4 sm:mt-0 space-y-2">
                  <p className="text-sm text-gray-500 text-center">
                    Detailed rating breakdown not available
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Individual Reviews - Placeholder */}
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-center text-gray-500">
              Individual reviews will be displayed here once available
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default WorkerProfile;
