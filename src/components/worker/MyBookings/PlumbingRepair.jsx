import React from "react";
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

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-5 last:mb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-3 sm:gap-4 md:gap-6">
        {/* Left: Details */}
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-sky-50 text-sky-500 ring-1 ring-sky-100 flex items-center justify-center shrink-0">
            {getIcon(booking.category)}
          </div>
          <div>
            {/* Title */}
            <h3 className="text-[14px] sm:text-[15px] font-semibold text-gray-900">
              {booking.title}
            </h3>

            {/* Customer + Rating */}
            <div className="mt-0.5 flex items-center gap-1.5 sm:gap-2 text-[12px] sm:text-[13px] text-gray-700">
              <span className="inline-flex items-center gap-1">
                <span className="h-4.5 w-4.5 sm:h-5 sm:w-5 rounded-full bg-gray-100 text-gray-600 text-[9px] sm:text-[10px] font-semibold flex items-center justify-center">
                  {getInitials(booking.customer)}
                </span>
                <span className="font-medium">{booking.customer}</span>
              </span>
              <span className="inline-flex items-center gap-0.5 text-amber-600 text-xs">
                <Star size={11} className="fill-amber-400 text-amber-400" />
                {booking.rating}
              </span>
            </div>

            {/* Meta Info */}
            <div className="mt-1.5 sm:mt-2 flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 text-[11px] sm:text-xs text-gray-600">
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={12} className="text-gray-400" /> {booking.date}
              </span>
            </div>

            {/* Description */}
            <p className="mt-1.5 sm:mt-2 text-[12px] sm:text-[13px] text-gray-600">
              {booking.description}
            </p>
          </div>
        </div>
        {/* center detail  */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start sm:gap-4 md:gap-6">
          <p className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-500">
            <Clock1 size={12} />
            {booking.time} ({booking.duration})
          </p>
          <p className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-500">
            <MapPin size={12} /> {booking.location}
          </p>
        </div>
        {/* Right Details  */}
        <div className="flex items-end md:items-end justify-between md:justify-end gap-2.5 sm:gap-3">
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5 sm:gap-2">
              {booking.status && (
                <Pill color={booking.statusColor}>{booking.status}</Pill>
              )}
              {booking.paymentStatus && (
                <Pill color="bg-gray-100 text-gray-600 border border-gray-200">
                  {booking.paymentStatus}
                </Pill>
              )}
            </div>
            <div className="mt-1.5 sm:mt-2 text-emerald-600 font-semibold text-[13px] sm:text-sm">
              $ {booking.price}
            </div>
          </div>
          <button className="inline-flex items-center justify-center bg-[#87CEEB] text-white rounded-lg px-2.5 sm:px-4 py-1.5 sm:py-2 font-medium shadow-sm gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-nowrap ">
            <Eye size={11} />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

const PlumbingRepair = () => {
  const bookings = [
    {
      id: 1,
      title: "Plumbing Repair",
      category: "Plumbing",
      customer: "Sarah Johnson",
      rating: 4.8,
      date: "1/12/2024",
      time: "09:00 AM",
      duration: "2–3 hours",
      location: "Kinondoni, Dar es Salaam",
      description: "Kitchen sink blockage repair",
      price: "TZS 50,000",
      status: "In Progress",
      statusColor: "bg-sky-50 text-sky-700 border border-sky-200",
      urgency: "Emergency",
    },
    {
      id: 2,
      title: "House Cleaning",
      category: "House Cleaning",
      customer: "Michael Chen",
      rating: 4.6,
      date: "1/13/2024",
      time: "10:30 AM",
      duration: "4 hours",
      location: "Mbezi, Dar es Salaam",
      description: "Deep cleaning for 3-bedroom apartment",
      price: "TZS 35,000",
      status: "Completed",
      statusColor: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      urgency: null,
    },
    {
      id: 3,
      title: "Electrical Installation",
      category: "Electrical",
      customer: "Fatima Hassan",
      rating: 4.9,
      date: "1/14/2024",
      time: "02:00 PM",
      duration: "3-4 hours",
      location: "Masaki, Dar es Salaam",
      description: "New electrical outlets installation",
      price: "TZS 75,000",
      status: "Pending",
      statusColor: "bg-amber-50 text-amber-700 border border-amber-200",
      paymentStatus: "Pending",
      urgency: null,
    },
    {
      id: 4,
      title: "Carpentry Work",
      category: "Carpentry",
      customer: "James Wilson",
      rating: 4.7,
      date: "1/15/2024",
      time: "11:30 AM",
      duration: "5-6 hours",
      location: "Oyster Bay, Dar es Salaam",
      description: "Custom bookshelf installation",
      price: "TZS 120,000",
      status: "Completed",
      statusColor: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      urgency: null,
    },
    {
      id: 5,
      title: "Garden Maintenance",
      category: "Garden Maintenance",
      customer: "Alice Mwangi",
      rating: 4.5,
      date: "1/16/2024",
      time: "09:00 AM",
      duration: "4 hours",
      location: "Msasani, Dar es Salaam",
      description: "Weekly garden maintenance and trimming",
      price: "TZS 40,000",
      status: "Pending",
      statusColor: "bg-amber-50 text-amber-700 border border-amber-200",
      urgency: null,
    },
  ];

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
};

export default PlumbingRepair;
