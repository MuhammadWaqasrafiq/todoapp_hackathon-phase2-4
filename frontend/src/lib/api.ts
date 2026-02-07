import { authClient } from "./auth-client"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    // Attempt to get session/token using Better Auth client
    const session = await authClient.getSession()

    // Try to find a JWT (starts with ey...) or use session token
    // @ts-ignore
    let token = session?.data?.token || session?.data?.session?.token || session?.data?.accessToken

    // If token is opaque (short, no dots), try to check if there is another field
    if (token && !token.startsWith("ey")) {
        // Fallback: Check if there's an idToken or similar
        // @ts-ignore
        if (session?.data?.idToken) token = session.data.idToken
    }

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    }

    // Add authorization header if token is available
    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        credentials: "include", // This ensures cookies are sent with the request
        headers
    })

    if (!response.ok) {
        const errorText = await response.text(); // Get the error response body
        console.error(`API Error: ${response.status} - ${response.statusText}`, errorText);
        throw new Error(`API Error: ${response.status} - ${response.statusText}. Details: ${errorText}`)
    }

    if (response.status === 204) return null;

    return response.json()
}

// API functions for tasks
export async function getTasks(userId: string) {
    try {
        const response = await fetchWithAuth(`/tasks/${userId}/tasks`);
        return response;
    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw error;
    }
}

export async function createTask(userId: string, taskData: any) {
    try {
        const response = await fetchWithAuth(`/tasks/${userId}/tasks`, {
            method: "POST",
            body: JSON.stringify(taskData),
        });
        return response;
    } catch (error) {
        console.error("Error creating task:", error);
        throw error;
    }
}

export async function updateTask(userId: string, taskId: number, taskData: any) {
    try {
        const response = await fetchWithAuth(`/tasks/${userId}/tasks/${taskId}`, {
            method: "PUT",
            body: JSON.stringify(taskData),
        });
        return response;
    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
}

export async function deleteTask(userId: string, taskId: number) {
    try {
        const response = await fetchWithAuth(`/tasks/${userId}/tasks/${taskId}`, {
            method: "DELETE",
        });
        return response;
    } catch (error) {
        console.error("Error deleting task:", error);
        throw error;
    }
}

export async function toggleTaskCompletion(userId: string, taskId: number) {
    try {
        const response = await fetchWithAuth(`/tasks/${userId}/tasks/${taskId}/complete`, {
            method: "PATCH",
        });
        return response;
    } catch (error) {
        console.error("Error toggling task completion:", error);
        throw error;
    }
}
