"use client"
import { fetchWithAuth } from "@/lib/api"
import { authClient } from "@/lib/auth-client"
import { MoreVertical, Clock, CheckCircle2, Circle, Pencil, Trash2 } from "lucide-react"
import { Task } from "@/lib/types"

interface TaskListProps {
    tasks: Task[];
    onTaskUpdate: () => void;
    onEditTask: (task: Task) => void;
}

export default function TaskList({ tasks, onTaskUpdate, onEditTask }: TaskListProps) {
    const { data: session } = authClient.useSession()

    const handleDelete = async (id: number) => {
        if (!session?.user?.id) return
        if (!confirm("Are you sure you want to delete this task?")) return
        await fetchWithAuth(`/${session.user.id}/tasks/${id}`, { method: "DELETE" })
        onTaskUpdate()
    }

    const handleToggle = async (id: number) => {
        if (!session?.user?.id) return
        await fetchWithAuth(`/${session.user.id}/tasks/${id}/complete`, { method: "PATCH" })
        onTaskUpdate()
    }

    // Colors for "random" assignment to cards to match design variety
    const accentColors = ['#6F6FC8', '#FF7262', '#90E089', '#FFCE75'];

    return (
        <div className="space-y-4 pb-20">
            {tasks?.map((task, index) => {
                const accentColor = accentColors[index % accentColors.length];
                return (
                    <div key={task.id} className="bg-[var(--card-bg)] p-5 rounded-3xl flex flex-col gap-4 relative group hover:translate-y-[-2px] transition-transform duration-200 shadow-md border border-white/5">

                        <div className="flex justify-between items-start">
                            <h3 className={`font-semibold text-lg ${task.is_completed ? 'line-through text-gray-500' : 'text-white'}`}>
                                {task.title}
                            </h3>
                            <div className="flex gap-2">
                                <button onClick={() => handleToggle(task.id)} className="text-white/50 hover:text-[var(--primary-gradient-from)] transition-colors" title={task.is_completed ? "Mark incomplete" : "Mark complete"}>
                                    {task.is_completed ? <CheckCircle2 className="text-[var(--accent-green)]" /> : <Circle />}
                                </button>
                                <button onClick={() => onEditTask(task)} className="text-white/40 hover:text-blue-400 transition-colors p-1" title="Edit">
                                    <Pencil size={18} />
                                </button>
                                <button onClick={() => handleDelete(task.id)} className="text-white/40 hover:text-red-500 transition-colors p-1" title="Delete">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        {task.description && (
                            <p className="text-[var(--text-secondary)] text-sm line-clamp-2">
                                {task.description}
                            </p>
                        )}

                        <div className="flex justify-between items-end mt-2">
                            {/* Team Avatars */}
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[var(--card-bg)] bg-gray-600 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/150?img=${(index + i) * 5}`} alt="member" />
                                    </div>
                                ))}
                            </div>

                            {/* Time / Progress */}
                            <div className="flex items-center gap-2 text-[var(--text-secondary)] text-xs bg-[var(--background)] px-3 py-1.5 rounded-full">
                                <Clock size={12} />
                                <span>2:30 PM - 6:00 PM</span>
                            </div>

                            {/* Progress Percentage Badge (Mock) */}
                            <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-[10px] font-bold"
                                style={{ borderColor: accentColor, color: accentColor }}>
                                {task.is_completed ? '100%' : '46%'}
                            </div>
                        </div>

                        {/* Decorative side bar like in design */}
                        <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full" style={{ background: accentColor }}></div>
                    </div>
                );
            })}

            {tasks?.length === 0 && (
                <div className="text-center py-10 text-[var(--text-secondary)]">
                    <p>No tasks found. Create one to get started!</p>
                </div>
            )}
        </div>
    )
}
