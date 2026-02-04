'use client';

import { authClient } from '@/lib/auth-client';
import { useState, useEffect } from 'react';

interface Task {
    id: number;
    title: string;
    description: string | null;
    completed: boolean;
    created_at: string;
    updated_at: string;
}

export function TaskView() {
    const { data: session } = authClient.useSession();
    const userId = session?.user?.id;
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setIsLoading(false);
            return;
        }

        const fetchTasks = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // TODO: Need to pass Authorization header with JWT token
                // For now, assuming auth is handled by cookies or proxy if same origin.
                // Or if better-auth token is accessible.
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const res = await fetch(`${baseUrl}/api/${userId}/tasks`);
                if (!res.ok) {
                    throw new Error(`Failed to fetch tasks: ${res.statusText}`);
                }
                const data: Task[] = await res.json();
                setTasks(data);
            } catch (err: any) {
                setError(err.message);
                console.error("Error fetching tasks:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();
        // Polling or WebSocket for real-time updates would be here for "real-time state"
        // For now, it's a simple fetch on load.
    }, [userId]);

    if (isLoading) {
        return <div className="p-4 text-center">Loading tasks...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">Error: {error}</div>;
    }

    if (!userId) {
        return <div className="p-4 text-center">Please log in to view tasks.</div>;
    }

    return (
        <div className="p-4 border rounded-lg bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
            {tasks.length === 0 ? (
                <p>No tasks found. Add some using the chat!</p>
            ) : (
                <ul className="space-y-2">
                    {tasks.map((task) => (
                        <li key={task.id} className={`flex items-center justify-between p-3 rounded-md ${
                            task.completed ? 'bg-green-50' : 'bg-blue-50'
                        }`}>
                            <div>
                                <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                    {task.title}
                                </h3>
                                {task.description && (
                                    <p className="text-sm text-gray-600">{task.description}</p>
                                )}
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                                task.completed ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'
                            }`}>
                                {task.completed ? 'Completed' : 'Pending'}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
