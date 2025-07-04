import { useQuery } from "@tanstack/react-query";
import type { User, ChannelWithMessageCount } from "@shared/schema";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentChannelId: number;
  onChannelSelect: (channelId: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ 
  currentChannelId, 
  onChannelSelect, 
  isOpen, 
  onClose 
}: SidebarProps) {
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: channels = [] } = useQuery<ChannelWithMessageCount[]>({
    queryKey: ["/api/channels"],
  });

  const onlineUsers = users.filter(user => user.status === "online");
  const awayUsers = users.filter(user => user.status === "away");

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "w-80 bg-gray-900 text-white flex flex-col fixed lg:relative z-50 h-full transform transition-transform duration-200 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        "lg:flex"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-semibold text-white">ChatFlow</h1>
          <p className="text-sm text-gray-400">Real-time messaging</p>
        </div>
        
        {/* Online Users */}
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Online Users</h3>
          <div className="space-y-2">
            {onlineUsers.map((user) => (
              <div 
                key={user.id}
                className="flex items-center space-x-3 py-2 px-2 rounded hover:bg-gray-800 cursor-pointer"
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {user.avatar}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                </div>
                <div>
                  <p className="text-sm font-medium">{user.username}</p>
                  <p className="text-xs text-gray-400">Online</p>
                </div>
              </div>
            ))}
            
            {awayUsers.map((user) => (
              <div 
                key={user.id}
                className="flex items-center space-x-3 py-2 px-2 rounded hover:bg-gray-800 cursor-pointer"
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm font-medium">
                    {user.avatar}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-500 rounded-full border-2 border-gray-900"></div>
                </div>
                <div>
                  <p className="text-sm font-medium">{user.username}</p>
                  <p className="text-xs text-gray-400">Away</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat Channels */}
        <div className="p-4 flex-1">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Channels</h3>
          <div className="space-y-1">
            {channels.map((channel) => (
              <div 
                key={channel.id}
                onClick={() => {
                  onChannelSelect(channel.id);
                  onClose();
                }}
                className={cn(
                  "flex items-center space-x-3 py-2 px-2 rounded hover:bg-gray-800 cursor-pointer",
                  currentChannelId === channel.id && "bg-gray-800"
                )}
              >
                <i className="fas fa-hashtag text-gray-400 text-sm"></i>
                <span className="text-sm">{channel.name}</span>
                {channel.unreadCount && (
                  <span className="ml-auto text-xs bg-blue-600 rounded-full px-2 py-1 text-white">
                    {channel.unreadCount}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
