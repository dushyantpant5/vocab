"use client";

import { useEffect, useState } from "react";
import WordCard from "@/components/WordCard";
import { TWord } from "@/app/(protected)/dashboard/page"; // Adjust if your types are elsewhere

export default function LearnedPage() {
    const [learnedWords, setLearnedWords] = useState<TWord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLearnedWords = async () => {
            try {
                const res = await fetch(`/api/words/getLearnedWords`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
                setLearnedWords(data.learnedWords || []);
            } catch (err) {
                console.error("Failed to fetch learned words:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLearnedWords();
    }, []);

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">📘 Learned Words</h1>

            {loading ? (
                <p className="text-gray-600">Loading...</p>
            ) : learnedWords.length === 0 ? (
                <p className="text-gray-600">
                    You haven’t learned any words yet. Start your journey from the Dashboard!
                </p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {learnedWords.map((word) => (
                        <WordCard key={word.id} {...word} showDoneButton={false} />
                    ))}
                </div>
            )}
        </div>
    );
}
