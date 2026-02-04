"use client"
import { useState } from "react"
import { fetchWithAuth } from "@/lib/api"
import { authClient } from "@/lib/auth-client"

export default function TaskForm({ onTaskCreated }: { onTaskCreated: () => void }) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const { data: session } = authClient.useSession()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!session?.user?.id) return

        await fetchWithAuth(`/${session.user.id}/tasks`, {
            method: "POST",
            body: JSON.stringify({ title, description })
        })
        setTitle("")
        setDescription("")
        onTaskCreated()
    }

    return (
        <form onSubmit={handleSubmit} className="border p-4 rounded bg-gray-50 space-y-2">
            <h2 className="font-bold">New Task</h2>
            <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="Task Title" 
                className="w-full border p-2 rounded"
                required
            />
            <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Description (optional)" 
                className="w-full border p-2 rounded"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Task</button>
        </form>
    )
}
