import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  Zap,
  Wrench,
  Home,
  Droplets,
  Scissors,
  AlertTriangle,
  Camera,
  Briefcase,
  DollarSign,
  Heart,
  User,
  Edit,
  Shield,
} from "lucide-react";
import { useGetMyProfileQuery } from "../../services/workerApi";
import { getFullImageUrl, reverseGeocode } from "../../utils/fileUrl.js";
import OptimizedImage from "../common/OptimizedImage";

// Badge Component
const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    verified: "bg-green-100 text-green-700",
    available: "bg-blue-100 text-blue-700",
    emergency: "bg-red-100 text-red-700",
    years: "bg-purple-100 text-purple-700",
    location: "bg-orange-100 text-orange-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

// Service Card Component
const ServiceCard = ({
  icon,
  title,
  description,
  price,
  bgColor = "bg-gray-50",
}) => (
  <div className={`${bgColor} rounded-lg p-4`}>
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-sm text-gray-900 mb-1">{title}</h4>
        <p className="text-xs text-gray-600 mb-2">{description}</p>
        <div className="text-sm font-bold text-emerald-600">{price}</div>
      </div>
    </div>
  </div>
);

// Info Row Component
const InfoRow = ({ icon, label, value, isLink = false }) => (
  <div className="flex items-center gap-3 py-2">
    <div className="w-4 h-4 text-gray-400 flex-shrink-0">{icon}</div>
    <div className="flex-1">
      <span className="text-sm text-gray-600">{label}:</span>
      <span
        className={`ml-2 text-sm font-medium ${
          isLink ? "text-blue-600" : "text-gray-900"
        }`}
      >
        {value}
      </span>
    </div>
  </div>
);

