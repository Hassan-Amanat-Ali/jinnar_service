import { Link } from "react-router-dom";
import { CheckCircle, Briefcase, Check, DollarSign, Star } from "lucide-react";
import bag from "../../../assets/icons/worker-bag.png";
import check from "../../../assets/icons/check.png";
import { useGetMyProfileQuery } from "../../../services/workerApi";

const Hero = () => {
  // Fetch real-time profile data
  const { data } = useGetMyProfileQuery();
  const profile = data?.profile;

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!profile) return 0;

    let completed = 0;
    let total = 8; // Total steps to complete

    // Basic info (25%)
    if (profile.name) completed += 1;
    if (profile.bio) completed += 1;

    // Skills (12.5%)
    if (profile.skills && profile.skills.length > 0) completed += 1;

    // Work samples (25%)
    if (profile.portfolioImages && profile.portfolioImages.length > 0)
      completed += 1;
    if (profile.videos && profile.videos.length > 0) completed += 1;

    // Certificates/Verification (12.5%)
    if (profile.certificates && profile.certificates.length > 0) completed += 1;

    // Availability (12.5%)
    if (profile.availability && profile.availability.length > 0) completed += 1;

    // Profile picture (12.5%)
    if (profile.profileImage && profile.profileImage.url) completed += 1;

    return Math.round((completed / total) * 100);
  };

  const completionPercentage = calculateProfileCompletion();

  // Check individual completion status
  const hasWorkSamples =
    profile?.portfolioImages?.length > 0 || profile?.videos?.length > 0;
  const hasSkills = profile?.skills && profile?.skills.length > 0;
  const hasVerification =
    profile?.certificates && profile?.certificates.length > 0;
  const hasAvailability =
    profile?.availability && profile?.availability.length > 0;

  // Get stats from profile
  const jobsCompleted = profile?.orderHistory?.length || 0;
  const rating = profile?.rating?.average || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 xl:px-5 my-8 space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#A8D8F0] to-[#74C7F2] rounded-2xl p-8 relative overflow-hidden">
        {/* Background Circle */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
          <div className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center">
            <img
              src={bag}
              alt="Worker Bag"
              className="w-10 h-10 object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-md">
          <h1 className="text-white text-2xl font-bold mb-3 leading-tight">
            Grow Your Skills.
            <br />
            Earn More. Work Smarter.
          </h1>

          <p className="text-white/90 text-sm mb-6 leading-relaxed">
            Get matched with customers in your area and start
            <br />
            receiving job requests today.
          </p>

          <Link
            to="/worker-setup-basic"
            className="inline-flex items-center gap-2 bg-white text-[#74C7F2] px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Complete Your Profile
          </Link>
        </div>
      </div>

      {/* Profile Completion Section */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
              Profile Completion: {completionPercentage}%
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Complete your profile to unlock more job requests and increase
              your visibility.
            </p>
          </div>
          <Link
            to="/worker-setup-basic"
            className="px-3 py-2 sm:px-4 sm:py-2 border border-[#74C7F2] text-[#74C7F2] rounded-lg text-xs sm:text-sm font-medium hover:bg-[#74C7F2] hover:text-white transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            Continue Setup
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#74C7F2] to-[#A8D8F0] h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Completion Steps - Mobile Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-2">
          <div className="flex items-center gap-2">
            <img
              src={check}
              alt=""
              className={`h-3 w-3 flex-shrink-0 ${
                !hasWorkSamples ? "grayscale-100" : ""
              }`}
            />
            <span
              className={`text-xs sm:text-sm ${
                hasWorkSamples ? "text-gray-700" : "text-gray-400"
              }`}
            >
              Add Work Samples
            </span>
          </div>

          <div className="flex items-center gap-2">
            <img
              src={check}
              alt=""
              className={`h-3 w-3 flex-shrink-0 ${
                !hasSkills ? "grayscale-100" : ""
              }`}
            />
            <span
              className={`text-xs sm:text-sm ${
                hasSkills ? "text-gray-700" : "text-gray-400"
              }`}
            >
              Complete Skills Assessment
            </span>
          </div>

          <div className="flex items-center gap-2">
            <img
              src={check}
              alt=""
              className={`h-3 w-3 flex-shrink-0 ${
                !hasVerification ? "grayscale-100" : ""
              }`}
            />
            <span
              className={`text-xs sm:text-sm ${
                hasVerification ? "text-gray-700" : "text-gray-400"
              }`}
            >
              Upload ID Verification
            </span>
          </div>

          <div className="flex items-center gap-2">
            <img
              src={check}
              alt=""
              className={`h-3 w-3 flex-shrink-0 ${
                !hasAvailability ? "grayscale-100" : ""
              }`}
            />
            <span
              className={`text-xs sm:text-sm ${
                hasAvailability ? "text-gray-700" : "text-gray-400"
              }`}
            >
              Set Availability Schedule
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Jobs Completed */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <img src={check} alt="" className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs font-medium text-green-600">↗ +12%</span>
          </div>
          <p className="text-xs text-gray-600 mb-1">Jobs Completed</p>
          <p className="text-2xl font-bold text-gray-900">{jobsCompleted}</p>
        </div>

        {/* Earnings This Month */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-green-600">↗ +12%</span>
          </div>
          <p className="text-xs text-gray-600 mb-1">Earnings This Month</p>
          <p className="text-2xl font-bold text-gray-900">$3,240</p>
        </div>

        {/* Active Job Requests */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-xs font-medium text-green-600">↗ +12%</span>
          </div>
          <p className="text-xs text-gray-600 mb-1">Active Job Requests</p>
          <p className="text-2xl font-bold text-gray-900">8</p>
        </div>

        {/* Rating */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-xs font-medium text-green-600">↗ +12%</span>
          </div>
          <p className="text-xs text-gray-600 mb-1">Rating</p>
          <p className="text-2xl font-bold text-gray-900">
            {rating > 0 ? rating.toFixed(1) : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
