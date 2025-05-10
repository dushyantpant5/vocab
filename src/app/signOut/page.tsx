'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignOutPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const logout = async () => {
            let attempts = 0;
            const maxAttempts = 3; // Max number of retries
            const retryDelay = 2000; // Delay between retries (2 seconds)

            while (attempts < maxAttempts) {
                try {
                    const res = await fetch('/api/auth/signOut', {
                        method: 'GET',
                        credentials: 'include',
                    });

                    if (res.ok) {
                        router.push('/');
                        return;
                    } else {
                        console.error("Logout failed");
                        break;
                    }
                } catch (err) {
                    console.error(`Attempt ${attempts + 1} failed:`, err);
                    attempts += 1;
                    if (attempts < maxAttempts) {
                        // Exponential backoff (increasing delay for each retry)
                        await new Promise((resolve) => setTimeout(resolve, retryDelay * Math.pow(2, attempts)));
                    }
                }
                finally {
                    setLoading(false); // Set loading to false after attempts
                }
            }

            // After max attempts, redirect to homepage or handle the failure gracefully
            router.push('/');
            setLoading(false);
        };

        logout();
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg font-medium">Logging you out...</p>
            </div>
        );
    }

    return null; // Return null after logout process completes and redirection happens
}
