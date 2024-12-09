"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { CalendarIcon, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import JournalCard from "@/components/cards/JournalCard";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Tooltip } from "@/components/ui/tooltip";
import { Dialog, DialogHeader } from "@/components/ui/dialog";
import { DialogContent, DialogTrigger } from "@radix-ui/react-dialog";

const FilterPopover = ({
  title,
  min,
  max,
  value,
  onChange,
  open,
  onOpenChange,
}) => (
  <Popover open={open} onOpenChange={onOpenChange}>
    <PopoverTrigger asChild>
      <Button variant="outline" className="w-[150px]">
        {title}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-80">
      <div className="space-y-4">
        <h4 className="font-medium leading-none">{title}</h4>
        <div className="flex flex-col gap-4">
          <div className="relative pt-6">
            <SliderPrimitive.Root
              min={min}
              max={max}
              step={1}
              value={value}
              onValueChange={onChange}
              className="relative flex w-full touch-none select-none items-center"
            >
              <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
                <SliderPrimitive.Range className="absolute h-full bg-primary" />
              </SliderPrimitive.Track>
              {value.map(
                (val, index) =>
                  val !== min &&
                  val !== max && (
                    <div
                      key={index}
                      className="absolute top-[-30px] transform -translate-x-1/2"
                      style={{ left: `${((val - min) / (max - min)) * 100}%` }}
                    >
                      <div className="bg-background border border-primary rounded px-2 py-1 text-xs">
                        {val}
                      </div>
                    </div>
                  )
              )}
              {value.map((val, index) => (
                <SliderPrimitive.Thumb
                  key={index}
                  className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                />
              ))}
            </SliderPrimitive.Root>
          </div>
          <div className="flex justify-between">
            <span>{min}</span>
            <span>{max}</span>
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
  const [openPopover, setOpenPopover] = useState(null);
  const popoverRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [period, metricsDateRange, journalsDateRange, filters]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setOpenPopover(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          metricsFromDate = startOfWeek(new Date(), { weekStartsOn: 1 });
          metricsToDate = endOfWeek(new Date(), { weekStartsOn: 1 });
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
      <div className="bg-card/75 shadow-md border border-border/50 p-4 rounded-xl">
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
            <div className="grid grid-cols-2 gap-4">
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

            <StatCard
              title="Loss Days"
              stats={metrics.loss_days}
              colorClass="text-red-500"
            />
            <div className="grid md:grid-cols-2 gap-4">
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
        )}
      </div>

      <div className="bg-card/75 shadow-md border border-border/50 p-4 rounded-xl min-h-[60vh]">
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
                        "font-normal",
                        !journalsDateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      date range
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

                <div ref={popoverRef} className="flex gap-4">
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
                    open={openPopover === "winRate"}
                    onOpenChange={(open) =>
                      setOpenPopover(open ? "winRate" : null)
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
                    open={openPopover === "trades"}
                    onOpenChange={(open) =>
                      setOpenPopover(open ? "trades" : null)
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
                    open={openPopover === "rulesFollowed"}
                    onOpenChange={(open) =>
                      setOpenPopover(open ? "rulesFollowed" : null)
                    }
                  />
                </div>
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
