"use client"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { data: session, isPending, error } = authClient.useSession()
    const router = useRouter()

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/sign-in")
        }
    }, [isPending, session, router])

    if (isPending) return <div>Loading...</div>

    return <>{children}</>
}
