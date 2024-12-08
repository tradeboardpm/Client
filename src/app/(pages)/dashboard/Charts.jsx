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

export function WeeklyCharts({
  selectedDate = new Date(),
  tradesPerDay = 10,
  weeklyDataOverride = null,
}) {
  const [weeklyData, setWeeklyData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Normalize the date input to a valid Date object
  const normalizeDate = (date) => {
    if (date instanceof Date) return date;

    // Handle string inputs (ISO format or other parseable formats)
    const parsedDate =
      typeof date === "string" ? parseISO(date) : new Date(date);

    return isValid(parsedDate) ? parsedDate : new Date();
  };

  const fetchWeeklyData = async (date) => {
    setIsLoading(true);
    setError(null);

    // If weeklyDataOverride is provided, use it directly
    if (weeklyDataOverride) {
      setWeeklyData(weeklyDataOverride);
      setIsLoading(false);
      return weeklyDataOverride;
    }

    try {
      // Normalize the date and use toISOString
      const normalizedDate = normalizeDate(date);
      const formattedDate = normalizedDate.toISOString().split("T")[0];
      const token = Cookies.get("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `http://localhost:5000/api/metrics/weekly?date=${formattedDate}`,
        {
          method: "GET",
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

  // Process data for charts
  const processedData = days.map((day, index) => {
    const date = weeklyData ? Object.keys(weeklyData)[index] : null;
    const dayData = weeklyData?.[date] || {};
    return {
      day,
      tradesTaken: dayData.tradesTaken || 0,
      win: dayData.winTrades || 0,
      loss: dayData.lossTrades || 0,
      profitLoss: dayData.totalProfitLoss || 0,
      rulesFollowed: dayData.rulesFollowed || 0,
      rulesBroken: dayData.rulesUnfollowed || 0,
    };
  });

  // Render loading or error state
  if (isLoading) {
    return <div>Loading weekly performance...</div>;
  }

  if (error) {
    return <div>Error loading weekly data: {error}</div>;
  }

  if (!weeklyData) {
    return <div>No weekly data available</div>;
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl">
      {/* Trades Taken Chart */}
      <Card className="shadow-lg">
        <CardHeader className="p-4 flex flex-col justify-between">
          <CardTitle className="text-base font-semibold p-0">
            Trades Taken
          </CardTitle>
          <CardDescription className="p-0 text-xs">
            Daily trade count (limit: {tradesPerDay})
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ChartContainer
            config={{
              trades: {
                label: "Trades",
                color: "hsl(var(--primary))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={processedData}
                margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="hsl(var(--border))"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="tradesTaken"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Win Rate Chart */}
      <Card className="shadow-lg">
        <CardHeader className="p-4 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">Win Rate</CardTitle>
          <CustomLegend
            items={[
              { label: "Win", color: "hsl(var(--chart-1))" },
              { label: "Loss", color: "hsl(var(--destructive))" },
            ]}
          />
        </CardHeader>
        <CardContent className="p-0">
          <ChartContainer
            config={{
              win: {
                label: "Win",
                color: "hsl(var(--chart-1))",
              },
              loss: {
                label: "Loss",
                color: "hsl(var(--destructive))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={processedData}
                margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
                stackOffset="sign"
              >
                <CartesianGrid
                  vertical={false}
                  stroke="hsl(var(--border))"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="win"
                  stackId="a"
                  fill="hsl(var(--chart-1))"
                  barSize={20}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="loss"
                  stackId="a"
                  fill="hsl(var(--destructive))"
                  barSize={20}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Profit & Loss Chart */}
      <Card className="shadow-lg">
        <CardHeader className="p-4 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Profit & Loss
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ChartContainer
            config={{
              amount: {
                label: "Amount",
                color: "hsl(var(--primary))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={processedData}
                margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="hsl(var(--border))"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
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
                  type="monotone"
                  dataKey="profitLoss"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Rules Chart */}
      <Card className="shadow-lg">
        <CardHeader className="p-4 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">Rules</CardTitle>
          <CustomLegend
            items={[
              { label: "Followed", color: "hsl(var(--chart-1))" },
              { label: "Broken", color: "hsl(var(--destructive))" },
            ]}
          />
        </CardHeader>
        <CardContent className="p-0">
          <ChartContainer
            config={{
              followed: {
                label: "Followed",
                color: "hsl(var(--chart-1))",
              },
              broken: {
                label: "Broken",
                color: "hsl(var(--destructive))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={processedData}
                margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
                stackOffset="sign"
              >
                <CartesianGrid
                  vertical={false}
                  stroke="hsl(var(--border))"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="rulesFollowed"
                  stackId="a"
                  fill="hsl(var(--chart-1))"
                  barSize={20}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="rulesBroken"
                  stackId="a"
                  fill="hsl(var(--destructive))"
                  barSize={20}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
