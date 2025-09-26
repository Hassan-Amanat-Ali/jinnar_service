import React, { useState } from "react";
import {
  ArrowLeft,
  Star,
  Calendar,
  MapPin,
  MessageSquare,
  Eye,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

// Stats Card Component
const StatsCard = ({ icon, value, label, bgColor, textColor, iconBg }) => (
  <div className={`${bgColor} rounded-xl p-4 text-center`}>
    <div
      className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center mx-auto mb-2`}
    >
      {icon}
    </div>
    <div className={`text-2xl font-bold ${textColor} mb-1`}>{value}</div>
    <div className="text-xs text-gray-600">{label}</div>
  </div>
);

// Job Review Card Component
const JobReviewCard = ({ job, isExpanded, onToggle }) => (
  <div className="border border-gray-200 rounded-lg p-4">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
          <span className="text-xs font-semibold text-gray-600">
            {job.initials}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-medium text-sm text-gray-900">{job.service}</div>
          <div className="text-xs text-gray-500">
            {job.date} • {job.worker}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-2">
        <div className="text-emerald-600 font-semibold text-sm">
          {job.price}
        </div>
        <button
          onClick={onToggle}
          className="p-1 text-gray-400 hover:text-gray-600 shrink-0"
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
    </div>

    {isExpanded && (
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-gray-700">
            Worker's Review:
          </span>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < job.rating
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-600 italic">"{job.review}"</p>
      </div>
    )}
  </div>
);

// Trust Score Component
const TrustSection = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <h3 className="text-xl font-bold text-gray-900 mb-6">
      Trust & Payment Reliability
    </h3>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className="text-center">
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
          <CreditCard className="text-green-600" size={24} />
        </div>
        <div className="font-semibold text-gray-900 mb-1">Payment Method</div>
        <div className="text-sm text-gray-600">M-Pesa</div>
        <div className="text-xs text-gray-500 mt-1">M-Pesa / Card Based</div>
      </div>

      <div className="text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
          <Shield className="text-blue-600" size={24} />
        </div>
        <div className="font-semibold text-gray-900 mb-1">Dispute History</div>
        <div className="text-2xl font-bold text-blue-600">0</div>
      </div>

      <div className="text-center">
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
          <Star className="text-purple-600 fill-purple-600" size={24} />
        </div>
        <div className="font-semibold text-gray-900 mb-1">
          Reliability Score
        </div>
        <div className="text-2xl font-bold text-purple-600">
          9.5<span className="text-lg text-gray-500">/10</span>
        </div>
      </div>
    </div>
  </div>
);

const CustomerProfile = () => {
  const navigate = useNavigate();
  const { id: _customerId } = useParams();
  const [expandedJobs, setExpandedJobs] = useState({});

  // Mock customer data - would typically come from API
  const customer = {
    initials: "AK",
    name: "Ahmed Khan",
    rating: 4.7,
    reviewCount: 52,
    isVerified: true,
    joinDate: "May 2022",
    location: "Dar es Salaam, Tanzania",
    about:
      "House owner regularly booking for cleaning and maintenance tasks. Values punctuality and clear communication.",
    stats: {
      totalBookings: 45,
      completedJobs: 41,
      cancelled: 2,
      onTimePayments: 95,
    },
  };

  const previousJobs = [
    {
      id: 1,
      initials: "PL",
      service: "Plumbing Fix",
      date: "15 Jan 2024",
      worker: "Worker: Ahmed Hassan",
      price: "$ TZS 50,000",
      rating: 5,
      review: "Excellent experience again! Customer...",
    },
    {
      id: 2,
      initials: "HC",
      service: "House Cleaning",
      date: "10 June 2024",
      worker: "Worker: Maria Santos",
      price: "$ TZS 35,000",
      rating: 4,
      review: "Very happy with their cleaning and respectful.",
    },
    {
      id: 3,
      initials: "EW",
      service: "Electrical Work",
      date: "5 April 2024",
      worker: "Worker: John Wesley",
      price: "$ TZS 75,000",
      rating: 5,
      review: "Professional customer, payment was on time.",
    },
  ];

  const toggleJobExpansion = (jobId) => {
    setExpandedJobs((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Back</span>
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-lg font-semibold text-gray-900">
                Customer Profile
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 lg:grid lg:grid-cols-3 lg:gap-5 lg:space-y-0">
        {/* Customer Info Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:col-span-1 lg:h-fit">
          <div className="flex flex-col gap-6">
            {/* Left: Avatar and Basic Info */}
            <div className="flex flex-col items-center text-center ">
              <div className="w-20 h-20 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xl font-semibold mb-3">
                {customer.initials}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {customer.name}
              </h2>
              <div className="flex items-center gap-1 mb-2">
                <Star className="text-amber-400 fill-amber-400" size={16} />
                <span className="font-semibold text-gray-900">
                  {customer.rating}
                </span>
                <span className="text-sm text-gray-500">
                  ({customer.reviewCount} reviews)
                </span>
              </div>
              {customer.isVerified && (
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium mb-3">
                  ✓ Verified Customer
                </div>
              )}
            </div>

            {/* Right: About and Action Buttons */}
            <div className="flex-1">
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                <Calendar size={14} />
                <span>Joined {customer.joinDate}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin size={14} />
                <span>Near Kinondoni, 3 km away</span>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium py-2.5 sm:py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-2 text-sm">
                  <MessageSquare size={16} />
                  <span className="hidden sm:inline">Message Customer</span>
                  <span className="sm:hidden">Message</span>
                </button>
                <button className="w-full border border-gray-300 text-gray-700 font-medium py-2.5 sm:py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm">
                  <Eye size={16} />
                  <span className="hidden sm:inline">View Booking Detail</span>
                  <span className="sm:hidden">View Detail</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              About Customer
            </h3>
            <p className="text-md text-gray-600 leading-relaxed">
              {customer.about}
            </p>
          </div>
          {/* Booking Stats Overview */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Booking Stats Overview
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                icon={<Calendar className="text-blue-600" size={16} />}
                value={customer.stats.totalBookings}
                label="Total Bookings"
                bgColor="bg-blue-50"
                textColor="text-blue-700"
                iconBg="bg-blue-100"
              />
              <StatsCard
                icon={<Star className="text-green-600" size={16} />}
                value={customer.stats.completedJobs}
                label="Completed Jobs"
                bgColor="bg-green-50"
                textColor="text-green-700"
                iconBg="bg-green-100"
              />
              <StatsCard
                icon={<AlertTriangle className="text-red-600" size={16} />}
                value={customer.stats.cancelled}
                label="Cancelled"
                bgColor="bg-red-50"
                textColor="text-red-700"
                iconBg="bg-red-100"
              />
              <StatsCard
                icon={<CreditCard className="text-purple-600" size={16} />}
                value={`${customer.stats.onTimePayments}%`}
                label="On-Time Payments"
                bgColor="bg-purple-50"
                textColor="text-purple-700"
                iconBg="bg-purple-100"
              />
            </div>
          </div>
          {/* Previous Jobs with Reviews */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Previous Jobs with Reviews
              </h3>
              <span className="text-sm text-gray-500">( of 3 )</span>
            </div>
            <div className="space-y-3">
              {previousJobs.map((job) => (
                <JobReviewCard
                  key={job.id}
                  job={job}
                  isExpanded={expandedJobs[job.id]}
                  onToggle={() => toggleJobExpansion(job.id)}
                />
              ))}
            </div>
          </div>
          {/* Trust & Payment Reliability */}
          <TrustSection />
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
