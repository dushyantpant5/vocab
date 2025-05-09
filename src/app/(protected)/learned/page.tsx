"use client";

import { useEffect, useState } from "react";
import WordCard from "@/components/WordCard";
import { TWord } from "@/app/(protected)/dashboard/page"; // Adjust if your types are elsewhere

export default function LearnedPage() {
    const [learnedWords, setLearnedWords] = useState<TWord[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
        const fetchLearnedWords = async () => {
            console.log("selcted date", selectedDate);
            if(selectedDate===null)
            {
            try {
                const res = await fetch(`/api/words/getLearnedWords`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
                console.log("data of if condition",data);
                setLearnedWords(data.learnedWords || []);
            } catch (err) {
                console.error("Failed to fetch learned words:", err);
            } finally {
                setLoading(false);
            }
            }
        else{
            try {
                const res = await fetch(`/api/words/getLearnedWordsByDate/${selectedDate}`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
                console.log(data);
                setLearnedWords(data.learnedWords || []);
            } catch (err) {
                console.error("Failed to fetch learned words for selected date:", err);
            } finally {
                setLoading(false);
            }
            }
        };
        console.log("selcted date", selectedDate);
        fetchLearnedWords();
    }, [selectedDate]);

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-8">
            <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">📘 Learned Words</h1>
            <input type="date" className="border rounded px-3 py-1" onChange={(e) => setSelectedDate(new Date(e.target.value))} />

            </div>
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
