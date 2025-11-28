import { useState } from "react";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  FileText,
  Loader2 
} from "lucide-react";
import { useAcceptOfferMutation, useRejectOfferMutation } from "../../services";
import Avatar from "./Avatar";

const OfferCard = ({ message, currentUserId, otherParticipant }) => {
  const [acceptOffer, { isLoading: isAccepting }] = useAcceptOfferMutation();
  const [rejectOffer, { isLoading: isRejecting }] = useRejectOfferMutation();
  const [error, setError] = useState("");

  const { customOffer } = message;
  const isMe = (message.senderId || message.sender?._id) === currentUserId;
  const isBuyer = !isMe; // If I'm not the sender, I'm the buyer
  const isPending = customOffer.status === "pending";
  const isAccepted = customOffer.status === "accepted";
  const isRejected = customOffer.status === "rejected";

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAccept = async () => {
    try {
      setError("");
      await acceptOffer({ orderId: customOffer.orderId }).unwrap();
    } catch (error) {
      console.error("Failed to accept offer:", error);
      if (error.status === 402) {
        setError("Insufficient funds. Please top up your wallet to accept this offer.");
      } else {
        setError("Failed to accept offer. Please try again.");
      }
    }
  };

  const handleReject = async () => {
    try {
      setError("");
      await rejectOffer({ orderId: customOffer.orderId }).unwrap();
    } catch (error) {
      console.error("Failed to reject offer:", error);
      setError("Failed to reject offer. Please try again.");
    }
  };

  const getStatusColor = () => {
    if (isAccepted) return "text-green-600";
    if (isRejected) return "text-red-600";
    return "text-yellow-600";
  };

  const getStatusIcon = () => {
    if (isAccepted) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (isRejected) return <XCircle className="w-4 h-4 text-red-600" />;
    return <Clock className="w-4 h-4 text-yellow-600" />;
  };

  const getStatusText = () => {
    if (isAccepted) return "Offer Accepted";
    if (isRejected) return "Offer Rejected";
    return isMe ? "Offer Sent" : "Custom Offer";
  };

  return (
    <div className={`flex gap-2 md:gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
      {!isMe && (
        <Avatar
          src={otherParticipant?.profilePicture || message.sender?.profilePicture}
          name={otherParticipant?.name || message.sender?.name}
          size="default"
          className="h-6 w-6 md:h-8 md:w-8"
        />
      )}
      <div className={`flex-1 max-w-sm md:max-w-md ${isMe ? "flex justify-end" : ""}`}>
        <div
          className={`rounded-2xl border-2 p-4 ${
            isMe
              ? "bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white border-blue-300"
              : "bg-white border-blue-200 text-gray-900 shadow-sm"
          }`}
        >
          {/* Offer Header */}
          <div className="flex items-center gap-2 mb-3">
            {getStatusIcon()}
            <span className={`font-semibold text-sm ${isMe ? "text-white" : getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>

          {/* Offer Details */}
          <div className="space-y-3">
            {/* Price */}
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-lg font-bold">
                ${customOffer.price}
              </span>
            </div>

            {/* Description */}
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="text-sm break-words">
                {customOffer.description}
              </p>
            </div>

            {/* Action Buttons for Buyer */}
            {isBuyer && isPending && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleAccept}
                  disabled={isAccepting || isRejecting}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                >
                  {isAccepting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Accept
                </button>
                <button
                  onClick={handleReject}
                  disabled={isAccepting || isRejecting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                >
                  {isRejecting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  Reject
                </button>
              </div>
            )}

            {/* Status Message for Non-Pending States */}
            {!isPending && (
              <div className={`text-center py-2 px-3 rounded-lg text-sm font-medium ${
                isAccepted 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}>
                {isAccepted ? "✅ Offer has been accepted" : "❌ Offer was rejected"}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 text-red-800 text-sm p-2 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Timestamp */}
        <p className={`mt-1 text-[10px] md:text-xs text-gray-500 ${isMe ? "text-right" : ""}`}>
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default OfferCard;