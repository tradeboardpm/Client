"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchApData } from "@/utils/ap-api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

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

const LEVELS = [
  { name: "Pearl", threshold: 250 },
  { name: "Aquamarine", threshold: 500 },
  { name: "Topaz", threshold: 750 },
  { name: "Opal", threshold: 1000 },
  { name: "Sapphire", threshold: 1250 },
  { name: "Emerald", threshold: 1500 },
  { name: "Ruby", threshold: 1750 },
  { name: "Diamond", threshold: 2000 },
];

function ApDataInner() {
  const [isLoading, setIsLoading] = useState(true);
  const [sharedData, setSharedData] = useState(null);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      fetchApData(token)
        .then((data) => {
          setSharedData(data);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!sharedData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardContent>
              Unable to fetch shared data. Please try again later.
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Transform detailed data into chart-friendly format
  const chartData = Object.entries(sharedData.detailed).map(([date, data]) => ({
    date: new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    ...data,
  }));
    
    const determineUpcomingLevel = (currentPoints) => {
      for (const level of LEVELS) {
        if (currentPoints < level.threshold) {
          return level.name;
        }
      }
      return "Diamond"; // If points exceed the highest threshold
    };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-4">
        <h1 className="text-xl font-semibold ">Welcome {sharedData.apName},</h1>
        <h1 className="text-xl font-semibold ">
          You are viewing the monthly progress of {sharedData.userName}
        </h1>
        <p>
          Shared with you since:{" "}
          {new Date(sharedData.dataSentAt).toLocaleString()}
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-xl">Performance</CardTitle>
          <p className="text-lg font-semibold rounded-lg border-2 text-primary py-1 px-2 w-fit">
            Capital: ₹ {sharedData.overall.capital?.toFixed(2) ?? "N/A"}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row gap-6 w-full">
            {/* Trades Taken Chart */}
            <Card className="shadow-lg flex-1 bg-accent/40">
              <CardHeader className="p-4 flex flex-col justify-between">
                <CardTitle className="text-base font-semibold p-0">
                  Trades Taken
                </CardTitle>

                <CardDescription className="p-0 text-xs">
                  Daily trade count
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
                  <ResponsiveContainer>
                    <LineChart
                      data={chartData}
                      margin={{ top: 20, right: 20, bottom: 10, left: 0 }}
                    >
                      <CartesianGrid
                        vertical={false}
                        stroke="hsl(var(--border))"
                        strokeDasharray="3 3"
                      />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={12}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={12}
                      />
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
            <Card className="shadow-lg flex-1 bg-accent/40">
              <CardHeader className="p-4 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  Win Rate
                </CardTitle>
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
                  <ResponsiveContainer>
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 20, bottom: 10, left: 0 }}
                      stackOffset="sign"
                    >
                      <CartesianGrid
                        vertical={false}
                        stroke="hsl(var(--border))"
                        strokeDasharray="3 3"
                      />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={12}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={12}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="winTrades"
                        stackId="a"
                        fill="hsl(var(--chart-1))"
                        barSize={20}
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="lossTrades"
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
            <Card className="shadow-lg flex-1 bg-accent/40">
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
                  <ResponsiveContainer>
                    <LineChart
                      data={chartData}
                      margin={{ top: 20, right: 20, bottom: 10, left: 0 }}
                    >
                      <CartesianGrid
                        vertical={false}
                        stroke="hsl(var(--border))"
                        strokeDasharray="3 3"
                      />
                      <XAxis
                        dataKey="date"
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
                        dataKey="totalProfitLoss"
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
            <Card className="shadow-lg flex-1 bg-accent/40">
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
                  <ResponsiveContainer>
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 20, bottom: 10, left: 0 }}
                      stackOffset="sign"
                    >
                      <CartesianGrid
                        vertical={false}
                        stroke="hsl(var(--border))"
                        strokeDasharray="3 3"
                      />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={12}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={12}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="rulesFollowed"
                        stackId="a"
                        fill="hsl(var(--chart-1))"
                        barSize={20}
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="rulesUnfollowed"
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-xl">Journaling Trends</CardTitle>
          <p className="text-lg font-semibold rounded-lg border-2 text-primary py-1 px-2 w-fit flex items-center gap-2">
            <span>
              Upcoming Level:{" "}
              {determineUpcomingLevel(sharedData.overall.currentPoints)}
            </span>
            <Separator className="h-6" orientation="vertical" />
            <span>
              Current Points: {sharedData.overall.currentPoints ?? "N/A"}
            </span>
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>On Profitable Days</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between">
                <p>
                  Rules you followed: <br />
                  <span className="text-green-600 font-semibold text-lg">
                    {sharedData.overall.profitLossSummary.profit_days.avgRulesFollowed.toFixed(
                      2
                    )}
                    %
                  </span>
                </p>
                <p>
                  Words Journaled: <br />
                  <span className="text-green-600 font-semibold text-lg">
                    {sharedData.overall.profitLossSummary.profit_days.avgWordsJournaled.toFixed(
                      2
                    )}
                  </span>
                </p>
                <p>
                  Trades taken: <br />
                  <span className="text-green-600 font-semibold text-lg">
                    {sharedData.overall.profitLossSummary.profit_days.avgTradesTaken.toFixed(
                      2
                    )}
                  </span>
                </p>
                <p>
                  Win rate: <br />
                  <span className="text-green-600 font-semibold text-lg">
                    {sharedData.overall.profitLossSummary.profit_days.winRate.toFixed(
                      2
                    )}
                    %
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>On Loss Making Days</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between">
                <p>
                  Rules you followed: <br />
                  <span className="text-red-600 font-semibold text-lg">
                    {sharedData.overall.profitLossSummary.loss_days.avgRulesFollowed.toFixed(
                      2
                    )}
                    %
                  </span>
                </p>
                <p>
                  Words Journaled: <br />
                  <span className="text-red-600 font-semibold text-lg">
                    {" "}
                    {sharedData.overall.profitLossSummary.loss_days.avgWordsJournaled.toFixed(
                      2
                    )}
                  </span>
                </p>
                <p>
                  Trades taken: <br />
                  <span className="text-red-600 font-semibold text-lg">
                    {sharedData.overall.profitLossSummary.loss_days.avgTradesTaken.toFixed(
                      2
                    )}
                  </span>
                </p>
                <p>
                  Win rate: <br />
                  <span className="text-red-600 font-semibold text-lg">
                    {sharedData.overall.profitLossSummary.loss_days.winRate.toFixed(
                      2
                    )}
                    %
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>On Break-Even Days</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between">
                <p>
                  Rules you followed: <br />
                  <span className="text-blue-600 font-semibold text-lg">
                    {sharedData.overall.profitLossSummary.breakEven_days.avgRulesFollowed.toFixed(
                      2
                    )}
                    %
                  </span>
                </p>
                <p>
                  Words Journaled: <br />
                  <span className="text-blue-600 font-semibold text-lg">
                    {sharedData.overall.profitLossSummary.breakEven_days.avgWordsJournaled.toFixed(
                      2
                    )}
                  </span>
                </p>
                <p>
                  Trades taken: <br />
                  <span className="text-blue-600 font-semibold text-lg">
                    {sharedData.overall.profitLossSummary.breakEven_days.avgTradesTaken.toFixed(
                      2
                    )}
                  </span>
                </p>
                <p>
                  Win rate: <br />
                  <span className="text-blue-600 font-semibold text-lg">
                    {sharedData.overall.profitLossSummary.breakEven_days.winRate.toFixed(
                      2
                    )}
                    %
                  </span>
                </p>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:bg-gray-100 flex-1">
                    <CardHeader>
                      <CardTitle>Top Followed Rules</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="flex flex-col">
                        <span className="text-sm">
                          {sharedData.overall.topFollowedRules[0]?.rule}
                        </span>
                        <span className="text-sm">
                          <span className="text-xl text-green-600 font-semibold">
                            {
                              sharedData.overall.topFollowedRules[0]
                                ?.followedCount
                            }
                          </span>{" "}
                          times followed
                        </span>
                      </p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>All Followed Rules</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    {sharedData.overall.topFollowedRules.map((rule, index) => (
                      <p key={index}>
                        {rule.rule}: {rule.followedCount}
                      </p>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:bg-gray-100 flex-1">
                    <CardHeader>
                      <CardTitle>Top Unfollowed Rules</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="flex flex-col">
                        <span className="text-sm">
                          {sharedData.overall.topUnfollowedRules[0]?.rule}
                        </span>
                        <span className="text-sm">
                          <span className="text-xl text-red-600 font-semibold">
                            {
                              sharedData.overall.topUnfollowedRules[0]
                                ?.unfollowedCount
                            }
                          </span>{" "}
                          times un-followed
                        </span>
                      </p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>All Unfollowed Rules</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    {sharedData.overall.topUnfollowedRules.map(
                      (rule, index) => (
                        <p key={index}>
                          {rule.rule}: {rule.unfollowedCount}
                        </p>
                      )
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ApData() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <ApDataInner />
    </Suspense>
  );
}