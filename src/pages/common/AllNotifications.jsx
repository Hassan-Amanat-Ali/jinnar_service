import { useState, useMemo } from "react";
import {
  Bell,
  CheckCircle,
  MessageSquare,
  Calendar,
  AlertCircle,
  Filter,
  Check,
  Loader2,
  Circle,
  ChevronDown,
  Clock,
  User,
} from "lucide-react";
import { 
  useGetNotificationsQuery, 
  useMarkNotificationsAsReadMutation 
} from "../../services/customerApi";
import { 
  useGetNotificationsQuery as useWorkerGetNotificationsQuery,
  useMarkNotificationsAsReadMutation as useWorkerMarkNotificationsAsReadMutation 
} from "../../services/workerApi";
import { useAuth } from "../../context/AuthContext";

// Notification type icons and colors
const getNotificationIcon = (type) => {
  switch (type) {
    case "booking":
      return { icon: Calendar, color: "text-blue-500", bg: "bg-blue-100" };
    case "message":
      return { icon: MessageSquare, color: "text-green-500", bg: "bg-green-100" };
    case "payment":
      return { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-100" };
    case "system":
      return { icon: Bell, color: "text-purple-500", bg: "bg-purple-100" };
    default:
      return { icon: AlertCircle, color: "text-gray-500", bg: "bg-gray-100" };
  }
};

// Time filters
const timeFilters = [
  { key: "today", label: "Today", days: 0 },
  { key: "yesterday", label: "Yesterday", days: 1 },
  { key: "last_week", label: "Last Week", days: 7 },
  { key: "last_month", label: "Last Month", days: 30 },
  { key: "last_year", label: "Last Year", days: 365 },
  { key: "year_before", label: "Year Before", days: 730 },
];

// Notification Item Component
const NotificationItem = ({ notification, onMarkAsRead }) => {
  const { icon: Icon, color, bg } = getNotificationIcon(notification.type);
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return diffInMinutes < 1 ? "Just now" : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead([notification._id]);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-start gap-3 p-4 rounded-lg border transition-all cursor-pointer hover:shadow-sm ${
        notification.isRead
          ? "border-gray-100 bg-white"
          : "border-blue-100 bg-blue-50/50 shadow-sm"
      }`}
    >
      {/* Icon */}
      <div className={`shrink-0 w-10 h-10 rounded-full ${bg} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm leading-relaxed ${notification.isRead ? "text-gray-700" : "text-gray-900 font-medium"}`}>
            {notification.content}
          </p>
          {!notification.isRead && (
            <Circle className="w-2.5 h-2.5 fill-blue-500 text-blue-500 shrink-0 mt-1.5" />
          )}
        </div>
        
        {/* Time and type */}
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatTime(notification.createdAt)}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <span className="capitalize">{notification.type}</span>
        </div>
      </div>
    </div>
  );
};

// Filter Dropdown Component
const FilterDropdown = ({ selectedFilter, onFilterChange, notificationCounts }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Filter className="w-4 h-4" />
        {timeFilters.find(f => f.key === selectedFilter)?.label || "All Time"}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="py-2">
            <button
              onClick={() => {
                onFilterChange("all");
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 ${
                selectedFilter === "all" ? "text-blue-600 bg-blue-50" : "text-gray-700"
              }`}
            >
              All Time
              <span className="text-xs text-gray-500">
                ({notificationCounts.all})
              </span>
            </button>
            {timeFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => {
                  onFilterChange(filter.key);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 ${
                  selectedFilter === filter.key ? "text-blue-600 bg-blue-50" : "text-gray-700"
                }`}
              >
                {filter.label}
                <span className="text-xs text-gray-500">
                  ({notificationCounts[filter.key] || 0})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AllNotifications = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const { user } = useAuth();

  // Always call both hooks, then use the appropriate one
  const customerData = useGetNotificationsQuery();
  const workerData = useWorkerGetNotificationsQuery();
  const [customerMarkAsRead] = useMarkNotificationsAsReadMutation();
  const [workerMarkAsRead] = useWorkerMarkNotificationsAsReadMutation();

  // Use appropriate data based on user role
  const isWorker = user?.role === 'worker' || user?.role === 'seller';
  const { data: notifications = [], isLoading, error, refetch } = isWorker ? workerData : customerData;
  const markAsRead = isWorker ? workerMarkAsRead : customerMarkAsRead;

  // Filter notifications by time period
  const filteredNotifications = useMemo(() => {
    if (!notifications.length) return [];

    let filtered = notifications;

    // Filter by time period
    if (selectedFilter !== "all") {
      const now = new Date();
      
      if (selectedFilter === "today") {
        // Today: from midnight today to now
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        
        filtered = filtered.filter(notification => {
          const notificationDate = new Date(notification.createdAt);
          return notificationDate >= startOfDay && notificationDate <= now;
        });
        
      } else if (selectedFilter === "yesterday") {
        // Yesterday: from midnight yesterday to end of yesterday
        const startOfYesterday = new Date(now);
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);
        startOfYesterday.setHours(0, 0, 0, 0);
        
        const endOfYesterday = new Date(startOfYesterday);
        endOfYesterday.setHours(23, 59, 59, 999);
        
        filtered = filtered.filter(notification => {
          const notificationDate = new Date(notification.createdAt);
          return notificationDate >= startOfYesterday && notificationDate <= endOfYesterday;
        });
        
      } else if (selectedFilter === "last_week") {
        // Last week: 7 days ago to 2 days ago (excluding today and yesterday)
        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() - 2);
        endDate.setHours(23, 59, 59, 999);
        
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        
        filtered = filtered.filter(notification => {
          const notificationDate = new Date(notification.createdAt);
          return notificationDate >= startDate && notificationDate <= endDate;
        });
        
      } else if (selectedFilter === "last_month") {
        // Last month: 30 days ago to 8 days ago
        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() - 8);
        endDate.setHours(23, 59, 59, 999);
        
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
        
        filtered = filtered.filter(notification => {
          const notificationDate = new Date(notification.createdAt);
          return notificationDate >= startDate && notificationDate <= endDate;
        });
        
      } else if (selectedFilter === "last_year") {
        // Last year: 365 days ago to 31 days ago
        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() - 31);
        endDate.setHours(23, 59, 59, 999);
        
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 365);
        startDate.setHours(0, 0, 0, 0);
        
        filtered = filtered.filter(notification => {
          const notificationDate = new Date(notification.createdAt);
          return notificationDate >= startDate && notificationDate <= endDate;
        });
        
      } else if (selectedFilter === "year_before") {
        // Year before: older than 365 days
        const cutoffDate = new Date(now);
        cutoffDate.setDate(cutoffDate.getDate() - 365);
        cutoffDate.setHours(23, 59, 59, 999);
        
        filtered = filtered.filter(notification => {
          const notificationDate = new Date(notification.createdAt);
          return notificationDate <= cutoffDate;
        });
      }
    }

    // Filter by read status
    if (showUnreadOnly) {
      filtered = filtered.filter(notification => !notification.isRead);
    }

    // Create a copy before sorting to avoid mutating the original array
    return filtered.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [notifications, selectedFilter, showUnreadOnly]);

  // Calculate notification counts for each filter
  const notificationCounts = useMemo(() => {
    const counts = { all: notifications.length };
    
    timeFilters.forEach(filter => {
      const now = new Date();
      
      if (filter.key === "today") {
        // Only today's notifications
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);
        
        counts[filter.key] = notifications.filter(n => {
          const notificationDate = new Date(n.createdAt);
          return notificationDate >= startOfToday && notificationDate <= now;
        }).length;
        
      } else if (filter.key === "yesterday") {
        // Only yesterday's notifications
        const startOfYesterday = new Date(now);
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);
        startOfYesterday.setHours(0, 0, 0, 0);
        
        const endOfYesterday = new Date(startOfYesterday);
        endOfYesterday.setHours(23, 59, 59, 999);
        
        counts[filter.key] = notifications.filter(n => {
          const notificationDate = new Date(n.createdAt);
          return notificationDate >= startOfYesterday && notificationDate <= endOfYesterday;
        }).length;
        
      } else if (filter.key === "last_week") {
        // Notifications from 7 days ago to 2 days ago (excluding today and yesterday)
        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() - 2);
        endDate.setHours(23, 59, 59, 999);
        
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        
        counts[filter.key] = notifications.filter(n => {
          const notificationDate = new Date(n.createdAt);
          return notificationDate >= startDate && notificationDate <= endDate;
        }).length;
        
      } else if (filter.key === "last_month") {
        // Notifications from 30 days ago to 8 days ago (excluding last week, yesterday, today)
        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() - 8);
        endDate.setHours(23, 59, 59, 999);
        
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
        
        counts[filter.key] = notifications.filter(n => {
          const notificationDate = new Date(n.createdAt);
          return notificationDate >= startDate && notificationDate <= endDate;
        }).length;
        
      } else if (filter.key === "last_year") {
        // Notifications from 365 days ago to 31 days ago
        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() - 31);
        endDate.setHours(23, 59, 59, 999);
        
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 365);
        startDate.setHours(0, 0, 0, 0);
        
        counts[filter.key] = notifications.filter(n => {
          const notificationDate = new Date(n.createdAt);
          return notificationDate >= startDate && notificationDate <= endDate;
        }).length;
        
      } else if (filter.key === "year_before") {
        // Notifications older than 365 days
        const cutoffDate = new Date(now);
        cutoffDate.setDate(cutoffDate.getDate() - 365);
        cutoffDate.setHours(23, 59, 59, 999);
        
        counts[filter.key] = notifications.filter(n => {
          const notificationDate = new Date(n.createdAt);
          return notificationDate <= cutoffDate;
        }).length;
      }
    });

    return counts;
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Mark notifications as read
  const handleMarkAsRead = async (notificationIds) => {
    try {
      await markAsRead({ notificationIds }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n._id);
    if (unreadIds.length > 0) {
      await handleMarkAsRead(unreadIds);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#74C7F2] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load notifications</h3>
          <p className="text-gray-600 mb-4">Please try refreshing the page</p>
          <button
            onClick={refetch}
            className="px-6 py-2 bg-[#74C7F2] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Simple Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600">Stay updated with your latest activities</p>
        </div>
        {/* Filters and actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"} • {notifications.length} total
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Unread filter toggle */}
            <button
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border rounded-lg transition-colors ${
                showUnreadOnly
                  ? "bg-[#74C7F2] text-white border-[#74C7F2]"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Circle className={`w-3 h-3 ${showUnreadOnly ? "fill-white" : "fill-blue-500 text-blue-500"}`} />
              Unread Only
            </button>

            {/* Time filter dropdown */}
            <FilterDropdown
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
              notificationCounts={notificationCounts}
            />

            {/* Mark all as read */}
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#74C7F2] bg-white border border-[#74C7F2] rounded-lg hover:bg-[#74C7F2] hover:text-white transition-colors"
              >
                <Check className="w-4 h-4" />
                Mark All Read
              </button>
            )}
          </div>
        </div>

        {/* Notifications list */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {showUnreadOnly ? "No unread notifications" : "No notifications found"}
            </h3>
            <p className="text-gray-600">
              {showUnreadOnly 
                ? "All your notifications have been read"
                : selectedFilter === "all" 
                  ? "You'll see your notifications here when you receive them"
                  : `No notifications found for ${timeFilters.find(f => f.key === selectedFilter)?.label.toLowerCase()}`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllNotifications;
