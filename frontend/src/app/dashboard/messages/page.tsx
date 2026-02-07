"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Search, MoreVertical } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/api";
import { Task } from "@/lib/types";
import AuthGuard from "@/components/auth-guard";

interface Conversation {
  id: number;
  title: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch tasks and use them as conversations for now
        // In a real implementation, you would fetch actual conversations
        const tasksData = await fetchWithAuth(`/${session.user.id}/tasks`);
        setTasks(tasksData as Task[]);
        
        // Convert tasks to conversation-like objects
        const convos: Conversation[] = (tasksData as Task[]).slice(0, 10).map((task, index) => ({
          id: task.id || index,
          title: task.title || `Task ${index + 1}`,
          lastMessage: task.description || "No description",
          timestamp: task.updated_at || new Date().toISOString(),
          unread: !task.is_completed
        }));
        
        setConversations(convos);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Messages View</h1>
          </div>
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary-gradient-from)]"></div>
            <p className="mt-4 text-gray-400">Loading messages...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Messages View</h1>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-gray-700/30">
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-[var(--background)] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[var(--primary-gradient-from)] transition-colors"
            />
          </div>

          {/* Conversations List */}
          <div className="space-y-4">
            {conversations.length > 0 ? (
              conversations.map(conversation => (
                <div 
                  key={conversation.id} 
                  className="flex items-center p-4 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-gray-700/30"
                >
                  <div className="relative flex-shrink-0 mr-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    {conversation.unread && (
                      <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[var(--card-bg)]"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-white truncate">{conversation.title}</h3>
                      <span className="text-xs text-gray-400">
                        {formatTime(conversation.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">{conversation.lastMessage}</p>
                  </div>
                  
                  <button className="ml-4 text-gray-400 hover:text-white">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-400">No conversations yet. Start a new chat!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}