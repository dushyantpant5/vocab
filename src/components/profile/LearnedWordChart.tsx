"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
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

const last7FormattedDates = getLast7FormattedDates()
const chartData = last7FormattedDates.map((date) => ({
    date,
    desktop: Math.floor(Math.random() * 300),
}))

const chartConfig = {
    desktop: {
        label: "Words",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export function LearnedWordChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Learned Words</CardTitle>
                <CardDescription>Last 7 Days</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-[700px] max-w-full overflow-x-auto">
                    <ChartContainer config={chartConfig}>
                        <LineChart
                            width={700}
                            height={500}
                            data={chartData}
                            margin={{ left: 12, right: 12 }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                interval={0}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Line
                                dataKey="desktop"
                                type="natural"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ChartContainer>
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
