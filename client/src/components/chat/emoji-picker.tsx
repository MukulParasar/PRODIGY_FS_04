interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

const emojis = [
  "😀", "😂", "😍", "🤔", "👍", "👎", "❤️", "🎉", 
  "🚀", "🔥", "⭐", "💯", "👋", "🙌", "💪", "🎯",
  "📱", "💻", "🎵", "🍕", "☕", "🌟", "⚡", "🌈",
  "🎨", "📚", "🏆", "🎪", "🎭", "🎬", "📸", "🎮"
];

export default function EmojiPicker({ onEmojiSelect, onClose }: EmojiPickerProps) {
  const handleEmojiClick = (emoji: string) => {
    // Dispatch custom event for the message input to listen to
    window.dispatchEvent(new CustomEvent('emoji-selected', { detail: emoji }));
    onEmojiSelect(emoji);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Choose an emoji</h3>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto">
          {emojis.map((emoji, index) => (
            <button 
              key={index}
              className="text-2xl p-2 hover:bg-gray-100 rounded transition-colors"
              onClick={() => handleEmojiClick(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
