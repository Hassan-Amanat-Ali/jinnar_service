import React from "react";
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
} from "lucide-react";

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
  // Mock worker data
  const worker = {
    initials: "AR",
    name: "Ali Raza",
    title: "Experienced Electrician & Plumber | 5+ Years in Dar es Salaam",
    rating: 4.8,
    reviewCount: 104,
    completedJobs: 234,
    joinDate: "May 2022",
    isVerified: true,
    isAvailable: true,
    location: "Kinondoni, Dar es Salaam",
    experience: "5+ years in Electrical & Plumbing",
    phone: "+255 765 432 109",
    email: "aliraza@email.com",
    pricingModel: "Hourly + Fixed",
    hourlyRate: "10,200/hour",
    standardRate: "TZS 25,000/hour",
    description: "TZS 5,000",
    emergencyRate: "TZS 35,000",
    availability: {
      status: "Available",
      schedule: "Mon-Sun: 8:00 AM - 6:00 PM",
      nextSlot: "Tomorrow at 8:00 AM",
    },
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
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center text-2xl font-bold">
                {worker.initials}
              </div>
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
                <Badge variant="verified">
                  <CheckCircle size={12} />
                  Verified since {worker.joinDate}
                </Badge>
                <Badge variant="available">
                  <Clock size={12} />
                  Available
                </Badge>
                <Badge variant="years">
                  <Star size={12} />
                  5+ years
                </Badge>
                <Badge variant="location">
                  <MapPin size={12} />
                  Dar es Salaam
                </Badge>
              </div>
            </div>
          </div>

          {/* Right: Action Button */}
          <div className="flex-shrink-0 flex md:flex-col gap-2">
            <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm">
              <Edit size={16} />
              Edit Profile
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
                      ali.raza@email.com
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-900">
                      +255 *** *** 789
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-gray-700 mb-4 mt-6">
                  Languages Spoken
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Swahili
                  </Badge>
                  <Badge variant="default">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    English
                  </Badge>
                  <Badge variant="default">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Urdu
                  </Badge>
                </div>
              </div>

              {/* Location & Service Area Column */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-4">
                  Location & Service Area
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      Kinondoni, Dar es Salaam
                    </div>
                    <div className="text-xs text-gray-500">
                      Service Radius: 15 km Radius
                    </div>
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-gray-700 mb-4 mt-6">
                  Experience Level
                </h4>
                <div className="text-sm font-medium text-gray-900">
                  5+ years in Electrical & Plumbing
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
                <Badge
                  variant="default"
                  className="bg-blue-50 text-blue-700 border border-blue-200"
                >
                  <Zap size={12} />
                  Electrical
                </Badge>
                <Badge
                  variant="default"
                  className="bg-blue-50 text-blue-700 border border-blue-200"
                >
                  <Droplets size={12} />
                  Plumbing
                </Badge>
                <Badge
                  variant="emergency"
                  className="bg-red-50 text-red-700 border border-red-200"
                >
                  <AlertTriangle size={12} />
                  Emergency Services
                </Badge>
              </div>
            </div>

            {/* Detailed Skills & Expertise */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-4">
                Detailed Skills & Expertise
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Row */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <Zap className="text-amber-500" size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Electrical Installation
                    </div>
                    <div className="text-xs text-gray-500">Expert</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <Droplets className="text-blue-500" size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Plumbing Repair
                    </div>
                    <div className="text-xs text-gray-500">Expert</div>
                  </div>
                </div>

                {/* Second Row */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <Zap className="text-amber-500" size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Wiring & Outlets
                    </div>
                    <div className="text-xs text-gray-500">Advanced</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <Droplets className="text-blue-500" size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Pipe Installation
                    </div>
                    <div className="text-xs text-gray-500">Advanced</div>
                  </div>
                </div>

                {/* Third Row - Emergency Repairs */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-1">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <AlertTriangle className="text-red-500" size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Emergency Repairs
                    </div>
                    <div className="text-xs text-gray-500">Expert</div>
                  </div>
                </div>
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
              {[...Array(6)].map((_, idx) => (
                <div
                  key={idx}
                  className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center"
                >
                  <Camera className="text-gray-400" size={32} />
                </div>
              ))}
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

            {/* Pricing Model */}
            <div className="mb-6 bg-green-50 p-2 rounded-lg">
              <div className="text-sm font-semibold text-gray-700 mb-3">
                Pricing Model: Hourly + Fixed
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-600">Standard Rate:</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">TZS</div>
                    <div className="text-sm font-bold text-gray-900">
                      15,000/hour
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-600">Emergency Rate:</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">TZS</div>
                    <div className="text-sm font-bold text-gray-900">
                      25,000/hour
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-600">Consultation:</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">
                      TZS 5,000
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sample Service Prices */}
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-4">
                Sample Service Prices
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Basic Electrical
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      Repair
                    </div>
                    <div className="text-xs text-gray-500">Fixed</div>
                  </div>
                  <div className="text-sm font-bold text-green-600">
                    TZS 25,000
                  </div>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Plumbing
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      Installation
                    </div>
                    <div className="text-xs text-gray-500">Hourly</div>
                  </div>
                  <div className="text-sm font-bold text-green-600">
                    TZS 20,000
                  </div>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Emergency Call-
                    </div>
                    <div className="text-sm font-medium text-gray-900">out</div>
                    <div className="text-xs text-gray-500">Fixed</div>
                  </div>
                  <div className="text-sm font-bold text-green-600">
                    TZS 35,000
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-2">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="text-green-600" size={20} />
              <h3 className="text-lg font-bold text-gray-900">Availability</h3>
            </div>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <div className="text-lg font-bold text-green-700 mb-1">
                Available
              </div>
              <div className="text-sm text-gray-600">
                Usually responds within 2 hours
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <div className="text-sm text-gray-600">Working Hours:</div>
                <div className="font-semibold text-gray-900">
                  {worker.availability.schedule}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Next Available:</div>
                <div className="font-semibold text-gray-900">
                  {worker.availability.nextSlot}
                </div>
              </div>
            </div>

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
