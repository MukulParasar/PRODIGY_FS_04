import { useState } from "react";
import Sidebar from "@/components/chat/sidebar";
import ChatArea from "@/components/chat/chat-area";
import { useQuery } from "@tanstack/react-query";
import type { Channel } from "@shared/schema";

export default function Chat() {
  const [currentChannelId, setCurrentChannelId] = useState<number>(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: channels = [] } = useQuery<Channel[]>({
    queryKey: ["/api/channels"],
  });

  const currentChannel = channels.find(c => c.id === currentChannelId);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar 
        currentChannelId={currentChannelId}
        onChannelSelect={setCurrentChannelId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <ChatArea 
        currentChannel={currentChannel}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
    </div>
  );
}
