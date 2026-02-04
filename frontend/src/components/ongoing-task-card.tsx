import { Clock } from "lucide-react";
import { Task } from "@/lib/types";

interface OngoingTaskCardProps {
    task?: Task | null;
}

export default function OngoingTaskCard({ task }: OngoingTaskCardProps) {
    if (!task) {
        return (
            <div className="py-2">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-white">Ongoing Task</h2>
                </div>
                <div className="bg-[#2A2D3E] p-5 rounded-3xl border border-dashed border-white/10 flex items-center justify-center min-h-[160px]">
                    <p className="text-[var(--text-secondary)] text-sm">No ongoing tasks</p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-2">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-white">Ongoing Task</h2>
                <button className="text-[var(--primary-gradient-from)] text-sm">See all</button>
            </div>

            <div className="bg-[#2A2D3E] p-5 rounded-3xl flex flex-col gap-4 hover:translate-y-[-2px] transition-transform duration-200 shadow-lg shadow-black/20">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-white text-lg truncate pr-4">{task.title}</h3>
                    <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-white whitespace-nowrap">Due Today</span>
                </div>

                <div className="flex items-center gap-2 text-[var(--text-secondary)] text-xs">
                    <span>Team members</span>
                    <div className="flex -space-x-2 ml-2">
                        <img src="https://i.pravatar.cc/150?img=33" className="w-6 h-6 rounded-full border border-[#2A2D3E]" alt="Member" />
                        <img src="https://i.pravatar.cc/150?img=47" className="w-6 h-6 rounded-full border border-[#2A2D3E]" alt="Member" />
                        <img src="https://i.pravatar.cc/150?img=12" className="w-6 h-6 rounded-full border border-[#2A2D3E]" alt="Member" />
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-1">
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--accent-green)] w-[46%] rounded-full"></div>
                    </div>
                    <span className="text-[var(--accent-green)] text-xs font-bold">46%</span>
                </div>

                <div className="flex items-center gap-2 text-[var(--text-secondary)] text-xs mt-1">
                    <Clock size={14} />
                    <span>2:30 PM - 6:00 PM</span>
                </div>
            </div>
        </div>
    );
}
