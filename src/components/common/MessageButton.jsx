import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

const MessageButton = ({ 
  participantId, 
  participantRole, 
  participantName = "User",
  className = "",
  size = "default" // "small", "default", "large"
}) => {
  const navigate = useNavigate();

  const handleStartChat = async () => {
    try {
      console.log('🚀 Starting chat with:', { participantId, participantRole, participantName });
      
      // Just navigate to chat page with the participant ID
      // The chat page will handle fetching/creating the conversation
      navigate(`/chat?user=${participantId}`);
      
    } catch (error) {
      console.error('❌ Failed to navigate to chat:', error);
    }
  };

  const sizeClasses = {
    small: "px-3 py-2 text-xs",
    default: "px-4 py-3 text-sm", 
    large: "px-6 py-4 text-base"
  };

  const iconSizes = {
    small: 14,
    default: 18,
    large: 20
  };

  return (
    <button
      onClick={handleStartChat}
      disabled={!participantId}
      className={`
        flex items-center justify-center gap-2 
        bg-blue-600 text-white font-medium 
        rounded-xl hover:bg-blue-700 
        disabled:opacity-50 disabled:cursor-not-allowed 
        transition-colors
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <MessageSquare size={iconSizes[size]} />
      {`Message ${participantName}`}
    </button>
  );
};

export default MessageButton;
