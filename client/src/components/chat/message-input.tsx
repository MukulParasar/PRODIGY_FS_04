import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useSocket } from "@/hooks/use-socket";
import type { User } from "@shared/schema";

interface MessageInputProps {
  channelId: number;
  channelName: string;
  onEmojiClick: () => void;
}

export default function MessageInput({ channelId, channelName, onEmojiClick }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [showMetadata, setShowMetadata] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/users/me"],
  });

  const { sendMessage, startTyping, stopTyping } = useSocket({
    onError: (error: string) => {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    setShowMetadata(value.length > 0);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }

    // Handle typing indicators
    if (value.length > 0 && !isTyping && currentUser) {
      setIsTyping(true);
      startTyping(channelId, currentUser.username);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping && currentUser) {
        setIsTyping(false);
        stopTyping(channelId, currentUser.username);
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && currentUser) {
      // Send message via WebSocket
      sendMessage(trimmedMessage, channelId, currentUser.id);
      
      // Clear message and reset UI
      setMessage("");
      setShowMetadata(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      
      // Stop typing indicator
      if (isTyping) {
        setIsTyping(false);
        stopTyping(channelId, currentUser.username);
      }
    }
  };

  // Handle emoji insertion
  useEffect(() => {
    const handleEmojiSelect = (event: CustomEvent) => {
      const emoji = event.detail;
      setMessage(prev => prev + emoji);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    };

    window.addEventListener('emoji-selected', handleEmojiSelect as EventListener);
    return () => {
      window.removeEventListener('emoji-selected', handleEmojiSelect as EventListener);
    };
  }, []);

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end space-x-3">
          {/* File Upload Button */}
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <i className="fas fa-paperclip"></i>
          </button>
          
          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea 
              ref={textareaRef}
              rows={1} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none max-h-32 transition-all" 
              placeholder={`Type a message in #${channelName}...`}
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={false}
            />
            
            {/* Emoji Picker Button */}
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={onEmojiClick}
            >
              <i className="fas fa-smile"></i>
            </button>
          </div>
          
          {/* Send Button */}
          <button 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
        
        {/* Character Count */}
        {showMetadata && (
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span>Shift + Enter for new line</span>
            <span>{message.length}/2000</span>
          </div>
        )}
      </div>
    </div>
  );
}
