import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  FileText,
  Loader2,
} from "lucide-react";
import { useAcceptOfferMutation, useRejectOfferMutation } from "../../services";
import Avatar from "./Avatar";
import toast from "react-hot-toast";

const OfferCard = ({ message, currentUserId, otherParticipant }) => {
  const [acceptOffer, { isLoading: isAccepting }] = useAcceptOfferMutation();
  const [rejectOffer, { isLoading: isRejecting }] = useRejectOfferMutation();
  const [error, setError] = useState("");

  const { customOffer } = message;
  const isMe = (message.senderId || message.sender?._id) === currentUserId;
  const isBuyer = !isMe;

  const isPending = customOffer.status === "pending";
  const isAccepted = customOffer.status === "accepted";
  const isRejected = customOffer.status === "rejected";

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  const handleAccept = async () => {
    try {
      setError("");
      await acceptOffer({
        orderId: customOffer.orderId,
        messageId: message?._id,
      }).unwrap();
      toast.success("Offer accepted successfully!");
    } catch (err) {
      const errorMsg = err?.status === 402
        ? "Insufficient wallet balance."
        : "Failed to accept offer.";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleReject = async () => {
    try {
      setError("");
      await rejectOffer({ 
        orderId: customOffer.orderId,
        messageId: message?._id 
      }).unwrap();
      toast.success("Offer rejected successfully!");
    } catch (err) {
      const errorMsg = "Failed to reject offer.";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const getStatus = () => {
    if (isAccepted)
      return {
        text: "Offer Accepted",
        color: "text-green-700",
        icon: <CheckCircle className="w-4 h-4 text-green-600" />,
      };
    if (isRejected)
      return {
        text: "Offer Rejected",
        color: "text-red-700",
        icon: <XCircle className="w-4 h-4 text-red-600" />,
      };
    return {
      text: isMe ? "Offer Sent" : "Custom Offer",
      color: "text-yellow-700",
      icon: <Clock className="w-4 h-4 text-yellow-600" />,
    };
  };

  const status = getStatus();

  return (
    <div
      className={`flex gap-3 w-full min-w-0 ${isMe ? "flex-row-reverse" : ""}`}
    >
      {!isMe && (
        <Avatar
          src={
            otherParticipant?.profilePicture || message.sender?.profilePicture
          }
          name={otherParticipant?.name || message.sender?.name}
          size="default"
          className="h-8 w-8 flex-shrink-0"
        />
      )}

      <div className="flex flex-col w-full min-w-0">
        <div
          className={`rounded-xl border p-4 shadow-sm w-full break-words ${
            isMe
              ? "bg-[#C3E6FF] border-blue-200 text-gray-900"
              : "bg-white border-gray-200 text-gray-900"
          }`}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            {status.icon}
            <span className={`text-sm font-semibold ${status.color}`}>
              {status.text}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="text-lg font-semibold">
              TZS {customOffer.price}
            </span>
          </div>

          {/* Description */}
          <div className="flex gap-2 min-w-0">
            <FileText className="w-4 h-4 mt-1 text-gray-500 flex-shrink-0" />
            <p className="text-sm leading-relaxed break-words">
              {customOffer.description}
            </p>
          </div>

          {/* Buyer Actions */}
          {isBuyer && isPending && (
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={handleAccept}
                disabled={isAccepting || isRejecting}
                className="flex-1 min-w-[120px] bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
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
                className="flex-1 min-w-[120px] bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
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

          {/* Final Status */}
          {!isPending && (
            <div
              className={`mt-4 text-center text-sm font-medium rounded-lg py-2 ${
                isAccepted
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {status.text}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-3 bg-red-100 text-red-700 text-sm p-2 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Time */}
        <span
          className={`mt-1 text-xs text-gray-500 ${isMe ? "text-right" : ""}`}
        >
          {formatTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default OfferCard;
