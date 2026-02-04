import { Category, Task } from "@/lib/types";

interface CategoryGridProps {
    categories?: Category[];
    tasks?: Task[];
}

export default function CategoryGrid({ categories = [], tasks = [] }: CategoryGridProps) {
    if (categories.length === 0) {
        return (
            <div className="py-2">
                <h2 className="text-lg font-bold text-white mb-4">Categories</h2>
                <div className="text-gray-500 text-sm">Loading categories...</div>
            </div>
        )
    }

    return (
        <div className="py-2">
            <h2 className="text-lg font-bold text-white mb-4">Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {categories.map((cat, idx) => {
                    const taskCount = tasks.filter(t => t.category_id === cat.id).length;

                    return (
                        <div key={cat.id} className="bg-[var(--card-bg)] p-4 rounded-3xl flex flex-col gap-3 hover:translate-y-[-2px] transition-transform cursor-pointer">
                            <div className="flex justify-between items-start">
                                <div className="text-white font-semibold">
                                    {cat.name}
                                    <p className="text-xs text-[var(--text-secondary)] font-normal mt-1">{taskCount} Task{taskCount !== 1 ? 's' : ''}</p>
                                </div>
                            </div>

                            {/* Visual block representing illustration */}
                            <div className="h-16 w-full rounded-2xl bg-white/5 mt-2 overflow-hidden relative">
                                {idx % 2 === 0 ? (
                                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[var(--accent-blue)]/20 to-transparent flex items-end justify-center">
                                        <div className="w-8 h-12 bg-[var(--accent-blue)]/40 rounded-t-lg mx-auto"></div>
                                    </div>
                                ) : (
                                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[var(--accent-green)]/20 to-transparent flex items-end justify-center">
                                        <div className="w-12 h-8 bg-[var(--accent-green)]/40 rounded-t-lg mx-auto"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
