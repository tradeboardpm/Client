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
  ComposedChart,
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
  <div className="flex flex-col items-center justify-start p-8 text-center min-h-screen h-full">
    <img src="/images/no_charts.svg" alt="No Data" className="mb-4 w-42 h-42" />
    <h2 className="text-xl font-semibold mb-2">No Data</h2>
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

    if (!isValid(normalizedDate)) {
      return new Date();
    }

    return new Date(
      Date.UTC(
        normalizedDate.getFullYear(),
        normalizedDate.getMonth(),
        normalizedDate.getDate()
      )
    );
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

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/metrics/weekly?date=${formattedDate}`,
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

  if (isLoading) {
    return <div>Loading weekly performance...</div>;
  }

  if (error) {
    return <div>Error loading weekly data: {error}</div>;
  }

  if (!weeklyData || hasNoData) {
    return <NoDataComponent />;
  }

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
    <div className="flex flex-col gap-6 w-full max-w-4xl">
      {/* Previous Trades Taken Chart remains unchanged */}
      <Card className="shadow-lg bg-[#FAF7FF] dark:bg-[#363637]">
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
                  type="linear"
                  dataKey="tradesTaken"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Updated Win Rate Chart with Stacked Bars */}
      <Card className="shadow-lg bg-[#FAF7FF] dark:bg-[#363637]">
        <CardHeader className="p-4 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">Win Rate</CardTitle>
          <CustomLegend
            items={[
              { label: "Win", color: "#0ED991" },
              { label: "Loss", color: "#F44C60" },
            ]}
          />
        </CardHeader>
        <CardContent className="p-0">
          <ChartContainer
            config={{
              win: {
                label: "Win",
                color: "#0ED991",
              },
              loss: {
                label: "Loss",
                color: "#F44C60",
              },
            }}
          >
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
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
                <Bar
                  dataKey="winTrade"
                  stackId="winLoss"
                  fill="#0ED991"
                  barSize={20}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="lossTrade"
                  stackId="winLoss"
                  fill="#F44C60"
                  barSize={20}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Previous Profit & Loss Chart remains unchanged */}
      <Card className="shadow-lg bg-[#FAF7FF] dark:bg-[#363637]">
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
                  type="linear"
                  dataKey="profitLoss"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Updated Rules Chart with Stacked Bars */}
      <Card className="shadow-lg bg-[#FAF7FF] dark:bg-[#363637]">
        <CardHeader className="p-4 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">Rules</CardTitle>
          <CustomLegend
            items={[
              { label: "Followed", color: "#0ED991" },
              { label: "Broken", color: "#F44C60" },
            ]}
          />
        </CardHeader>
        <CardContent className="p-0">
          <ChartContainer
            config={{
              followed: {
                label: "Followed",
                color: "#0ED991",
              },
              broken: {
                label: "Broken",
                color: "#F44C60 ",
              },
            }}
          >
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
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
                <Bar
                  dataKey="rulesFollowed"
                  stackId="ruleStatus"
                  fill="#0ED991"
                  barSize={20}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="rulesBroken"
                  stackId="ruleStatus"
                  fill="#F44C60"
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
