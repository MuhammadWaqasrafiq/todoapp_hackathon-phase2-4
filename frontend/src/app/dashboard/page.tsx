"use client"
import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard-header";
import CategoryGrid from "@/components/category-grid";
import OngoingTaskCard from "@/components/ongoing-task-card";
import TaskList from "@/components/task-list";
import Sidebar from "@/components/sidebar";
import { Plus, MessageCircle, X } from "lucide-react";
import CreateTaskModal from "@/components/create-task-modal";
import { ChatInterface } from "@/components/chat-interface";
import { fetchWithAuth } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { Category, Task } from "@/lib/types";
import AuthGuard from "@/components/auth-guard";

export default function DashboardPage() {
    const [refreshKey, setRefreshKey] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const { data: session } = authClient.useSession();

    const refreshDashboard = () => {
        setRefreshKey(prev => prev + 1);
    };

    const handleTaskCreated = () => {
        refreshDashboard();
        setIsModalOpen(false);
        setTaskToEdit(null);
    };

    const handleEditTask = (task: Task) => {
        setTaskToEdit(task);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setTaskToEdit(null);
        setIsModalOpen(true);
    };

    useEffect(() => {
        if (!session?.user?.id) return;

        // Fetch Tasks AND Categories
        const loadData = async () => {
            try {
                const [tasksData, catsData] = await Promise.all([
                    fetchWithAuth(`/${session.user.id}/tasks`),
                    fetchWithAuth(`/categories`)
                ]);
                setTasks(tasksData as Task[] || []);
                setCategories(catsData as Category[] || []);
            } catch (err) {
                console.error("Failed to load dashboard data", err);
            }
        };

        loadData();
    }, [session, refreshKey]);

    // Determine the "Ongoing" task (e.g., the most recent incomplete task)
    const ongoingTask = tasks.find(t => !t.is_completed) || null;

    return (
        <AuthGuard>
            <div className="min-h-screen bg-[var(--background)] text-white font-sans selection:bg-[var(--accent-blue)] selection:text-white flex">

                {/* Desktop Sidebar */}
                <Sidebar />

                {/* Main Content Area */}
                <main className="flex-1 min-h-screen relative flex flex-col px-6 md:px-10 md:ml-64 w-full">

                    {/* Header Section */}
                    <div className="max-w-5xl w-full mx-auto">
                        <DashboardHeader
                            userName={session?.user?.name}
                            taskCount={tasks.filter(t => !t.is_completed).length}
                        />
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 flex flex-col gap-6 pb-24 max-w-5xl w-full mx-auto">

                        {/* Top Row: Categories (expands on desktop) */}
                        <CategoryGrid categories={categories} tasks={tasks} />

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column: Ongoing Task & Stats */}
                            <div className="col-span-1 lg:col-span-1 space-y-6">
                                <OngoingTaskCard task={ongoingTask} />

                                {/* Placeholder for small stats or calendar could go here to fill space */}
                            </div>

                            {/* Right Column: Task List (Takes more space on desktop) */}
                            <div className="col-span-1 lg:col-span-2">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-bold">Todays Task</h2>
                                    <button className="text-[var(--primary-gradient-from)] text-sm">See all</button>
                                </div>
                                {/* Wrapped in a constrained height container for desktop scroll if needed, 
                        currently just letting it flow */}
                                <TaskList
                                    tasks={tasks}
                                    onTaskUpdate={refreshDashboard}
                                    onEditTask={handleEditTask}
                                />
                            </div>
                        </div>

                    </div>

                    {/* Floating Action Button */}
                    <button
                        onClick={openCreateModal}
                        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] rounded-full flex items-center justify-center shadow-lg shadow-orange-500/40 hover:scale-105 transition-transform z-50 md:right-12"
                    >
                        <Plus size={32} className="text-white" />
                    </button>

                    {/* Create Task Modal */}
                    <CreateTaskModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onTaskCreated={handleTaskCreated}
                        taskToEdit={taskToEdit}
                    />

                    {/* Chatbot Floating Action Button */}
                    <div className="fixed bottom-8 left-8 z-50 md:left-[280px]">
                        {/* Adjusted md:left to account for sidebar width so it doesn't overlap content too much */}
                        {!isChatOpen && (
                            <button
                                onClick={() => setIsChatOpen(true)}
                                className="group relative w-14 h-14 bg-gradient-to-br from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] rounded-full flex items-center justify-center shadow-lg shadow-orange-500/25 hover:scale-110 hover:shadow-orange-500/40 transition-all duration-300"
                            >
                                <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
                                <MessageCircle size={26} className="text-white" />

                                {/* Notification Dot (optional, static for now) */}
                                <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-400 border-2 border-[var(--background)] rounded-full"></span>
                            </button>
                        )}

                        {isChatOpen && (
                            <div className="flex flex-col items-start translate-y-0 transition-transform duration-300 animate-slide-up origin-bottom-left">
                                <div className="relative w-[380px] rounded-[2rem] shadow-2xl">
                                    {/* Close Button styling */}
                                    <button
                                        onClick={() => setIsChatOpen(false)}
                                        className="absolute -top-12 left-0 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 transition-colors shadow-lg z-50"
                                    >
                                        <X size={20} />
                                    </button>
                                    <ChatInterface />
                                </div>
                            </div>
                        )}
                    </div>

                </main>
            </div>
        </AuthGuard>
    );
}