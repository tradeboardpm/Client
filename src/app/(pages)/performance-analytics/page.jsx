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
import Image from "next/image";

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ArrowUpRight, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import JournalCard from "@/components/cards/JournalCard";
import * as SliderPrimitive from "@radix-ui/react-slider";

// Reusable components (FilterPopover, StatCard, RuleCard remain the same as in the previous code)
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
      <Button
        variant="outline"
        className="w-fit flex items-center gap-2 justify-between text-foreground h-8"
      >
        {title}
        <ChevronDown className="h-4 w-4 text-foreground/65" />
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
              {value.map((_, index) => (
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
        {[
          {
            label: "Rules Followed",
            value: stats.avgRulesFollowed,
            suffix: "%",
          },
          {
            label: "Words Journaled",
            value: stats.avgWordsJournaled,
            suffix: "",
          },
          { label: "Trades Taken", value: stats.avgTradesTaken, suffix: "" },
          { label: "Win Rate", value: stats.winRate, suffix: "%" },
        ].map(({ label, value, suffix }) => (
          <div key={label}>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className={`text-xl font-bold ${colorClass}`}>
              {value.toFixed(label === "Words Journaled" ? 0 : 2)}
              {suffix}
            </p>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const RuleCard = ({ title, rules, period, isTopFollowedRules = false }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCardClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <Card
        className={`cursor-pointer rounded-2xl h-full p-0 border border-foreground/15 
          hover:border-primary transition-colors duration-200 
          ${isDialogOpen ? "border-primary shadow-2xl" : ""}`}
        onClick={handleCardClick}
      >
        <CardHeader className="p-2 px-3">
          <div className="flex justify-between items-center">
            <CardTitle>{title}</CardTitle>
            <span
              className={`flex items-center justify-center rounded-full border border-foreground/15 p-1 
                hover:bg-primary hover:text-background 
                ${isDialogOpen ? "bg-primary text-background" : ""}`}
            >
              <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{rules[0]?.rule}</p>
          <p className="mt-2">
            <span
              className={`text-2xl font-bold ${
                isTopFollowedRules
                  ? "text-green-400"
                  : rules[0]?.count
                  ? "text-red-400"
                  : "text-green-400"
              }`}
            >
              {rules[0]?.count || 0}
            </span>{" "}
            <span className="text-xs text-foreground/35">
              times this {period}
            </span>
          </p>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>List of {title}</DialogTitle>
            <DialogDescription>
              Detailed breakdown of rules for this category
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2 py-4 overflow-auto h-[75vh]">
            {rules.map((ruleItem, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border rounded-lg hover:bg-secondary/30 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{ruleItem.rule}</p>
                </div>
                <div
                  className={`font-bold w-36 text-right ${
                    isTopFollowedRules
                      ? "text-green-500"
                      : ruleItem.count
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {ruleItem.count} times
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

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

  // Compute date range based on selected period
  const computeDateRange = () => {
    const periodMap = {
      thisWeek: () => ({
        from: startOfWeek(new Date(), { weekStartsOn: 1 }),
        to: endOfWeek(new Date(), { weekStartsOn: 1 }),
      }),
      lastWeek: () => ({
        from: startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
        to: endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
      }),
      thisMonth: () => ({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
      }),
      lastMonth: () => ({
        from: startOfMonth(subMonths(new Date(), 1)),
        to: endOfMonth(subMonths(new Date(), 1)),
      }),
      customRange: () => ({
        from: metricsDateRange.from || new Date(),
        to: metricsDateRange.to || new Date(),
      }),
    };

    return periodMap[period]();
  };

  const fetchData = async () => {
    const token = Cookies.get("token");
    if (!token) {
      setError("No authentication token found");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { from: startDate, to: endDate } = computeDateRange();

      const [metricsResponse, journalsResponse] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/metrics/date-range`, {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
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

      setMetrics(
        Object.keys(metricsResponse.data).length === 0
          ? null
          : metricsResponse.data
      );
      setMonthlyJournals(
        Object.keys(journalsResponse.data).length === 0
          ? null
          : journalsResponse.data
      );
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period, metricsDateRange, journalsDateRange, filters]);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setOpenPopover(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderDateRangeButton = (dateRange, placeholder) => {
    // Check if the date range matches the default month range
    const isDefaultRange =
      dateRange.from &&
      dateRange.to &&
      format(dateRange.from, "LLL y") ===
        format(startOfMonth(new Date()), "LLL y");

    return (
      <Button
        variant="outline"
        className={cn(
          "w-fit  text-left font-normal h-8 flex items-center justify-between gap-2",
          (!dateRange.from || isDefaultRange) && "text-foreground"
        )}
      >
        {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
        {dateRange.from && !isDefaultRange ? (
          dateRange.to ? (
            `${format(dateRange.from, "LLL dd, y")} - ${format(
              dateRange.to,
              "LLL dd, y"
            )}`
          ) : (
            format(dateRange.from, "LLL dd, y")
          )
        ) : (
          <span>{placeholder}</span>
        )}

        <ChevronDown className="h-4 w-4 text-foreground/65" />
      </Button>
    );
  };

  const clearAllFilters = () => {
    // Reset filters to default values
    setFilters({
      minWinRate: 0,
      maxWinRate: 100,
      minTrades: 0,
      maxTrades: 50,
      minRulesFollowed: 0,
      maxRulesFollowed: 100,
    });

    // Reset date ranges to default
    setJournalsDateRange({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    });

    // Close any open popovers
    setOpenPopover(null);
  };

  const hasActiveFilters = () => {
    return (
      filters.minWinRate !== 0 ||
      filters.maxWinRate !== 100 ||
      filters.minTrades !== 0 ||
      filters.maxTrades !== 50 ||
      filters.minRulesFollowed !== 0 ||
      filters.maxRulesFollowed !== 100 ||
      (journalsDateRange.from &&
        format(journalsDateRange.from, "LLL y") !==
          format(startOfMonth(new Date()), "LLL y"))
    );
  };

  return (
    <div className="bg-card">
      <div className="flex flex-col p-6 gap-6 bg-background rounded-t-xl">
        {/* Tradeboard Intelligence section (same as before) */}
        <div className="bg-card/75 shadow-md border border-border/50 p-4 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Tradeboard Intelligence</h1>

            <div className="flex flex-wrap gap-4">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "thisWeek",
                    "lastWeek",
                    "thisMonth",
                    "lastMonth",
                    "customRange",
                  ].map((periodOption) => (
                    <SelectItem key={periodOption} value={periodOption}>
                      {periodOption
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {period === "customRange" && (
                <Popover>
                  <PopoverTrigger asChild>
                    {renderDateRangeButton(
                      metricsDateRange,
                      "Pick a date range"
                    )}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={metricsDateRange.from}
                      selected={metricsDateRange}
                      onSelect={(range) =>
                        setMetricsDateRange(range || { from: null, to: null })
                      }
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

          {metrics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Profit Days",
                  key: "profit_days",
                  color: "text-green-500",
                },
                { title: "Loss Days", key: "loss_days", color: "text-red-500" },
                {
                  title: "Break Even Days",
                  key: "breakEven_days",
                  color: "text-blue-500",
                },
              ].map(({ title, key, color }) => (
                <StatCard
                  key={key}
                  title={title}
                  stats={metrics[key]}
                  colorClass={color}
                />
              ))}
              <div className="grid md:grid-cols-2 gap-6">
                <RuleCard
                  title="Your Most Followed Rules"
                  rules={metrics.topFollowedRules}
                  isTopFollowedRules={true}
                  period={period}
                />
                <RuleCard
                  title="Your Most Broken Rules"
                  rules={metrics.topUnfollowedRules}
                  period={period}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8">
              <Image
                src="/images/no_box.png"
                alt="No data"
                width={200}
                height={200}
              />
              <p className="mt-4 text-lg text-gray-500">
                No data available for Tradeboard Intelligence
              </p>
            </div>
          )}
        </div>

        {/* Journal Analysis section with new filter clearing functionality */}
        <div className="bg-card/75 shadow-md border border-border/50 p-4 rounded-xl min-h-[60vh]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Journal Analysis</h2>

            <div className="flex flex-wrap gap-4 items-center">
              <p className="font-semibold">Filter By: </p>

              <Popover>
                <PopoverTrigger asChild>
                  {renderDateRangeButton(journalsDateRange, "Date Range")}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={journalsDateRange.from}
                    selected={journalsDateRange}
                    onSelect={(range) =>
                      setJournalsDateRange(range || { from: null, to: null })
                    }
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>

              <div ref={popoverRef} className="flex gap-4 items-center">
                {[
                  {
                    title: "Win Rate",
                    min: 0,
                    max: 100,
                    valueKey: ["minWinRate", "maxWinRate"],
                  },
                  {
                    title: "Trades",
                    min: 0,
                    max: 50,
                    valueKey: ["minTrades", "maxTrades"],
                  },
                  {
                    title: "Rules Followed",
                    min: 0,
                    max: 100,
                    valueKey: ["minRulesFollowed", "maxRulesFollowed"],
                  },
                ].map(({ title, min, max, valueKey }) => (
                  <FilterPopover
                    key={title}
                    title={title}
                    min={min}
                    max={max}
                    value={[filters[valueKey[0]], filters[valueKey[1]]]}
                    onChange={([min, max]) =>
                      setFilters((prev) => ({
                        ...prev,
                        [valueKey[0]]: min,
                        [valueKey[1]]: max,
                      }))
                    }
                    open={
                      openPopover === title.replace(/\s/g, "").toLowerCase()
                    }
                    onOpenChange={(open) =>
                      setOpenPopover(
                        open ? title.replace(/\s/g, "").toLowerCase() : null
                      )
                    }
                  />
                ))}

                {/* New Clear Filters Button */}
                {hasActiveFilters() && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={clearAllFilters}
                    className="hover:bg-red-500/90"
                    title="Clear all filters"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          {monthlyJournals ? (
            <div className="mt-4">
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
                <div className="flex flex-col items-center justify-center p-8">
                  <Image
                    src="/images/no_box.png"
                    alt="No data"
                    width={200}
                    height={200}
                  />
                  <p className="mt-4 text-lg text-gray-500">
                    No journal entries for this period
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8">
              <Image
                src="/images/no_box.png"
                alt="No data"
                width={200}
                height={200}
              />
              <p className="mt-4 text-lg text-gray-500">
                No data available for Journal Analysis
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// export default EnhancedMetricsDashboard;
