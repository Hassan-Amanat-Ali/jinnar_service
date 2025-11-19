import React, { useState } from "react";
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
import { useGetMyOrdersQuery } from "../../services/workerApi";

const MyBookings = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { color: "bg-yellow-100 text-yellow-800", text: "Pending" },
      accepted: { color: "bg-blue-100 text-blue-800", text: "Accepted" },
      "in-progress": { color: "bg-purple-100 text-purple-800", text: "In Progress" },
      completed: { color: "bg-green-100 text-green-800", text: "Completed" },
      cancelled: { color: "bg-red-100 text-red-800", text: "Cancelled" },
      declined: { color: "bg-gray-100 text-gray-800", text: "Declined" },
    };
    const badge = statusMap[status?.toLowerCase()] || statusMap.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  // Filter orders
  const filteredOrders = orders?.filter(order => {
    const matchesFilter = filter === "All" || order.status?.toLowerCase() === filter.toLowerCase();
    const matchesSearch = !searchTerm || 
      order.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  // Group orders by status
  const orderCounts = {
    all: orders?.length || 0,
    pending: orders?.filter(o => o.status?.toLowerCase() === 'pending').length || 0,
    accepted: orders?.filter(o => o.status?.toLowerCase() === 'accepted').length || 0,
    'in-progress': orders?.filter(o => o.status?.toLowerCase() === 'in-progress').length || 0,
    completed: orders?.filter(o => o.status?.toLowerCase() === 'completed').length || 0,
    cancelled: orders?.filter(o => o.status?.toLowerCase() === 'cancelled').length || 0,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-2">Error loading bookings</div>
          <div className="text-sm text-gray-500">
            {error?.data?.message || "Please try again later"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Hero
        place="My Bookings"
        title="My Bookings"
        subtitle="Manage all your service bookings"
        className="h-28 sm:h-32 md:h-48 lg:h-48"
      />

      <section className="w-full">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div 
              onClick={() => setFilter("All")}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                filter === "All" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-2xl font-bold text-gray-900">{orderCounts.all}</div>
              <div className="text-sm text-gray-600">All Orders</div>
            </div>
            <div 
              onClick={() => setFilter("Pending")}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                filter === "Pending" ? "border-yellow-500 bg-yellow-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-2xl font-bold text-yellow-800">{orderCounts.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div 
              onClick={() => setFilter("Accepted")}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                filter === "Accepted" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-2xl font-bold text-blue-800">{orderCounts.accepted}</div>
              <div className="text-sm text-gray-600">Accepted</div>
            </div>
            <div 
              onClick={() => setFilter("In-Progress")}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                filter === "In-Progress" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-2xl font-bold text-purple-800">{orderCounts['in-progress']}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div 
              onClick={() => setFilter("Completed")}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                filter === "Completed" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-2xl font-bold text-green-800">{orderCounts.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div 
              onClick={() => setFilter("Cancelled")}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                filter === "Cancelled" ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-2xl font-bold text-red-800">{orderCounts.cancelled}</div>
              <div className="text-sm text-gray-600">Cancelled</div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by service, booking ID, or customer..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => navigate(`/worker/booking/${order._id}`)}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">
                            {order.serviceName || "Service"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Booking ID: {order.orderId || order._id}
                          </p>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4 text-blue-600" />
                          <span>{order.customerId?.name || order.customerId?.mobileNumber || "Customer"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span>{formatDate(order.scheduledDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span>{order.scheduledTime || "Time TBD"}</span>
                        </div>
                      </div>

                      {order.location?.address && (
                        <div className="flex items-start gap-2 text-sm text-gray-600 mt-2">
                          <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                          <span className="line-clamp-1">{order.location.address}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-row lg:flex-col items-end lg:items-end gap-2 lg:gap-1">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          TZS {order.price?.toLocaleString() || '0'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.pricingType || "Fixed Price"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Filter className="w-16 h-16 mx-auto" />
                </div>
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
