import {
  Check,
  Star,
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  User,
  Eye,
  ArrowRight,
  ArrowLeft,
  Info,
  Loader2,
} from "lucide-react";
import ali from "../../assets/images/ali-hassan.jpg";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetOrderByIdQuery } from "../../services/workerApi";
import { useStartConversationMutation } from "../../services/customerApi";
import { getFullImageUrl } from "../../utils/fileUrl.js";

const BookingConfirm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  const { data, isLoading, error } = useGetOrderByIdQuery(orderId, {
    skip: !orderId,
  });
  const [startConversation] = useStartConversationMutation();

  const order = data;
  const seller = order?.sellerId;

  // Debug logging
  console.log("BookingConfirm - Raw data:", data);
  console.log("BookingConfirm - Extracted order:", order);
  console.log("BookingConfirm - Seller info:", seller);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time slot
  const formatTimeSlot = (slot) => {
    const slots = {
      morning: "9:00 AM – 12:00 PM",
      afternoon: "12:00 PM – 3:00 PM",
      evening: "3:00 PM – 6:00 PM",
    };
    return slots[slot] || slot;
  };

  // Handle chat navigation
  const handleChatClick = async () => {
    if (!seller?._id) return;
    try {
      const result = await startConversation({
        participantId: seller._id,
      }).unwrap();
      navigate(`/customer-chat?conversation=${result.conversation._id}`, { state: { conversationId: result.conversation._id } });
    } catch (err) {
      console.error("Failed to start conversation:", err);
      navigate(`/customer-chat?conversation=${seller._id}`);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[70vh] bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#74C7F2] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="min-h-[70vh] bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold mb-2">
            Failed to load booking details
          </p>
          <p className="text-gray-600 mb-4">
            {error?.data?.error || "Order not found"}
          </p>
          <button
            onClick={() => navigate("/customer-home")}
            className="px-6 py-2 bg-[#74C7F2] text-white rounded-lg hover:opacity-90"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="bg-white rounded-[28px] border border-neutral-200 shadow-xl p-6 sm:p-10">
          {/* Top icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-[#DBF0FF] to-[#74C7F2] shadow-lg ring-4 ring-[#74C7F2]/10 flex items-center justify-center">
              <Check
                className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                strokeWidth={3}
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-center mt-4">
            Booking Confirmed! 🎉
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Your booking with {seller?.name || "the worker"} has been
            successfully placed.
          </p>

          {/* Worker summary card */}
          <div className="mt-6 sm:mt-8 rounded-xl border border-[#74C7F2]/30 bg-[#DBF0FF] p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Left: worker */}
              <div className="flex items-center gap-3">
                <img
                  src={
                    getFullImageUrl(seller?.profilePicture || seller?.profileImage) || ali
                  }
                  alt={seller?.name || "Worker"}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = ali;
                  }}
                />
                <div>
                  <p className="text-sm sm:text-base font-semibold">
                    {seller?.name || "Worker"}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-700">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`w-3.5 h-3.5 ${
                          index < Math.round(seller?.rating?.average || 0)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                      />
                    ))}
                    <span className="ml-1">
                      {seller?.rating?.average?.toFixed(1) || "0.0"} (
                      {seller?.rating?.count || 0} Reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: date/time and address (stacked rows) */}
              <div className="text-xs sm:text-sm text-gray-800 sm:text-left ">
                <div className="flex items-start gap-2 justify-start ">
                  <Calendar className="w-4 h-4 text-[#74C7F2] mt-0.5" />
                  <div className="leading-tight">
                    <p className="font-medium">{formatDate(order.date)}</p>
                    <p>{formatTimeSlot(order.timeSlot)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 mt-2 justify-start sm:justify-end ">
                  <MapPin className="w-4 h-4 text-[#74C7F2] mt-0.5" />
                  <p className="max-w-[220px] sm:max-w-[200px] leading-tight">
                    Lat: {order.location?.lat?.toFixed(4)}, Lng:{" "}
                    {order.location?.lng?.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom row: booking id + payment */}
            <div className="mt-4 pt-4 border-t border-white/70 grid grid-cols-2 text-xs sm:text-sm">
              <div>
                <p className="text-gray-700">Booking ID:</p>
                <p className="font-semibold">
                  {order._id?.slice(-8).toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-700">Status:</p>
                <p className="font-semibold capitalize">{order.status}</p>
              </div>
            </div>
          </div>

          {/* What's next */}
          <p className="mt-7 sm:mt-8 text-center text-sm font-semibold text-gray-800">
            What's next?
          </p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={handleChatClick}
              className="rounded-xl border border-neutral-200 bg-white p-4 text-center hover:bg-[#DBF0FF] transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[#DBF0FF] mx-auto flex items-center justify-center mb-2">
                <MessageSquare className="w-5 h-5 text-[#74C7F2]" />
              </div>
              <p className="text-sm font-medium">Chat with Worker</p>
              <p className="text-xs text-gray-600">Discuss Detail</p>
            </button>
            <button
              onClick={() => navigate(`/worker-profile/${seller?._id}`)}
              className="rounded-xl border border-neutral-200 bg-white p-4 text-center hover:bg-[#DBF0FF] transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[#DBF0FF] mx-auto flex items-center justify-center mb-2">
                <User className="w-5 h-5 text-[#74C7F2]" />
              </div>
              <p className="text-sm font-medium">View Worker Profile</p>
              <p className="text-xs text-gray-600">See Review and Work</p>
            </button>
            <button
              onClick={() => navigate(`/customer-booking/${order._id}`)}
              className="rounded-xl border border-neutral-200 bg-white p-4 text-center hover:bg-[#DBF0FF] transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[#DBF0FF] mx-auto flex items-center justify-center mb-2">
                <Eye className="w-5 h-5 text-[#74C7F2]" />
              </div>
              <p className="text-sm font-medium">View Booking Detail</p>
              <p className="text-xs text-gray-600">Track Progress</p>
            </button>
          </div>

          {/* CTA buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#74C7F2] to-[#74C7F2] text-white py-3 rounded-xl font-medium hover:opacity-95 transition-all shadow"
              onClick={() => navigate(`/customer-booking/${order._id}`)}
            >
              Go to Booking Details
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              className="flex-1 inline-flex items-center justify-center gap-2 border border-[#74C7F2] text-[#74C7F2] py-3 rounded-xl font-medium hover:bg-[#DBF0FF] transition-colors"
              onClick={() => navigate("/customer-home")}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </div>

          {/* Tip */}
          <div className="mt-6 pt-4 border-t border-neutral-200 text-xs sm:text-sm text-gray-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-500 mt-0.5" />
            <p>
              Tip: Your worker will contact you shortly to confirm details. You
              can message them anytime from your booking details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirm;
