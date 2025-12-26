import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OptimizedImage from "../../components/common/OptimizedImage";
import Hero from "../../components/common/Hero";
import {
  Star,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Loader2,
  X,
  CircleCheck,
  CircleX,
} from "lucide-react";
import MessageButton from "../../components/common/MessageButton";
import {
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  useCompleteOrderMutation,
  useRateAndReviewOrderMutation,
} from "../../services/customerApi";
import { reverseGeocode } from "../../utils/fileUrl.js";
import { toast } from "react-hot-toast";

const BookingDetail = () => {
  const { slug } = useParams();
  const id = slug;
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useGetOrderByIdQuery(id, {
    skip: !id || id.length !== 24,
  });
  const order = data?.order || data;

  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [completeOrder, { isLoading: isCompleting }] =
    useCompleteOrderMutation();
  const [rateAndReview, { isLoading: isSubmittingReview }] =
    useRateAndReviewOrderMutation();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [locationAddress, setLocationAddress] = useState(null);

  useEffect(() => {
    const fetchAddress = async () => {
      if (order?.location?.lat && order?.location?.lng) {
        const address = await reverseGeocode(
          order.location.lat,
          order.location.lng
        );
        setLocationAddress(address);
      }
    };
    fetchAddress();
  }, [order?.location?.lat, order?.location?.lng]);

  const handleCancel = async () => {
    if (!cancelReason.trim()) return;
    try {
      await cancelOrder({ orderId: order._id, reason: cancelReason }).unwrap();
      refetch();
      setShowCancelModal(false);
      setCancelReason("");
      toast.success("Order cancelled successfully");
    } catch (error) {
      console.error("Failed to cancel:", error);
      toast.error(error?.data?.message || "Failed to cancel order");
    }
  };

  const handleComplete = async () => {
    try {
      await completeOrder({ id: order._id }).unwrap();
      refetch();
      setShowReviewModal(true);
      toast.success("Order marked as complete!");
    } catch (error) {
      console.error("Failed to complete:", error);
      toast.error(error?.data?.message || "Failed to complete order");
    }
  };

  const handleSubmitReview = async () => {
    if (rating === 0) return;
    try {
      await rateAndReview({
        orderId: order._id,
        rating,
        review: review.trim() || undefined,
      }).unwrap();
      refetch();
      setShowReviewModal(false);
      setRating(0);
      setReview("");
      toast.success("Thank you for your review!");
    } catch (error) {
      console.error("Failed to submit review:", error);
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
    };
    const badge = statusMap[status?.toLowerCase()] || statusMap.pending;
    return (
      <span
        className={`px-4 py-2 rounded-full text-sm font-medium ${badge.color}`}
      >
        {badge.text}
      </span>
    );
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  if (error || !order)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-2">Error loading booking</div>
          <div className="text-sm text-gray-500">
            {error?.data?.message || "Booking not found"}
          </div>
          <button
            onClick={() => navigate("/customer-bookings")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Back to My Bookings
          </button>
        </div>
      </div>
    );

  const worker = order.sellerId || {};
  const gig = order.gigId || {};

  return (
    <div className="min-h-[80vh] bg-white">
      <Hero
        title={`Booking #${order._id}`}
        subtitle={gig.title || "Service Booking"}
        place="Customer"
        className="h-40 md:h-50 lg:h-80"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <aside className="lg:col-span-1">
          <div className="rounded-2xl border border-neutral-200 shadow-sm bg-white p-6 sticky top-6">
            <div className="flex flex-col items-center text-center">
              {worker.profilePicture ? (
                <OptimizedImage
                  src={worker.profilePicture}
                  alt={worker.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {worker.name?.charAt(0) || "W"}
                </div>
              )}
              <h3 className="text-lg font-semibold mt-3">
                {worker.name || "Worker"}
              </h3>
              <p className="text-sm text-gray-600">
                {worker.profession || "Service Provider"}
              </p>
              {worker.rating && (
                <div>
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(worker.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 fill-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {worker.rating} ({worker.reviewCount || 0} Reviews)
                  </p>
                </div>
              )}
            </div>
            {worker.bio && (
              <p className="text-sm text-center mt-4 text-gray-600">
                {worker.bio}
              </p>
            )}
            <div className="bg-gradient-to-b from-[#DBF0FF] to-[#DBF0FF]/60 rounded-xl text-center py-4 mt-4">
              <p className="text-xl font-bold">
                TZS {order.price?.toLocaleString() || "0"}
              </p>
              <p className="text-sm text-gray-500">
                {order.pricingType || "Fixed Price"}
              </p>
            </div>
            <div className="mt-4 space-y-2">
              <button
                onClick={() => navigate(`/worker-profile/${worker._id}`)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#DBF0FF] to-[#74C7F2] text-white font-medium hover:opacity-90"
              >
                View Profile
              </button>
              <MessageButton
                participantId={worker._id}
                participantRole="worker"
                participantName={worker.name || "Worker"}
                className="w-full border border-[#74C7F2] bg-[#74C7F2] text-white hover:bg-blue-600"
              />
            </div>
          </div>
        </aside>

        <section className="lg:col-span-2 space-y-5">
          <div className="rounded-2xl border border-neutral-200 shadow-sm bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Status</h4>
              {getStatusBadge(order.status)}
            </div>

            {(order.status === "accepted" ||
              order.status === "in-progress") && (
              <div className="mt-4">
                <button
                  onClick={handleComplete}
                  disabled={isCompleting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50"
                >
                  {isCompleting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CircleCheck className="w-5 h-5" />
                  )}
                  Mark as Complete
                </button>
              </div>
            )}

            {order.status === "pending" && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 mt-4"
              >
                <CircleX className="w-5 h-5" />
                Cancel Booking
              </button>
            )}

            {order.status === "completed" && !order.rating && (
              <button
                onClick={() => setShowReviewModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 mt-4"
              >
                <Star className="w-5 h-5" />
                Leave a Review
              </button>
            )}
          </div>

          <div className="rounded-2xl border border-neutral-200 shadow-sm bg-white p-5">
            <h4 className="text-lg font-semibold mb-3">Job Summary</h4>
            <h3 className="font-semibold text-xl">{gig.title || "Service"}</h3>
            {order.jobDescription && (
              <p className="text-sm text-gray-600 mt-2">
                {order.jobDescription}
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              <div className="rounded-xl bg-[#DBF0FF] border border-[#74C7F2]/30 p-3 text-center">
                <Calendar className="w-5 h-5 mx-auto text-[#74C7F2]" />
                <p className="text-xs mt-1 text-gray-600">Date</p>
                <p className="text-sm font-semibold">
                  {formatDate(order.date)}
                </p>
              </div>
              <div className="rounded-xl bg-[#DBF0FF] border border-[#74C7F2]/30 p-3 text-center">
                <Clock className="w-5 h-5 mx-auto text-[#74C7F2]" />
                <p className="text-xs mt-1 text-gray-600">Time</p>
                <p className="text-sm font-semibold">
                  {order.timeSlot || "TBD"}
                </p>
              </div>
              <div className="rounded-xl bg-[#DBF0FF] border border-[#74C7F2]/30 p-3 text-center">
                <DollarSign className="w-5 h-5 mx-auto text-[#74C7F2]" />
                <p className="text-xs mt-1 text-gray-600">Price</p>
                <p className="text-sm font-semibold">
                  TZS {order.price?.toLocaleString() || "0"}
                </p>
              </div>
            </div>
          </div>

          {order.location && (
            <div className="rounded-2xl border border-neutral-200 shadow-sm bg-white p-5">
              <h4 className="text-lg font-semibold mb-3">Location</h4>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                <div className="flex-1">
                  <p className="font-semibold">Service Address</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {locationAddress ||
                      order.location.address ||
                      `Lat: ${order.location.lat?.toFixed(
                        4
                      )}, Lng: ${order.location.lng?.toFixed(4)}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {order.rating && (
            <div className="rounded-2xl border border-neutral-100 shadow-sm bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Your Review</h4>
                <div className="flex gap-1" aria-label={`Rating: ${order.rating} out of 5 stars`}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < order.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-200 fill-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {order.review && (
                <div className="relative mt-2">
                  <div className="absolute -top-3 -left-2 text-6xl text-blue-100 font-serif opacity-50 select-none">"</div>
                  <blockquote className="relative z-10 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-gray-700 italic leading-relaxed text-[15px]">
                      {order.review}
                    </p>
                  </blockquote>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Cancel Booking</h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for cancelling this booking.
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Cancellation reason (required)"
              className="w-full p-3 border border-gray-200 rounded-lg mb-4 resize-none"
              rows="3"
              required
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleCancel}
                disabled={isCancelling || !cancelReason.trim()}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isCancelling ? "Processing..." : "Cancel Booking"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Rate Your Experience</h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Select Rating</p>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => setRating(value)}
                    className="p-1"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        value <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Write a Review (Optional)
              </p>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience..."
                className="w-full p-3 border border-gray-200 rounded-lg resize-none"
                rows="4"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
              >
                Skip
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={isSubmittingReview || rating === 0}
                className="flex-1 px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetail;
