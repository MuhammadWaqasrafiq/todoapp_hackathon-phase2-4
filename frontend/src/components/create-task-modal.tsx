import { useState, useEffect } from "react"
import { X, Calendar, Clock, Globe, Tag } from "lucide-react"
import { fetchWithAuth } from "@/lib/api"
import { authClient } from "@/lib/auth-client"
import { Category, Task } from "@/lib/types"

interface CreateTaskModalProps {
    isOpen: boolean
    onClose: () => void
    onTaskCreated: () => void
    taskToEdit?: Task | null
}

export default function CreateTaskModal({ isOpen, onClose, onTaskCreated, taskToEdit }: CreateTaskModalProps) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(false)
    const { data: session } = authClient.useSession()

    useEffect(() => {
        if (isOpen) {
            // Fetch categories when modal opens
            fetchWithAuth("/categories")
                .then((data: unknown) => setCategories(data as Category[]))
                .catch(err => console.error("Failed to fetch categories", err))
        }
    }, [isOpen])

    useEffect(() => {
        if (taskToEdit) {
            setTitle(taskToEdit.title)
            setDescription(taskToEdit.description || "")
            setSelectedCategoryId(taskToEdit.category_id)
        } else {
            setTitle("")
            setDescription("")
            setSelectedCategoryId(undefined)
        }
    }, [taskToEdit])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!session?.user?.id) return

        setIsLoading(true)
        try {
            if (taskToEdit) {
                await fetchWithAuth(`/${session.user.id}/tasks/${taskToEdit.id}`, {
                    method: "PUT",
                    body: JSON.stringify({
                        title,
                        description,
                        category_id: selectedCategoryId
                    })
                })
            } else {
                await fetchWithAuth(`/${session.user.id}/tasks`, {
                    method: "POST",
                    body: JSON.stringify({
                        title,
                        description,
                        category_id: selectedCategoryId
                    })
                })
            }
            setTitle("")
            setDescription("")
            setSelectedCategoryId(undefined)
            onTaskCreated() // This will refresh the dashboard
            onClose()
        } catch (error) {
            console.error("Failed to save task", error)
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[var(--card-bg)] w-full max-w-md rounded-3xl p-6 relative animate-in fade-in zoom-in duration-200 h-[85vh] overflow-y-auto no-scrollbar">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-[var(--card-bg)] z-10 py-2">
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="text-white w-6 h-6" />
                    </button>
                    <h2 className="text-xl font-semibold text-white">{taskToEdit ? "Edit Task" : "Create New Task"}</h2>
                    <div className="w-10" /> {/* Spacer for centering */}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Task Title */}
                    <div className="space-y-2">
                        <label className="text-sm text-[var(--text-secondary)]">Task title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Finance App Design"
                            className="w-full bg-[var(--background)] border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:border-[var(--primary-gradient-from)] transition-colors"
                            required
                        />
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-2">
                        <label className="text-sm text-[var(--text-secondary)]">Category</label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setSelectedCategoryId(cat.id)}
                                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${selectedCategoryId === cat.id
                                        ? "bg-[var(--primary-gradient-from)] text-white shadow-lg"
                                        : "bg-[var(--background)] text-[var(--text-secondary)] border border-gray-700 hover:border-white/50"
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                            {categories.length === 0 && <span className="text-xs text-gray-500">Loading categories...</span>}
                        </div>
                    </div>

                    {/* CO Worker (Visual Placeholder) */}
                    <div className="space-y-2">
                        <label className="text-sm text-[var(--text-secondary)]">CO Worker</label>
                        <div className="flex -space-x-3 items-center">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--card-bg)] bg-gray-600 flex items-center justify-center text-xs overflow-hidden">
                                    <img src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="avatar" className="w-full h-full object-cover" />
                                </div>
                            ))}
                            <button type="button" className="w-10 h-10 rounded-full bg-[var(--primary-gradient-from)] flex items-center justify-center text-white border-2 border-[var(--card-bg)]">
                                +
                            </button>
                        </div>
                    </div>

                    {/* Date & Time Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Date */}
                        <div className="space-y-2">
                            <label className="text-sm text-[var(--text-secondary)]">Date</label>
                            <div className="bg-[var(--background)] p-3 rounded-xl flex items-center gap-3 text-white border border-gray-700">
                                <Calendar className="w-5 h-5 text-[var(--primary-gradient-from)]" />
                                <span className="text-sm">24 Dec</span>
                            </div>
                        </div>
                        {/* Task Zone */}
                        <div className="space-y-2">
                            <label className="text-sm text-[var(--text-secondary)]">Task Zone</label>
                            <div className="bg-[var(--background)] p-3 rounded-xl flex items-center gap-3 text-white border border-gray-700">
                                <Globe className="w-5 h-5 text-[#6F6FC8]" />
                                <span className="text-sm">GMT+6</span>
                            </div>
                        </div>
                        {/* Task Start */}
                        <div className="space-y-2">
                            <label className="text-sm text-[var(--text-secondary)]">Task Start</label>
                            <div className="bg-[var(--background)] p-3 rounded-xl flex items-center gap-3 text-white border border-gray-700">
                                <Clock className="w-5 h-5 text-[var(--text-secondary)]" />
                                <span className="text-sm">12:45 PM</span>
                            </div>
                        </div>
                        {/* Task End */}
                        <div className="space-y-2">
                            <label className="text-sm text-[var(--text-secondary)]">Task End</label>
                            <div className="bg-[var(--background)] p-3 rounded-xl flex items-center gap-3 text-white border border-gray-700">
                                <Clock className="w-5 h-5 text-[var(--text-secondary)]" />
                                <span className="text-sm">07:45 PM</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm text-[var(--text-secondary)]">Descriptions</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Join us in solving the challenges..."
                            className="w-full bg-[var(--background)] border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:border-[var(--primary-gradient-from)] transition-colors h-24 resize-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 rounded-2xl font-bold text-white text-lg shadow-lg hover:opacity-90 transition-opacity mt-4"
                        style={{ background: 'linear-gradient(to right, var(--primary-gradient-from), var(--primary-gradient-to))', boxShadow: '0 10px 20px -5px rgba(255, 107, 107, 0.4)' }}
                    >
                        {isLoading ? "Saving..." : (taskToEdit ? "Update Task" : "Create Task")}
                    </button>
                </form>
            </div>
        </div>
    )
}
