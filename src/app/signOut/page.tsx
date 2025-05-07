'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignOutPage() {
    const router = useRouter()

    useEffect(() => {
        const logout = async () => {
            const res = await fetch('/api/auth/signOut', {
                method: 'POST',
            })

            if (res.ok) {
                window.location.href = '/'
            }
        }
        logout()
    }, [router])

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-lg font-medium">Logging you out...</p>
        </div>
    )
}
