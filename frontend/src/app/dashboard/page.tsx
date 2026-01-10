// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { getTasks, createTask } from '@/lib/api';

// Task type
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await getTasks();
        setTasks(fetchedTasks);
      } catch (err) {
        setError('Failed to fetch tasks');
        console.error(err);
      }
    };

    fetchTasks();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const newTask = await createTask(title, description);
      setTasks([...tasks, newTask]);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Task Dashboard</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleCreateTask} className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Create Task
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 rounded shadow-md ${
              task.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
            }`}
          >
            <h2 className="text-xl font-bold">{task.title}</h2>
            <p className="text-gray-700">{task.description}</p>
            <p className="mt-2">
              <strong>Status:</strong> {task.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
