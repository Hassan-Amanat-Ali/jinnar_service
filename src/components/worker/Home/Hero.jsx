import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Briefcase, Check, DollarSign, Star } from "lucide-react";
import bag from "../../../assets/icons/worker-bag.png";
import check from "../../../assets/icons/check.png";
import { useGetMyProfileQuery, useGetMyOrdersQuery, useGetNewJobRequestsQuery, useGetWalletQuery, useGetSellerStatsQuery } from "../../../services/workerApi";
import { getFullImageUrl } from "../../../utils/fileUrl.js";

const Hero = () => {
  // Fetch real-time profile data
  const { data } = useGetMyProfileQuery();
  const profile = data?.profile;
  
  // Fetch orders to calculate stats
  const { data: ordersData } = useGetMyOrdersQuery();
  const { data: newJobsData } = useGetNewJobRequestsQuery();
  const { data: walletData } = useGetWalletQuery();
  const { data: sellerStats } = useGetSellerStatsQuery();
  
  // Calculate real stats
  const allOrders = ordersData || [];
  const completedOrders = allOrders.filter(order => order.status === 'completed');
  // Get active job requests from new jobs data (pending jobs waiting for response)
  const activeJobRequests = newJobsData?.jobs?.length || 0;
  
  // Get wallet balance from wallet API
  const walletBalance = walletData?.balance || 0;
  
  // Calculate monthly earnings (orders from current month that are completed)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyEarnings = completedOrders
    .filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    })
    .reduce((total, order) => total + (order.price || 0), 0);


  // Check individual completion status
  const hasPersonalDetails = profile?.name && profile?.mobileNumber && typeof profile?.yearsOfExperience === 'number' && !!getFullImageUrl(profile?.profilePicture) && profile?.bio;
  const hasSkillsAndServices = profile?.categories?.length > 0 && profile?.subcategories?.length > 0;
  const hasWorkSamples = profile?.portfolioImages?.length > 0 || profile?.videos?.length > 0;
  const hasCertificates = profile?.certificates?.length > 0;
  const hasLocation = profile?.selectedAreas?.length > 0;
  const hasAvailability = profile?.availability?.length > 0;

  // Get stats - use calculated values from orders
  const jobsCompleted = completedOrders.length;
  const rating = profile?.rating?.average || profile?.rating || 0;
  // Get growth percentages from seller stats API
  const jobsGrowthPercentage = sellerStats?.jobsGrowthPercentage;
  const ratingGrowthPercentage = sellerStats?.ratingGrowthPercentage;
  
  // Helper function to render growth indicator
  const renderGrowthIndicator = (percentage) => {
    if (percentage === null || percentage === undefined) return null;
    
    const isPositive = percentage >= 0;
    const arrow = isPositive ? '↗' : '↘';
    const colorClass = isPositive ? 'text-green-600' : 'text-red-600';
    const sign = isPositive ? '+' : '';
    
    return (
      <span className={`text-xs font-medium ${colorClass}`}>
        {arrow} {sign}{percentage}%
      </span>
    );
  };
  
  const calculateProfileCompletion = () => {
    if (!profile) return 0;

    let completed = 0;
    let total = 6; // Total main sections to complete

    // 1. Personal Info (Name, Mobile, Years of Exp, Profile Picture, Bio)
    if (hasPersonalDetails) completed += 1;

    // 2. Skills & Services (Categories and Subcategories)
    if (hasSkillsAndServices) completed += 1;

    // 3. Work Samples (Portfolio Images or Videos)
    if (hasWorkSamples) completed += 1;

    // 4. Certificates
    if (hasCertificates) completed += 1;

    // 5. Location & Address
    if (hasLocation) completed += 1;

    // 6. Availability
    if (hasAvailability) completed += 1;

    return Math.round((completed / total) * 100);
  };

  const completionPercentage = calculateProfileCompletion();

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-4">
          <div className="flex items-center gap-2">
            <img
              src={check}
              alt=""
              className={`h-3 w-3 flex-shrink-0 ${
                !hasPersonalDetails ? "grayscale-100" : ""
              }`}
            />
            <span
              className={`text-xs sm:text-sm ${
                hasPersonalDetails ? "text-gray-700" : "text-gray-400"
              }`}
            >
              Complete Personal Info
            </span>
          </div>

          <div className="flex items-center gap-2">
            <img
              src={check}
              alt=""
              className={`h-3 w-3 flex-shrink-0 ${!hasSkillsAndServices ? "grayscale-100" : ""}`}
            />
            <span
              className={`text-xs sm:text-sm ${hasSkillsAndServices ? "text-gray-700" : "text-gray-400"}`}
            >
              Add Skills & Services
            </span>
          </div>

          <div className="flex items-center gap-2">
            <img
              src={check}
              alt=""
              className={`h-3 w-3 flex-shrink-0 ${!hasWorkSamples ? "grayscale-100" : ""}`}
            />
            <span
              className={`text-xs sm:text-sm ${hasWorkSamples ? "text-gray-700" : "text-gray-400"}`}
            >
              Add Work Samples
            </span>
          </div>

          <div className="flex items-center gap-2">
            <img
              src={check}
              alt=""
              className={`h-3 w-3 flex-shrink-0 ${!hasCertificates ? "grayscale-100" : ""}`}
            />
            <span
              className={`text-xs sm:text-sm ${hasCertificates ? "text-gray-700" : "text-gray-400"}`}
            >
              Upload Certificates
            </span>
          </div>

          <div className="flex items-center gap-2">
            <img
              src={check}
              alt=""
              className={`h-3 w-3 flex-shrink-0 ${!hasLocation ? "grayscale-100" : ""}`}
            />
            <span
              className={`text-xs sm:text-sm ${hasLocation ? "text-gray-700" : "text-gray-400"}`}
            >
              Set Service Location
            </span>
          </div>

          <div className="flex items-center gap-2">
            <img
              src={check}
              alt=""
              className={`h-3 w-3 flex-shrink-0 ${!hasAvailability ? "grayscale-100" : ""}`}
            />
            <span
              className={`text-xs sm:text-sm ${hasAvailability ? "text-gray-700" : "text-gray-400"}`}
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
            {renderGrowthIndicator(jobsGrowthPercentage)}
          </div>
          <p className="text-xs text-gray-600 mb-1">Jobs Completed</p>
          <p className="text-2xl font-bold text-gray-900">{jobsCompleted}</p>
        </div>

        {/* Wallet Balance */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-1">Wallet Balance</p>
          <p className="text-2xl font-bold text-gray-900">TZS {walletBalance.toLocaleString()}</p>
        </div>

        {/* Active Job Requests */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-1">Active Job Requests</p>
          <p className="text-2xl font-bold text-gray-900">{activeJobRequests}</p>
        </div>

        {/* Rating */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            {renderGrowthIndicator(ratingGrowthPercentage)}
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