const WorkerProfileOverview = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetMyProfileQuery();
  console.log("Profile data:", data);

  const profile = data?.profile;
  const [locationAddress, setLocationAddress] = useState("Loading location...");

  // Fetch location address when profile data is available
  useEffect(() => {
    const fetchLocation = async () => {
      if (profile?.selectedAreas && profile.selectedAreas.length > 0) {
        const firstArea = profile.selectedAreas[0];
        if (firstArea?.coordinates && firstArea.coordinates.length === 2) {
          const [lng, lat] = firstArea.coordinates; // GeoJSON format is [lng, lat]
          const address = await reverseGeocode(lat, lng);
          setLocationAddress(address || "Location unavailable");
        } else {
          setLocationAddress("Location not set");
        }
      } else {
        setLocationAddress("No location added");
      }
    };

    if (profile) {
      fetchLocation();
    }
  }, [profile]);

  // Handler for edit profile button
  const handleEditProfile = () => {
    // Navigate to profile setup/edit page
    navigate("/worker-setup-basic");
  };

  // Handler for verification button
  const handleVerification = () => {
    navigate("/worker/profile/verification");
  };

  // Skeleton Shimmer Component
  const Skeleton = ({ className = "" }) => (
    <div className={`bg-gray-200 rounded animate-pulse ${className}`}>
      <div className="shimmer"></div>
    </div>
  );

  // Shimmer styles
  const shimmerStyles = `
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
  `;

  // Loading state with Skeleton
  if (isLoading) {
    return (
      <div className="space-y-2">
        <style>{shimmerStyles}</style>

        {/* Header - Static */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Profile Overview
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Your account information and personal details
          </p>

          {/* Profile Section Skeleton */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              {/* Avatar Skeleton */}
              <Skeleton className="w-20 h-20 rounded-full shrink-0" />

              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />

                {/* Rating Skeleton */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>

                {/* Badges Skeleton */}
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-28 rounded-full" />
                </div>
              </div>
            </div>

            {/* Action Button Skeleton */}
            <div className="shrink-0">
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Two Column Layout Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 space-y-2">
            {/* Personal Information Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="h-6 w-40" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Skeleton className="h-5 w-36 mb-4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-5 w-32 mt-6 mb-4" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-5 w-40 mb-4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-5 w-32 mt-6 mb-4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>

            {/* Skills Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="h-6 w-48" />
              </div>

              <Skeleton className="h-5 w-32 mb-4" />
              <div className="flex flex-wrap gap-3 mb-6">
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-28 rounded-full" />
              </div>

              <Skeleton className="h-5 w-40 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="h-6 w-48" />
              </div>
              <Skeleton className="h-4 w-full mb-4" />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="aspect-square rounded-lg" />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-1 space-y-2">
            {/* Pricing Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="h-6 w-36" />
              </div>

              <Skeleton className="h-5 w-28 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-start">
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>

            {/* Availability Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="h-6 w-24" />
              </div>

              <div className="text-center mb-6">
                <Skeleton className="w-16 h-16 rounded-full mx-auto mb-3" />
                <Skeleton className="h-6 w-24 mx-auto mb-2" />
                <Skeleton className="h-4 w-40 mx-auto" />
              </div>

              <div className="space-y-3 mb-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>

              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load profile</p>
          <p className="text-gray-500">
            {error?.data?.error || "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  // No data
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">No profile data available</p>
      </div>
    );
  }

  // Helper functions
  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getAvailabilitySchedule = (availability) => {
    if (!availability || availability.length === 0) {
      return { hasSchedule: false, days: [], summary: "Not set" };
    }

    // Group by day and format time slots
    const daySchedule = availability.map((slot) => ({
      day: slot.day,
      slots: slot.timeSlots || [],
    }));

    // Create a short summary
    const dayCount = daySchedule.length;
    const summary =
      dayCount === 7
        ? "Available every day"
        : `Available ${dayCount} day${dayCount > 1 ? "s" : ""}/week`;

    return {
      hasSchedule: true,
      days: daySchedule,
      summary: summary,
    };
  };

  const getCategoryIcon = (skill) => {
    const skillLower = skill?.toLowerCase() || "";
    if (skillLower.includes("electric")) return <Zap size={12} />;
    if (skillLower.includes("plumb")) return <Droplets size={12} />;
    if (skillLower.includes("emerg")) return <AlertTriangle size={12} />;
    return <Wrench size={12} />;
  };

  const getSkillIcon = (skill) => {
    const skillLower = skill?.toLowerCase() || "";
    if (skillLower.includes("electric") || skillLower.includes("wiring"))
      return <Zap className="text-amber-500" size={16} />;
    if (skillLower.includes("plumb") || skillLower.includes("pipe"))
      return <Droplets className="text-blue-500" size={16} />;
    if (skillLower.includes("emerg"))
      return <AlertTriangle className="text-red-500" size={16} />;
    return <Wrench className="text-gray-500" size={16} />;
  };

  const getLocationString = (areas) => {
    if (!areas || areas.length === 0) return null;
    // For simplicity, just show count. In production, you'd reverse geocode
    return `${areas.length} service area${
      areas.length !== 1 ? "s" : ""
    } configured`;
  };

  const getServiceRadius = (areas) => {
    if (!areas || areas.length === 0) return null;
    return `${areas.length} location${areas.length !== 1 ? "s" : ""}`;
  };

  // Prepare worker data from API
  const availabilityData = getAvailabilitySchedule(profile.availability);

  const worker = {
    initials: getInitials(profile.name),
    name: profile.name || "No name",
    title: `${profile.bio || "Service Professional"} | ${
      profile.yearsOfExperience || 0
    }+ Years`,
    rating: profile.rating?.average || 0,
    reviewCount: profile.rating?.count || 0,
    completedJobs: profile.completedJobs || 0,
    joinDate: formatDate(profile.createdAt),
    isVerified: profile.isVerified || false,
    isAvailable: availabilityData.hasSchedule,
    location: getLocationString(profile.selectedAreas),
    experience: `${profile.yearsOfExperience || 0}+ years`,
    phone: profile.mobileNumber,
    email: profile.email || "Not provided",
    availability: availabilityData,
  };

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Profile Overview
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Your account information and personal details
        </p>

        {/* Profile Section */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Avatar and Basic Info */}
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            {console.log("Rendering profile:", profile)}
            <div className="shrink-0">
              {profile.profilePicture ? (
                <OptimizedImage
                  src={profile.profilePicture}
                  alt={profile.name || "Worker profile"}
                  fallbackSrc="/placeholder-avatar.jpg"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center text-2xl font-bold">
                  {worker.initials}
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {worker.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">{worker.title}</p>

              {/* Rating and Stats */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < Math.floor(worker.rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                  <span className="text-sm font-semibold text-gray-900 ml-1">
                    {worker.rating}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({worker.reviewCount} reviews)
                  </span>
                </div>
             
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">
                  {worker.completedJobs} jobs completed
                </span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.createdAt && (
                  <Badge variant="verified">
                    <CheckCircle size={12} />
                    Member since {worker.joinDate}
                  </Badge>
                )}
                <Badge variant="available">
                  <Clock size={12} />
                  Available
                </Badge>
                <Badge variant="years">
                  <Star size={12} />
                  {profile.yearsOfExperience || 0}+ years
                </Badge>
                {profile.selectedAreas && profile.selectedAreas.length > 0 && (
                  <Badge variant="location">
                    <MapPin size={12} />
                    {locationAddress !== "Loading location..." && locationAddress !== "No location added" 
                      ? locationAddress.split(",")[0] // Show only city name
                      : `${profile.selectedAreas.length} service area${profile.selectedAreas.length !== 1 ? "s" : ""}`}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="shrink-0 flex md:flex-col gap-2">
            <button
              onClick={handleEditProfile}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm"
            >
              <Edit size={16} />
              Edit Profile
            </button>
            <button
              onClick={handleVerification}
              className={`flex items-center justify-center gap-2 ${
                profile.verificationStatus === "approved"
                  ? "bg-green-100 text-green-700"
                  : profile.verificationStatus === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } font-medium px-4 py-2 rounded-lg transition-all text-sm`}
            >
              <Shield size={16} />
              {profile.verificationStatus === "approved"
                ? "Verified"
                : profile.verificationStatus === "pending"
                ? "Pending"
                : "Get Verified"}
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-2">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <User className="text-blue-600" size={20} />
              <h3 className="text-lg font-bold text-gray-900">
                Personal Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information Column */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-4">
                  Contact Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-900">
                      {profile.email || "Not provided"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-900">
                      {profile.mobileNumber || "Not provided"}
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-gray-700 mb-4 mt-6">
                  Languages Spoken
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.languages && profile.languages.length > 0 ? (
                    profile.languages.map((lang, idx) => (
                      <Badge key={idx} variant="default">
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        {lang}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">
                      No languages specified
                    </span>
                  )}
                </div>
              </div>

              {/* Location & Service Area Column */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-4">
                  Location & Service Area
                </h4>
                <div className="space-y-3">
                  {profile.selectedAreas && profile.selectedAreas.length > 0 ? (
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {locationAddress}
                      </div>
                      <div className="text-xs text-gray-500">
                        Service Areas: {profile.selectedAreas.length} location{profile.selectedAreas.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      No location added
                    </div>
                  )}
                </div>

                <h4 className="text-sm font-semibold text-gray-700 mb-4 mt-6">
                  Experience Level
                </h4>
                <div className="text-sm font-medium text-gray-900">
                  {profile.yearsOfExperience || 0}+ years experience
                </div>
              </div>
            </div>
          </div>

          {/* Skills & Services Offered */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Wrench className="text-blue-600" size={20} />
              <h3 className="text-lg font-bold text-gray-900">
                Skills & Services Offered
              </h3>
            </div>

            {/* Service Categories */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">
                Service Categories
              </h4>
              <div className="flex flex-wrap gap-3">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.slice(0, 5).map((skill, idx) => {
                    const isEmergency = skill
                      .toLowerCase()
                      .includes("emergency");
                    return (
                      <Badge
                        key={idx}
                        variant={isEmergency ? "emergency" : "default"}
                        className={
                          isEmergency
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }
                      >
                        {getCategoryIcon(skill)}
                        {skill}
                      </Badge>
                    );
                  })
                ) : (
                  <span className="text-sm text-gray-500">
                    No skills specified
                  </span>
                )}
              </div>
            </div>

            {/* Detailed Skills & Expertise */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-4">
                Detailed Skills & Expertise
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        {getSkillIcon(skill)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {skill}
                        </div>
                        <div className="text-xs text-gray-500">
                          {profile.yearsOfExperience >= 5
                            ? "Expert"
                            : profile.yearsOfExperience >= 2
                            ? "Advanced"
                            : "Intermediate"}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center text-gray-500 py-4">
                    No skills added yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Work Samples & Portfolio */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Camera className="text-gray-600" size={20} />
              <h3 className="text-lg font-bold text-gray-900">
                Work Samples & Portfolio
              </h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Examples of completed work and professional achievements
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {profile.portfolioImages && profile.portfolioImages.length > 0 ? (
                profile.portfolioImages.map((image, idx) => (
                  <div
                    key={idx}
                    className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                  >
                    <OptimizedImage
                      src={image.url}
                      alt={`Portfolio ${idx + 1}`}
                      fallbackSrc="/placeholder-avatar.jpg"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              ) : (
                <>
                  {[...Array(6)].map((_, idx) => (
                    <div
                      key={idx}
                      className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center"
                    >
                      <Camera className="text-gray-400" size={32} />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Pricing & Availability */}
        <div className="lg:col-span-1 space-y-2">
          {/* Pricing Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <DollarSign className="text-blue-600" size={20} />
              <h3 className="text-lg font-bold text-gray-900">
                Pricing Information
              </h3>
            </div>

            {/* Gigs-based pricing */}
            {profile.gigs && profile.gigs.length > 0 ? (
              <div>
                <div className="text-sm font-semibold text-gray-700 mb-4">
                  Service Prices
                </div>

                <div className="space-y-4">
                  {profile.gigs.slice(0, 3).map((gig, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {gig.title}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {gig.pricing?.method || "negotiable"}
                        </div>
                      </div>
                      <div className="text-sm font-bold text-green-600">
                        {gig.pricing?.method === "negotiable"
                          ? "Negotiable"
                          : `TZS ${
                              gig.pricing?.price?.toLocaleString() || "N/A"
                            }`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 mb-2">
                  No pricing information available
                </p>
                <p className="text-xs text-gray-400">
                  Add gigs to display pricing
                </p>
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-2">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="text-green-600" size={20} />
              <h3 className="text-lg font-bold text-gray-900">Availability</h3>
            </div>

            {worker.availability.hasSchedule ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                  <div className="text-lg font-bold text-green-700 mb-1">
                    Available
                  </div>
                  <div className="text-xs text-gray-500">
                    {worker.availability.summary}
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="text-xs font-semibold text-gray-700 mb-3">
                    Weekly Schedule
                  </div>
                  {worker.availability.days.map((dayData, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <span className="text-sm font-medium text-gray-700 w-24">
                        {dayData.day}
                      </span>
                      <div className="flex gap-1">
                        {dayData.slots.map((slot, slotIdx) => (
                          <span
                            key={slotIdx}
                            className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded border border-green-200"
                          >
                            {slot.charAt(0).toUpperCase() + slot.slice(1)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="text-gray-400" size={24} />
                </div>
                <div className="text-sm font-medium text-gray-600 mb-1">
                  Schedule Not Set
                </div>
                <div className="text-xs text-gray-500 mb-6">
                  Contact for availability
                </div>
              </div>
            )}

            <button className="w-full bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium py-3 rounded-lg hover:opacity-90 transition-opacity">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfileOverview;
