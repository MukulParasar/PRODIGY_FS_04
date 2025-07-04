import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import type { MessageWithUser, User } from "@shared/schema";
import { cn } from "@/lib/utils";
import { useSocket } from "@/hooks/use-socket";

interface MessageListProps {
  channelId: number;
}

export default function MessageList({ channelId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  const { data: messages = [] } = useQuery<MessageWithUser[]>({
    queryKey: ["/api/channels", channelId, "messages"],
    // Remove polling - we'll use WebSocket updates instead
  });

  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/users/me"],
  });

  const { joinChannel, leaveChannel } = useSocket({
    onNewMessage: (message: MessageWithUser) => {
      // Update the messages cache when a new message arrives
      queryClient.setQueryData<MessageWithUser[]>(["/api/channels", channelId, "messages"], (oldMessages = []) => {
        // Only add if it's not already in the list
        if (!oldMessages.some(m => m.id === message.id)) {
          return [...oldMessages, message];
        }
        return oldMessages;
      });
    },
    onUserTyping: ({ username, isTyping }) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (isTyping) {
          newSet.add(username);
        } else {
          newSet.delete(username);
        }
        return newSet;
      });
    },
    onUserStatusUpdate: (user: User) => {
      // Update user status in the users cache
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    }
  });

  // Join/leave channel when channelId changes
  useEffect(() => {
    joinChannel(channelId);
    return () => {
      leaveChannel(channelId);
    };
  }, [channelId, joinChannel, leaveChannel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (date: Date | string) => {
    const messageDate = new Date(date);
    const now = new Date();
    const isToday = messageDate.toDateString() === now.toDateString();
    
    if (isToday) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <div className="flex justify-center">
          <div className="bg-white rounded-lg p-4 shadow-sm border text-center max-w-md">
            <i className="fas fa-comments text-blue-600 text-2xl mb-2"></i>
            <h3 className="font-semibold text-gray-900 mb-1">Start the conversation!</h3>
            <p className="text-sm text-gray-600">Be the first to send a message in this channel.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {/* Welcome Message */}
      <div className="flex justify-center">
        <div className="bg-white rounded-lg p-4 shadow-sm border text-center max-w-md">
          <i className="fas fa-comments text-blue-600 text-2xl mb-2"></i>
          <h3 className="font-semibold text-gray-900 mb-1">Welcome to this channel!</h3>
          <p className="text-sm text-gray-600">This is the beginning of your conversation.</p>
        </div>
      </div>

      {/* Typing Indicator */}
      {typingUsers.size > 0 && (
        <div className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-500">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <span>
            {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
          </span>
        </div>
      )}

      {/* Messages */}
      {messages.map((message, index) => {
        const isCurrentUser = currentUser && message.userId === currentUser.id;
        const prevMessage = index > 0 ? messages[index - 1] : null;
        const showAvatar = !prevMessage || prevMessage.userId !== message.userId;
        
        return (
          <div 
            key={message.id}
            className={cn(
              "flex items-start space-x-3",
              isCurrentUser ? "flex-row-reverse space-x-reverse" : ""
            )}
          >
            {showAvatar ? (
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0",
                isCurrentUser ? "bg-green-500" : "bg-blue-600"
              )}>
                {isCurrentUser ? "ME" : (message.user?.avatar || "U")}
              </div>
            ) : (
              <div className="w-10 flex-shrink-0"></div>
            )}
            
            <div className="flex-1 min-w-0">
              {showAvatar && (
                <div className={cn(
                  "flex items-center space-x-2 mb-1",
                  isCurrentUser ? "flex-row-reverse space-x-reverse" : ""
                )}>
                  <span className="text-sm font-semibold text-gray-900">
                    {isCurrentUser ? "You" : (message.user?.username || "Unknown User")}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTime(message.createdAt)}
                  </span>
                </div>
              )}
              
              <div className={cn(
                "rounded-lg p-3 shadow-sm max-w-md",
                isCurrentUser 
                  ? "bg-blue-600 text-white ml-auto" 
                  : "bg-white border text-gray-800"
              )}>
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              </div>
              
              {!showAvatar && (
                <span className="text-xs text-gray-500 ml-3 mt-1 inline-block">
                  {formatTime(message.createdAt)}
                </span>
              )}
            </div>
          </div>
        );
      })}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
