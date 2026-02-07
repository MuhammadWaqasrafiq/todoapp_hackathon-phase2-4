"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/api";
import { Task } from "@/lib/types";
import AuthGuard from "@/components/auth-guard";
import CreateTaskModal from "@/components/create-task-modal";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: session } = authClient.useSession();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchTasks = async () => {
      setLoading(true);
      try {
        // For now, fetch all tasks for the user
        // In a real implementation, you might want to fetch tasks for a specific date range
        const tasksData = await fetchWithAuth(`/${session.user.id}/tasks`);
        setTasks(tasksData as Task[]);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [session, refreshKey]);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const changeMonth = (direction: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getTasksForDate = (dateString: string) => {
    return tasks.filter(task => {
      if (!task.date) return false;
      const taskDate = new Date(task.date).toISOString().split('T')[0];
      return taskDate === dateString;
    });
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const days = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 border border-gray-700/30"></div>);
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateString = formatDate(date);
    const dayTasks = getTasksForDate(dateString);
    
    days.push(
      <div key={day} className="h-24 border border-gray-700/30 p-1 flex flex-col">
        <div className="text-right text-sm font-medium pr-1">{day}</div>
        <div className="flex-1 overflow-y-auto text-xs">
          {dayTasks.slice(0, 2).map((task, idx) => (
            <div 
              key={`${task.id}-${idx}`} 
              className="truncate px-1 py-0.5 rounded mb-1 truncate"
              style={{ backgroundColor: 'rgba(255, 107, 107, 0.2)' }}
              title={task.title}
            >
              {task.title}
            </div>
          ))}
          {dayTasks.length > 2 && (
            <div className="text-gray-400 px-1">+{dayTasks.length - 2} more</div>
          )}
        </div>
      </div>
    );
  }

  const handleTaskCreated = () => {
    setRefreshKey(prev => prev + 1);
    setIsModalOpen(false);
  };

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Calendar View</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            <span>Create Task</span>
          </button>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-gray-700/30">
          {/* Calendar Header */}
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => changeMonth(-1)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="text-white" />
            </button>
            <h2 className="text-xl font-semibold text-white">
              {monthNames[month]} {year}
            </h2>
            <button 
              onClick={() => changeMonth(1)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="text-white" />
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-0 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0">
            {days}
          </div>
        </div>

        {/* Create Task Modal */}
        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onTaskCreated={handleTaskCreated}
        />
      </div>
    </AuthGuard>
  );
}