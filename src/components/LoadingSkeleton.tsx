import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
    variant: "profile"
}

export default function LoadingSkeleton({ variant = "profile" }: LoadingSkeletonProps) {
    if (variant === "profile") {
        return (
            <div className="flex flex-col items-center space-y-6 w-full">
                {/* Profile picture skeleton */}
                <Skeleton className="w-36 h-36 rounded-full" />
                {/* Username and email skeletons */}
                <Skeleton className="w-40 h-6" />
                <Skeleton className="w-48 h-4" />
                <Skeleton className="w-48 h-4" />

                {/* Stat cards skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl mt-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full rounded-xl" />
                    ))}
                </div>

                {/* Chart section skeleton */}
                <div className="w-full max-w-6xl mt-6 flex justify-center">
                    <Skeleton className="h-80 w-full max-w-xl" />
                </div>
            </div>
        )
    }
    return (null);
}
