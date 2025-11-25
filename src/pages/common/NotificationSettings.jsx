import { useState, useMemo } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Calendar,
  MessageSquare,
  Package,
  Star,
  User,
  Filter,
  Search,
  Loader2,
  Clock,
  MoreVertical,
  ChevronDown,
} from "lucide-react";
import Hero from "../../components/common/Hero";
import { useAuth } from "../../context/AuthContext";
import {
  useGetNotificationsQuery,
  useMarkNotificationsAsReadMutation,
} from "../../services/customerApi";
import {
  useGetNotificationsQuery as useGetWorkerNotificationsQuery,
  useMarkNotificationsAsReadMutation as useMarkWorkerNotificationsAsReadMutation,
} from "../../services/workerApi";
import { ROLES } from "../../constants/roles";

const Notifications = () => {
  const { user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Use appropriate API based on user role
  const isWorker = user?.role === ROLES.WORKER;

  // Call both hooks but skip the unused one
  const {
    data: customerNotifications = [],
    isLoading: customerLoading,
    error: customerError,
    refetch: customerRefetch,
  } = useGetNotificationsQuery(undefined, { skip: isWorker });

  const {
    data: workerNotifications = [],
    isLoading: workerLoading,
    error: workerError,
    refetch: workerRefetch,
  } = useGetWorkerNotificationsQuery(undefined, { skip: !isWorker });

  const [markCustomerAsRead] = useMarkNotificationsAsReadMutation();
  const [markWorkerAsRead] = useMarkWorkerNotificationsAsReadMutation();

  // Use the appropriate data based on role
  const notifications = isWorker ? workerNotifications : customerNotifications;
  const isLoading = isWorker ? workerLoading : customerLoading;
  const error = isWorker ? workerError : customerError;
  const refetch = isWorker ? workerRefetch : customerRefetch;
  const markAsRead = isWorker ? markWorkerAsRead : markCustomerAsRead;

  // Filter options
  const filters = [
    { value: "all", label: "All Notifications", count: notifications.length },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "week", label: "Last Week" },
    { value: "month", label: "Last Month" },
    { value: "year", label: "Last Year" },
    { value: "older", label: "Year Before" },
  ];

  // Helper function to check if date is within range
  const isDateInRange = (date, range) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffTime = now - notificationDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    switch (range) {
      case "today":
        return diffDays <= 1;
      case "yesterday":
        return diffDays === 2;
      case "week":
        return diffDays <= 7 && diffDays > 2;
      case "month":
        return diffDays <= 30 && diffDays > 7;
      case "year":
        return diffDays <= 365 && diffDays > 30;
      case "older":
        return diffDays > 365;
      default:
        return true;
    }
  };

  // Filter and search notifications
  const filteredNotifications = useMemo(() => {
    // Create a copy of the array to avoid mutating the original
    let filtered = [...notifications];

    // Apply date filter
    if (selectedFilter !== "all") {
      filtered = filtered.filter((notification) =>
        isDateInRange(notification.createdAt, selectedFilter)
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((notification) =>
        notification.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [notifications, selectedFilter, searchTerm]);

  // Update filter counts
  const updatedFilters = filters.map((filter) => ({
    ...filter,
    count:
      filter.value === "all"
        ? notifications.length
        : notifications.filter((notification) =>
            isDateInRange(notification.createdAt, filter.value)
          ).length,
  }));

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking":
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case "message":
        return <MessageSquare className="w-5 h-5 text-green-600" />;
      case "payment":
        return <Package className="w-5 h-5 text-purple-600" />;
      case "review":
        return <Star className="w-5 h-5 text-yellow-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Handle mark as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead({ notificationId }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAsRead({}).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#74C7F2] mx-auto mb-4" />
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Failed to load notifications</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-[#74C7F2] text-white rounded-lg hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero
        place="Notifications"
        title="Notifications"
        subtitle="Stay updated with all your important activities"
        className="h-48 md:h-64 lg:h-72"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Filter size={20} className="text-gray-500" />
                <span className="font-medium">
                  {
                    updatedFilters.find((f) => f.value === selectedFilter)
                      ?.label
                  }
                </span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>

              {showFilterDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                  {updatedFilters.map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => {
                        setSelectedFilter(filter.value);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 ${
                        selectedFilter === filter.value
                          ? "bg-[#EAF6FF] text-[#74C7F2]"
                          : ""
                      } ${filter === updatedFilters[0] ? "rounded-t-xl" : ""} ${
                        filter === updatedFilters[updatedFilters.length - 1]
                          ? "rounded-b-xl"
                          : ""
                      }`}
                    >
                      <span>{filter.label}</span>
                      <span className="text-sm text-gray-500">
                        {filter.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mark All as Read */}
            {filteredNotifications.some((n) => !n.isRead) && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 px-4 py-3 bg-[#74C7F2] text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                <CheckCheck size={20} />
                <span>Mark All Read</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white rounded-2xl border transition-all hover:shadow-md ${
                  notification.isRead
                    ? "border-gray-100"
                    : "border-[#74C7F2] bg-[#EAF6FF]/30"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`p-3 rounded-xl ${
                        notification.isRead ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p
                            className={`text-sm leading-relaxed ${
                              notification.isRead
                                ? "text-gray-600"
                                : "text-gray-900 font-medium"
                            }`}
                          >
                            {notification.content}
                          </p>

                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock size={12} />
                              <span>{formatTime(notification.createdAt)}</span>
                            </div>

                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                notification.type === "booking"
                                  ? "bg-blue-100 text-blue-700"
                                  : notification.type === "message"
                                  ? "bg-green-100 text-green-700"
                                  : notification.type === "payment"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {notification.type}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="p-2 text-gray-400 hover:text-[#74C7F2] transition-colors"
                              title="Mark as read"
                            >
                              <Check size={16} />
                            </button>
                          )}

                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Notifications Found
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? `No notifications match "${searchTerm}"`
                  : selectedFilter === "all"
                  ? "You don't have any notifications yet"
                  : `No notifications for ${updatedFilters
                      .find((f) => f.value === selectedFilter)
                      ?.label?.toLowerCase()}`}
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        {filteredNotifications.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500">
            Showing {filteredNotifications.length} of {notifications.length}{" "}
            notifications
            {searchTerm && ` for "${searchTerm}"`}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
