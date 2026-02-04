"use client";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, Command } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/dashboard",
      },
      {
        onRequest: () => {},
        onSuccess: () => router.push("/dashboard"),
        onError: (ctx) => {
          setLoading(false);
          alert(ctx.error.message);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex overflow-hidden">
      
      {/* Left Panel: Visuals */}
      <div className="hidden lg:flex w-1/2 relative bg-[var(--card-bg)] items-center justify-center p-12 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent-blue)]/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--primary-gradient-from)]/10 rounded-full blur-[120px] animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-lg text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-medium text-[var(--accent-blue)]">
                <Command size={14}/> <span>Taskoo OS</span>
            </div>
            <h1 className="text-6xl font-bold tracking-tight text-white leading-tight">
                Welcome back to your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)]">Flow State.</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                Taskoo helps you filter out the noise and focus on the signals. Continue where you left off.
            </p>
            
            {/* Visual Element: Minimal Card */}
            <div className="glass-card p-6 rounded-2xl border border-white/5 mt-12 animate-float">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--accent-green)]/20 flex items-center justify-center text-[var(--accent-green)] text-xs font-bold">AI</div>
                    <div className="h-2 w-32 bg-[var(--background)] rounded-full"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-2 w-full bg-[var(--background)] rounded-full"></div>
                    <div className="h-2 w-2/3 bg-[var(--background)] rounded-full"></div>
                </div>
            </div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative bg-[var(--background)]">
        <Link href="/" className="absolute top-8 left-8 text-[var(--text-secondary)] hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft size={16}/> Back
        </Link>

        <div className="w-full max-w-[400px] space-y-8 animate-slide-up">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">Sign In</h2>
                <p className="text-[var(--text-secondary)]">Enter your credentials to access your workspace.</p>
            </div>

            <form onSubmit={signIn} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--text-secondary)]">Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] border border-white/5 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[var(--primary-gradient-from)] focus:border-transparent transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                         <label className="text-sm font-medium text-[var(--text-secondary)]">Password</label>
                         <a href="#" className="text-sm text-[var(--accent-blue)] hover:text-white transition-colors">Forgot password?</a>
                    </div>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] border border-white/5 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[var(--primary-gradient-from)] focus:border-transparent transition-all"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] text-white font-bold hover:shadow-lg hover:shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                </button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[var(--background)] px-2 text-[var(--text-tertiary)]">Or continue with</span>
                </div>
            </div>

            <p className="text-center text-sm text-[var(--text-secondary)]">
                Don't have an account?{" "}
                <Link href="/sign-up" className="text-[var(--primary-gradient-from)] font-medium hover:text-[var(--primary-gradient-to)] transition-colors">
                    Sign Up for free
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
}