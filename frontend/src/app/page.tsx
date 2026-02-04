import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, Command, Layout, MessageSquare, Shield, Sparkles, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-white font-sans selection:bg-[var(--accent-blue)] selection:text-white overflow-hidden flex flex-col">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--accent-blue)]/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[var(--primary-gradient-from)]/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.2]"></div>
      </div>

      {/* Floating Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 rounded-full glass-card px-6 py-3 flex justify-between items-center shadow-2xl shadow-black/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] flex items-center justify-center shadow-lg shadow-[var(--primary-gradient-from)]/20">
             <Command size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">Taskoo</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="text-sm font-medium hover:text-white text-[var(--text-secondary)] transition-colors px-3 py-2">
            Log In
          </Link>
          <Link
            href="/sign-up"
            className="px-5 py-2 rounded-full bg-white text-[var(--background)] text-sm font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center pt-40 pb-20 px-4 text-center max-w-6xl mx-auto w-full">
        
        {/* Badge */}
        <div className="animate-slide-up opacity-0 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--accent-blue)]/30 bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] text-xs font-medium mb-8 backdrop-blur-md">
          <Sparkles size={12} />
          <span>New: AI Agent v2.0 Released</span>
        </div>

        {/* Headline */}
        <h1 className="animate-slide-up-delay-1 opacity-0 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-8 text-white">
          Your Productivity, <br/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)]">
             Reimagined by AI.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="animate-slide-up-delay-2 opacity-0 text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-12 leading-relaxed">
          Taskoo isn't just a to-do list. It's an intelligent workspace that plans, prioritizes, and executes tasks alongside you.
        </p>

        {/* CTA Buttons */}
        <div className="animate-slide-up-delay-2 opacity-0 flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link
              href="/sign-up"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(255,107,107,0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              Start for Free <ArrowRight size={20} />
            </Link>
             <Link
              href="/dashboard"
              className="px-8 py-4 rounded-full glass-card text-white font-semibold text-lg hover:bg-white/5 transition-all flex items-center justify-center gap-2 group"
            >
              <Layout size={20} className="text-[var(--text-secondary)] group-hover:text-white transition-colors"/>
              Live Demo
            </Link>
        </div>

        {/* Hero Visual / Dashboard Preview Placeholder */}
        <div className="mt-20 w-full relative animate-slide-up-delay-2 opacity-0" style={{ animationDelay: '0.4s' }}>
             <div className="absolute inset-0 bg-[var(--accent-blue)]/20 blur-[100px] rounded-full pointer-events-none"></div>
             <div className="relative glass-card rounded-2xl border border-white/5 p-2 md:p-4 shadow-2xl">
                 <div className="aspect-[16/9] rounded-xl bg-[var(--background)] overflow-hidden border border-white/5 relative flex items-center justify-center group">
                    <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                    {/* Simulated Dashboard UI Elements */}
                    <div className="absolute top-8 left-8 right-8 bottom-8 border border-dashed border-white/10 rounded-lg flex items-center justify-center">
                        <div className="text-center space-y-4">
                             <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] mx-auto flex items-center justify-center animate-float">
                                <Bot size={32} className="text-white" />
                             </div>
                             <p className="text-[var(--text-secondary)] font-mono text-sm">AI Agent Active...</p>
                        </div>
                    </div>
                    
                    {/* Floating Cards */}
                    <div className="absolute top-[20%] right-[10%] glass-card p-4 rounded-xl flex items-center gap-3 animate-float" style={{ animationDelay: '1s' }}>
                        <div className="w-8 h-8 rounded-full bg-[var(--accent-green)]/20 flex items-center justify-center text-[var(--accent-green)]"><CheckCircle2 size={16}/></div>
                        <div>
                            <div className="text-xs text-[var(--text-secondary)]">Task Completed</div>
                            <div className="text-sm font-semibold">Q4 Report Analysis</div>
                        </div>
                    </div>

                     <div className="absolute bottom-[20%] left-[10%] glass-card p-4 rounded-xl flex items-center gap-3 animate-float" style={{ animationDelay: '2s' }}>
                        <div className="w-8 h-8 rounded-full bg-[var(--primary-gradient-from)]/20 flex items-center justify-center text-[var(--primary-gradient-from)]"><Zap size={16}/></div>
                        <div>
                            <div className="text-xs text-[var(--text-secondary)]">High Priority</div>
                            <div className="text-sm font-semibold">Server Migration</div>
                        </div>
                    </div>
                 </div>
             </div>
        </div>

      </main>

      {/* Features Bento Grid */}
      <section id="features" className="relative z-10 py-32 px-4 max-w-7xl mx-auto w-full">
         <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Built for the future of work.</h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">Everything you need to manage tasks, projects, and goals in one beautifully designed workspace.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Card 1: Large Span */}
            <div className="md:col-span-2 glass-card rounded-3xl p-8 relative overflow-hidden group glass-card-hover transition-all duration-300">
                <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                        <div className="w-12 h-12 rounded-xl bg-[var(--accent-blue)]/20 flex items-center justify-center text-[var(--accent-blue)] mb-4">
                            <Bot size={24}/>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">AI-Powered Assistant</h3>
                        <p className="text-[var(--text-secondary)]">Your personal productivity agent that learns your habits and organizes your schedule automatically.</p>
                    </div>
                    {/* Visual Placeholder */}
                    <div className="mt-4 p-4 rounded-xl bg-[var(--background)] border border-white/5 font-mono text-xs text-[var(--text-secondary)] w-full max-w-md">
                        <span className="text-[var(--accent-green)]">{">"}</span> Rescheduling meeting with Sarah to 3 PM...<br/>
                        <span className="text-[var(--accent-green)]">{">"}</span> Task "Review Design" optimized for highest energy time.
                    </div>
                </div>
                <div className="absolute right-[-50px] bottom-[-50px] w-64 h-64 bg-[var(--accent-blue)]/10 blur-[80px] rounded-full group-hover:bg-[var(--accent-blue)]/20 transition-all"></div>
            </div>

            {/* Card 2: Vertical */}
            <div className="md:row-span-2 glass-card rounded-3xl p-8 relative overflow-hidden group glass-card-hover transition-all duration-300">
                 <div className="relative z-10 h-full flex flex-col">
                    <div className="w-12 h-12 rounded-xl bg-[var(--primary-gradient-from)]/20 flex items-center justify-center text-[var(--primary-gradient-from)] mb-4">
                        <Zap size={24}/>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Instant Focus</h3>
                    <p className="text-[var(--text-secondary)] mb-8">Cut through the noise. Taskoo highlights exactly what you need to do next, removing decision fatigue.</p>
                    
                    <div className="flex-1 space-y-3">
                        {[1,2,3].map((i) => (
                            <div key={i} className="p-3 rounded-xl bg-[var(--background)] border border-white/5 flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity" style={{ transitionDelay: `${i * 100}ms` }}>
                                <div className="w-4 h-4 rounded-full border-2 border-white/20"></div>
                                <div className="h-2 bg-white/10 rounded-full w-24"></div>
                            </div>
                        ))}
                         <div className="p-3 rounded-xl bg-[var(--primary-gradient-from)]/10 border border-[var(--primary-gradient-from)]/20 flex items-center gap-3 scale-105 shadow-lg shadow-black/20">
                                <div className="w-4 h-4 rounded-full border-2 border-[var(--primary-gradient-from)]"></div>
                                <div className="h-2 bg-white rounded-full w-32"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card 3: Small */}
            <div className="glass-card rounded-3xl p-8 relative overflow-hidden group glass-card-hover transition-all duration-300">
                <div className="relative z-10">
                     <div className="w-12 h-12 rounded-xl bg-[var(--accent-yellow)]/20 flex items-center justify-center text-[var(--accent-yellow)] mb-4">
                        <MessageSquare size={24}/>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Natural Chat</h3>
                    <p className="text-[var(--text-secondary)] text-sm">Talk to your tasks like a human.</p>
                </div>
            </div>

             {/* Card 4: Small */}
            <div className="glass-card rounded-3xl p-8 relative overflow-hidden group glass-card-hover transition-all duration-300">
                <div className="relative z-10">
                     <div className="w-12 h-12 rounded-xl bg-[var(--accent-green)]/20 flex items-center justify-center text-[var(--accent-green)] mb-4">
                        <Shield size={24}/>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Private by Design</h3>
                    <p className="text-[var(--text-secondary)] text-sm">Your data never trains public models.</p>
                </div>
            </div>

         </div>
      </section>

      <footer className="py-8 text-center text-[var(--text-tertiary)] text-sm border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
             <p>© 2024 Taskoo AI Inc.</p>
             <div className="flex gap-4">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
             </div>
        </div>
      </footer>

    </div>
  );
}