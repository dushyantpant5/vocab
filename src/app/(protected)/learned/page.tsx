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
      setLoading(true);
      try {
        const dateOnly = selectedDate
          ? selectedDate.toISOString().split("T")[0]
          : null;

        const endpoint = dateOnly
          ? `/api/words/getLearnedWordsByDate/${dateOnly}`
          : `/api/words/getLearnedWords`;

        const res = await fetch(endpoint, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setLearnedWords(data.learnedWords || []);
      } catch (err) {
        console.error(
          "Failed to fetch learned words" +
            (selectedDate ? " for selected date:" : ":"),
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLearnedWords();
  }, [selectedDate]);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          📘 Learned Words
        </h1>
        <input
          type="date"
          className="border rounded px-3 py-1"
          value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedDate(value ? new Date(value) : null);
          }}
        />
      </div>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : learnedWords.length === 0 ? (
        <p className="text-gray-600">
          You haven’t learned any words yet. Start your journey from the
          Dashboard!
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
