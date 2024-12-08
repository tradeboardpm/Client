"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subWeeks,
  subMonths,
} from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ArrowUpRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import JournalCard from "@/components/cards/JournalCard";

const FilterPopover = ({ title, min, max, value, onChange }) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" className="w-[150px]">
        {title}
      </Button>
    </PopoverTrigger>
    <PopoverContent
      className="w-80"
      onInteractOutside={(e) => e.preventDefault()}
    >
      <div className="space-y-4">
        <h4 className="font-medium leading-none">{title}</h4>
        <div className="flex flex-col gap-4">
          <Slider
            min={min}
            max={max}
            step={1}
            value={value}
            onValueChange={onChange}
          />
          <div className="flex justify-between">
            <span>{value[0]}</span>
            <span>{value[1]}</span>
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
);

const StatCard = ({ title, stats, colorClass }) => (
  <Card className="w-full h-full border border-foreground/15">
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Rules Followed</p>
          <p className={`text-xl font-bold ${colorClass}`}>
            {stats.avgRulesFollowed.toFixed(2)}%
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Words Journaled</p>
          <p className={`text-xl font-bold ${colorClass}`}>
            {stats.avgWordsJournaled.toFixed(0)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Trades Taken</p>
          <p className={`text-xl font-bold ${colorClass}`}>
            {stats.avgTradesTaken.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Win Rate</p>
          <p className={`text-xl font-bold ${colorClass}`}>
            {stats.winRate.toFixed(2)}%
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const RuleCard = ({ title, rules, className }) => (
  <Card
    className={`${className} cursor-pointer h-full p-0 border border-foreground/15`}
  >
    <CardHeader className="p-2 px-3">
      <div className="flex justify-between items-center">
        <CardTitle>{title}</CardTitle>
        <span className="flex items-center justify-center rounded-full border border-foreground/15 p-1">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">{rules[0]?.rule}</p>
      <p className="mt-2">
        <span
          className={`text-2xl font-bold ${
            rules[0]?.unfollowedCount ? "text-red-400" : "text-green-400"
          }`}
        >
          {rules[0]?.unfollowedCount || rules[0]?.followedCount}
        </span>{" "}
        <span className="text-sm text-muted-foreground">times this period</span>
      </p>
    </CardContent>
  </Card>
);


export default function EnhancedMetricsDashboard() {
  const [period, setPeriod] = useState("thisWeek");
  const [metricsDateRange, setMetricsDateRange] = useState({
    from: null,
    to: null,
  });
  const [journalsDateRange, setJournalsDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [filters, setFilters] = useState({
    minWinRate: 0,
    maxWinRate: 100,
    minTrades: 0,
    maxTrades: 50,
    minRulesFollowed: 0,
    maxRulesFollowed: 100,
  });
  const [metrics, setMetrics] = useState(null);
  const [monthlyJournals, setMonthlyJournals] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [period, metricsDateRange, journalsDateRange, filters]);

  const fetchData = async () => {
    const token = Cookies.get("token");

    if (!token) {
      setError("No authentication token found");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let metricsFromDate, metricsToDate;

      switch (period) {
        case "thisWeek":
          metricsFromDate = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
          metricsToDate = endOfWeek(new Date(), { weekStartsOn: 1 }); // Sunday
          break;
        case "lastWeek":
          metricsFromDate = startOfWeek(subWeeks(new Date(), 1), {
            weekStartsOn: 1,
          });
          metricsToDate = endOfWeek(subWeeks(new Date(), 1), {
            weekStartsOn: 1,
          });
          break;
        case "thisMonth":
          metricsFromDate = startOfMonth(new Date());
          metricsToDate = endOfMonth(new Date());
          break;
        case "lastMonth":
          metricsFromDate = startOfMonth(subMonths(new Date(), 1));
          metricsToDate = endOfMonth(subMonths(new Date(), 1));
          break;
        case "customRange":
          metricsFromDate = metricsDateRange.from || new Date();
          metricsToDate = metricsDateRange.to || new Date();
          break;
      }

      const [metricsResponse, journalsResponse] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/metrics/date-range`, {
          params: {
            startDate: metricsFromDate.toISOString(),
            endDate: metricsToDate.toISOString(),
            ...filters,
          },
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/journals/filters`, {
          params: {
            startDate:
              journalsDateRange.from?.toISOString() ||
              startOfMonth(new Date()).toISOString(),
            endDate:
              journalsDateRange.to?.toISOString() ||
              endOfMonth(new Date()).toISOString(),
            ...filters,
          },
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setMetrics(metricsResponse.data);
      setMonthlyJournals(journalsResponse.data);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex flex-col p-6 gap-6">
      <div className="bg-popover p-4 rounded-xl">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold mb-4">Tradeboard Intelligence</h1>

          <div className="flex flex-wrap gap-4 mb-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thisWeek">This Week</SelectItem>
                <SelectItem value="lastWeek">Last Week</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="customRange">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            {period === "customRange" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !metricsDateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {metricsDateRange.from ? (
                      metricsDateRange.to ? (
                        <>
                          {format(metricsDateRange.from, "LLL dd, y")} -{" "}
                          {format(metricsDateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(metricsDateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={metricsDateRange.from}
                    selected={metricsDateRange}
                    onSelect={(range) => {
                      setMetricsDateRange(range || { from: null, to: null });
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            {error}
          </div>
        )}

        {metrics && (
          <div className="flex gap-6">
            <div className="flex flex-col gap-6 flex-1">
              <StatCard
                title="Profit Days"
                stats={metrics.profit_days}
                colorClass="text-green-500"
              />

              <StatCard
                title="Break Even Days"
                stats={metrics.breakEven_days}
                colorClass="text-blue-500"
              />
            </div>

            <div className="flex flex-col gap-6 flex-1 items-center justify-center">
              <StatCard
                title="Loss Days"
                stats={metrics.loss_days}
                colorClass="text-red-500"
              />
              <div className="grid md:grid-cols-2 gap-6">
                <RuleCard
                  title="Top Followed Rules"
                  rules={metrics.topFollowedRules}
                />
                <RuleCard
                  title="Top Unfollowed Rules"
                  rules={metrics.topUnfollowedRules}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-popover p-4 rounded-xl">
        {monthlyJournals && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Journal Analysis</h2>

              <div className="flex flex-wrap gap-4 mb-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !journalsDateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {journalsDateRange.from ? (
                        journalsDateRange.to ? (
                          <>
                            {format(journalsDateRange.from, "LLL dd, y")} -{" "}
                            {format(journalsDateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(journalsDateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={journalsDateRange.from}
                      selected={journalsDateRange}
                      onSelect={(range) => {
                        setJournalsDateRange(range || { from: null, to: null });
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>

                <FilterPopover
                  title="Win Rate"
                  min={0}
                  max={100}
                  value={[filters.minWinRate, filters.maxWinRate]}
                  onChange={([min, max]) =>
                    setFilters((prev) => ({
                      ...prev,
                      minWinRate: min,
                      maxWinRate: max,
                    }))
                  }
                />
                <FilterPopover
                  title="Trades"
                  min={0}
                  max={50}
                  value={[filters.minTrades, filters.maxTrades]}
                  onChange={([min, max]) =>
                    setFilters((prev) => ({
                      ...prev,
                      minTrades: min,
                      maxTrades: max,
                    }))
                  }
                />
                <FilterPopover
                  title="Rules Followed"
                  min={0}
                  max={100}
                  value={[filters.minRulesFollowed, filters.maxRulesFollowed]}
                  onChange={([min, max]) =>
                    setFilters((prev) => ({
                      ...prev,
                      minRulesFollowed: min,
                      maxRulesFollowed: max,
                    }))
                  }
                />
              </div>
            </div>

            {Object.keys(monthlyJournals).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(monthlyJournals).map(([date, journal]) => (
                  <JournalCard
                    key={date}
                    date={date}
                    note={journal.note}
                    mistake={journal.mistake}
                    lesson={journal.lesson}
                    rulesFollowedPercentage={journal.rulesFollowedPercentage}
                    winRate={journal.winRate}
                    profit={journal.profit}
                    tradesTaken={journal.tradesTaken}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                No journal entries for this period
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
