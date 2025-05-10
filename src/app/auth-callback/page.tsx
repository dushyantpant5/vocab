'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const AuthCallBack = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const origin = searchParams.get('origin');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserAuth = async () => {
            let attempts = 0;
            const maxAttempts = 3; // Number of retry attempts
            const retryDelay = 2000; // 2 seconds delay between retries

            while (attempts < maxAttempts) {
                try {
                    const response = await fetch('/api/auth/callback', {
                        credentials: 'include',
                        method: 'GET',
                    });
                    const data = await response.json();

                    if (data.success) {
                        // Redirect to origin or default dashboard
                        router.push(origin ? `/${origin}` : '/dashboard');
                        return; // Exit after successful redirect
                    } else {
                        // If unauthorized, redirect to sign-in
                        router.push('/signIn');
                        return;
                    }
                } catch (err) {
                    console.error(`Attempt ${attempts + 1} failed:`, err);
                    attempts += 1;
                    if (attempts < maxAttempts) {
                        // Wait before retrying
                        await new Promise((resolve) => setTimeout(resolve, retryDelay * Math.pow(2, attempts))); // Exponential backoff
                    }
                }
                finally {
                    setLoading(false); // Set loading to false after attempts
                }
            }

            // After max attempts, redirect to sign-in
            router.push('/signIn');
        };

        checkUserAuth();
    }, [origin, router]);

    if (loading) {
        return (
            <div className="w-full mt-24 flex justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
                    <h3 className="font-semibold text-xl">Setting up your account...</h3>
                    <p>You will be redirected automatically.</p>
                </div>
            </div>
        );
    }

    return null; // Optionally, you can return null when redirecting is complete
};

const SuspenseWrapper = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthCallBack />
        </Suspense>
    );
};

export default SuspenseWrapper;
