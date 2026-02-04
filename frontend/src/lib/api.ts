import { authClient } from "./auth-client"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    // Attempt to get session/token using Better Auth client
    const session = await authClient.getSession()
    console.log("DEBUG: Full session object:", JSON.stringify(session, null, 2))

    // Try to find a JWT (starts with ey...)
    // @ts-ignore
    let token = session?.data?.token || session?.data?.session?.token || session?.data?.accessToken

    // If token is opaque (short, no dots), try to check if there is another field
    if (token && !token.startsWith("ey")) {
        console.warn("DEBUG: Token does not look like a JWT (no 'ey' prefix). Value:", token)
        // Fallback: Check if there's an idToken or similar
        // @ts-ignore
        if (session?.data?.idToken) token = session.data.idToken
    }

    console.log("DEBUG: Final token used:", token)

    if (!token) {
        console.warn("No auth token found in session")
    }

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        credentials: "include",
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
