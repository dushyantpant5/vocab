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
        // Make a request to your server-side callback to validate user
        const checkUserAuth = async () => {
            try {
                const response = await fetch('/api/auth/callback', {
                    credentials: 'include',
                });
                const data = await response.json();

                if (data.success) {
                    // Redirect to origin or default dashboard
                    router.push(origin ? `/${origin}` : '/dashboard');
                } else {
                    // If unauthorized, redirect to sign-in
                    router.push('/sign-in');
                }
            } catch (err) {
                console.error("Error:", err);
                router.push('/sign-in');
            } finally {
                setLoading(false);
            }
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
