import {
  MapPin,
  Calendar,
  Star,
  Wrench,
  Sparkles,
  Zap as Lightning,
  Hammer,
  Scissors,
  Clock1,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../../services/workerApi";

const Pill = ({
  children,
  color = "bg-sky-50 text-sky-700 border border-sky-200",
}) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 sm:gap-1.5 sm:px-2.5 sm:py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium ${color}`}
  >
    {children}
  </span>
);

const BookingCard = ({ booking }) => {
  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const getIcon = (category) => {
    const icons = {
      Plumbing: <Wrench size={18} />,
      "House Cleaning": <Sparkles size={18} />,
      Electrical: <Lightning size={18} />,
      Carpentry: <Hammer size={18} />,
      "Garden Maintenance": <Scissors size={18} />,
    };
    return icons[category] || <Wrench size={18} />;
  };

  const getStatusColor = (status) => {
    const colors = {
      accepted: "bg-sky-50 text-sky-700 border border-sky-200",
      "in-progress": "bg-amber-50 text-amber-700 border border-amber-200",
      completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      cancelled: "bg-red-50 text-red-700 border border-red-200",
    };
    return colors[status] || "bg-gray-50 text-gray-700 border border-gray-200";
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString();
  };

  const formatLocation = () => {
    if (booking.location?.lat && booking.location?.lng) {
      return `${booking.location.lat.toFixed(2)}, ${booking.location.lng.toFixed(2)}`;
    }
    return 'Location not specified';
  };

  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-5 last:mb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-3 sm:gap-4 md:gap-6">
        {/* Left: Details */}
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-sky-50 text-sky-500 ring-1 ring-sky-100 flex items-center justify-center shrink-0">
            {getIcon("Service")}
          </div>
          <div>
            {/* Title */}
            <h3 className="text-[14px] sm:text-[15px] font-semibold text-gray-900">
              Service Request
            </h3>

            {/* Customer + Rating */}
            <div className="mt-0.5 flex items-center gap-1.5 sm:gap-2 text-[12px] sm:text-[13px] text-gray-700">
              <span className="inline-flex items-center gap-1">
                <span className="h-4.5 w-4.5 sm:h-5 sm:w-5 rounded-full bg-gray-100 text-gray-600 text-[9px] sm:text-[10px] font-semibold flex items-center justify-center">
                  {getInitials(booking.buyerId?.name)}
                </span>
                <span className="font-medium">{booking.buyerId?.name || "Unknown Customer"}</span>
              </span>
              <span className="inline-flex items-center gap-0.5 text-amber-600 text-xs">
                <Star size={11} className="fill-amber-400 text-amber-400" />
                {booking.buyerId?.rating?.average || "N/A"}
              </span>
            </div>

            {/* Meta Info */}
            <div className="mt-1.5 sm:mt-2 flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 text-[11px] sm:text-xs text-gray-600">
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={12} className="text-gray-400" /> {formatDate(booking.date)}
              </span>
            </div>

            {/* Description */}
            <p className="mt-1.5 sm:mt-2 text-[12px] sm:text-[13px] text-gray-600">
              {booking.jobDescription || "No description provided"}
            </p>
          </div>
        </div>
        {/* center detail  */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start sm:gap-4 md:gap-6">
          <p className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-500">
            <Clock1 size={12} />
            {booking.timeSlot || "TBD"}
          </p>
          <p className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-500">
            <MapPin size={12} /> {formatLocation()}
          </p>
        </div>
        {/* Right Details  */}
        <div className="flex items-end md:items-end justify-between md:justify-end gap-2.5 sm:gap-3">
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5 sm:gap-2">
              {booking.status && (
                <Pill color={getStatusColor(booking.status)}>{booking.status}</Pill>
              )}
              {booking.emergency && (
                <Pill color="bg-red-100 text-red-600 border border-red-200">
                  Emergency
                </Pill>
              )}
            </div>
            <div className="mt-1.5 sm:mt-2 text-emerald-600 font-semibold text-[13px] sm:text-sm">
              Price to be negotiated
            </div>
          </div>
          <button
            className="inline-flex items-center justify-center bg-[#87CEEB] text-white rounded-lg px-2.5 sm:px-4 py-1.5 sm:py-2 font-medium shadow-sm gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-nowrap "
            onClick={() => navigate(`/worker-booking/${booking._id}`)}
          >
            <Eye size={15} />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

const PlumbingRepair = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">Error loading bookings: {error.message}</p>
      </div>
    );
  }

  // Filter for accepted orders only
  const acceptedOrders = (orders?.orders || []).filter(order => 
    order.status === 'accepted' || order.status === 'in-progress' || order.status === 'completed'
  );

  if (acceptedOrders.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">No bookings found.</p>
        <p className="text-sm text-gray-400 mt-1">Accept job requests to see them here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {acceptedOrders.map((booking) => (
        <BookingCard key={booking._id} booking={booking} />
      ))}
    </div>
  );
};

export default PlumbingRepair;
