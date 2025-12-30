import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  CheckCheck,
  Send,
  MoreVertical,
  Circle,
  Loader2,
  DollarSign,
  Menu,
  X,
  Paperclip,
} from "lucide-react";
import Hero from "../../components/common/Hero";
import Avatar from "../../components/common/Avatar";
import GigSelectionModal from "../../components/common/GigSelectionModal";
import CustomOfferModal from "../../components/common/CustomOfferModal";
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
import OfferCard from "../../components/common/OfferCard";
import styles from "./Chat.module.scss";
import { getFullImageUrl } from "../../utils/fileUrl.js";

// Contact Item Component
const ContactItem = ({
  conversation,
  active = false,
  onClick,
  currentUserId,
}) => {
  // find the participant id that is not the current user
  const otherParticipant = conversation?.participants?.find(
    (p) => p._id !== currentUserId
  );
  const participantId = otherParticipant?._id;

  // Fetch public profile for this participant using the existing RTK hook
  const { data: publicProfile } = useGetPublicProfileQuery(participantId, {
    skip: !participantId,
  });

  // Use profile data if available, otherwise fall back to conversation participant
  const displayName =
    publicProfile?.profile?.name || otherParticipant?.name || "Unknown User";
  const displayPicture =
    publicProfile?.profile?.profilePicture || otherParticipant?.profilePicture;

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
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <button
      onClick={onClick}
      className={[
        "w-full flex items-center gap-2 md:gap-3 py-3 md:py-4 p-2 md:p-3 text-left transition-colors hover:cursor-pointer",
        active
          ? "bg-[#EAF6FF] border-l-4 border-l-[#74C7F2]"
          : "hover:bg-gray-50",
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

// Message Bubble Component
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
      <div
        className={`w-fit items-end gap-1 ${
          isMe ? "flex justify-end flex-col" : ""
        }`}
      >
        <div
          className={`rounded-2xl px-3 md:px-4 py-2 md:py-3 ${
            isMe
              ? "bg-linear-to-r from-[#B6E0FE] to-[#74C7F2] text-white"
              : "bg-gray-100 text-gray-900"
          }`}
        >
          {isImage ? (
            <img
              src={getFullImageUrl(message.attachment.url)}
              alt={message.attachment.type || "shared file"}
              className="max-w-xs max-h-60 rounded-lg"
            />
          ) : isFile ? (
            <a
              href={getFullImageUrl(message.attachment.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {message.attachment.type === "video"
                ? "View video"
                : "Download file"}
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

// Main Chat Component
const Chat = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showGigSelection, setShowGigSelection] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedGig, setSelectedGig] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [localMessages, setLocalMessages] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState(null);
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
    const previewUrl = file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : null;
    setPendingAttachment({
      file,
      previewUrl,
      fileName: file.name,
      fileType: file.type,
    });
  };

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  const { user: currentUser } = useAuth();
  const currentUserId =
    currentUser?._id || currentUser?.id || currentUser?.userId;

  const { isConnected, socket } = useSocket();
  const conversationId = searchParams.get("conversation");
  const userId = searchParams.get("user");
  const targetUserId = conversationId || userId;
  const otherParticipantId =
    selectedConversation?.participants?.find((p) => p._id !== currentUserId)
      ?._id || targetUserId;

  // Ensure we have otherParticipant available before using it for header display
  const otherParticipant = selectedConversation?.participants?.find(
    (p) => p._id !== currentUserId
  );

  // Fetch public profile for header display (use existing RTK hook)
  const { data: publicProfile } = useGetPublicProfileQuery(targetUserId, {
    skip:
      !targetUserId ||
      (selectedConversation && !selectedConversation._id.startsWith("temp-")),
  });

  const headerDisplayName =
    publicProfile?.profile?.name || otherParticipant?.name;
  const headerDisplayPicture =
    publicProfile?.profile?.profilePicture || otherParticipant?.profilePicture;
  const headerDisplayRole =
    publicProfile?.profile?.role || otherParticipant?.role || "User";

  const {
    data: conversationsData,
    isLoading: conversationsLoading,
    refetch: refetchConversations,
  } = useGetConversationsQuery();

  const {
    data: messagesData,
    isLoading: messagesLoading,
    // refetch: refetchMessages,
  } = useGetMessagesQuery(
    { userId: otherParticipantId },
    { skip: !otherParticipantId }
  );

  const conversations = useMemo(
    () => (Array.isArray(conversationsData) ? conversationsData : []),
    [conversationsData]
  );

  const messages = useMemo(
    () => (Array.isArray(messagesData) ? messagesData : []),
    [messagesData]
  );

  console.log("............", messages);

  const [, { isLoading: isSending }] = useSendMessageMutation();
  const [markAsRead] = useMarkAsReadMutation();

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
// Sync messages from API to local state with Merge Logic
  useEffect(() => {
    // Only proceed if we have API messages
    if (messages && messages.length > 0) {
      setLocalMessages((prev) => {
        // If local state is empty, just accept the API data
        if (prev.length === 0) return messages;

        // 1. Get a Set of all IDs currently returned by the API
        const apiMessageIds = new Set(messages.map((m) => m._id));

        // 2. Find messages in our Local State that are MISSING from the API.
        //    These are likely:
        //    - Optimistic updates (temp-*)
        //    - New socket messages/offers that arrived *after* the API fetch started
        const missingLocalMessages = prev.filter((localMsg) => {
          // Keep temp messages
          if (localMsg._id?.startsWith("temp-")) return true;
          
          // Keep real messages that the API doesn't know about yet
          return !apiMessageIds.has(localMsg._id);
        });

        // 3. Combine API messages + the preserved local messages
        const mergedMessages = [...messages, ...missingLocalMessages].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        return mergedMessages;
      });
    }
  }, [messages]);

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
      // Check if message belongs to current conversation
      const messageSenderId = newMessage.sender?._id || newMessage.senderId;
      const messageReceiverId =
        newMessage.receiver?._id || newMessage.receiverId;

      const isRelevant =
        (messageSenderId === currentUserId &&
          messageReceiverId === otherParticipantId) ||
        (messageSenderId === otherParticipantId &&
          messageReceiverId === currentUserId);

      if (isRelevant) {
        // Avoid duplicates
        setLocalMessages((prev) => {
          const exists = prev.some(
            (msg) => msg._id === newMessage._id || msg.id === newMessage.id
          );
          if (exists) return prev;
          return [...prev, newMessage];
        });
      }

      // Refresh conversations list to update last message
      refetchConversations();
    };

    const handleOfferUpdate = (updatedMessage) => {
      setLocalMessages((prev) =>
        prev.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg
        )
      );
      setSocketMessages((prev) =>
        prev.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg
        )
      );
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("updateMessage", handleOfferUpdate);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("updateMessage", handleOfferUpdate);
    };
  }, [
    socket,
    currentUserId,
    otherParticipantId,
    refetchConversations,
    setSocketMessages,
  ]);

  // Listen for new offers from socket
 // Listen for new offers from socket
  useEffect(() => {
    if (!socket) return;

    const handleNewOffer = (offer) => {
      const messageSenderId = offer.sender?._id || offer.senderId;
      const messageReceiverId = offer.receiver?._id || offer.receiverId;

      const isRelevant =
        (messageSenderId === currentUserId &&
          messageReceiverId === otherParticipantId) ||
        (messageSenderId === otherParticipantId &&
          messageReceiverId === currentUserId);

      if (isRelevant) {
        // Ensure the offer has the structure of a Message (MessageBubble checks message.customOffer)
        // If the socket sends the raw Offer object, we might need to wrap it or ensure 'customOffer' exists
        const formattedOffer = offer.customOffer 
          ? offer 
          : { ...offer, customOffer: offer }; // Fallback if backend sends raw offer data

        setLocalMessages((prev) => {
            // Avoid duplicates if this offer is already in the list
            if (prev.some(m => m._id === formattedOffer._id)) return prev;
            return [...prev, formattedOffer]
        });
        
        refetchConversations(); 
      }
    };

    socket.on("newOffer", handleNewOffer);

    return () => socket.off("newOffer", handleNewOffer);
  }, [socket, currentUserId, otherParticipantId, refetchConversations]);

  // Listen for chat list updates
  useEffect(() => {
    if (!socket) return;

    const handleChatListUpdate = () => {
      refetchConversations();
    };

    socket.on("updateChatList", handleChatListUpdate);

    return () => {
      socket.off("updateChatList", handleChatListUpdate);
    };
  }, [socket, refetchConversations]);

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
        if (conversation._id !== conversationId)
          setSearchParams({ conversation: conversation._id });
      } else {
        setSelectedConversation({
          _id: `temp-${targetUserId}`,
          participants: [
            {
              _id: currentUserId,
              name: currentUser?.name,
              role: currentUser?.role,
            },
            { _id: targetUserId, name: "Customer", role: "user" },
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

  const handleConversationSelect = useCallback(
    (conversation) => {
      setSelectedConversation(conversation);
      setSearchParams({ conversation: conversation._id });
      if (conversation.unreadCount > 0) markAsRead(conversation._id);
      setShowSidebar(false);
      // Do NOT clear localMessages here; let useGetMessagesQuery handle it
    },
    [setSearchParams, markAsRead]
  );

  const handleSendMessage = useCallback(
    (e) => {
      e.preventDefault();
      if (!messageText.trim() && !pendingAttachment) return;
      if (!otherParticipantId || isSending) return;

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

      // Optimistic UI - include pending attachment preview if exists
      if (pendingAttachment) {
        tempMessage.attachment = {
          url: pendingAttachment.previewUrl,
          type: pendingAttachment.fileType.startsWith("image")
            ? "image"
            : pendingAttachment.fileType.startsWith("video")
            ? "video"
            : "file",
          fileName: pendingAttachment.fileName,
          pending: true,
        };
      }
      setLocalMessages((prev) => [...prev, tempMessage]);
      setMessageText("");

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      stopTyping(otherParticipantId);

      // If there's a pending attachment, upload via RTK mutation and then emit/replace
      if (pendingAttachment) {
        (async () => {
          setUploadingFile(true);
          try {
            const formData = new FormData();
            formData.append("attachment", pendingAttachment.file);
            formData.append("receiverId", otherParticipantId);
            if (messageText.trim())
              formData.append("message", messageText.trim());

            const res = await uploadChatMedia(formData).unwrap();
            if (res && res.data) {
              setLocalMessages((prev) =>
                prev.map((m) => (m._id === tempMessage._id ? res.data : m))
              );
              socket.emit("sendMessage", {
                receiverId: otherParticipantId,
                message: res.data.message,
                attachment: res.data.attachment,
              });
            } else {
              setLocalMessages((prev) =>
                prev.filter((m) => m._id !== tempMessage._id)
              );
              alert(res?.error || "File upload failed");
            }
          } catch (err) {
            console.error("File upload error:", err);
            setLocalMessages((prev) =>
              prev.filter((m) => m._id !== tempMessage._id)
            );
            alert("File upload error");
          } finally {
            setUploadingFile(false);
            setPendingAttachment(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }
        })();
      } else {
        // No attachment: send as before via socket
        if (socket) {
          socket.emit(
            "sendMessage",
            { receiverId: otherParticipantId, message: tempMessage.message },
            (response) => {
              if (response?.status === "ok") {
                setLocalMessages((prev) =>
                  prev.map((m) =>
                    m._id === tempMessage._id ? response.data : m
                  )
                );
              } else {
                setLocalMessages((prev) =>
                  prev.filter((m) => m._id !== tempMessage._id)
                );
              }
            }
          );
        }
      }
    },
    [
      messageText,
      otherParticipantId,
      currentUserId,
      currentUser,
      socket,
      isSending,
      stopTyping,
      pendingAttachment,
      uploadChatMedia,
    ]
  );

  const removePendingAttachment = () => {
    if (pendingAttachment?.previewUrl)
      URL.revokeObjectURL(pendingAttachment.previewUrl);
    setPendingAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Add socket connection error handling and logging
  useEffect(() => {
    if (!socket) return;
    const onConnect = () => console.log("Socket connected");
    const onDisconnect = (reason) =>
      console.warn("Socket disconnected:", reason);
    const onConnectError = (err) =>
      console.error("Socket connection error:", err);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
    };
  }, [socket]);

  const filteredConversations = conversations.filter((conv) =>
    conv.participants?.some(
      (p) =>
        p._id !== currentUserId &&
        p.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // otherParticipant already declared earlier for header usage

  // Combine and deduplicate messages
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
        subtitle="Communicate with workers and customers"
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
          <div className={`flex-1 ${styles.scrollContainer}`}>
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
                    src={getFullImageUrl(headerDisplayPicture)}
                    name={headerDisplayName}
                    size="default"
                    className="h-6 w-6 md:h-8 md:w-8"
                  />
                  <div>
                    <h2 className="text-xs md:text-sm font-semibold text-gray-900">
                      {headerDisplayName || "Unknown User"}
                    </h2>
                    <p className="text-[10px] md:text-xs text-gray-500">
                      {headerDisplayRole || "User"} •{" "}
                      {isConnected ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  {otherParticipant && (
                    <button
                      onClick={() => setShowGigSelection(true)}
                      className="px-2 md:px-3 py-1.5 md:py-2 bg-linear-to-r from-[#B6E0FE] to-[#74C7F2] text-white text-xs md:text-sm font-medium rounded-lg hover:shadow-md transition-all flex items-center gap-1"
                      title="Send Custom Offer"
                    >
                      <DollarSign size={14} className="md:w-4 md:h-4" />
                      <span className="hidden md:inline">Offer</span>
                    </button>
                  )}

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
                className={`flex-1 ${styles.scrollContainer} p-3 md:p-4 space-y-3 md:space-y-4`}
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
                        {otherParticipant?.name || "this customer"} to start
                        your conversation.
                      </p>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                          💡 <strong>Tip:</strong> Introduce yourself
                          professionally and explain your services or respond to
                          their inquiry.
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
                          <img
                            src={pendingAttachment.previewUrl}
                            alt="preview"
                            className="w-12 h-12 object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-md text-xs">
                            {pendingAttachment.fileName}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={removePendingAttachment}
                          className="text-red-500"
                        >
                          Remove
                        </button>
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
                              otherParticipant?.name || "this customer"
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
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      disabled={isSending}
                      className="flex-1 bg-transparent text-xs md:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none min-w-0"
                    />

                    <button
                      type="submit"
                      disabled={
                        !(messageText.trim() || pendingAttachment) || isSending
                      }
                      className="inline-flex h-7 w-7 md:h-9 md:w-9 items-center justify-center rounded-full text-white shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background:
                          "linear-gradient(180deg, #B6E0FE 0%, #74C7F2 100%)",
                      }}
                      aria-label="Send"
                    >
                      {isSending ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Send size={14} className="md:w-[18px] md:h-[18px]" />
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

      <GigSelectionModal
        isOpen={showGigSelection}
        onClose={() => {
          setShowGigSelection(false);
          setSelectedGig(null);
        }}
        onGigSelect={(gig) => {
          setSelectedGig(gig);
          setShowGigSelection(false);
          setShowOfferModal(true);
        }}
        receiverName={otherParticipant?.name}
      />

      <CustomOfferModal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        receiverId={otherParticipant?._id}
        receiverName={otherParticipant?.name}
        selectedGig={selectedGig}
        onOfferSent={(offer, tempId) => {
          // Ensure structure is correct for rendering immediately
const offerMessage = normalizeOfferMessage(
  offer,
  currentUser._id,
  otherParticipant?._id
);
          
          setLocalMessages((prev) =>
            tempId
              ? prev.map((m) => (m._id === tempId ? offerMessage : m))
              : [...prev, offerMessage]
          );
        }}
        socket={socket}
        currentUser={currentUser}
      />
    </main>
  );
};

const normalizeOfferMessage = (offer, currentUserId, receiverId) => ({
  _id: offer._id || `temp-offer-${Date.now()}`,
  createdAt: offer.createdAt || new Date().toISOString(),
  senderId: currentUserId,
  receiverId,
  customOffer: offer.customOffer || offer,
  sender: offer.sender || {
    _id: currentUserId,
  },
});


export default Chat;
