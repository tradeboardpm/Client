"use client";

import {
  format,
  isFuture,
  isSameMonth,
  startOfMonth,
  subMonths,
} from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useDateStore } from "@/stores/DateStore";

export function CalendarAndCharts({
  // selectedDate,
  // setSelectedDate,
  profitLossDates,
  weeklyStats,
}) {

  const { selectedDate, setSelectedDate } = useDateStore();
  const transformedData = Object.entries(weeklyStats || {}).map(
    ([date, stats]) => ({
      date: format(new Date(date), "EEE"),
      tradeCount: stats.tradeCount,
      wins: parseInt(stats.winsVsLosses.split(":")[0]),
      losses: parseInt(stats.winsVsLosses.split(":")[1]),
      profitLoss: stats.profitLoss,
      rulesFollowed: parseInt(stats.rulesFollowedVsBroken.split(":")[0]),
      rulesBroken:
        stats.rulesFollowedVsBroken === "N/A"
          ? 0
          : parseInt(stats.rulesFollowedVsBroken.split(":")[1]),
    })
  );

  const chartConfig = {
    tradeCount: {
      label: "Trades",
      color: "hsl(var(--primary))",
    },
    wins: {
      label: "Wins",
      color: "hsl(var(--chart-1))",
    },
    losses: {
      label: "Losses",
      color: "hsl(var(--chart-2))",
    },
    profitLoss: {
      label: "P&L",
      color: "hsl(var(--primary))",
    },
    rulesFollowed: {
      label: "Rules Followed",
      color: "hsl(var(--chart-1))",
    },
    rulesBroken: {
      label: "Rules Broken",
      color: "hsl(var(--chart-2))",
    },
  };

  const avgTrades =
    transformedData.reduce((acc, curr) => acc + curr.tradeCount, 0) /
    transformedData.length;
  const totalWins = transformedData.reduce((acc, curr) => acc + curr.wins, 0);
  const totalTrades = transformedData.reduce(
    (acc, curr) => acc + curr.wins + curr.losses,
    0
  );
  const winRate =
    totalTrades > 0 ? ((totalWins / totalTrades) * 100).toFixed(2) : 0;
  const totalProfitLoss = transformedData.reduce(
    (acc, curr) => acc + curr.profitLoss,
    0
  );
  const totalFollowed = transformedData.reduce(
    (acc, curr) => acc + curr.rulesFollowed,
    0
  );
  const totalRules = transformedData.reduce(
    (acc, curr) => acc + curr.rulesFollowed + curr.rulesBroken,
    0
  );
  const rulesFollowedRate =
    totalRules > 0 ? ((totalFollowed / totalRules) * 100).toFixed(2) : 0;

  const today = new Date();
  const disabledDays = [
    {
      from: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      ),
      to: new Date(2100, 0, 1),
    },
  ];

  const fromMonth = subMonths(today, 12); // Allow navigation up to 12 months in the past

  return (
    <div className="space-y-4 ">
      <Card className="p-0 w-fit">

        <CardContent className="p-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiers={{
              profit: (date) =>
                profitLossDates.some(
                  (d) =>
                    d.date === format(date, "yyyy-MM-dd") &&
                    d.status === "profit"
                ),
              loss: (date) =>
                profitLossDates.some(
                  (d) =>
                    d.date === format(date, "yyyy-MM-dd") && d.status === "loss"
                ),
            }}
            modifiersStyles={{
              profit: {
                color: "hsl(var(--chart-1))",
                backgroundColor: "hsl(var(--chart-1)/0.25)",
              },
              loss: {
                color: "hsl(var(--chart-2))",
                backgroundColor: "hsl(var(--chart-2)/0.25)",
              },
            }}
            disabled={disabledDays}
            fromMonth={fromMonth}
            onMonthChange={(month) => {
              if (isFuture(month)) {
                setSelectedDate(startOfMonth(today));
              }
            }}
          />
        </CardContent>
      </Card>

      <Card className="p-0 w-fit">
        <CardHeader className="p-2">
          <CardTitle>Trades Taken</CardTitle>
          <CardDescription>Daily trade count (limit: 4)</CardDescription>
        </CardHeader>
        <CardContent className="p-2">
          <ChartContainer config={chartConfig} className="h-[150px] -ml-4">
            <LineChart data={transformedData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="tradeCount"
                stroke="var(--color-tradeCount)"
                strokeWidth={2}
                dot={{ fill: "var(--color-tradeCount)" }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span>Average: {avgTrades.toFixed(2)} trades/day</span>
          </div>
        </CardFooter>
      </Card>

      <Card className="p-0 w-fit">
        <CardHeader className="p-2">
          <CardTitle>Win Rate</CardTitle>
          <CardDescription>Wins vs Losses</CardDescription>
        </CardHeader>
        <CardContent className="p-2">
          <ChartContainer config={chartConfig} className="h-[150px] -ml-4">
            <BarChart data={transformedData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="wins"
                stackId="a"
                fill="var(--color-wins)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="losses"
                stackId="a"
                fill="var(--color-losses)"
                radius={[0, 0, 4, 4]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {Number(winRate) >= 50 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span>Win rate: {winRate}%</span>
          </div>
        </CardFooter>
      </Card>

      <Card className="p-0 w-fit">
        <CardHeader className="p-2">
          <CardTitle>Profit & Loss</CardTitle>
          <CardDescription>Daily P&L</CardDescription>
        </CardHeader>
        <CardContent className="p-2">
          <ChartContainer config={chartConfig} className="h-[150px] -ml-4">
            <AreaChart data={transformedData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="profitLoss"
                fill="var(--color-profitLoss)"
                fillOpacity={0.2}
                stroke="var(--color-profitLoss)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {totalProfitLoss >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span>Total P&L: ${totalProfitLoss.toFixed(2)}</span>
          </div>
        </CardFooter>
      </Card>

      <Card className="p-0 w-fit">
        <CardHeader className="p-2">
          <CardTitle>Rules Adherence</CardTitle>
          <CardDescription>Followed vs Broken</CardDescription>
        </CardHeader>
        <CardContent className="p-2">
          <ChartContainer config={chartConfig} className="h-[150px] -ml-4">
            <BarChart data={transformedData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="rulesFollowed"
                stackId="a"
                fill="var(--color-rulesFollowed)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="rulesBroken"
                stackId="a"
                fill="var(--color-rulesBroken)"
                radius={[0, 0, 4, 4]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {Number(rulesFollowedRate) >= 80 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span>Rules followed: {rulesFollowedRate}%</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
