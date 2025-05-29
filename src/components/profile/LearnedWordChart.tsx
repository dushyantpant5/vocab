"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { getLast7FormattedDates } from "@/helpers/profile"
import { useEffect, useState } from "react"


type ChartDataArray = Array<ChartData>;
interface ChartData {
    date: string
    desktop: number
}


const chartConfig = {
    desktop: {
        label: "Words",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export function LearnedWordChart() {

    const [chartData, setChartData] = useState<ChartDataArray | null>();

    useEffect(() => {
        const fetchLearnedWordsData = async () => {
            try {
                const response = await fetch("/api/words/getLearnedWordAnalytics", {
                    method: "GET",
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch learned words data");
                }
                const data = await response.json();
                if (data.error || !data.learnedWordsAnalytics) {
                    throw new Error(data.error);
                }
                // Initialize chartData with last 7 days
                const learnedWordsAnalytics = data.learnedWordsAnalytics;
                const last7FormattedDates = getLast7FormattedDates();
                const chartDataFromApi: ChartData[] = last7FormattedDates.map((date) => {
                    const matched = learnedWordsAnalytics.find((analyticsEntry: ChartData) => {
                        const entryDate = new Date(analyticsEntry.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                        });
                        return entryDate === date;
                    });

                    return {
                        date,
                        desktop: matched?.words_learned_count ?? 0,
                    };
                });
                setChartData(chartDataFromApi);

            } catch (error) {
                console.error("Error fetching learned words data:", error);
            }
        };
        fetchLearnedWordsData();
    }, []);


    return (
        <Card>
            <CardHeader>
                <CardTitle>Learned Words</CardTitle>
                <CardDescription>Last 7 Days</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-full overflow-x-auto">
                    <div className="min-w-[900px]">
                        <ChartContainer config={chartConfig}>
                            <LineChart
                                width={900}
                                height={400}
                                data={chartData ?? []}
                                margin={{ top: 10, right: 20, left: 10, bottom: 30 }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={12}
                                    interval={0} // force all ticks
                                />
                                <YAxis allowDecimals={false} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                <Line
                                    dataKey="desktop"
                                    type="monotone"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                />
                            </LineChart>
                        </ChartContainer>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                    Showing Learned Words for the last 7 days
                </div>
            </CardFooter>
        </Card>
    )
}
