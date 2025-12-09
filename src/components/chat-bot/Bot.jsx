import React, { useEffect, useRef, useState } from "react";
import {
  useSendChatbotMessageMutation,
} from "../../services/chatbotApi";
import { useCreateSupportTicketMutation } from "../../services/supportApi";
import { useAuth } from "../../context/AuthContext";

const Bot = ({
  title = "Jinnar Assistant",
  subtitle = "Ask me about services, payments, or accounts",
  className = "",
  position = "bottom-right",
  brandColor = "#74C7F2",
  brandColorDark = "#469DD7",
}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isAwaitingTicketQuery, setIsAwaitingTicketQuery] = useState(false);
  const [emailFormData, setEmailFormData] = useState({
    email: "",
    name: "",
    phone: "",
  });

  const listRef = useRef(null);
  const inputRef = useRef(null);

  const { user } = useAuth();

  // RTK Query mutations
  const [sendMessage, { isLoading: isSending }] =
    useSendChatbotMessageMutation();
  const [createTicket, { isLoading: isCreatingTicket }] =
    useCreateSupportTicketMutation();

  // Position classes - responsive positioning
  const positionClasses = {
    "bottom-right": "bottom-3 right-3 sm:bottom-6 sm:right-6",
    "bottom-left": "bottom-3 left-3 sm:bottom-6 sm:left-6", 
    "top-right": "top-3 right-3 sm:top-6 sm:right-6",
    "top-left": "top-3 left-3 sm:top-6 sm:left-6",
  };

  // Initialize chat on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      handleBotMessage("start");
    }
  }, [isOpen]);

  useEffect(() => {
    // Auto-scroll on new messages
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Focus input when chat opens
    if (isOpen && inputRef.current && !showEmailForm) {
      inputRef.current.focus();
    }
  }, [isOpen, showEmailForm]);

  useEffect(() => {
    // Update unread count when chat is closed
    if (!isOpen) {
      const lastBotMessage = messages[messages.length - 1];
      if (lastBotMessage && lastBotMessage.from === "bot") {
        setUnreadCount((prev) => prev + 1);
      }
    } else {
      setUnreadCount(0);
    }
  }, [messages, isOpen]);

  const addMessage = (from, text, options = null, timestamp = new Date()) => {
    const newMsg = {
      id: Date.now() + Math.random(),
      from,
      text,
      options,
      timestamp,
    };
    setMessages((m) => [...m, newMsg]);
    return newMsg;
  };

  const handleBotMessage = async (query) => {
    try {
      const result = await sendMessage(query).unwrap();

      if (result.success && result.response) {
        const { message, options, type } = result.response;

        // Check if we need to show email form
        if (type === "input_email") {
          setShowEmailForm(true);
          addMessage("bot", message);
        } else {
          // Add bot message with options if available
          addMessage("bot", message, options?.length > 0 ? options : null);
        }
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      addMessage(
        "bot",
        "Sorry, I'm having trouble connecting right now. Please try again.",
        [{ label: "🔄 Retry", value: "start" }]
      );
    }
  };

  const handleUserMessage = async (text) => {
    if (!text || !text.trim()) return;

    if (isAwaitingTicketQuery) {
      handleTicketFlow(text);
      return;
    }

    setInput("");
    addMessage("user", text.trim());
    await handleBotMessage(text.trim());
  };

  const handleOptionClick = async (option) => {
    // Show the label (user-friendly text) instead of the value (backend key)
    addMessage("user", option.label);

    if (option.value === "contact_support_start") {
      setIsAwaitingTicketQuery(true);
      addMessage("bot", "Please describe your issue in detail for the support ticket.");
      return;
    }

    await handleBotMessage(option.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUserMessage(input);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!emailFormData.email || !emailFormData.name) {
      return;
    }

    const lastUserMessage = messages.findLast((m) => m.from === "user");
    const userQuery = lastUserMessage?.text || "Support request from chatbot";

    try {
      const ticketData = {
        subject: userQuery.substring(0, 100), // Use part of the message as subject
        message: userQuery,
      };

      if (!user) {
        // This is now part of the payload for guest ticket creation via the same endpoint
        ticketData.guestInfo = {
          email: emailFormData.email,
          name: emailFormData.name,
          phone: emailFormData.phone,
        };
      }

      const result = await createTicket(ticketData).unwrap();

      setShowEmailForm(false);
      setEmailFormData({ email: "", name: "", phone: "" });

      addMessage(
        "bot",
        result.message ||
          `✅ Ticket created! We'll get back to you shortly.`,
        [{ label: "🏠 Main Menu", value: "start" }]
      );
    } catch (error) {
      console.error("Ticket creation error:", error);
      addMessage(
        "bot",
        "Sorry, I couldn't create your ticket. Please try again.",
        [
          { label: "🔄 Try Again", value: "contact_support_start" },
          { label: "🏠 Main Menu", value: "start" },
        ]
      );
    }
  };

  const createTicketForLoggedInUser = async (message) => {
    try {
      const result = await createTicket({
        subject: message.substring(0, 100),
        message: message,
      }).unwrap();

      addMessage(
        "bot",
        result.message || `✅ Ticket created! We'll get back to you shortly.`,
        [{ label: "🏠 Main Menu", value: "start" }]
      );
    } catch (error) {
      console.error("Ticket creation error for logged in user:", error);
      addMessage(
        "bot",
        "Sorry, I couldn't create your ticket. Please try again.",
        [{ label: "🔄 Try Again", value: "contact_support_start" }]
      );
    }
  };

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleTicketFlow = (text) => {
    setInput("");
    addMessage("user", text.trim());
    setIsAwaitingTicketQuery(false);

    if (user) {
      // If user is logged in, create ticket directly
      createTicketForLoggedInUser(text.trim());
    } else {
      // If user is a guest, ask for their details
      setShowEmailForm(true);
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className={`fixed ${positionClasses[position]} z-50 group w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center`}
          aria-label="Open chat"
          style={{
            background: `linear-gradient(135deg, ${brandColor}, ${brandColorDark})`,
          }}
        >
          {/* Unread badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}

          {/* Chat icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            Chat with us
            <div className="absolute top-full right-5 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-900"></div>
          </div>
        </button>
      )}{" "}
      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed inset-0 sm:inset-auto sm:${positionClasses[position]} z-50 ${className} flex items-center justify-center sm:block`}
          role="dialog"
          aria-label="Chat window"
        >
          {/* Mobile backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 sm:hidden" 
            onClick={toggleChat}
          />
          
          <div
            className="relative w-[calc(100vw-24px)] max-w-[360px] h-[calc(100vh-100px)] max-h-[550px] sm:w-[360px] sm:h-[550px] rounded-xl overflow-hidden bg-white shadow-xl flex flex-col m-3 sm:m-0"
            style={{
              animation: "slideUp 0.3s ease-out",
            }}
          >
            {/* Header */}
            <header
              className="flex items-center justify-between px-4 py-3 text-white shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${brandColor}, ${brandColorDark})`,
              }}
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-semibold text-sm">
                    JA
                  </div>
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border border-white"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">
                    {title}
                  </div>
                  <div className="text-[11px] opacity-90 truncate">{subtitle}</div>
                </div>
              </div>

              <div className="flex items-center">
                <button
                  aria-label="Close chat"
                  onClick={toggleChat}
                  className="rounded-full p-1.5 hover:bg-white/20 transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </header>

            {/* Messages Area */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto p-3 space-y-3 bg-gradient-to-b from-gray-50 to-white scrollbar-hide"
            >
              {messages.map((m) => (
                <div key={m.id} className="space-y-1.5 animate-fadeIn">
                  <div
                    className={`flex ${
                      m.from === "bot" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] ${
                        m.from === "bot"
                          ? "bg-white border border-gray-200 text-gray-900 rounded-xl rounded-tl-sm shadow-sm"
                          : "text-white rounded-xl rounded-tr-sm shadow-sm"
                      } px-3 py-2`}
                      style={
                        m.from === "user"
                          ? {
                              background: `linear-gradient(135deg, ${brandColor}, ${brandColorDark})`,
                            }
                          : {}
                      }
                    >
                      <div className="text-[13px] leading-relaxed whitespace-pre-wrap break-words">
                        {m.text}
                      </div>
                      {m.timestamp && (
                        <div
                          className={`text-[10px] mt-1 ${
                            m.from === "bot" ? "text-gray-400" : "text-white/70"
                          }`}
                        >
                          {formatTime(m.timestamp)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Options/Quick Replies */}
                  {m.from === "bot" && m.options && m.options.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pl-1">
                      {m.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOptionClick(option)}
                          disabled={isSending}
                          className="px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm transform hover:scale-[1.02] active:scale-95"
                          style={{
                            color: brandColor,
                            borderColor: brandColor,
                            backgroundColor: 'white',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = brandColor;
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.color = brandColor;
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isSending && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="px-3 py-2 rounded-xl rounded-tl-sm bg-white border border-gray-200 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                      <span
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></span>
                      <span
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            {showEmailForm ? (
              <form
                onSubmit={handleEmailSubmit}
                className="p-3 border-t border-gray-200 bg-white space-y-2 animate-fadeIn"
              >
                <input
                  type="text"
                  placeholder="Your Name *"
                  value={emailFormData.name}
                  onChange={(e) =>
                    setEmailFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:border-transparent"
                  style={{ focusRing: `1px solid ${brandColor}` }}
                />
                <input
                  type="email"
                  placeholder="Your Email *"
                  value={emailFormData.email}
                  onChange={(e) =>
                    setEmailFormData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:border-transparent"
                  style={{ focusRing: `1px solid ${brandColor}` }}
                />
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={emailFormData.phone}
                  onChange={(e) =>
                    setEmailFormData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:border-transparent"
                  style={{ focusRing: `1px solid ${brandColor}` }}
                />
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmailForm(false);
                      setEmailFormData({ email: "", name: "", phone: "" });
                    }}
                    className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      isCreatingTicket ||
                      !emailFormData.email ||
                      !emailFormData.name
                    }
                    className="flex-1 px-3 py-1.5 text-xs font-semibold text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${brandColor}, ${brandColorDark})`,
                    }}
                  >
                    {isCreatingTicket ? "Sending..." : "Submit"}
                  </button>
                </div>
              </form>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-3 border-t border-gray-200 bg-white"
              >
                <div className="flex gap-2 items-end">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    aria-label="Type your message"
                    disabled={isSending}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    style={{
                      focusRing: `1px solid ${brandColor}`,
                    }}
                    maxLength={500}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isSending}
                    className="rounded-lg p-2 text-white font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
                    style={{
                      background: `linear-gradient(135deg, ${brandColor}, ${brandColorDark})`,
                    }}
                    aria-label="Send message"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            )}
          </div>

          <style>{`
            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            
            .animate-fadeIn {
              animation: fadeIn 0.3s ease-out;
            }
            
            /* Hide scrollbar for Chrome, Safari and Opera */
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            
            /* Hide scrollbar for IE, Edge and Firefox */
            .scrollbar-hide {
              -ms-overflow-style: none;  /* IE and Edge */
              scrollbar-width: none;  /* Firefox */
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default Bot;
