import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Search, Filter, User } from "lucide-react";
import Dropdown from "../../components/common/DropDown.jsx";

import Hero from "../../components/common/Hero";
import JobCard from "../../components/customer/MyBookingsCard";
import { useGetMyOrdersQuery } from "../../services/customerApi";
import { getFullImageUrl } from "../../utils/fileUrl.js";
import { useAuth } from "../../context/AuthContext.jsx";

const CustomerBookings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);

  const statusOptions = [
    "All",
    "Pending",
    "Accepted",
    "In Progress",
    "Completed",
    "Cancelled",
  ];

  const {
    data: allBookings = [],
    isLoading,
    error,
    refetch,
  } = useGetMyOrdersQuery();
  console.log(allBookings);
  console.log(user);
  const data = allBookings.filter((order) => order.buyerId?._id == user?._id);

  const bookings = useMemo(() => {
    return data
      .filter((booking) => {
        const search = searchTerm.toLowerCase();

        const matchesSearch =
          booking.gigId?.title?.toLowerCase().includes(search) ||
          booking.jobDescription?.toLowerCase().includes(search) ||
          booking.sellerId?.name?.toLowerCase().includes(search);

        const matchesStatus =
          statusFilter === "all" || booking.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .map((booking) => ({
        id: booking._id,
        serviceImage: getFullImageUrl(booking.gigId?.images?.[0]?.url),
        serviceTitle: booking.gigId?.title || "Service",
        serviceDescription:
          booking.jobDescription || "No description available",
        emergencyTag: booking.emergency ? "Emergency" : null,
        statusTag:
          booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) ||
          "Unknown",
        workerImage: getFullImageUrl(booking.sellerId?.profilePicture),
        workerName: booking.sellerId?.name || "Worker",
        workerRating: booking.sellerId?.rating || "N/A",
        date: booking.date
          ? new Date(booking.date).toLocaleDateString()
          : "TBD",
        time:
          booking.timeSlot?.charAt(0).toUpperCase() +
            booking.timeSlot?.slice(1) || "TBD",
        location: booking.location
          ? `${booking.location.lat.toFixed(4)}, ${booking.location.lng.toFixed(
              4
            )}`
          : "Location TBD",
        price: booking.price || "Price TBD",
        workerId: booking.sellerId?._id,
      }));
  }, [data, searchTerm, statusFilter]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#7FCBF4]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-3">
            {error?.data?.message || "Failed to load bookings"}
          </p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-[#7FCBF4] text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Hero
        place="customer-bookings"
        title="My Bookings"
        subtitle="Track and manage your service bookings"
        className="h-50 md:h-70 lg:h-60"
      />

      <div className="px-4 pb-5 sm:py-5 max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search bookings, services, or workers"
              className="
                w-full h-11
                pl-11 pr-4
                text-sm text-gray-700
                bg-white
                border border-gray-200
                rounded-xl
                shadow-sm
                transition-all duration-200
                placeholder:text-gray-400
                focus:outline-none
                focus:border-[#7FCBF4]
                focus:ring-4 focus:ring-[#7FCBF4]/20
                hover:border-gray-300
              "
            />
          </div>

          <Dropdown
            icon={<Filter size={16} className="mr-2 text-gray-400" />}
            placeholder="Filter Status"
            options={statusOptions}
            isOpen={open}
            value={
              statusFilter === "all"
                ? ""
                : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)
            }
            onToggle={() => setOpen((v) => !v)}
            onClose={() => setOpen(false)}
            onSelect={(val) => setStatusFilter(val.toLowerCase())}
            className="min-w-[180px]"
          />
        </div>

        {bookings.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <JobCard
                key={booking.id}
                {...booking}
                bookingId={booking.id}
                onViewDetails={() =>
                  navigate(`/customer-booking/${booking.id}`)
                }
                messageButtonRole="customer"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            {searchTerm || statusFilter !== "all"
              ? "No bookings match your filters"
              : "No bookings found"}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerBookings;
