'use client';

import { useAgentChat } from '@/hooks/use-agent-chat';
import { useRef, useEffect, useState } from 'react';
import { Send, Bot, User, Sparkles, Wrench, ShieldCheck, ChevronRight } from 'lucide-react';

export function ChatInterface() {
    const { messages, append, isLoading, userId } = useAgentChat();
    const [localInput, setLocalInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!localInput.trim()) return;

        const content = localInput;
        setLocalInput('');

        try {
            await append({
                role: 'user',
                content: content
            });
        } catch (err) {
            console.error("Error in append:", err);
        }
    };

    if (!userId) {
        return (
            <div className="h-[600px] w-full flex flex-col items-center justify-center p-8 text-[var(--text-secondary)] bg-[var(--card-bg)]/50 backdrop-blur-xl rounded-[2rem] border border-white/5 shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
                    <ShieldCheck className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Authentication Required</h3>
                <p className="text-center max-w-xs leading-relaxed opacity-70">
                    To access the personalized AI assistant and manage your tasks securely, please sign in.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[500px] w-full bg-[#1A1D26]/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden font-sans relative group">

            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-blue)]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none z-0"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--primary-gradient-from)]/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none z-0"></div>

            {/* Header */}
            <div className="relative px-6 py-4 border-b border-white/5 bg-white/10 backdrop-blur-md flex items-center justify-between z-20">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] flex items-center justify-center shadow-lg shadow-orange-500/20 ring-1 ring-white/10">
                            <Bot size={18} className="text-white" />
                        </div>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#1A1D26] rounded-full"></span>
                    </div>
                    <div>
                        <h2 className="font-bold text-base text-white tracking-tight flex items-center gap-2">
                            Taskoo AI
                        </h2>
                        <p className="text-[10px] text-[var(--text-secondary)] font-medium uppercase tracking-wider">Online</p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 w-full relative z-10 overflow-hidden flex flex-col">
                {messages.length === 0 ? (
                    /* Empty State - Centered & Non-scrollable */
                    <div className="h-full w-full flex flex-col items-center justify-center p-6 space-y-6 animate-slide-up">
                        {/* Icon */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <div className="relative w-16 h-16 rounded-2xl bg-[var(--card-bg)] border border-white/10 flex items-center justify-center shadow-xl transform group-hover:scale-105 transition-transform">
                                <Sparkles className="text-[var(--primary-gradient-from)]" size={28} />
                            </div>
                        </div>

                        {/* Text */}
                        <div className="space-y-1 text-center">
                            <h3 className="text-xl font-bold text-white tracking-tight">
                                How can I help?
                            </h3>
                            <p className="text-[var(--text-secondary)] text-xs max-w-[250px] mx-auto leading-relaxed">
                                Manage tasks, organize your day, and stay productive.
                            </p>
                        </div>

                        {/* Suggestions */}
                        <div className="grid w-full gap-2">
                            {[
                                { icon: '📝', text: 'Add a task to submit report' },
                                { icon: '📅', text: 'Show tasks for today' },
                                { icon: '✅', text: 'Mark first task as done' }
                            ].map((suggestion, i) => (
                                <button
                                    key={i}
                                    onClick={() => setLocalInput(suggestion.text)}
                                    className="group flex items-center gap-3 p-3 w-full text-left bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl transition-all duration-200"
                                >
                                    <span className="text-base opacity-70 group-hover:scale-110 transition-transform">{suggestion.icon}</span>
                                    <span className="text-xs font-medium text-[var(--text-secondary)] group-hover:text-white transition-colors">{suggestion.text}</span>
                                    <ChevronRight className="ml-auto w-3 h-3 text-white/20 group-hover:text-white/60 transition-all opacity-0 group-hover:opacity-100" />
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Scrollable Messages */
                    <div className="flex-1 overflow-y-auto w-full p-6 space-y-6 no-scrollbar">
                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={`flex w-full animate-slide-up ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex max-w-[85%] md:max-w-[75%] gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                                    {/* Avatar */}
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 shadow-md ring-1 ring-white/10 ${m.role === 'user'
                                            ? 'bg-[var(--card-bg)]'
                                            : 'bg-gradient-to-br from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)]'
                                        }`}>
                                        {m.role === 'user' ? (
                                            <User size={14} className="text-[var(--text-secondary)]" />
                                        ) : (
                                            <Sparkles size={14} className="text-white" />
                                        )}
                                    </div>

                                    {/* Bubble */}
                                    <div className={`flex flex-col gap-1.5 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`relative px-5 py-3.5 text-sm leading-relaxed shadow-lg ${m.role === 'user'
                                                ? 'bg-gradient-to-br from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] text-white rounded-[1.25rem] rounded-tr-sm'
                                                : 'bg-[var(--card-bg)] text-[var(--text-primary)] border border-white/5 rounded-[1.25rem] rounded-tl-sm backdrop-blur-sm'
                                            }`}>
                                            <div className="whitespace-pre-wrap">{m.content}</div>
                                        </div>

                                        {/* Tool Invocations */}
                                        {m.toolInvocations?.map((tool) => (
                                            <div key={tool.toolCallId} className="flex items-center gap-2 text-[11px] text-[var(--text-secondary)] bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse"></div>
                                                <span className="font-mono opacity-80 uppercase tracking-wider">Using: {tool.toolName}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start w-full animate-slide-up">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] flex items-center justify-center shadow-lg ring-1 ring-white/10">
                                        <Bot size={14} className="text-white" />
                                    </div>
                                    <div className="bg-[var(--card-bg)] px-5 py-4 rounded-[1.25rem] rounded-tl-sm border border-white/5 flex gap-1.5 items-center shadow-lg">
                                        <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-5 bg-[#1A1D26]/80 backdrop-blur-xl border-t border-white/5 z-20">
                <form
                    onSubmit={handleSend}
                    className={`relative flex items-center transition-all duration-300 rounded-2xl bg-black/20 border ${isFocused ? 'border-[var(--primary-gradient-from)]/50 shadow-[0_0_15px_rgba(255,107,107,0.1)]' : 'border-white/5'}`}
                >
                    <input
                        className="w-full bg-transparent text-white placeholder-gray-500 py-4 pl-5 pr-14 focus:outline-none text-sm transition-all"
                        value={localInput}
                        onChange={(e) => setLocalInput(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Type a message to Taskoo..."
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !localInput.trim()}
                        className={`absolute right-2 p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center ${localInput.trim() && !isLoading
                            ? 'bg-gradient-to-r from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] text-white shadow-lg hover:shadow-orange-500/25 transform hover:scale-105 active:scale-95'
                            : 'bg-white/5 text-white/20 cursor-not-allowed'
                            }`}
                    >
                        <Send size={18} className={localInput.trim() && !isLoading ? "-ml-0.5" : ""} />
                    </button>
                </form>
            </div>
        </div>
    );
}