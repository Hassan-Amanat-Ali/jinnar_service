import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  CheckCheck,
  Send,
  ArrowLeft,
  MoreVertical,
  Circle,
  Loader2,
  DollarSign,
  Menu,
  X,
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
} from "../../services/chatApi";
import OfferCard from "../../components/common/OfferCard";
import styles from "./Chat.module.scss";

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
          src={otherParticipant?.profilePicture}
          name={otherParticipant?.name}
          size="md"
          className="h-8 w-8 md:h-10 md:w-10"
        />
        <Circle className="absolute -bottom-0.5 -right-0.5 w-3 h-3 fill-green-500 text-green-500" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="truncate text-xs md:text-sm font-semibold text-gray-900">
            {otherParticipant?.name || "Unknown User"}
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
          src={
            otherParticipant?.profilePicture || message.sender?.profilePicture
          }
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
          <p className="text-xs md:text-sm wrap-break-word whitespace-pre-wrap">
            {messageText}
          </p>
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
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { user: currentUser } = useAuth();
  const currentUserId =
    currentUser?._id || currentUser?.id || currentUser?.userId;

  const { isConnected, socket } = useSocket();
  const conversationId = searchParams.get("conversation");
  const userId = searchParams.get("user");
  const targetUserId = conversationId || userId;
  const otherParticipantId =
    targetUserId ||
    selectedConversation?.participants?.find((p) => p._id !== currentUserId)
      ?._id;

  const {
    data: conversationsData,
    isLoading: conversationsLoading,
    refetch: refetchConversations,
  } = useGetConversationsQuery();

  const {
    data: messagesData,
    isLoading: messagesLoading,
    refetch: refetchMessages,
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
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [markAsRead] = useMarkAsReadMutation();

  const socketConversationId =
    selectedConversation?._id || `temp-${targetUserId}`;
  const {
    messages: socketMessages,
    setMessages: setSocketMessages,
    typingUsers,
    sendMessage: sendSocketMessage,
    startTyping,
    stopTyping,
  } = useChat(socketConversationId);

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
    const currentLength = messages.length + socketMessages.length;
    const isInitialLoad =
      prevMessagesLengthRef.current === 0 && currentLength > 0;
    const hasNewMessages = currentLength > prevMessagesLengthRef.current;
    if (isInitialLoad) scrollToBottom(false);
    else if (hasNewMessages && !isSending) scrollToBottom(true);
    prevMessagesLengthRef.current = currentLength;
  }, [
    messages.length,
    socketMessages.length,
    selectedConversation?._id,
    isSending,
  ]);

  useEffect(() => {
    if (!socket) return;
    const handleOfferUpdate = (updatedMessage) => {
      setSocketMessages((prev) =>
        prev.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg
        )
      );
      refetchMessages();
    };
    socket.on("updateMessage", handleOfferUpdate);
    return () => socket.off("updateMessage", handleOfferUpdate);
  }, [socket, setSocketMessages, refetchMessages]);

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
      // Close sidebar on mobile when conversation is selected
      setShowSidebar(false);
    },
    [setSearchParams, markAsRead]
  );

  const handleSendMessage = useCallback(
    async (e) => {
      e.preventDefault();
      if (!messageText.trim() || !otherParticipantId || isSending) return;

      const messageData = {
        receiverId: otherParticipantId,
        message: messageText.trim(),
        messageType: "text",
      };
      await sendMessage(messageData).unwrap();
      sendSocketMessage({
        ...messageData,
        conversationId: socketConversationId,
        sender: currentUser,
      });
      setMessageText("");
      refetchMessages();
      refetchConversations();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      stopTyping(otherParticipantId);
    },
    [
      messageText,
      otherParticipantId,
      isSending,
      sendMessage,
      sendSocketMessage,
      currentUser,
      refetchMessages,
      refetchConversations,
      socketConversationId,
      stopTyping,
    ]
  );

  const filteredConversations = conversations.filter((conv) =>
    conv.participants?.some(
      (p) =>
        p._id !== currentUserId &&
        p.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const otherParticipant = selectedConversation?.participants?.find(
    (p) => p._id !== currentUserId
  );
  const allMessages = [...messages, ...socketMessages].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

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
            className="fixed inset-0 bg-black/10 backdrop-blur-2xl  bg-opacity-50 z-30 lg:hidden"
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
                    src={otherParticipant?.profilePicture}
                    name={otherParticipant?.name}
                    size="default"
                    className="h-6 w-6 md:h-8 md:w-8"
                  />
                  <div>
                    <h2 className="text-xs md:text-sm font-semibold text-gray-900">
                      {otherParticipant?.name || "Unknown User"}
                    </h2>
                    <p className="text-[10px] md:text-xs text-gray-500">
                      {otherParticipant?.role || "User"} •{" "}
                      {isConnected ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  {otherParticipant && (
                    <button
                      onClick={() => setShowGigSelection(true)}
                      className="px-2 md:px-3 py-1.5 md:py-2 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white text-xs md:text-sm font-medium rounded-lg hover:shadow-md transition-all flex items-center gap-1"
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
                      onKeyPress={(e) => {
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
                      disabled={!messageText.trim() || isSending}
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
                className="lg:hidden mb-4 px-4 py-2 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white rounded-lg flex items-center gap-2"
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
        onClose={() => {
          setShowOfferModal(false);
          setSelectedGig(null);
        }}
        receiverId={otherParticipantId}
        receiverName={otherParticipant?.name}
        selectedGig={selectedGig}
        onOfferSent={() => {
          setShowOfferModal(false);
          setSelectedGig(null);
          refetchMessages();
          refetchConversations();
        }}
      />
    </main>
  );
};

export default Chat;
