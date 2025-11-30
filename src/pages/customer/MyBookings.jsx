import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "../../components/customer/MyBookingsCard";
import Hero from "../../components/common/Hero";
import { Loader2, Search, Filter } from "lucide-react";
import { useGetMyOrdersQuery } from "../../services/customerApi";
import { getFullImageUrl } from "../../utils/fileUrl.js";

const CustomerBookings = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch orders from API
  const {
    data: ordersResponse,
    isLoading,
    error,
    refetch,
  } = useGetMyOrdersQuery();

  // Extract orders array from API response
  const bookingsData = ordersResponse?.orders || [];

  // Debug logs
  console.log("🔍 Customer Orders API Response:", ordersResponse);
  console.log("🔍 Extracted Orders:", bookingsData);

  // Filter bookings based on search and status
  const filteredBookings = bookingsData.filter((booking) => {
    const matchesSearch =
      booking.gigId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.jobDescription
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.sellerId?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (bookingId) => {
    navigate(`/customer-booking/${bookingId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-xl text-red-600 mb-2">
            Error loading bookings
          </div>
          <div className="text-sm text-gray-500 mb-4">
            {error?.data?.message || error?.message || "Please try again later"}
          </div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Transform API data to match JobCard component expectations
  const transformedBookings = filteredBookings.map((booking) => ({
    id: booking._id,
    serviceImage: getFullImageUrl(booking.gigId?.images?.[0]?.url) || null,
    serviceTitle: booking.gigId?.title || "Service",
    serviceDescription: booking.jobDescription || "No description available",
    emergencyTag: booking.emergency ? "Emergency" : null,
    statusTag:
      booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) ||
      "Unknown",
    workerImage: getFullImageUrl(booking.sellerId?.profilePicture) || null,
    workerName: booking.sellerId?.name || "Worker",
    workerRating: booking.sellerId?.rating || "N/A",
    date: booking.date ? new Date(booking.date).toLocaleDateString() : "TBD",
    time:
      booking.timeSlot?.charAt(0).toUpperCase() + booking.timeSlot?.slice(1) ||
      "TBD",
    location: booking.location
      ? `${booking.location.lat.toFixed(4)}, ${booking.location.lng.toFixed(4)}`
      : "Location TBD",
    price: booking.price || "Price TBD",
    workerId: booking.sellerId?._id, // Add workerId for messaging
  }));

  return (
    <div>
      <Hero
        place="customer-bookings"
        title="My Bookings"
        subtitle="Track and manage your service bookings"
        className="h-64 md:h-80 lg:h-88"
      />

      <div className="px-4 py-8 max-w-7xl mx-auto">
        {/* Search and Filter Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Bookings Grid */}
        {filteredBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {transformedBookings.map((booking) => (
              <JobCard
                key={booking.id}
                serviceImage={booking.serviceImage}
                serviceTitle={booking.serviceTitle}
                serviceDescription={booking.serviceDescription}
                emergencyTag={booking.emergencyTag}
                statusTag={booking.statusTag}
                workerImage={booking.workerImage}
                workerName={booking.workerName}
                workerRating={booking.workerRating}
                date={booking.date}
                time={booking.time}
                location={booking.location}
                price={booking.price}
                bookingId={booking.id}
                workerId={booking.workerId}
                onViewDetails={() => handleViewDetails(booking.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">
              {searchTerm || statusFilter !== "all"
                ? "No bookings match your filters"
                : "No bookings found"}
            </div>
            <div className="text-gray-400 text-sm">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Book a service to see your bookings here"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerBookings;
