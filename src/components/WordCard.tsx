import axios from "axios";
import { TWord } from "@/app/dashboard/page";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function WordCard({
    id,
    word,
    meaning,
    sentence1,
    sentence2,
    examtags,
    difficultytag,
    synonyms,
    antonyms,
}: TWord) {
    const [isDone, setIsDone] = useState(false);

    const handleMarkAsDone = async () => {
        try {
            // Sending POST request with Axios
            const response = await axios.patch(
                `/api/words/checkLearnedTrue/${id}`,
                { withCredentials: true }  // Ensures that credentials (cookies) are included
            );

            if (response.status === 200) {
                // Successfully marked as done
                setIsDone(true);
            } else {
                // Handle error response
                console.error("Error:", response.data?.error || "Unexpected error");
            }
        } catch (err) {
            console.error("API call failed", err);
        }
    };

    // Render nothing if the word is marked as done
    if (isDone) return null;

    return (
        <Card className="bg-white rounded-2xl shadow-md p-4 sm:p-6 hover:shadow-xl transition duration-300 ease-in-out relative">
            <CardHeader className="pb-2 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <CardTitle className="text-xl sm:text-2xl font-bold text-blue-600">
                    {word.charAt(0).toUpperCase() + word.slice(1)}
                </CardTitle>
                <Badge className="text-xs bg-gray-200 text-gray-700 font-medium px-2 py-0.5 mt-1 sm:mt-0">
                    {difficultytag.charAt(0).toUpperCase() + difficultytag.slice(1)}
                </Badge>
            </CardHeader>

            <CardDescription className="text-gray-700 px-4 sm:px-6 -mt-2 sm:-mt-4 text-sm sm:text-base">{meaning}</CardDescription>

            <CardContent className="space-y-4 mt-2 px-4 sm:px-6">
                {/* Example sentences */}
                {sentence1 && <p className="text-sm text-gray-500 italic">• {sentence1}</p>}
                {sentence2 && <p className="text-sm text-gray-500 italic">• {sentence2}</p>}

                {/* Exam Tags */}
                {examtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {examtags.map((tag, index) => (
                            <Badge
                                key={index}
                                className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Synonyms */}
                {synonyms.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800">Synonyms:</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {synonyms.map((syn, i) => (
                                <Badge
                                    key={i}
                                    className="bg-green-100 text-green-800 text-xs px-2 py-0.5"
                                >
                                    {syn}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Antonyms + Mark as Done */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mt-4 gap-3 min-h-[60px]">
                    {/* Antonyms */}
                    <div className="flex-1">
                        {antonyms.length > 0 ? (
                            <>
                                <h3 className="text-sm font-semibold text-gray-800">Antonyms:</h3>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {antonyms.map((ant, i) => (
                                        <Badge
                                            key={i}
                                            className="bg-red-100 text-red-800 text-xs px-2 py-0.5"
                                        >
                                            {ant}
                                        </Badge>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="invisible">No antonyms</div>
                        )}
                    </div>

                    {/* Mark as Done Button */}
                    <Button
                        variant="outline"
                        size="default"
                        onClick={handleMarkAsDone}
                        className="text-sm px-4 py-2 rounded-lg hover:scale-105 transition cursor-pointer self-end"
                    >
                        ✅ Mark as Done
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
