import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../../components/common/Hero";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Loader2,
  Search,
  Filter,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useGetMyOrdersQuery } from "../../services/workerApi";
import { reverseGeocode } from "../../utils/fileUrl.js";

const MyBookings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: apiResponse, isLoading, error } = useGetMyOrdersQuery();

  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [locations, setLocations] = useState({});

  // Filter worker's bookings
  const orders = (
    Array.isArray(apiResponse)
      ? apiResponse
      : apiResponse?.orders || apiResponse?.data || []
  ).filter((order) => order.sellerId?._id == user?._id);

  // Fetch reverse geocoded locations
  useEffect(() => {
    const fetchLocations = async () => {
      const newLocations = {};
      for (const order of orders) {
        if (order.location) {
          newLocations[order._id] = await reverseGeocode(order.location);
        }
      }
      setLocations(newLocations);
    };
    fetchLocations();
  }, [orders]);

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Not specified";

  const formatTimeSlot = (timeSlot) => {
    const slots = {
      morning: "Morning (8AM - 12PM)",
      afternoon: "Afternoon (12PM - 5PM)",
      evening: "Evening (5PM - 9PM)",
    };
    return slots[timeSlot?.toLowerCase()] || timeSlot || "Time TBD";
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { color: "bg-yellow-100 text-yellow-800", text: "Pending" },
      accepted: { color: "bg-blue-100 text-blue-800", text: "Accepted" },
      "in-progress": {
        color: "bg-purple-100 text-purple-800",
        text: "In Progress",
      },
      completed: { color: "bg-green-100 text-green-800", text: "Completed" },
      cancelled: { color: "bg-red-100 text-red-800", text: "Cancelled" },
      declined: { color: "bg-gray-100 text-gray-800", text: "Declined" },
    };
    const badge = statusMap[status?.toLowerCase()] || statusMap.pending;
    return (
      <span
        className={`px-3 py-1 rounded-full h-fit text-xs font-medium ${badge.color}`}
      >
        {badge.text}
      </span>
    );
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      filter === "All" || order.status?.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      order.gigId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.jobDescription?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const orderCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    accepted: orders.filter((o) => o.status === "accepted").length,
    "in-progress": orders.filter((o) => o.status === "in-progress").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-2">
            Error loading bookings
          </div>
          <div className="text-sm text-gray-500">
            {error?.data?.message || "Please try again later"}
          </div>
        </div>
      </div>
    );

  return (
    <div>
      <Hero
        place="My Bookings"
        title="My Bookings"
        subtitle="Manage all your service bookings"
        className="h-48 sm:h-46 md:h-55 lg:h-58"
      />

      <section className="w-full">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
            <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-full overflow-x-auto">
              {[
                { label: "All", count: orderCounts.all },
                { label: "Pending", count: orderCounts.pending },
                { label: "Accepted", count: orderCounts.accepted },
                { label: "In-Progress", count: orderCounts["in-progress"] },
                { label: "Completed", count: orderCounts.completed },
                { label: "Cancelled", count: orderCounts.cancelled },
              ].map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => setFilter(tab.label)}
                  className={`flex-1 min-w-fit px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    filter === tab.label
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by service, booking ID, customer name, or description..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredOrders.length ? (
              filteredOrders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => navigate(`/worker/booking/${order._id}`)}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">
                            {order.gigId?.title || "Service"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Booking ID: {order._id}
                          </p>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>

                      {order.jobDescription && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {order.jobDescription}
                        </p>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4 text-blue-600" />
                          <span>
                            {order.buyerId?.name ||
                              order.buyerId?.mobileNumber ||
                              "Customer"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span>{formatDate(order.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span>{formatTimeSlot(order.timeSlot)}</span>
                        </div>
                      </div>

                      {order.location && locations[order._id] && (
                        <div className="flex items-start gap-2 text-sm text-gray-600 mt-2">
                          <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                          <span>Location: {locations[order._id]}</span>
                        </div>
                      )}

                      {order.emergency && (
                        <div className="mt-2">
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            Emergency
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <Filter className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No bookings found
                </h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : filter !== "All"
                    ? `You have no ${filter.toLowerCase()} bookings`
                    : "You don't have any bookings yet"}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyBookings;
