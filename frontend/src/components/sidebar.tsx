"use client";
import { LayoutGrid, Folder, Settings, LogOut, Calendar, MessageSquare, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const navItems = [
        { icon: LayoutGrid, label: "Overview", href: "/dashboard" },
        { icon: Calendar, label: "Calendar", href: "/dashboard/calendar" }, // Placeholder
        { icon: Folder, label: "Projects", href: "/dashboard/projects" },   // Placeholder
        { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" }, // Placeholder
        { icon: User, label: "Profile", href: "/profile" },
    ];

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/sign-in");
                },
            },
        });
    };

    return (
        <aside className="hidden md:flex w-64 flex-col h-screen fixed left-0 top-0 bg-[var(--card-bg)] border-r border-white/5 p-6 z-50">
            <Link href="/dashboard" className="flex items-center gap-2 mb-10 px-2 group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] flex items-center justify-center font-bold text-white text-lg shadow-md group-hover:scale-105 transition-transform">
                    T
                </div>
                <span className="text-xl font-bold text-white tracking-tight">Taskoo</span>
            </Link>

            <nav className="flex-1 flex flex-col gap-2">
                {navItems.map((item, idx) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={idx}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${isActive
                                    ? "bg-[var(--primary-gradient-from)] text-white shadow-lg shadow-orange-500/20"
                                    : "text-[var(--text-secondary)] hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <item.icon size={20} />
                            <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <button 
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-3 text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-colors mt-auto w-full text-left"
            >
                <LogOut size={20} />
                <span className="font-medium text-sm">Log Out</span>
            </button>
        </aside>
    );
}
