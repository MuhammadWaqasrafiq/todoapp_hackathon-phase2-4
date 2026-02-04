"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { LogOut, User, Mail, Shield, Bell, Key, Camera } from "lucide-react";
import AuthGuard from "@/components/auth-guard";
import { useState } from "react";

export default function ProfilePage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general");

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
    <AuthGuard>
      <div className="min-h-screen bg-[var(--background)] text-white font-sans flex">
        <Sidebar />

        <main className="flex-1 min-h-screen relative flex flex-col md:ml-64 w-full">
            
            {/* Cover Image Header */}
            <div className="h-60 w-full bg-gradient-to-r from-[var(--card-bg)] via-[#35384D] to-[var(--card-bg)] relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[var(--background)] to-transparent"></div>
            </div>

            <div className="px-6 md:px-12 -mt-20 relative z-10 max-w-5xl mx-auto w-full pb-20">
                
                {/* Profile Header Card */}
                <div className="flex flex-col md:flex-row items-end md:items-center gap-6 mb-12">
                     <div className="relative group">
                        <div className="w-32 h-32 rounded-full bg-[var(--card-bg)] border-4 border-[var(--background)] flex items-center justify-center text-5xl font-bold text-white shadow-2xl overflow-hidden relative">
                             {/* Gradient Avatar Placeholder */}
                             <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] flex items-center justify-center">
                                {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                             </div>
                        </div>
                        <button className="absolute bottom-1 right-1 p-2 rounded-full bg-[var(--input-bg)] text-white border border-white/10 hover:bg-white/10 transition-colors shadow-lg">
                            <Camera size={16}/>
                        </button>
                     </div>
                     
                     <div className="flex-1 space-y-2 mb-2">
                         <h1 className="text-3xl font-bold">{session?.user?.name || "User"}</h1>
                         <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                            <Mail size={16}/>
                            <span>{session?.user?.email}</span>
                         </div>
                         <div className="flex gap-2 mt-2">
                             <span className="px-3 py-1 rounded-full bg-[var(--accent-blue)]/10 border border-[var(--accent-blue)]/20 text-[var(--accent-blue)] text-xs font-medium">Pro Plan</span>
                             <span className="px-3 py-1 rounded-full bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20 text-[var(--accent-green)] text-xs font-medium">Verified</span>
                         </div>
                     </div>

                     <div className="flex gap-3">
                        <button 
                            onClick={handleSignOut}
                            className="px-4 py-2 rounded-xl bg-[var(--primary-gradient-from)]/10 text-[var(--primary-gradient-from)] border border-[var(--primary-gradient-from)]/20 hover:bg-[var(--primary-gradient-from)]/20 transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                            <LogOut size={16}/> Sign Out
                        </button>
                     </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 border-b border-white/5 mb-8 text-sm font-medium text-[var(--text-secondary)]">
                    <button 
                        onClick={() => setActiveTab("general")}
                        className={`pb-4 transition-colors ${activeTab === "general" ? "text-[var(--accent-blue)] border-b-2 border-[var(--accent-blue)]" : "hover:text-white"}`}
                    >
                        General
                    </button>
                    <button 
                        onClick={() => setActiveTab("security")}
                         className={`pb-4 transition-colors ${activeTab === "security" ? "text-[var(--accent-blue)] border-b-2 border-[var(--accent-blue)]" : "hover:text-white"}`}
                    >
                        Security
                    </button>
                    <button 
                        onClick={() => setActiveTab("notifications")}
                        className={`pb-4 transition-colors ${activeTab === "notifications" ? "text-[var(--accent-blue)] border-b-2 border-[var(--accent-blue)]" : "hover:text-white"}`}
                    >
                        Notifications
                    </button>
                </div>

                {/* Content Area */}
                <div className="glass-card rounded-3xl p-8 border border-white/5">
                    {activeTab === "general" && (
                         <div className="space-y-8 animate-slide-up">
                            <h2 className="text-xl font-bold mb-6">Profile Information</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[var(--text-secondary)]">Display Name</label>
                                    <input 
                                        type="text" 
                                        defaultValue={session?.user?.name || ""} 
                                        className="w-full p-3 rounded-xl bg-[var(--input-bg)] border border-white/10 text-white focus:border-[var(--accent-blue)] focus:outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[var(--text-secondary)]">Email Address</label>
                                    <input 
                                        type="email" 
                                        disabled
                                        defaultValue={session?.user?.email || ""} 
                                        className="w-full p-3 rounded-xl bg-[var(--background)] border border-white/10 text-[var(--text-secondary)] cursor-not-allowed"
                                    />
                                </div>
                                 <div className="space-y-2">
                                    <label className="text-sm font-medium text-[var(--text-secondary)]">Bio</label>
                                    <textarea 
                                        rows={4}
                                        placeholder="Tell us about yourself..."
                                        className="w-full p-3 rounded-xl bg-[var(--input-bg)] border border-white/10 text-white focus:border-[var(--accent-blue)] focus:outline-none transition-colors resize-none"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex justify-end pt-4">
                                <button className="px-6 py-2.5 rounded-xl bg-[var(--accent-blue)] hover:bg-[#5E5EB8] text-white font-medium transition-colors">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="space-y-8 animate-slide-up">
                            <h2 className="text-xl font-bold mb-6">Security Settings</h2>
                             <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--input-bg)] border border-white/10">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-[var(--accent-blue)]/10 text-[var(--accent-blue)]">
                                            <Key size={20}/>
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">Password</div>
                                            <div className="text-sm text-[var(--text-secondary)]">Last changed 3 months ago</div>
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg transition-colors">Change</button>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--input-bg)] border border-white/10">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-[var(--accent-green)]/10 text-[var(--accent-green)]">
                                            <Shield size={20}/>
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">2-Factor Authentication</div>
                                            <div className="text-sm text-[var(--text-secondary)]">Add an extra layer of security</div>
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg transition-colors">Enable</button>
                                </div>
                             </div>
                        </div>
                    )}
                </div>

            </div>
        </main>
      </div>
    </AuthGuard>
  );
}
