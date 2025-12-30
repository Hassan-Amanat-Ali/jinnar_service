import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  CheckCheck,
  Send,
  MoreVertical,
  Circle,
  Loader2,
  Flag,
  X,
  Menu,
  Paperclip,
} from "lucide-react";
import Hero from "../../components/common/Hero";
import Avatar from "../../components/common/Avatar";
import { useAuth } from "../../context/AuthContext";
import { useSocket, useChat } from "../../hooks/useSocket";
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
  useUploadChatMediaMutation,
} from "../../services/chatApi";
import { useGetPublicProfileQuery } from "../../services/workerApi";
import { getFullImageUrl } from "../../utils/fileUrl.js";
import OfferCard from "../../components/common/OfferCard";

// Contact Item Component
const ContactItem = ({
  conversation,
  active = false,
  onClick,
  currentUserId,
}) => {
  const otherParticipant = conversation?.participants?.find(
    (p) => p._id !== currentUserId
  );
    const participantId = otherParticipant?._id;

  // fetch public profile
  const { data: publicProfile } = useGetPublicProfileQuery(participantId, { skip: !participantId });

  const displayName = publicProfile?.profile?.name || otherParticipant?.name || "Unknown User";
  const displayPicture = publicProfile?.profile?.profilePicture || otherParticipant?.profilePicture;

  const lastMessage = conversation?.lastMessage;
  const lastTime = conversation?.lastTime;
  const unreadCount = conversation?.unreadCount || 0;

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  return (
    <button
      onClick={onClick}
      className={[
        "w-full flex items-center gap-2 md:gap-3 py-3 md:py-4 p-2 md:p-3 text-left transition-colors hover:cursor-pointer",
        active
          ? "bg-[#EAF6FF] border-l-4 border-l-[#74C7F2]"
          : "hover:bg-gray-50",
        conversation?.isNewChat ? "bg-linear-to-r from-[#B6E0FE] to-[#74C7F2] text-white" : ""
      ].join(" ")}
      aria-current={active ? "true" : undefined}
    >
      <div className="relative">
        <Avatar
          src={getFullImageUrl(displayPicture)}
          name={displayName}
          size="md"
          className="h-8 w-8 md:h-10 md:w-10"
        />
        <Circle className="absolute -bottom-0.5 -right-0.5 w-3 h-3 fill-green-500 text-green-500" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="truncate text-xs md:text-sm font-semibold text-gray-900">
            {displayName}
          </p>
          <span className="shrink-0 text-[10px] md:text-xs text-gray-500">
            {formatTime(lastTime || lastMessage?.createdAt)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="truncate text-[10px] md:text-xs text-gray-600">
            {typeof lastMessage === "string"
              ? lastMessage
              : lastMessage?.content || "No messages yet"}
          </p>
          {unreadCount > 0 && (
            <span className="shrink-0 rounded-full bg-sky-500 px-1.5 py-0.5 text-[10px] font-medium text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

// Message Component
const MessageBubble = ({ message, currentUserId, otherParticipant }) => {
  if (message.customOffer) {
    return (
      <OfferCard
        message={message}
        currentUserId={currentUserId}
        otherParticipant={otherParticipant}
      />
    );
  }


  const messageSenderId = message.senderId || message.sender?._id;
  const isMe = messageSenderId === currentUserId;
  const messageText = message.message || message.content || "";

  const isFile = message.attachment && message.attachment.url;
  const isImage = isFile && message.attachment.type === "image";

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`flex gap-2 md:gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
      {!isMe && (
        <Avatar
          src={getFullImageUrl(
            otherParticipant?.profilePicture || message.sender?.profilePicture
          )}
          name={otherParticipant?.name || message.sender?.name}
          size="default"
          className="h-6 w-6 md:h-8 md:w-8"
        />
      )}

      <div className={`w-fit items-end gap-1 ${isMe ? "flex justify-end flex-col" : ""}`}>
        <div
          className={`rounded-2xl px-3 md:px-4 py-2 md:py-3 ${
            isMe
              ? "bg-linear-to-r from-[#B6E0FE] to-[#74C7F2] text-white"
              : "bg-gray-100 text-gray-900"
          }`}
        >
          {isImage ? (
            <img src={getFullImageUrl(message.attachment.url)} alt={message.attachment.type || "shared file"} className="max-w-xs max-h-60 rounded-lg" />
          ) : isFile ? (
            <a href={getFullImageUrl(message.attachment.url)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              {message.attachment.type === "video" ? "View video" : "Download file"}
            </a>
          ) : (
            <p className="text-xs md:text-sm wrap-break-word whitespace-pre-wrap">
              {messageText}
            </p>
          )}
        </div>
        <p
          className={`mt-1 text-[10px] md:text-xs text-gray-500 ${
            isMe ? "text-right" : ""
          }`}
        >
          {formatTime(message.createdAt)}
          {isMe && message.isRead && (
            <CheckCheck className="inline ml-1 w-3 h-3 text-sky-500" />
          )}
        </p>
      </div>
    </div>
  );
};

// Report Modal Component
const ReportModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [reason, setReason] = useState("Spam");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ reason, description });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Report User</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#74C7F2] outline-none"
            >
              <option value="Spam">Spam</option>
              <option value="Inappropriate Content">
                Inappropriate Content
              </option>
              <option value="Harassment">Harassment</option>
              <option value="Scam/Fraud">Scam/Fraud</option>
              <option value="Poor Service">Poor Service</option>
              <option value="Did Not Pay">Did Not Pay</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide more details..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#74C7F2] outline-none resize-none h-32"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Main Chat Component
const Chat = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [localMessages, setLocalMessages] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState(null);
   const messagesEndRef = useRef(null);
   const typingTimeoutRef = useRef(null);
   const fileInputRef = useRef(null);

  const { user: currentUser } = useAuth();
  const currentUserId =
    currentUser?._id || currentUser?.id || currentUser?.userId;

  const { isConnected, socket } = useSocket();
  
  console.log("🔍 Customer Chat - Socket Status:", {
    isConnected,
    hasSocket: !!socket,
    socketId: socket?.id,
    currentUserId,
  });

  const conversationId = searchParams.get("conversation");
  const userId = searchParams.get("user");
  const targetUserId = conversationId || userId;

  const otherParticipantId =
    selectedConversation?.participants?.find((p) => p._id !== currentUserId)
      ?._id || targetUserId;

  // Ensure otherParticipant is available for header/profile lookups
  const otherParticipant = selectedConversation?.participants?.find(
    (p) => p._id !== currentUserId
  );

  const {
    data: conversationsData,
    isLoading: conversationsLoading,
    refetch: refetchConversations,
  } = useGetConversationsQuery();

  const {
    data: messagesData,
    isLoading: messagesLoading,
    // refetch: refetchMessages, // Remove unused
  } = useGetMessagesQuery(
    { userId: otherParticipantId },
    { skip: !otherParticipantId }
  );

  const { data: publicProfile } = useGetPublicProfileQuery(targetUserId, {
    skip:
      !targetUserId ||
      (selectedConversation && !selectedConversation._id.startsWith("temp-")),
  });

  const conversations = useMemo(
    () => (Array.isArray(conversationsData) ? conversationsData : []),
    [conversationsData]
  );

  const messages = useMemo(
    () => (Array.isArray(messagesData) ? messagesData : []),
    [messagesData]
  );

  const [ , { isLoading: isSending }] = useSendMessageMutation();
  const [markAsRead] = useMarkAsReadMutation();
  const [uploadChatMedia] = useUploadChatMediaMutation();

  // Stage attachment on select; upload will occur when user clicks Send
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "application/pdf", "video/mp4"];
    if (!allowed.includes(file.type)) {
      alert("Unsupported file type. Allowed: jpg, png, pdf, mp4");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      alert("File too large. Max 50MB");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    const previewUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
    setPendingAttachment({ file, previewUrl, fileName: file.name, fileType: file.type });
  };

  const socketConversationId =
    selectedConversation?._id || `temp-${targetUserId}`;

  const {
    messages: socketMessages,
    setMessages: setSocketMessages,
    typingUsers,
    startTyping,
    stopTyping,
  } = useChat(socketConversationId);

  // Sync messages from API to local state
useEffect(() => {
  if (!messages.length) return;

  const normalized = messages.map((msg) =>
    msg.customOffer ? msg : msg.offerId ? normalizeOfferMessage(msg) : msg
  );

  setLocalMessages(normalized);
}, [messages]);


  // Update temporary conversation with fetched profile data
  useEffect(() => {
    if (
      selectedConversation?._id.startsWith("temp-") &&
      publicProfile?.profile
    ) {
      const targetParticipant = selectedConversation.participants.find(
        (p) => p._id === targetUserId
      );

      if (
        targetParticipant &&
        (targetParticipant.name === "Worker" ||
          !targetParticipant.profilePicture)
      ) {
        setSelectedConversation((prev) => ({
          ...prev,
          participants: prev.participants.map((p) =>
            p._id === targetUserId
              ? {
                  ...p,
                  name: publicProfile.profile.name || "Worker",
                  profilePicture: publicProfile.profile.profilePicture,
                  role: publicProfile.profile.role || "worker",
                }
              : p
          ),
        }));
      }
    }
  }, [publicProfile, targetUserId, selectedConversation]);

  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current?.parentElement) {
      messagesEndRef.current.parentElement.scrollTo({
        top: messagesEndRef.current.parentElement.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  };

  const prevMessagesLengthRef = useRef(0);
  useEffect(() => {
    const currentLength = localMessages.length + socketMessages.length;
    const isInitialLoad =
      prevMessagesLengthRef.current === 0 && currentLength > 0;
    const hasNewMessages = currentLength > prevMessagesLengthRef.current;
    if (isInitialLoad) scrollToBottom(false);
    else if (hasNewMessages) scrollToBottom(true);
    prevMessagesLengthRef.current = currentLength;
  }, [localMessages.length, socketMessages.length, selectedConversation?._id]);

  // Listen for new messages from socket
  useEffect(() => {
    if (!socket) return;
    
    const handleNewMessage = (newMessage) => {
      const messageSenderId = newMessage.sender?._id || newMessage.senderId;
      const messageReceiverId =
        newMessage.receiver?._id || newMessage.receiverId;

      const isRelevant =
        (messageSenderId === currentUserId &&
          messageReceiverId === otherParticipantId) ||
        (messageSenderId === otherParticipantId &&
          messageReceiverId === currentUserId);

      if (isRelevant) {
        setLocalMessages((prev) => {
          const exists = prev.some(
            (msg) => msg._id === newMessage._id || msg.id === newMessage.id
          );
          if (exists) return prev;
          return [...prev, newMessage];
        });
      }

      refetchConversations();
    };

    const handleOfferUpdate = (updatedMessage) => {
      const normalized = updatedMessage.customOffer
        ? updatedMessage
        : normalizeOfferMessage(updatedMessage);

      setLocalMessages((prev) =>
        prev.map((msg) =>
          msg._id === normalized._id ? normalized : msg
        )
      );

      setSocketMessages((prev) =>
        prev.map((msg) =>
          msg._id === normalized._id ? normalized : msg
        )
      );
    };

    // Robust handler for various offer status update payloads
    const handleGenericOfferUpdate = (payload) => {
      console.log("🔔 Generic Offer Update Received:", payload);
      
      setLocalMessages((prev) => {
        return prev.map((msg) => {
          // 1. Match by Message ID
          if (payload._id && msg._id === payload._id) {
            // If payload looks like a full message, use it (normalized)
            if (payload.customOffer) {
              return payload; 
            }
            // If payload is partial merge, we'd need more logic, but usually it's full msg or status
            return { ...msg, ...payload };
          }

          // 2. Match by Order ID (if payload has orderId or customOffer.orderId)
          const payloadOrderId = payload.orderId || payload.customOffer?.orderId || payload.id; 
          // (payload.id might be orderId in some backends)
          
          if (payloadOrderId && msg.customOffer?.orderId === payloadOrderId) {
             // Create a new customOffer object with updated status
             return {
               ...msg,
               customOffer: {
                 ...msg.customOffer,
                 status: payload.status || msg.customOffer.status, // Update status if present
                 // Merge other fields if necessary
                 ...payload.customOffer // If payload has nested customOffer, merge it
               }
             };
          }

          return msg;
        });
      });
    };

    const handleChatListUpdate = () => {
      refetchConversations();
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("updateMessage", handleOfferUpdate);
    
    // Listen for additional events that might trigger status changes
    socket.on("offerAccepted", handleGenericOfferUpdate);
    socket.on("offerRejected", handleGenericOfferUpdate);
    socket.on("offerStatusUpdated", handleGenericOfferUpdate);
    
    socket.on("updateChatList", handleChatListUpdate);
    console.log("✅ Registered socket listeners including offer updates");

    // Listen for new offers (sent by sellers). Append to messages if relevant and refresh sidebar.
   
    const handleNewOffer = (offer) => {
      const senderId = offer.sender?._id || offer.senderId;
      const receiverId = offer.receiver?._id || offer.receiverId;

      const isRelevant =
        (senderId === currentUserId && receiverId === otherParticipantId) ||
        (senderId === otherParticipantId && receiverId === currentUserId);

      if (isRelevant) {
        const normalized = normalizeOfferMessage(offer);
        setLocalMessages((prev) => {
          const alreadyExists = prev.some((m) => m._id === normalized._id);
          if (alreadyExists) return prev;
          return [...prev, normalized];
        });
      }
    };



    socket.on("newOffer", handleNewOffer);
 

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("updateMessage", handleOfferUpdate);
      socket.off("offerAccepted", handleGenericOfferUpdate);
      socket.off("offerRejected", handleGenericOfferUpdate);
      socket.off("offerStatusUpdated", handleGenericOfferUpdate);
      socket.off("updateChatList", handleChatListUpdate);
      socket.off("newOffer", handleNewOffer);
    };
  }, [
    socket,
    currentUserId,
    otherParticipantId,
    refetchConversations,
    setSocketMessages,
    conversationId,
  ]);

  useEffect(() => {
    if (targetUserId && currentUserId) {
      let conversation = null;
      if (
        conversationId &&
        conversationId.length > 10 &&
        conversations.length > 0
      ) {
        conversation = conversations.find((c) => c._id === conversationId);
      }

      if (!conversation && conversations.length > 0) {
        conversation = conversations.find((c) =>
          c.participants?.some((p) => p._id === targetUserId)
        );
      }

      if (conversation) {
        setSelectedConversation(conversation);
        if (conversation._id !== conversationId) {
          setSearchParams({ conversation: conversation._id });
        }
      } else {
        setSelectedConversation({
          _id: `temp-${targetUserId}`,
          participants: [
            {
              _id: currentUserId,
              name: currentUser?.name,
              role: currentUser?.role,
            },
            { _id: targetUserId, name: "Worker", role: "worker" },
          ],
          lastMessage: null,
          unreadCount: 0,
          isNewChat: true,
        });
      }
    }
  }, [
    conversationId,
    targetUserId,
    conversations,
    currentUser,
    currentUserId,
    setSearchParams,
  ]);

  // Fix: When selecting a conversation, fetch and set messages for that conversation, and mark as read
  const handleConversationSelect = useCallback(
    (conversation) => {
      setSelectedConversation(conversation);
      setSearchParams({ conversation: conversation._id });
      setShowSidebar(false);
      // Mark as read and update unread count immediately
      if (conversation.unreadCount > 0) {
        markAsRead(conversation._id);
        // UI will update on next fetch
      }
      // Do NOT manually fetch messages here; let useGetMessagesQuery handle it
    },
    [setSearchParams, markAsRead]
  );

  const handleReportSubmit = async ({ reason, description }) => {
    if (!otherParticipantId) return;

    setIsReporting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://api.jinnar.com/api/user/reports/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reportedUserId: otherParticipantId,
            reason,
            description,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(
          "Report submitted successfully. Our support team will review it."
        );
        setShowReportModal(false);
      } else {
        alert(data.error || "Failed to submit report");
      }
    } catch (error) {
      console.error("Report error:", error);
      alert("An error occurred while submitting the report");
    } finally {
      setIsReporting(false);
    }
  };
  const handleSendMessage = useCallback(
    (e) => {
      e.preventDefault();
      // If there's no message and no pending attachment, do nothing
      if (!messageText.trim() && !pendingAttachment) return;
      if (!otherParticipantId || !socket) return;

      const tempMessage = {
        _id: `temp-${Date.now()}`,
        senderId: currentUserId,
        receiverId: otherParticipantId,
        message: messageText.trim(),
        content: messageText.trim(),
        createdAt: new Date().toISOString(),
        isRead: false,
        sender: {
          _id: currentUserId,
          name: currentUser?.name,
          profilePicture: currentUser?.profilePicture,
        },
      };

      // 1) Optimistic UI - include pending attachment preview if present
      if (pendingAttachment) {
        tempMessage.attachment = {
          url: pendingAttachment.previewUrl,
          type: pendingAttachment.fileType.startsWith("image") ? "image" : pendingAttachment.fileType.startsWith("video") ? "video" : "file",
          fileName: pendingAttachment.fileName,
          pending: true,
        };
      }
      setLocalMessages((prev) => [...prev, tempMessage]);
      // clear input text now; keep pendingAttachment until upload completes or user cancels
      setMessageText("");

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      stopTyping(otherParticipantId);

      // 2) If there's a pending attachment, upload via RTK mutation (FormData) to /api/chat/send
      if (pendingAttachment) {
        (async () => {
          setUploadingFile(true);
          try {
            const formData = new FormData();
            formData.append("attachment", pendingAttachment.file);
            formData.append("receiverId", otherParticipantId);
            if (messageText.trim()) formData.append("message", messageText.trim());

            const res = await uploadChatMedia(formData).unwrap();
            console.log("uploadChatMedia response:", res);
            if (res && res.data) {
              // Replace temp message with server message
              setLocalMessages((prev) =>
                prev.map((msg) => (msg._id === tempMessage._id ? res.data : msg))
              );
              // Emit via socket so recipient gets realtime update (server also emits but keep consistent)
              socket.emit("sendMessage", { receiverId: otherParticipantId, message: res.data.message, attachment: res.data.attachment });
            } else {
              // Remove temp message on failure
              setLocalMessages((prev) => prev.filter((msg) => msg._id !== tempMessage._id));
              alert(res?.error || "File upload failed");
            }
          } catch (error) {
            console.error("File upload error:", error);
            setLocalMessages((prev) => prev.filter((msg) => msg._id !== tempMessage._id));
            alert("File upload error");
          } finally {
            setUploadingFile(false);
            setPendingAttachment(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }
        })();
      } else {
        // No attachment: send via socket as before
        socket.emit(
          "sendMessage",
          {
            receiverId: otherParticipantId,
            message: tempMessage.message,
          },
          (response) => {
            if (response?.status === "ok") {
              setLocalMessages((prev) =>
                prev.map((msg) =>
                  msg._id === tempMessage._id ? response.data : msg
                )
              );
            } else {
              setLocalMessages((prev) => prev.filter((msg) => msg._id !== tempMessage._id));
            }
          }
        );
      }
    },
    [
      messageText,
      otherParticipantId,
      socket,
      currentUserId,
      currentUser,
      stopTyping,
      pendingAttachment,
      uploadChatMedia,
    ]
  );

  // Allow user to remove pending attachment before sending
  const removePendingAttachment = () => {
    if (pendingAttachment?.previewUrl) URL.revokeObjectURL(pendingAttachment.previewUrl);
    setPendingAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const filteredConversations = conversations.filter((conv) => {
    const otherParticipant = conv.participants?.find(
      (p) => p._id !== currentUserId
    );
    return otherParticipant?.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  const allMessages = useMemo(() => {
    const combined = [...localMessages, ...socketMessages];
    const unique = combined.filter(
      (msg, index, self) =>
        index === self.findIndex((m) => (m._id || m.id) === (msg._id || msg.id))
    );
    return unique.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [localMessages, socketMessages]);

  if (conversationsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-white flex flex-col">
      <Hero
        place="Chat"
        title="Messages"
        subtitle="Communicate with workers and service providers"
        className="h-42 md:h-50 lg:h-68 mb-0"
      />

      <div className="flex flex-1 overflow-hidden border border-neutral-200 mb-10 w-full mx-auto max-w-7xl rounded-lg relative">
        {/* Sidebar/Conversations List */}
        <aside
          className={`
            ${showSidebar ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
            fixed lg:relative
            inset-y-0 left-0
            z-40
            w-72 sm:w-80
            border-r border-gray-200 bg-gray-50
            flex flex-col
            transition-transform duration-300 ease-in-out
          `}
        >
          <header className="border-b border-gray-200 p-3 md:p-4 bg-white">
            <div className="flex items-center justify-between mb-3 lg:hidden mt-10 lg:mt-0">
              <h3 className="text-sm font-semibold text-gray-900">Messages</h3>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="search"
                placeholder="Search conversations"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-neutral-100 py-2 pl-11 pr-4 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </header>

          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-gray-100">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <ContactItem
                    key={conversation._id}
                    conversation={conversation}
                    active={selectedConversation?._id === conversation._id}
                    onClick={() => handleConversationSelect(conversation)}
                    currentUserId={currentUserId}
                  />
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <p>No conversations found</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black/10 backdrop-blur-2xl bg-opacity-50 z-30 lg:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Chat Section */}
        <section className="flex flex-1 flex-col shadow-sm h-130 w-full">
          {selectedConversation ? (
            <>
              <header className="flex items-center justify-between border-b border-gray-100 p-3 md:p-4 bg-white shadow-sm">
                <div className="flex items-center gap-2 md:gap-3">
                  <button
                    className="lg:hidden p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setShowSidebar(true)}
                    aria-label="Open conversations"
                  >
                    <Menu className="w-5 h-5 text-gray-600" />
                  </button>
                  <Avatar
                    src={getFullImageUrl(publicProfile?.profile?.profilePicture || otherParticipant?.profilePicture)}
                    name={publicProfile?.profile?.name || otherParticipant?.name}
                    size="default"
                    className="h-6 w-6 md:h-8 md:w-8"
                  />
                  <div>
                    <h2 className="text-xs md:text-sm font-semibold text-gray-900">
                      {publicProfile?.profile?.name || otherParticipant?.name || "Unknown User"}
                    </h2>
                    <p className="text-[10px] md:text-xs text-gray-500">
                      {publicProfile?.profile?.role || otherParticipant?.role || "Worker"} •{" "}
                       {isConnected ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <button
                    className="p-1.5 md:p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                    aria-label="Report user"
                    title="Report User"
                    onClick={() => setShowReportModal(true)}
                  >
                    <Flag size={16} className="md:w-[18px] md:h-[18px]" />
                  </button>
                  <button
                    className="p-1.5 md:p-2 text-gray-500 hover:text-gray-700"
                    aria-label="More options"
                  >
                    <MoreVertical
                      size={16}
                      className="md:w-[18px] md:h-[18px]"
                    />
                  </button>
                </div>
              </header>

              <div
                className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4"
                style={{ overflowAnchor: "none" }}
              >
                {messagesLoading ? (
                  <div className="flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : allMessages.length > 0 ? (
                  allMessages.map((message, index) => (
                    <MessageBubble
                      key={message._id || message.id || `message-${index}`}
                      message={message}
                      currentUserId={currentUserId}
                      otherParticipant={otherParticipant}
                    />
                  ))
                ) : selectedConversation?.isNewChat ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="text-center max-w-md">
                      <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                        <Send className="w-8 h-8 text-[#74C7F2]" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Start a conversation
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Send a message to{" "}
                        {otherParticipant?.name || "this worker"} to start your
                        conversation.
                      </p>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                          💡 <strong>Tip:</strong> Be polite and clearly
                          describe what service you need or questions you have.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}

                {typingUsers.length > 0 && (
                  <div className="text-sm text-gray-500 italic">
                    {typingUsers.map((u) => u.userName).join(", ")}{" "}
                    {typingUsers.length === 1 ? "is" : "are"} typing...
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <footer className="border-t border-gray-100 p-2 md:p-3">
                <form onSubmit={handleSendMessage}>
                  <div className="flex items-center gap-1 md:gap-2 rounded-full border border-gray-200 bg-white px-2 md:px-3 py-1.5 md:py-2 shadow-sm">
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileSelect}
                      disabled={uploadingFile}
                    />
                    {pendingAttachment && (
                      <div className="flex items-center gap-2 mr-2">
                        {pendingAttachment.previewUrl ? (
                          <img src={pendingAttachment.previewUrl} alt="preview" className="w-12 h-12 object-cover rounded-md" />
                        ) : (
                          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-md text-xs">{pendingAttachment.fileName}</div>
                        )}
                        <button type="button" onClick={removePendingAttachment} className="text-red-500">Remove</button>
                      </div>
                    )}
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-full text-gray-500 hover:text-blue-500"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingFile}
                      aria-label="Attach file"
                    >
                      <Paperclip size={18} />
                    </button>
                    <input
                      type="text"
                      placeholder={
                        selectedConversation?.isNewChat
                          ? `Send your first message to ${
                              otherParticipant?.name || "this worker"
                            }...`
                          : "Type a message..."
                      }
                      value={messageText}
                      onChange={(e) => {
                        setMessageText(e.target.value);
                        if (otherParticipantId) {
                          startTyping(otherParticipantId);
                          if (typingTimeoutRef.current)
                            clearTimeout(typingTimeoutRef.current);
                          typingTimeoutRef.current = setTimeout(
                            () => stopTyping(otherParticipantId),
                            1000
                          );
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      disabled={isSending}
                      className="flex-1 bg-transparent text-xs md:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none min-w-0"
                    />

                    <button
                      type="submit"
                      disabled={!(messageText.trim() || pendingAttachment) || isSending}
                      className="inline-flex h-7 w-7 md:h-9 md:w-9 items-center justify-center rounded-full text-white shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background:
                          "linear-gradient(180deg, #B6E0FE 0%, #74C7F2 100%)",
                      }}
                      aria-label="Send"
                    >
                      {isSending ? (
                        <Loader2
                          size={14}
                          className="md:w-4 md:h-4 animate-spin"
                        />
                      ) : (
                        <Send size={14} className="md:w-4 md:h-4" />
                      )}
                    </button>
                  </div>
                </form>
              </footer>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
              <button
                className="lg:hidden mb-4 px-4 py-2 bg-linear-to-r from-[#B6E0FE] to-[#74C7F2] text-white rounded-lg flex items-center gap-2"
                onClick={() => setShowSidebar(true)}
              >
                <Menu className="w-5 h-5" />
                View Conversations
              </button>
              <div className="text-center text-gray-500">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Send className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Select a conversation
                </h3>
                <p className="text-sm">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReportSubmit}
        isSubmitting={isReporting}
      />
    </main>
  );
};

const normalizeOfferMessage = (offer) => {
  const senderId = offer.sender?._id || offer.senderId;
  const receiverId = offer.receiver?._id || offer.receiverId;

  return {
    _id: offer._id || `temp-offer-${Date.now()}`,
    createdAt: offer.createdAt || new Date().toISOString(),
    senderId,
    receiverId,
    sender: offer.sender || { _id: senderId },
    receiver: offer.receiver || { _id: receiverId },
    customOffer: offer.customOffer || offer,
    message: "", // keep MessageBubble safe
    content: "",
  };
};


export default Chat;
