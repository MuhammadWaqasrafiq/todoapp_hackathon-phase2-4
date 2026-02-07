"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/api";
import { Task, Category } from "@/lib/types";
import AuthGuard from "@/components/auth-guard";
import CreateTaskModal from "@/components/create-task-modal";

export default function ProjectsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch tasks and categories
        const [tasksData, categoriesData] = await Promise.all([
          fetchWithAuth(`/${session.user.id}/tasks`),
          fetchWithAuth("/categories")
        ]);
        
        setTasks(tasksData as Task[]);
        setCategories(categoriesData as Category[]);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, refreshKey]);

  const groupTasksByCategory = () => {
    const grouped: Record<string, Task[]> = {};
    
    // Initialize with all categories
    categories.forEach(category => {
      grouped[category.id] = [];
    });
    
    // Add uncategorized tasks
    grouped["uncategorized"] = [];
    
    // Group tasks by category
    tasks.forEach(task => {
      if (task.category_id) {
        if (grouped[task.category_id]) {
          grouped[task.category_id].push(task);
        }
      } else {
        grouped["uncategorized"].push(task);
      }
    });
    
    return grouped;
  };

  const groupedTasks = groupTasksByCategory();

  const getCategoryName = (categoryId: number | undefined) => {
    if (!categoryId) return "Uncategorized";
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  const getCategoryColor = (categoryId: number | undefined) => {
    if (!categoryId) return "#F7FFF7"; // Default color for uncategorized
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : "#F7FFF7";
  };

  const handleTaskCreated = () => {
    setRefreshKey(prev => prev + 1);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Projects View</h1>
          </div>
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary-gradient-from)]"></div>
            <p className="mt-4 text-gray-400">Loading projects...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Projects View</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            <span>Create Task</span>
          </button>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedTasks).map(([categoryId, categoryTasks]) => {
            if (categoryTasks.length === 0) return null;
            
            const categoryName = categoryId === "uncategorized" 
              ? "Uncategorized" 
              : getCategoryName(Number(categoryId));
              
            const categoryColor = categoryId === "uncategorized" 
              ? "#F7FFF7" 
              : getCategoryColor(Number(categoryId));

            return (
              <div 
                key={categoryId} 
                className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-gray-700/30"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: categoryColor }}
                  ></div>
                  <h2 className="text-xl font-semibold text-white">
                    {categoryName} ({categoryTasks.length})
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryTasks.map(task => (
                    <div 
                      key={task.id} 
                      className="bg-[var(--card-bg)] rounded-lg p-4 border border-gray-700/30"
                    >
                      <h3 className="font-medium text-white mb-2">{task.title}</h3>
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                        {task.description || "No description"}
                      </p>
                      <div className="flex justify-between items-center text-xs">
                        <span className={`px-2 py-1 rounded-full ${
                          task.is_completed 
                            ? "bg-green-500/20 text-green-400" 
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {task.is_completed ? "Completed" : "Pending"}
                        </span>
                        {task.date && (
                          <span className="text-gray-400">
                            {new Date(task.date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          
          {Object.keys(groupedTasks).every(key => groupedTasks[key].length === 0) && (
            <div className="text-center py-12">
              <p className="text-gray-400">No projects found. Create your first task to get started!</p>
            </div>
          )}
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