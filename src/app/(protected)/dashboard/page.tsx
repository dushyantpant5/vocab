'use client';

import WordCard from "@/components/WordCard";
import { useEffect, useState } from "react";

export type TWord = {
    id: string;
    word: string;
    meaning: string;
    sentence1: string;
    sentence2: string;
    examtags: string[];
    difficultytag: string;
    synonyms: string[];
    antonyms: string[];
    createdat: string;
    updatedat: string;
};

export default function Dashboard() {

    const [words, setWords] = useState<TWord[]>([]);  // State to store words
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWords = async () => {
            setLoading(true); // Set loading state to true
            setError(null); // Reset any previous errors
            try {
                const res = await fetch("/api/words/getNewWords", {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error("Failed to fetch words");
                }

                setWords(data);  // Store the fetched words in state
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);  // Handle any errors
                } else {
                    setError("An unknown error occurred");
                }
            } finally {
                setLoading(false);  // Set loading state to false after fetch is complete
            }
        };

        fetchWords();  // Call the fetchWords function
    }, []);

    return (
        <div className="max-w-3xl mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-semibold mb-4">🧠 Daily Word Dashboard</h1>
            {loading ? (
                <p className="text-center mt-10 text-blue-500">Loading...</p>
            ) : error ? (
                <p className="text-center mt-10 text-red-500">{error}</p>
            ) : words.length > 0 ? (
                words.map((word: TWord) => (
                    <WordCard
                        key={word.id}
                        word={word.word}
                        meaning={word.meaning}
                        sentence1={word.sentence1}
                        sentence2={word.sentence2}
                        id={word.id}
                        examtags={word.examtags}
                        difficultytag={word.difficultytag}
                        synonyms={word.synonyms}
                        antonyms={word.antonyms}
                        createdat={word.createdat}
                        updatedat={word.updatedat}
                    />
                ))
            ) : (
                <p className="text-center mt-10 text-red-500">No words found for your account yet.</p>
            )}
        </div>
    );
}