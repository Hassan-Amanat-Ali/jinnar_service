import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetTicketByIdQuery,
  useReplyToTicketMutation,
} from "../../services/supportApi";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowLeft,
  Send,
  Loader2,
  Paperclip,
  ShieldAlert,
  MessageSquare,
  Calendar,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";

const SupportTicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [replyMessage, setReplyMessage] = useState("");

  const {
    data: ticket,
    isLoading,
    isError,
    refetch,
  } = useGetTicketByIdQuery(id);

  const [replyToTicket, { isLoading: isReplying }] = useReplyToTicketMutation();

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) {
      toast.error("Reply message cannot be empty.");
      return;
    }

    const loadingToast = toast.loading("Sending your reply...");

    try {
      await replyToTicket({ id, message: replyMessage }).unwrap();
      setReplyMessage("");
      toast.success("Reply sent successfully!", { id: loadingToast });
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send reply.", {
        id: loadingToast,
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusPill = (status) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-red-500">
          Error loading ticket
        </h2>
        <p className="text-gray-600 mt-2">
          The ticket could not be found or there was an error fetching it.
        </p>
        <button
          onClick={() => navigate("/profile/help")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Back to Help & Support
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={16} />
            Back to Tickets
          </button>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-900 truncate">
                {ticket.subject}
              </h1>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${getStatusPill(
                  ticket.status
                )}`}
              >
                {ticket.status.replace("_", " ")}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MessageSquare size={14} />
                <span>Ticket ID: #{ticket.ticketId}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>Created: {formatDate(ticket.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag size={14} />
                <span className="capitalize">Category: {ticket.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldAlert size={14} />
                <span className="capitalize">Priority: {ticket.priority}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Conversation */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="space-y-6 mb-6 h-[50vh] overflow-y-auto pr-4">
            {ticket.conversation.map((item) => {
              const isUser = item.sender._id === user._id;
              return (
                <div
                  key={item._id}
                  className={`flex gap-3 ${isUser ? "justify-end" : ""}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
                      {item.sender.name.charAt(0)}
                    </div>
                  )}
                  <div
                    className={`max-w-md p-4 rounded-xl ${
                      isUser
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{item.message}</p>
                    <p
                      className={`text-xs mt-2 ${
                        isUser ? "text-blue-200" : "text-gray-500"
                      }`}
                    >
                      {item.sender.name} • {formatDate(item.createdAt)}
                    </p>
                  </div>
                  {isUser && (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-semibold text-white">
                      {item.sender.name.charAt(0)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Reply Form */}
          {ticket.status !== "closed" && ticket.status !== "resolved" ? (
            <div className="pt-4 border-t border-gray-200">
              <form onSubmit={handleReplySubmit}>
                <div className="relative">
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply..."
                    rows={3}
                    className="w-full p-3 pr-28 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    disabled={isReplying}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button
                      type="button"
                      className="p-2 text-gray-500 hover:text-gray-700"
                      disabled={isReplying}
                    >
                      <Paperclip size={18} />
                    </button>
                    <button
                      type="submit"
                      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-blue-300"
                      disabled={isReplying || !replyMessage.trim()}
                    >
                      {isReplying ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Send size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center py-4 border-t border-gray-200 text-gray-500 text-sm">
              This ticket is closed. You can create a new ticket if you need
              further assistance.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportTicketDetail;