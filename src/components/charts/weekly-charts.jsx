import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import Cookies from "js-cookie";
import { parseISO, isValid } from "date-fns";

const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const CustomLegend = ({ items }) => (
  <div className="flex items-center gap-4 ml-4 text-xs text-muted-foreground">
    {items.map((item, index) => (
      <div key={index} className="flex items-center gap-1">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: item.color }}
        />
        <span>{item.label}</span>
      </div>
    ))}
  </div>
);

const DefaultNoDataComponent = () => (
  <div className="flex flex-col items-center justify-start p-8 text-center min-h-[160px]">
    <img src="/images/no_charts.svg" alt="No Data" className="mb-4 w-24 h-24" />
    <h2 className="text-xl font-medium mb-2">No Data</h2>
    <p className="text-muted-foreground">
      Please start journaling daily to see your performance here
    </p>
  </div>
);

export function WeeklyCharts({
  selectedDate = new Date(),
  tradesPerDay = 10,
  weeklyDataOverride = null,
  noDataComponent: NoDataComponent = DefaultNoDataComponent,
}) {
  const [weeklyData, setWeeklyData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const normalizeDate = (date) => {
    let normalizedDate;
    if (date instanceof Date) {
      normalizedDate = date;
    } else if (typeof date === "string") {
      normalizedDate = parseISO(date);
    } else {
      normalizedDate = new Date(date);
    }
    return !isValid(normalizedDate)
      ? new Date()
      : new Date(
          Date.UTC(
            normalizedDate.getFullYear(),
            normalizedDate.getMonth(),
            normalizedDate.getDate()
          )
        );
  };

  const chartConfig = {
    containerHeight: "h-32", // Tailwind height class
    margin: { top: 5, right: 15, bottom: 5, left: 0 },
    className:
      "border  bg-background shadow-[0px_8px_20px_rgba(0,0,0,0.08)] dark:shadow-[0px_8px_20px_rgba(0,0,0,0.32)]",
  };

  const fetchWeeklyData = async (date) => {
    setIsLoading(true);
    setError(null);

    if (weeklyDataOverride) {
      setWeeklyData(weeklyDataOverride);
      setIsLoading(false);
      return weeklyDataOverride;
    }

    try {
      const normalizedDate = normalizeDate(date);
      const formattedDate = normalizedDate.toISOString().split("T")[0];
      const token = Cookies.get("token");

      if (!token) throw new Error("No authentication token found");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/metrics/weekly?date=${formattedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to fetch weekly data");
      }

      const data = await response.json();
      setWeeklyData(data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch weekly data:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyData(selectedDate);
  }, [selectedDate]);

  const hasNoData =
    weeklyData &&
    Object.values(weeklyData).every(
      (dayData) =>
        dayData.tradesTaken === 0 &&
        dayData.rulesFollowed === 0 &&
        dayData.rulesUnfollowed === 0 &&
        dayData.totalProfitLoss === 0 &&
        dayData.winTrades === 0 &&
        dayData.lossTrades === 0
    );

  if (isLoading) return <div>Loading weekly performance...</div>;
  if (error) return <div>Error loading weekly data: {error}</div>;
  if (!weeklyData || hasNoData) return <NoDataComponent />;

  const processedData = days.map((day, index) => {
    const date = weeklyData ? Object.keys(weeklyData)[index] : null;
    const dayData = weeklyData?.[date] || {};
    return {
      day,
      tradesTaken: dayData.tradesTaken || 0,
      winTrade: dayData.winTrades || 0,
      lossTrade: dayData.lossTrades || 0,
      profitLoss: dayData.totalProfitLoss || 0,
      rulesFollowed: dayData.rulesFollowed || 0,
      rulesBroken: dayData.rulesUnfollowed || 0,
    };
  });


  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl">
      <Card className={chartConfig.className}>
        <CardHeader className="py-2 px-4">
          <CardTitle className="text-sm font-medium flex items-center gap-1">
            Trades Taken
            <CardDescription className="text-xs font-light">
              (Daily limit: {tradesPerDay})
            </CardDescription>
          </CardTitle>
        </CardHeader>
        <CardContent className={`p-0 ${chartConfig.containerHeight}`}>
          <ChartContainer
          className="h-32 w-full"
            config={{
              trades: { label: "Trades", color: "var(--primary)" },
            }}
          >
            <ResponsiveContainer>
              <LineChart data={processedData} margin={chartConfig.margin}>
                <CartesianGrid
                  vertical={false}
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                />
                <XAxis className="text-xs"
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis className="text-xs" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="linear"
                  dataKey="tradesTaken"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ fill: "var(--primary)", r: 2 }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className={chartConfig.className}>
        <CardHeader className="py-2 px-4 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          <CustomLegend
            items={[
              { label: "Win", color: "#0ED991" },
              { label: "Loss", color: "#F44C60" },
            ]}
          />
        </CardHeader>
        <CardContent className={`p-0 ${chartConfig.containerHeight}`}>
          <ChartContainer
          className="h-32 w-full"
            config={{
              win: { label: "Win", color: "#0ED991" },
              loss: { label: "Loss", color: "#F44C60" },
            }}
          >
            <ResponsiveContainer className="h-[400px]">
              <BarChart data={processedData} margin={chartConfig.margin}>
                <CartesianGrid
                  vertical={false}
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                />
                <XAxis className="text-xs"
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis className="text-xs" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="winTrade"
                  stackId="winLoss"
                  fill="#0ED991"
                  barSize={16}
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="lossTrade"
                  stackId="winLoss"
                  fill="#F44C60"
                  barSize={16}
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className={chartConfig.className}>
        <CardHeader className="py-2 px-4">
          <CardTitle className="text-sm font-medium">Profit & Loss</CardTitle>
        </CardHeader>
        <CardContent className={`p-0 ${chartConfig.containerHeight}`}>
          <ChartContainer
          className="h-32 w-full"
            config={{
              amount: { label: "Amount", color: "var(--primary)" },
            }}
          >
            <ResponsiveContainer className="h-[400px]">
              <LineChart data={processedData} margin={chartConfig.margin}>
                <CartesianGrid
                  vertical={false}
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                />
                <XAxis className="text-xs"
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis className="text-xs"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) =>
                    value >= 0
                      ? `+${(value / 1000).toFixed(0)}K`
                      : `${(value / 1000).toFixed(0)}K`
                  }
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) =>
                        value >= 0
                          ? `+${(value / 1000).toFixed(1)}K`
                          : `${(value / 1000).toFixed(1)}K`
                      }
                    />
                  }
                />
                <Line
                  type="linear"
                  dataKey="profitLoss"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ fill: "var(--primary)", r: 2 }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className={chartConfig.className}>
        <CardHeader className="py-2 px-4 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">Rules</CardTitle>
          <CustomLegend
            items={[
              { label: "Followed", color: "#0ED991" },
              { label: "Broken", color: "#F44C60" },
            ]}
          />
        </CardHeader>
        <CardContent className={`p-0 ${chartConfig.containerHeight}`}>
          <ChartContainer
          className="h-32 w-full"
            config={{
              followed: { label: "Followed", color: "#0ED991" },
              broken: { label: "Broken", color: "#F44C60" },
            }}
          >
            <ResponsiveContainer className="h-[400px]">
              <BarChart data={processedData} margin={chartConfig.margin}>
                <CartesianGrid
                  vertical={false}
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                />
                <XAxis className="text-xs"
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis className="text-xs" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="rulesFollowed"
                  stackId="ruleStatus"
                  fill="#0ED991"
                  barSize={16}
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="rulesBroken"
                  stackId="ruleStatus"
                  fill="#F44C60"
                  barSize={16}
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
