import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Hero from "../../components/common/Hero";
import {
  Wrench,
  Calendar,
  Clock,
  MapPin,
  Star,
  Phone,
  Mail,
  CreditCard,
  Check,
  X,
  User,
  MessageSquare,
  Send,
  FileText,
  CircleCheck,
  CircleX,
  Loader2,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import MessageButton from "../../components/common/MessageButton";
import {
  useAcceptJobMutation,
  useDeclineJobMutation,
  useReviewOrderMutation,
} from "../../services/workerApi";

// Small UI helpers
const LabelValue = ({ label, value, valueClass = "" }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-600">{label}</span>
    <span className={twMerge(`font-semibold text-gray-900`, valueClass)}>
      {value}
    </span>
  </div>
);

const SectionCard = ({ title, children, className = "" }) => (
  <div
    className={`rounded-2xl border border-gray-100 bg-white shadow-sm ${className}`}
  >
    {title && (
      <div className="px-4 sm:px-5 pt-4">
        <h3 className=" font-bold text-gray-900 text-xl">{title}</h3>
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
  
  // DEBUG LOGS
  console.log("=== BOOKING DETAIL DEBUG START ===");
  console.log("🔍 1. Route ID from useParams:", id);
  console.log("🔍 2. ID type:", typeof id);
  console.log("🔍 3. ID length:", id?.length);
  console.log("🔍 4. Current URL:", window.location.href);
  console.log("🔍 5. ID is valid MongoDB ObjectId format:", /^[0-9a-fA-F]{24}$/.test(id));
  
  // Custom fetch hook as RTK Query replacement
  const [fetchState, setFetchState] = React.useState({
    data: null,
    isLoading: false,
    error: null,
    isFetching: false,
    isSuccess: false,
    isError: false
  });

  const customRefetch = React.useCallback(() => {
    if (!id || id.length !== 24) return;
    
    console.log("🚀 CUSTOM FETCH - Starting API request for order:", id);
    setFetchState(prev => ({ ...prev, isLoading: true, isFetching: true, error: null }));
    
    const token = localStorage.getItem("token");
    fetch(`https://jinnar-marketplace.onrender.com/api/orders/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log("🚀 Custom fetch response status:", response.status);
      console.log("🚀 Custom fetch response ok:", response.ok);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("🚀 Custom fetch response data:", data);
      const order = data.order || data;
      console.log("🚀 Extracted order:", order);
      setFetchState({
        data: order,
        isLoading: false,
        isFetching: false,
        isSuccess: true,
        isError: false,
        error: null
      });
    })
    .catch(error => {
      console.log("🚀 Custom fetch error:", error);
      setFetchState({
        data: null,
        isLoading: false,
        isFetching: false,
        isSuccess: false,
        isError: true,
        error: { message: error.message, status: error.status }
      });
    });
  }, [id]);

  React.useEffect(() => {
    customRefetch();
  }, [customRefetch]);
  
  // Use custom fetch state instead of RTK Query (which has issues)
  const order = fetchState.data;
  const isLoading = fetchState.isLoading;
  const error = fetchState.error;
  const isFetching = fetchState.isFetching;
  const isSuccess = fetchState.isSuccess;
  const isError = fetchState.isError;
  const refetch = customRefetch;
  
  // DEBUG LOGS for API response
  console.log("📡 5. Custom API Query ID being sent:", id);
  console.log("📡 6. Custom API isLoading:", isLoading);
  console.log("📡 6b. Custom API isFetching:", isFetching);
  console.log("📡 6c. Custom API isSuccess:", isSuccess);
  console.log("📡 6d. Custom API isError:", isError);
  console.log("📡 7. Custom API error object:", error);
  console.log("📡 8. Custom API error status:", error?.status);
  console.log("📡 9. Custom API error data:", error?.data);
  console.log("📡 10. Custom API error message:", error?.message);
  console.log("📡 11. Raw API response data:", order);
  
  // Use the fetched data directly
  const finalOrder = order;
  const finalIsLoading = isLoading;
  
  console.log("🔀 13. Final order (RTK or manual):", finalOrder);
  console.log("🔀 14. Final loading state:", finalIsLoading);
  
  if (finalOrder) {
    console.log("✅ 15. ORDER EXISTS - Detailed breakdown:");
    console.log("   📋 Order _id:", finalOrder._id);
    console.log("   📋 Order status:", finalOrder.status);
    console.log("   📋 Order date:", finalOrder.date);
    console.log("   📋 Order timeSlot:", finalOrder.timeSlot);
    console.log("   📋 Order jobDescription:", finalOrder.jobDescription);
    console.log("   📋 Order emergency:", finalOrder.emergency);
    console.log("   📋 Order location:", finalOrder.location);
    console.log("   📋 Order rating:", finalOrder.rating);
    console.log("   📋 Order review:", finalOrder.review);
    console.log("   📋 Order createdAt:", finalOrder.createdAt);
    console.log("   📋 Order updatedAt:", finalOrder.updatedAt);
  } else {
    console.warn("❌ 15. NO ORDER DATA FOUND (neither RTK Query nor manual)");
  }
  
  const [acceptJob, { isLoading: isAccepting }] = useAcceptJobMutation();
  const [declineJob, { isLoading: isDeclining }] = useDeclineJobMutation();
  const [reviewOrder, { isLoading: isReviewing }] = useReviewOrderMutation();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  // Handle accept job
  const handleAccept = async () => {
    try {
      await acceptJob({ id: finalOrder._id }).unwrap();
      refetch();
      alert("Booking accepted successfully!");
    } catch (error) {
      console.error("Failed to accept:", error);
      alert(error?.data?.message || "Failed to accept booking");
    }
  };

  // Handle decline job
  const handleDecline = async () => {
    const reason = prompt("Please provide a reason for declining:");
    if (!reason) return;
    
    try {
      await declineJob({ id: finalOrder._id, reason }).unwrap();
      refetch();
      alert("Booking declined");
      navigate("/worker/jobs");
    } catch (error) {
      console.error("Failed to decline:", error);
      alert(error?.data?.message || "Failed to decline booking");
    }
  };



  // Handle review order
  const handleReview = async () => {
    if (!reviewText.trim()) {
      alert("Please provide a review");
      return;
    }
    
    try {
      await reviewOrder({
        orderId: finalOrder._id,
        rating: rating.toString(), // API expects string
        review: reviewText
      }).unwrap();
      refetch();
      setShowReviewModal(false);
      setReviewText("");
      setRating(5);
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert(error?.data?.message || "Failed to submit review");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time slot
  const formatTimeSlot = (timeSlot) => {
    const slots = {
      morning: "Morning (8AM - 12PM)",
      afternoon: "Afternoon (12PM - 5PM)",
      evening: "Evening (5PM - 9PM)",
    };
    return slots[timeSlot?.toLowerCase()] || timeSlot || "Time TBD";
  };

  // Get status color and badge
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
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  if (finalIsLoading) {
    console.log("⏳ Loading state - showing spinner");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading booking details...</p>
          <p className="text-sm text-gray-400 mt-2">ID: {id}</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("❌ Error state:", error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-xl text-red-600 mb-2">Error loading booking</div>
          <div className="text-sm text-gray-500 mb-4">
            {error?.data?.message || error?.message || "Please try again later"}
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-left text-xs">
            <p className="font-semibold mb-2">Debug Info:</p>
            <p>Booking ID: {id}</p>
            <p>Error Status: {error?.status}</p>
            <p>Error: {JSON.stringify(error, null, 2)}</p>
          </div>
          <button
            onClick={() => navigate("/worker-bookings")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  if (!finalOrder) {
    console.warn("⚠️ NO ORDER STATE - Detailed analysis:");
    console.warn("   ⚠️ Custom order is:", order);
    console.warn("   ⚠️ finalOrder is:", finalOrder);
    console.warn("   ⚠️ finalOrder type:", typeof finalOrder);
    console.warn("   ⚠️ finalOrder === null:", finalOrder === null);
    console.warn("   ⚠️ finalOrder === undefined:", finalOrder === undefined);
    console.warn("   ⚠️ isLoading:", isLoading);
    console.warn("   ⚠️ error:", error);
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-xl text-red-600 mb-2">Booking not found</div>
          <div className="text-sm text-gray-500 mb-4">
            No order data available for ID: {id}
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-left text-xs">
            <p className="font-semibold mb-2">Debug Info:</p>
            <p>Requested ID: {id}</p>
            <p>IsLoading: {String(isLoading)}</p>
            <p>Has Error: {String(!!error)}</p>
            <p>Order exists: {String(!!order)}</p>
            <p>Final Order exists: {String(!!finalOrder)}</p>
          </div>
          <button
            onClick={() => {
              console.log("🔄 Retrying API call...");
              refetch();
            }}
            className="mt-4 mr-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

  // Extract data from the order - using correct API field names
  const customer = finalOrder?.buyerId || {}; // Changed from customerId to buyerId
  const gig = finalOrder?.gigId || {}; // Changed from serviceId to gigId
  
  // Log successful order loading
  console.log("✅ ORDER LOADED SUCCESSFULLY - About to render");
  console.log("✅ Will render with gig title:", gig?.title || "Service");
  console.log("✅ Will render with customer name:", customer?.name || customer?.mobileNumber || "Customer");
  
  if (finalOrder) {
    console.log("👤 13. CUSTOMER (buyerId) breakdown:");
    console.log("   👤 Customer object:", customer);
    console.log("   👤 Customer _id:", customer._id);
    console.log("   👤 Customer name:", customer.name);
    console.log("   👤 Customer mobileNumber:", customer.mobileNumber);
    console.log("   👤 Customer email:", customer.email);
    
    console.log("🔧 14. GIG (gigId) breakdown:");
    console.log("   🔧 Gig object:", gig);
    console.log("   🔧 Gig _id:", gig._id);
    console.log("   🔧 Gig title:", gig.title);
    console.log("   🔧 Gig skills:", gig.skills);
    console.log("   🔧 Gig images:", gig.images);
    console.log("   🔧 Gig images count:", gig.images?.length);
    
    console.log("🎯 15. COMPUTED VALUES:");
    console.log("   🎯 Display title:", gig.title || "Service");
    console.log("   🎯 Display customer name:", customer.name || customer.mobileNumber || "Customer");
    console.log("   🎯 Formatted date would be:", finalOrder.date);
    console.log("   🎯 Formatted time would be:", finalOrder.timeSlot);
    
    console.log("📍 16. LOCATION breakdown:");
    if (finalOrder.location) {
      console.log("   📍 Location object:", finalOrder.location);
      console.log("   📍 Latitude:", finalOrder.location.lat);
      console.log("   📍 Longitude:", finalOrder.location.lng);
    } else {
      console.log("   📍 No location data");
    }
  } else {
    console.warn("❌ Cannot extract customer/gig data - no finalOrder object");
  }

  return (
    <div>
      <Hero
        place="worker-detail"
        title="Booking Details"
        subtitle={`Booking ID: ${finalOrder._id}`}
        className="h-28 sm:h-32 md:h-48 lg:h-48"
      />

      <section className="w-full">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Customer Info & Actions */}
            <div className="lg:col-span-1 space-y-6">
              {/* Status Card */}
              <SectionCard title="Status">
                <div className="flex justify-center">
                  {getStatusBadge(finalOrder.status)}
                </div>
                {finalOrder.status === 'pending' && (
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

                {finalOrder.status === 'completed' && !finalOrder.review && (
                  <div className="mt-4">
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      <Star className="w-5 h-5" />
                      Review Order
                    </button>
                  </div>
                )}
              </SectionCard>

              {/* Customer Info Card */}
              <SectionCard title="Customer Information">
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {customer.name?.charAt(0) || customer.mobileNumber?.charAt(0) || "C"}
                  </div>
                  <h4 className="mt-3 font-bold text-lg">{customer.name || "Customer"}</h4>
                  {customer.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{customer.rating}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
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
                  {(finalOrder.location?.lat && finalOrder.location?.lng) && (
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span>Lat: {finalOrder.location.lat.toFixed(4)}, Lng: {finalOrder.location.lng.toFixed(4)}</span>
                    </div>
                  )}
                </div>

                <MessageButton
                  participantId={customer._id}
                  participantRole="customer"
                  participantName={customer.name || "Customer"}
                  className="w-full mt-4 bg-blue-600 border border-blue-600 text-white hover:bg-blue-700"
                />
              </SectionCard>
            </div>

            {/* Right Column - Booking Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Service Information */}
              <SectionCard title="Service Information">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-blue-50">
                    <Wrench className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{gig.title || "Service"}</h4>
                    <p className="text-gray-600 text-sm mt-1">Gig ID: {gig._id || "N/A"}</p>
                  </div>
                </div>

                {/* Service Images */}
                {gig.images && gig.images.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-sm text-gray-700 mb-3">Service Images</h5>
                    <div className="grid grid-cols-2 gap-3">
                      {gig.images.slice(0, 4).map((image, index) => (
                        <div key={image._id || index} className="relative aspect-square rounded-lg overflow-hidden">
                          <img 
                            src={image.url} 
                            alt={`Service image ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                            onError={(e) => {
                              e.target.src = '/placeholder-image.jpg';
                              e.target.alt = 'Image not available';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    {gig.images.length > 4 && (
                      <p className="text-xs text-gray-500 mt-2">
                        +{gig.images.length - 4} more images
                      </p>
                    )}
                  </div>
                )}

                {finalOrder.jobDescription && (
                  <div className="mt-4">
                    <h5 className="font-semibold text-sm text-gray-700 mb-2">Job Description</h5>
                    <p className="text-gray-600 text-sm">{finalOrder.jobDescription}</p>
                  </div>
                )}
                
                {finalOrder.emergency && (
                  <div className="mt-4">
                    <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                      🚨 Emergency Job
                    </span>
                  </div>
                )}

                {finalOrder.specialInstructions && (
                  <div className="mt-4">
                    <h5 className="font-semibold text-sm text-gray-700 mb-2">Special Instructions</h5>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {finalOrder.specialInstructions.split('\n').map((instruction, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </SectionCard>

              {/* Schedule & Location */}
              <SectionCard title="Schedule & Location">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <Calendar className="w-5 h-5 text-blue-600 mb-2" />
                    <div className="text-xs text-gray-600">Date</div>
                    <div className="font-semibold mt-1">{formatDate(finalOrder.date)}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <Clock className="w-5 h-5 text-blue-600 mb-2" />
                    <div className="text-xs text-gray-600">Time</div>
                    <div className="font-semibold mt-1">{formatTimeSlot(finalOrder.timeSlot)}</div>
                  </div>
                </div>

                {(finalOrder.location?.lat && finalOrder.location?.lng) && (
                  <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-semibold">Service Location</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Latitude: {finalOrder.location.lat}<br/>
                          Longitude: {finalOrder.location.lng}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Details */}
                <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h5 className="font-semibold mb-3">Order Information</h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Created:</span>
                      <div className="font-medium">{formatDate(finalOrder.createdAt)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Updated:</span>
                      <div className="font-medium">{formatDate(finalOrder.updatedAt)}</div>
                    </div>
                  </div>
                  {finalOrder.rating && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center gap-1 mt-1">
                        {[1,2,3,4,5].map(star => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${star <= finalOrder.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                        <span className="ml-2 text-sm font-medium">{finalOrder.rating}/5</span>
                      </div>
                      {finalOrder.review && (
                        <p className="text-sm text-gray-600 mt-2">{finalOrder.review}</p>
                      )}
                    </div>
                  )}
                </div>
              </SectionCard>

              {/* Pricing Details */}
              <SectionCard title="Pricing Details">
                <div className="space-y-3">
                  <LabelValue label="Pricing Type" value={finalOrder.pricingType || "Fixed Price"} />
                  <LabelValue 
                    label="Service Fee" 
                    value="Price not available" 
                    valueClass="text-lg font-bold text-blue-600"
                  />
                  {finalOrder.paymentMethod && (
                    <LabelValue label="Payment Method" value={finalOrder.paymentMethod} />
                  )}
                  {finalOrder.paymentStatus && (
                    <LabelValue 
                      label="Payment Status" 
                      value={finalOrder.paymentStatus}
                      valueClass={finalOrder.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}
                    />
                  )}
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      </section>



      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Review Order</h3>
              <button onClick={() => setShowReviewModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Please rate your experience and leave a review.
            </p>
            
            {/* Rating Stars */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
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
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
