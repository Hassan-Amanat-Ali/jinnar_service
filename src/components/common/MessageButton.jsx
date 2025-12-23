import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";

const MessageButton = ({
  participantId,
  participantRole,
  participantName = "User",
  className = "",
  size = "default",
}) => {
  const navigate = useNavigate();

  const handleStartChat = () => {
    if (!participantId) return;
    const chatRoute =
      participantRole === "worker" ? "/worker-chat" : "/customer-chat";
    try {
      navigate(`${chatRoute}?conversation=${participantId}`);
    } catch (error) {
      console.error("Failed to navigate to chat:", error);
    }
  };

  const sizeClasses = {
    small: "px-3 py-2 text-xs",
    default: "px-4 py-3 text-sm",
    large: "px-6 py-4 text-base",
  };
  const iconSizes = { small: 14, default: 18, large: 20 };

  return (
    <button
      onClick={handleStartChat}
      disabled={!participantId}
      className={`
        flex items-center justify-center gap-2 
        bg-linear-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium 
        rounded-xl cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed 
        transition-colors
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <MessageSquare
        size={iconSizes[size]}
        className="inline-block lg:hidden xl:inline-block"
      />
      {`Message ${participantName}`}
    </button>
  );
};

export default MessageButton;
