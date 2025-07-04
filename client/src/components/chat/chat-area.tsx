import { useState } from "react";
import MessageList from "./message-list";
import MessageInput from "./message-input";
import EmojiPicker from "./emoji-picker";
import type { Channel } from "@shared/schema";

interface ChatAreaProps {
  currentChannel?: Channel;
  onMenuClick: () => void;
}

export default function ChatArea({ currentChannel, onMenuClick }: ChatAreaProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  if (!currentChannel) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Select a channel</h2>
          <p className="text-gray-500">Choose a channel from the sidebar to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            className="lg:hidden text-gray-600 hover:text-gray-900"
            onClick={onMenuClick}
          >
            <i className="fas fa-bars"></i>
          </button>
          <i className="fas fa-hashtag text-gray-400"></i>
          <h2 className="text-lg font-semibold text-gray-900">{currentChannel.name}</h2>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <i className="fas fa-users text-xs"></i>
            <span>12 members</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="text-gray-600 hover:text-gray-900 p-2 rounded hover:bg-gray-100">
            <i className="fas fa-search"></i>
          </button>
          <button className="text-gray-600 hover:text-gray-900 p-2 rounded hover:bg-gray-100">
            <i className="fas fa-bell"></i>
          </button>
          <button className="text-gray-600 hover:text-gray-900 p-2 rounded hover:bg-gray-100">
            <i className="fas fa-info-circle"></i>
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <MessageList channelId={currentChannel.id} />

      {/* Message Input Area */}
      <MessageInput 
        channelId={currentChannel.id}
        channelName={currentChannel.name}
        onEmojiClick={() => setShowEmojiPicker(!showEmojiPicker)}
      />

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <EmojiPicker 
          onEmojiSelect={(emoji) => {
            // This will be handled by the message input component
            setShowEmojiPicker(false);
          }}
          onClose={() => setShowEmojiPicker(false)}
        />
      )}
    </div>
  );
}
