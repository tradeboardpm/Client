"use client";

import { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  LineChart,
  BarChart,
  AreaChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ChevronsLeft,
  ChevronsRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function JournalPage({ params }) {
  const router = useRouter();
  const [journalData, setJournalData] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date(params.date));
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSidebarExpanded(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = Cookies.get("token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const [journalResponse, statsResponse] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/journal/${format(
              currentDate,
              "yyyy-MM-dd"
            )}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/journal/weekly-stats/${format(
              currentDate,
              "yyyy-MM-dd"
            )}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        if (!journalResponse.ok || !statsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [journalResult, statsResult] = await Promise.all([
          journalResponse.json(),
          statsResponse.json(),
        ]);

        setJournalData(journalResult);
        setWeeklyStats(statsResult);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error instanceof Error ? error.message : String(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentDate]);

  const changeDate = (increment) => {
    const newDate = addDays(currentDate, increment);
    setCurrentDate(newDate);
    router.push(`/my-journal/${format(newDate, "yyyy-MM-dd")}`);
  };

  const prepareChartData = () => {
    if (!weeklyStats) return [];

    return Object.entries(weeklyStats).map(([date, stats]) => ({
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
    }));
  };

  const chartData = prepareChartData();

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

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">Error: {error}</div>;
  }

  return (
    <main className="flex h-full">
      <div className="flex-1 p-6 ">
        <div className="mb-6 flex items-center">
          <Button
            variant="ghost"
            className="mr-4"
            onClick={() => router.push("/my-journal")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="primary_gradient rounded-xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-background">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => changeDate(-1)}
              >
                <ChevronsLeft />
              </Button>
              <p className="bg-accent/40 text-xl text-background px-2 py-1 rounded-lg">
                {format(currentDate, "EEEE, d MMMM yyyy")}
              </p>
              <Button variant="ghost" size="icon" onClick={() => changeDate(1)}>
                <ChevronsRight />
              </Button>
            </div>
          </div>
        </div>

        {journalData && (
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4 min-h-[60vh]">
              <Card className="flex-1 h-full">
                <CardHeader>
                  <CardTitle>Journal Entry</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="notes"
                        className="block text-sm font-medium mb-1"
                      >
                        Notes
                      </label>
                      <Textarea
                        id="notes"
                        value={journalData.journal.notes}
                        readOnly
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="mistakes"
                        className="block text-sm font-medium mb-1"
                      >
                        Mistakes
                      </label>
                      <Textarea
                        id="mistakes"
                        value={journalData.journal.mistakes}
                        readOnly
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lessons"
                        className="block text-sm font-medium mb-1"
                      >
                        Lessons
                      </label>
                      <Textarea
                        id="lessons"
                        value={journalData.journal.lessons}
                        readOnly
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {" "}
                  <div className="flex gap-2 items-center">
                    {journalData.journal.attachments.map((attachment) => (
                      <div
                        key={attachment}
                        className="relative w-20 rounded-lg border shadow-md "
                      >
                        <img
                          src={`https://tradeboardjournals.s3.ap-south-1.amazonaws.com/${attachment}`}
                          alt="attachment"
                          className="h-10 w-full object-fill rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </CardFooter>
              </Card>

              <Card className="flex-1 h-full">
                <CardHeader>
                  <CardTitle>Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rule</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {journalData.allRules.map((rule) => (
                        <TableRow key={rule._id}>
                          <TableCell>{rule.content}</TableCell>
                          <TableCell>{rule.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {journalData.trades.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Trades</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Instrument</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total Charges</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {journalData.trades.map((trade) => (
                        <TableRow key={trade._id}>
                          <TableCell>{trade.instrumentName}</TableCell>
                          <TableCell>{trade.action}</TableCell>
                          <TableCell>{trade.quantity}</TableCell>
                          <TableCell>{trade.price}</TableCell>
                          <TableCell>{trade.totalCharges}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {!isMobile && (
        <div
          className={`relative h-fit p-4 space-y-6 transition-all duration-300 ease-in-out ${
            isSidebarExpanded
              ? "w-80 border-l bg-popover"
              : "w-12 border-0 bg-none"
          }`}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-1"
            onClick={toggleSidebar}
          >
            {isSidebarExpanded ? <ChevronRight /> : <ChevronLeft />}
          </Button>
          {isSidebarExpanded && (
            <div className="space-y-4">
              <Card className="p-0 w-full">
                <CardHeader className="p-2">
                  <CardTitle>Trades Taken</CardTitle>
                  <CardDescription>Daily trade count</CardDescription>
                </CardHeader>
                <CardContent className="p-2">
                  <ChartContainer config={chartConfig} className="h-[150px]">
                    <LineChart data={chartData}>
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
              </Card>

              <Card className="p-0 w-full">
                <CardHeader className="p-2">
                  <CardTitle>Win Rate</CardTitle>
                  <CardDescription>Wins vs Losses</CardDescription>
                </CardHeader>
                <CardContent className="p-2">
                  <ChartContainer config={chartConfig} className="h-[150px]">
                    <BarChart data={chartData}>
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
              </Card>

              <Card className="p-0 w-full">
                <CardHeader className="p-2">
                  <CardTitle>Profit & Loss</CardTitle>
                  <CardDescription>Daily P&L</CardDescription>
                </CardHeader>
                <CardContent className="p-2">
                  <ChartContainer config={chartConfig} className="h-[150px]">
                    <AreaChart data={chartData}>
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
              </Card>

              <Card className="p-0 w-full">
                <CardHeader className="p-2">
                  <CardTitle>Rules Adherence</CardTitle>
                  <CardDescription>Followed vs Broken</CardDescription>
                </CardHeader>
                <CardContent className="p-2">
                  <ChartContainer config={chartConfig} className="h-[150px]">
                    <BarChart data={chartData}>
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
              </Card>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
