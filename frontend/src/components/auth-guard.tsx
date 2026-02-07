"use client"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { data: session, isPending, error } = authClient.useSession()
    const router = useRouter()
    const [checkedAuth, setCheckedAuth] = useState(false)

    useEffect(() => {
        if (!isPending) {
            if (!session) {
                router.push("/sign-in")
            } else {
                setCheckedAuth(true)
            }
        }
    }, [isPending, session, router])

    if (isPending || !checkedAuth) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (!session) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500 text-xl">Authentication Required</div>
            </div>
        )
    }

    return <>{children}</>
}
