import { Search, SlidersHorizontal } from "lucide-react";
import Image from "next/image";

interface DashboardHeaderProps {
    userName?: string;
    taskCount?: number;
}

export default function DashboardHeader({ userName = "User", taskCount = 0 }: DashboardHeaderProps) {
    return (
        <div className="flex flex-col gap-6 pt-8 pb-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Hi {userName}</h1>
                    <p className="text-[var(--primary-gradient-to)] text-sm font-medium">{taskCount} task{taskCount !== 1 ? 's' : ''} pending</p>
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--card-bg)]">
                    <img src="https://i.pravatar.cc/150?img=12" alt="Profile" className="w-full h-full object-cover" />
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={20} />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full bg-[var(--input-bg)] text-white pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-1 focus:ring-[var(--accent-blue)] transition-all placeholder:text-[var(--text-secondary)]"
                    />
                </div>
                <button className="bg-[var(--primary-gradient-from)] hover:brightness-110 transition-all text-white p-4 rounded-2xl shadow-lg shadow-orange-500/20">
                    <SlidersHorizontal size={24} />
                </button>
            </div>
        </div>
    );
}
