'use client';
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { useState, useEffect } from "react";

import ProfilePicture from "@/components/profile/ProfilePicture";
import UserDetails from "@/components/profile/UserDetails";
import StatCard from "@/components/profile/StatCard";
import { LearnedWordChart } from "@/components/profile/LearnedWordChart";
import { Button } from "@/components/ui/button";
import UserProfileEditBox from "@/components/profile/UserProfileEditBox";


export interface UserDetails {
    username: string;
    email: string;
    phonenumber: string;
    dailywordcount: string;
    profileurl: string;
}

export default function ProfilePage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [learnedWordsCount, setLearnedWordsCount] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                setLoading(true);

                const res = await fetch(`/api/user/getUserProfile`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
                console.log(data);
                setUserDetails(data);

                // api call for fetching count of learned words
                const wordRes = await fetch("/api/words/getLearnedWordCount", {
                    method: "GET",
                    credentials: "include",
                });
                const learnedWordCount = await wordRes.json();
                setLearnedWordsCount(learnedWordCount.learnedWordsCount);
            } catch (err) {
                setError("Failed to fetch user details");
                console.error(
                    `Failed to fetch user Profile getting error
                      ${err}`
                );
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-200 to-indigo-200 p-8">
            {loading ? (
                <LoadingSkeleton variant="profile" />
            ) : error ? (
                <div className="flex flex-col items-center space-y-6">
                    <h1 className="text-2xl font-semibold text-red-600">{error}</h1>
                    <p className="text-center text-blue-500">Please try again later.</p>
                </div>
            ) : userDetails ? (
                <div className="flex flex-col items-center space-y-6">
                    <div className="flex flex-col items-center space-y-2">
                        <ProfilePicture profileUrl={userDetails?.profileurl} />
                        <UserDetails userDetails={userDetails} />

                        <Button
                            onClick={() => setIsEditing(true)}
                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:cursor-pointer hover:bg-blue-700 hover:shadow-lg transition duration-300 ease-in-out"
                        >
                            Edit Profile
                        </Button>

                        {isEditing && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
                                <UserProfileEditBox
                                    phoneNumber={userDetails?.phonenumber}
                                    dailyWordCount={userDetails?.dailywordcount}
                                    setIsEditing={setIsEditing}
                                    setUserDetails={setUserDetails}
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
                        <StatCard label="AVERAGE HOURS SPENT" value="-" />
                        <StatCard
                            label="DAILY DASHBOARD WORD COUNT"
                            value={`${userDetails?.dailywordcount} Words`}
                        />
                        <StatCard
                            label="TOTAL WORDS LEARNED"
                            value={`${learnedWordsCount} Words`}
                        />
                        <StatCard label="AVG WORDS / WEEK" value="-" />
                        <StatCard label="AVG WORDS / MONTH" value="-" />
                    </div>

                    <LearnedWordChart />
                </div>
            ) : (
                <div className="flex flex-col items-center space-y-6">
                    <h1 className="text-2xl font-semibold text-red-600">User not found</h1>
                    <p className="text-center text-blue-500">Please try again later.</p>
                </div>
            )}
        </div>
    );

}

