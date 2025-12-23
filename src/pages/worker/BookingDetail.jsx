import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Hero from "../../components/common/Hero";
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Phone,
  Mail,
  X,
  CircleCheck,
  CircleX,
  Loader2,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import MessageButton from "../../components/common/MessageButton";
import {
  useGetOrderByIdQuery,
  useAcceptJobMutation,
  useDeclineJobMutation,
  useReviewOrderMutation,
} from "../../services/workerApi";
import { getFullImageUrl, reverseGeocode } from "../../utils/fileUrl.js";
import { toast } from "react-hot-toast";

const LabelValue = ({ label, value, valueClass = "" }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-600">{label}</span>
    <span className={twMerge("font-semibold text-gray-900", valueClass)}>
      {value}
    </span>
  </div>
);

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
      className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}
    >
      {badge.text}
    </span>
  );
};

const SectionCard = ({ title, children, className = "", badge }) => (
  <div
    className={`rounded-2xl border border-gray-100 bg-white shadow-sm ${className}`}
  >
    {title && (
      <div className="px-4 sm:px-5 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-xl">{title}</h3>

          {badge && (
            <div className="flex justify-center">{getStatusBadge(badge)}</div>
          )}
        </div>
      </div>
    )}
    <div className={`px-4 sm:px-5 ${title ? "pb-5 pt-3" : "py-5"}`}>
      {children}
    </div>
  </div>
);

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [locationAddress, setLocationAddress] = useState(null);

  // Safely parse coordinates that might be numbers, numeric strings, or mongodb decimal objects
  const parseCoord = (val) => {
    if (val === null || val === undefined) return null;
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const n = Number(val);
      return Number.isFinite(n) ? n : null;
    }
    if (typeof val === "object") {
      // handle common MongoDB Decimal128 representation: { $numberDecimal: "12.34" }
      if (val.$numberDecimal) {
        const n = Number(val.$numberDecimal);
        return Number.isFinite(n) ? n : null;
      }
      // try value or toString fallback
      if (val.value) {
        const n = Number(val.value);
        if (Number.isFinite(n)) return n;
      }
      const n = Number(String(val));
      return Number.isFinite(n) ? n : null;
    }
    return null;
  };

  const formatLatLng = (loc) => {
    if (!loc) return "Not specified";
    const lat = parseCoord(loc.lat);
    const lng = parseCoord(loc.lng);
    if (lat === null && lng === null) return "Not specified";
    if (lat === null) return `Lng: ${lng.toFixed(4)}`;
    if (lng === null) return `Lat: ${lat.toFixed(4)}`;
    return `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
  };

  const hasCoords = (loc) => {
    if (!loc) return false;
    return parseCoord(loc.lat) !== null || parseCoord(loc.lng) !== null;
  };

  const {
    data: order,
    isLoading,
    isFetching,
    refetch,
    error,
  } = useGetOrderByIdQuery(id, { skip: !id || id.length !== 24 });

  // When the `order` data changes, resolve a readable address if coordinates are available
  useEffect(() => {
    if (order?.location) {
      const plat = parseCoord(order.location.lat);
      const plng = parseCoord(order.location.lng);
      if (import.meta.env && import.meta.env.DEV) {
        console.debug(
          "BookingDetail: raw order.location:",
          order.location,
          "parsed:",
          { plat, plng }
        );
      }
      if (plat !== null && plng !== null) {
        reverseGeocode(plat, plng)
          .then((address) => setLocationAddress(address))
          .catch(() => setLocationAddress(null));
      } else {
        setLocationAddress(null);
      }
    } else {
      setLocationAddress(null);
    }
  }, [order]);

  const [acceptJob, { isLoading: isAccepting }] = useAcceptJobMutation();
  const [declineJob, { isLoading: isDeclining }] = useDeclineJobMutation();
  const [reviewOrder, { isLoading: isReviewing }] = useReviewOrderMutation();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const handleAccept = async () => {
    try {
      await acceptJob({ id: order._id }).unwrap();
      // refetch order details after accepting
      if (refetch) refetch();
      toast.success("Booking accepted successfully!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to accept booking");
    }
  };

  const handleDecline = async () => {
    const reason = prompt("Please provide a reason for declining:");
    if (!reason) return;

    try {
      await declineJob({ id: order._id, reason }).unwrap();
      if (refetch) refetch();
      toast.error("Booking declined");
      navigate("/worker/jobs");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to decline booking");
    }
  };

  const handleReview = async () => {
    if (!reviewText.trim()) {
      toast("Please provide a review");
      return;
    }

    try {
      await reviewOrder({
        orderId: order._id,
        rating: rating.toString(),
        review: reviewText,
      }).unwrap();
      if (refetch) refetch();
      setShowReviewModal(false);
      setReviewText("");
      setRating(5);
      toast.success("Review submitted successfully!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to submit review");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTimeSlot = (timeSlot) => {
    const slots = {
      morning: "Morning (8AM - 12PM)",
      afternoon: "Afternoon (12PM - 5PM)",
      evening: "Evening (5PM - 9PM)",
    };
    return slots[timeSlot?.toLowerCase()] || timeSlot || "Time TBD";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#80CBF4] mx-auto mb-4" />
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-xl text-red-600 mb-2">Error loading booking</div>
          <div className="text-sm text-gray-500 mb-4">
            {error?.data?.message || error?.message || "Please try again later"}
          </div>
          <button
            onClick={() => navigate("/worker-bookings")}
            className="mt-4 px-4 py-2 bg-[#80CBF4] text-white rounded-lg hover:bg-[#6BB8E3]"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-xl text-red-600 mb-2">Booking not found</div>
          <div className="text-sm text-gray-500 mb-4">
            No order data available for ID: {id}
          </div>
          <button
            onClick={() => refetch && refetch()}
            className="mt-4 mr-2 px-4 py-2 bg-[#80CBF4] text-white rounded-lg hover:bg-[#6BB8E3]"
          >
            Retry
          </button>
          <button
            onClick={() => navigate("/worker-bookings")}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  const customer = order?.buyerId || {};
  const gig = order?.gigId || {};

  return (
    <div>
      <Hero
        place="worker-detail"
        title="Booking Details"
        subtitle={`Booking ID: ${order._id}`}
        className="h-48 sm:h-50 md:h-55 lg:h-58"
      />

      <section className="w-full">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <SectionCard title="Customer Information">
                <div className="flex flex-col items-center text-center mb-4">
                  {customer.profilePicture ? (
                    <img
                      src={getFullImageUrl(customer.profilePicture)}
                      alt={customer.name || "Customer"}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                      {customer.name?.charAt(0) || "C"}
                    </div>
                  )}
                  <h4 className="mt-3 font-bold text-lg">
                    {customer.name || "Customer"}
                  </h4>
                  {customer.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">
                        {customer.rating}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 flex flex-col items-center justify-center">
                  {customer.mobileNumber && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{customer.mobileNumber}</span>
                    </div>
                  )}
                  {customer.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{customer.email}</span>
                    </div>
                  )}
                  {hasCoords(order.location) && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span>
                        {locationAddress || formatLatLng(order.location)}
                      </span>
                    </div>
                  )}
                </div>

                <MessageButton
                  participantId={customer._id}
                  participantRole="worker"
                  participantName={customer.name || "Customer"}
                  className="w-full mt-4 bg-[#80CBF4] border  text-white hover:bg-[#6BB8E3]"
                />
              </SectionCard>

              <SectionCard title="Status" badge={order?.status}>
                {order.status === "pending" && (
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={handleAccept}
                      disabled={isAccepting}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      {isAccepting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <CircleCheck className="w-5 h-5" />
                      )}
                      Accept Booking
                    </button>
                    <button
                      onClick={handleDecline}
                      disabled={isDeclining}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      {isDeclining ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <CircleX className="w-5 h-5" />
                      )}
                      Decline Booking
                    </button>
                  </div>
                )}

                {order.status === "completed" && !order.review && (
                  <div className="mt-4">
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#80CBF4] text-white rounded-xl hover:bg-[#6BB8E3] transition-colors"
                    >
                      <Star className="w-5 h-5" />
                      Review Order
                    </button>
                  </div>
                )}
              </SectionCard>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <SectionCard>
                <div className="flex items-start gap-4 mb-4">
                  {}
                  {gig.images && gig.images.length > 0 ? (
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#B6E0FE] flex items-center justify-center">
                      <img
                        src={getFullImageUrl(gig.images[0].url)}
                        alt={gig.title || "Service image"}
                        className="w-12 h-12 object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  ) : null}
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">
                      {gig.title || "Service"}
                    </h4>
                  </div>
                </div>

                {order.jobDescription && (
                  <div className="mt-4">
                    <h5 className="font-semibold text-lg  mb-2">
                      Job Description
                    </h5>
                    <p className="text-gray-600 text-sm">
                      {order.jobDescription}
                    </p>
                  </div>
                )}

                {order.emergency && (
                  <div className="mt-4">
                    <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                      🚨 Emergency Job
                    </span>
                  </div>
                )}

                {order.specialInstructions && (
                  <div className="mt-4">
                    <h5 className="font-semibold text-sm text-gray-700 mb-2">
                      Special Instructions
                    </h5>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {order.specialInstructions
                        .split("\n")
                        .map((instruction, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            - <span className="text-blue-600 mt-1">•</span>+{" "}
                            <span className="text-[#80CBF4] mt-1">•</span>
                            <span>{instruction}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </SectionCard>

              <SectionCard title="Schedule & Location">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#EAF8FF] border border-[#CFEFFB]">
                    <Calendar className="w-5 h-5 text-[#80CBF4] mb-2" />
                    <div className="text-xs text-gray-600">Date</div>
                    <div className="font-semibold mt-1">
                      {formatDate(order.date)}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#EAF8FF] border border-[#CFEFFB]">
                    <Clock className="w-5 h-5 text-[#80CBF4] mb-2" />
                    <div className="text-xs text-gray-600">Time</div>
                    <div className="font-semibold mt-1 capitalize">
                      {formatTimeSlot(order.timeSlot)}
                    </div>
                  </div>
                </div>

                {hasCoords(order.location) && (
                  <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#80CBF4] mt-0.5" />
                      <div className="flex-1">
                        <div className="font-semibold">Service Location</div>
                        <div className="text-sm text-gray-600 mt-1">
                          - {locationAddress || formatLatLng(order.location)}+{" "}
                          {locationAddress || formatLatLng(order.location)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h5 className="font-semibold mb-3">Order Information</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Created:</span>
                      <div className="font-medium">
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Updated:</span>
                      <div className="font-medium">
                        {formatDate(order.updatedAt)}
                      </div>
                    </div>
                  </div>
                  {order.rating && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= order.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm font-medium">
                          {order.rating}/5
                        </span>
                      </div>
                      {order.review && (
                        <p className="text-sm text-gray-600 mt-2">
                          {order.review}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </SectionCard>

              <SectionCard title="Pricing Details">
                <div className="space-y-3">
                  <LabelValue
                    label="Pricing Type"
                    value={order.pricingType || "Fixed Price"}
                  />
                  <LabelValue
                    label="Service Fee"
                    value={order.price}
                    valueClass="text-lg font-bold text-[#80CBF4]"
                  />
                  {order.paymentMethod && (
                    <LabelValue
                      label="Payment Method"
                      value={order.paymentMethod}
                    />
                  )}
                  {order.paymentStatus && (
                    <LabelValue
                      label="Payment Status"
                      value={order.paymentStatus}
                      valueClass={
                        order.paymentStatus === "paid"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }
                    />
                  )}
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      </section>

      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Review Order</h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Please rate your experience and leave a review.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300 hover:text-yellow-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">{rating}/5 stars</p>
            </div>

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here (required)"
              className="w-full p-3 border border-gray-200 rounded-lg mb-4 resize-none"
              rows="4"
              required
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReview}
                disabled={isReviewing || !reviewText.trim()}
                className="flex-1 px-4 py-3 bg-[#80CBF4] text-white rounded-lg hover:bg-[#6BB8E3] disabled:opacity-50"
              >
                {isReviewing ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetail;
