import { authClient } from '@/lib/auth-client';
import { useMemo, useEffect, useState, useCallback } from 'react';

// Define types locally to avoid SDK dependency issues
export interface ToolInvocation {
    toolCallId: string;
    toolName: string;
    args: any;
}

export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    toolInvocations?: ToolInvocation[];
}

export function useAgentChat() {
    const { data: session } = authClient.useSession();
    const userId = session?.user?.id;

    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const apiEndpoint = useMemo(() => {
        if (!userId) return undefined;
        // Ensure we don't duplicate /api if it's already in the env var
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/api\/?$/, '');
        return `${baseUrl}/api/${userId}/chat`;
    }, [userId]);

    // Load history
    useEffect(() => {
        if (!apiEndpoint) return;

        const fetchHistory = async () => {
            try {
                const res = await fetch(apiEndpoint, {
                    credentials: 'include'
                });
                if (res.ok) {
                    const history = await res.json();
                    setMessages(history.map((msg: any) => ({
                        id: msg.id,
                        role: msg.role,
                        content: msg.content || '',
                        toolInvocations: msg.tool_calls ? msg.tool_calls.map((tc: any) => ({
                            toolCallId: tc.id,
                            toolName: tc.function.name,
                            args: JSON.parse(tc.function.arguments)
                        })) : undefined
                    })));
                }
            } catch (e) {
                console.error("Failed to load history", e);
            }
        };

        fetchHistory();
    }, [apiEndpoint]);

    const append = useCallback(async (message: { role: string; content: string }) => {
        if (!apiEndpoint) return null;

        setIsLoading(true);
        setError(null);

        // Optimistically add user message
        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: message.content
        };

        // We use functional update to ensure we have latest messages
        // But for the API call we need the CURRENT messages including this one
        // React state update is async, so we construct the list manually for the request

        setMessages(prev => [...prev, userMsg]);

        try {
            // Construct the payload for the backend
            // The backend expects { messages: [...] }
            // We should send the *entire* history or just the new message?
            // The backend spec implementation I saw handles "messages" list and takes the last one.
            // So we can send the previous messages + the new one.

            // NOTE: We need to map back from UI format to Backend format if sending full history
            // But since the backend only strictly looks at the *last* message for the prompt (in my recent edit),
            // sending just the user message might work if the backend wasn't needing context?
            // Wait, the backend loads context from DB: `history_service.get_messages(conversation.id)`.
            // So passing just the new message in the list is sufficient and safer!

            const payload = {
                messages: [{
                    role: 'user',
                    content: message.content
                }]
            };

            console.log("Fetching chat API:", {
                url: apiEndpoint,
                userId,
                payload
            });

            const res = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                throw new Error(`Chat request failed: ${res.statusText}`);
            }

            const data = await res.json();

            // Add assistant response
            const assistantMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response || '',
                toolInvocations: data.tool_calls ? data.tool_calls.map((tc: any) => ({
                    toolCallId: tc.id,
                    toolName: tc.function.name,
                    args: JSON.parse(tc.function.arguments)
                })) : undefined
            };

            setMessages(prev => [...prev, assistantMsg]);
            return assistantMsg;

        } catch (e: any) {
            console.error("Chat error:", e);
            setError(e);
            // Optionally remove the optimistic message?
            // For now let's keep it but maybe show error.
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [apiEndpoint]);

    const reload = useCallback(async () => {
        // Simple no-op or implement if needed
        console.log("Reload not implemented in custom hook");
    }, []);

    const stop = useCallback(() => {
        setIsLoading(false);
    }, []);

    return {
        messages,
        input: '', // No-op, managed by ChatInterface
        handleInputChange: () => { }, // No-op
        handleSubmit: () => { }, // No-op
        isLoading,
        error,
        setMessages,
        reload,
        stop,
        append,
        userId,
        isLoadingSession: !session && !userId
    };
}