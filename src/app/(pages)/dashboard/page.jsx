"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Image, PlusCircle, TrendingUp } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Sample data for the charts
const chartData = [
  { day: "Mon", tradesTaken: 1, win: 2, loss: 1, profitLoss: -20, rulesFollowed: 2, rulesBroken: 1 },
  { day: "Tue", tradesTaken: 2, win: 2, loss: 2, profitLoss: 30, rulesFollowed: 3, rulesBroken: 1 },
  { day: "Wed", tradesTaken: 4, win: 3, loss: 1, profitLoss: 50, rulesFollowed: 3, rulesBroken: 0 },
  { day: "Thu", tradesTaken: 3, win: 2, loss: 1, profitLoss: 40, rulesFollowed: 2, rulesBroken: 1 },
  { day: "Fri", tradesTaken: 2, win: 2, loss: 1, profitLoss: 20, rulesFollowed: 3, rulesBroken: 0 },
];

const tradesTakenConfig = {
  tradesTaken: {
    label: "Trades Taken",
    color: "hsl(var(--chart-1))",
  },
};

const winRateConfig = {
  win: {
    label: "Win",
    color: "hsl(var(--chart-1))",
  },
  loss: {
    label: "Loss",
    color: "hsl(var(--chart-2))",
  },
};

const profitLossConfig = {
  profitLoss: {
    label: "Profit & Loss",
    color: "hsl(var(--chart-1))",
  },
};

const rulesConfig = {
  rulesFollowed: {
    label: "Followed",
    color: "hsl(var(--chart-1))",
  },
  rulesBroken: {
    label: "Broken",
    color: "hsl(var(--chart-2))",
  },
};

function TradesTakenChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trades Taken</CardTitle>
        <CardDescription>Daily Trade limit: 4</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={tradesTakenConfig}>
          <LineChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis hide domain={[0, 4]} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              type="monotone"
              dataKey="tradesTaken"
              stroke="var(--color-tradesTaken)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-tradesTaken)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Average trades: 2.4 per day <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}

function WinRateChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Win Rate</CardTitle>
        <CardDescription>Wins vs Losses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={winRateConfig}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="win"
              stackId="a"
              fill="var(--color-win)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="loss"
              stackId="a"
              fill="var(--color-loss)"
              radius={[0, 0, 4, 4]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Win rate: 68.75% <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}

function ProfitLossChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit & Loss</CardTitle>
        <CardDescription>Daily P&L</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={profitLossConfig}>
          <LineChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              type="monotone"
              dataKey="profitLoss"
              stroke="var(--color-profitLoss)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-profitLoss)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total P&L: $120 <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}

function RulesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rules</CardTitle>
        <CardDescription>Followed vs Broken</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={rulesConfig}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
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
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Rules followed: 86.67% <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}

export default function Dashboard() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <MainLayout>
      <div className="flex h-full">
        <div
          className={`flex-1 p-6 overflow-auto ${
            isSidebarExpanded ? "md:mr-80" : "md:mr-12"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Welcome back, Json Taylor!</h2>
            <p className="text-xl">3:15 PM</p>
          </div>

          <Card className="bg-transparent border-none shadow-none mb-6">
            <CardHeader className="bg-gradient-to-b from-primary to-[#7886DD] rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div className="bg-accent/40 text-xl text-background px-2 py-1 rounded-lg">
                  <p>Monday, 31 May 2024</p>
                </div>
                <p className="text-background text-lg">Capital: ₹ 00</p>
              </div>
            </CardHeader>
            <CardContent className="p-0 bg-transparent mt-4">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Today's Journal */}
                <Card className="flex-1">
                  <CardHeader className="px-5 py-4">
                    <CardTitle className="text-lg font-semibold">
                      Today's Journal{" "}
                      <span className="text-sm font-light">(Saving)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Type your notes here..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="mistakes">Mistake</Label>
                      <Textarea
                        id="mistakes"
                        placeholder="Type your mistakes here..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="lessons">Lesson</Label>
                      <Textarea
                        id="lessons"
                        placeholder="Type your lessons here..."
                      />
                    </div>
                    <div className="flex w-full justify-end">
                      <Button variant="outline" className="text-primary">
                        <Image className="mr-2 h-4 w-4" />
                        Attach
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                {/* Rules */}
                <Card className="flex-1">
                  <CardHeader className="px-5 py-4">
                    <CardTitle className="text-lg font-semibold">
                      Rules
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <h4 className="text-xl font-semibold mb-2">
                        Get Started!
                      </h4>
                      <p className="text-gray-600 mb-4">
                        Please click below to add your trading rules
                      </p>
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Rules
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trade Log</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <h3 className="text-xl font-semibold mb-2">Get Started!</h3>
              <p className="text-gray-600 mb-4">
                Please add your trades here or import them automatically using
                your tradebook
              </p>
              <div className="space-x-4">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Trade
                </Button>
                <Button variant="outline">Import Trade</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        {!isMobile && (
          <div
            className={`fixed right-0 top-12 h-full bg-white p-4 space-y-6 border-l overflow-y-auto transition-all duration-300 ease-in-out ${
              isSidebarExpanded ? "w-80" : "w-12"
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
              <>
                <div className="mt-12">
                  <Calendar />
                </div>
                <TradesTakenChart />
                <WinRateChart />
                <ProfitLossChart />
                <RulesChart />
              </>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}