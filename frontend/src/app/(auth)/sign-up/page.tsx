"use client";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, Sparkles, Command, CheckCircle2, ArrowRight } from "lucide-react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Success:", data);
        router.push("/dashboard");
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.detail || "Sign-up failed"}`);
        setLoading(false);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex overflow-hidden selection:bg-[var(--primary-gradient-from)]/30 selection:text-white">
      
      {/* Left Panel: Visuals & Brand Value */}
      <div className="hidden lg:flex w-[55%] relative bg-[var(--card-bg)] items-center justify-center p-16 overflow-hidden">
        
        {/* Abstract Background Art */}
        <div className="absolute top-[-20%] left-[-20%] w-[1000px] h-[1000px] bg-[var(--accent-blue)]/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-[var(--primary-gradient-from)]/10 rounded-full blur-[100px] animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Content Container */}
        <div className="relative z-10 w-full max-w-xl">
            {/* Logo Badge */}
            <div className="inline-flex items-center gap-2 mb-12 opacity-80">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] flex items-center justify-center shadow-lg shadow-orange-500/20">
                     <Command size={20} className="text-white" />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">Taskoo</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl font-bold tracking-tight text-white leading-[1.2] mb-6">
                Orchestrate your work <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)]">with precision.</span>
            </h1>
            
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-12 max-w-md">
                Join thousands of professionals using Taskoo to streamline workflows, automate scheduling, and achieve clarity.
            </p>

            {/* Social Proof / Trust Indicators */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                     <div className="flex -space-x-3">
                        {[1,2,3,4,5].map((i) => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--card-bg)] bg-[var(--input-bg)] relative overflow-hidden flex items-center justify-center text-[var(--text-secondary)] text-xs font-medium">
                                U{i}
                            </div>
                        ))}
                    </div>
                    <div className="text-sm">
                        <div className="flex items-center gap-1 text-white font-semibold">
                            <span>4.9/5</span>
                            <div className="flex text-[var(--accent-yellow)]">★★★★★</div>
                        </div>
                        <span className="text-[var(--text-secondary)]">from 10,000+ reviews</span>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                    {['Automated Scheduling', 'Team Collaboration', 'Smart Analytics'].map((feature) => (
                         <div key={feature} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs font-medium text-[var(--text-secondary)] flex items-center gap-2">
                            <CheckCircle2 size={12} className="text-[var(--accent-green)]"/> {feature}
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 relative bg-[var(--background)]">
        {/* Mobile Back Link */}
        <Link href="/" className="absolute top-8 left-8 text-[var(--text-secondary)] hover:text-white transition-colors flex items-center gap-2 lg:hidden">
            <ArrowLeft size={16}/> Back
        </Link>

        {/* Desktop Back Link */}
         <Link href="/" className="absolute top-10 right-10 text-[var(--text-secondary)] hover:text-white transition-colors items-center gap-2 hidden lg:flex text-sm font-medium group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Return to Home
        </Link>

        <div className="w-full max-w-[420px] animate-slide-up">
            
            {/* Form Header */}
            <div className="mb-10">
                <h2 className="text-3xl font-bold text-white mb-2">Create your account</h2>
                <p className="text-[var(--text-secondary)]">Start your 14-day free trial. No credit card required.</p>
            </div>

            <form onSubmit={signUp} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider ml-1">Full Name</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Sarah Connor"
                        className="w-full px-4 py-3.5 rounded-xl bg-[var(--input-bg)] border border-white/5 text-white placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-gradient-from)] focus:border-transparent transition-all hover:border-white/10"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider ml-1">Work Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sarah@skynet.com"
                        className="w-full px-4 py-3.5 rounded-xl bg-[var(--input-bg)] border border-white/5 text-white placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-gradient-from)] focus:border-transparent transition-all hover:border-white/10"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider ml-1">Password</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3.5 rounded-xl bg-[var(--input-bg)] border border-white/5 text-white placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-gradient-from)] focus:border-transparent transition-all hover:border-white/10"
                    />
                     <div className="flex gap-2 mt-2">
                        {/* Password Strength Indicators (Visual Only) */}
                        <div className={`h-1 flex-1 rounded-full ${password.length > 0 ? 'bg-[var(--primary-gradient-from)]' : 'bg-white/10'} transition-colors`}></div>
                        <div className={`h-1 flex-1 rounded-full ${password.length > 6 ? 'bg-[var(--accent-yellow)]' : 'bg-white/10'} transition-colors`}></div>
                        <div className={`h-1 flex-1 rounded-full ${password.length > 10 ? 'bg-[var(--accent-green)]' : 'bg-white/10'} transition-colors`}></div>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] text-white font-bold text-base hover:shadow-lg hover:shadow-orange-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Get Started <ArrowRight size={18} className="opacity-80"/></>}
                    </button>
                </div>
            </form>

            <div className="mt-8 pt-8 border-t border-white/5 text-center">
                <p className="text-sm text-[var(--text-secondary)]">
                    Already have an account?{" "}
                    <Link href="/sign-in" className="text-[var(--primary-gradient-from)] font-semibold hover:text-[var(--primary-gradient-to)] transition-colors">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}