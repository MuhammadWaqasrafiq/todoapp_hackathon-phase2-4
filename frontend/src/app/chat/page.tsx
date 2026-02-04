'use client';

import AuthGuard from "@/components/auth-guard";
import { ChatInterface } from "@/components/chat-interface";

export default function ChatPage() {
    return (
        <AuthGuard>
            <div className="container mx-auto p-4 max-w-4xl">
                <h1 className="text-2xl font-bold mb-6">Taskoo Assistant</h1>
                <ChatInterface />
            </div>
        </AuthGuard>
    );
}
