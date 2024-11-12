"use client";

import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowUpRight } from "lucide-react";

export default function TradeboardIntelligence() {
  const [period, setPeriod] = useState("thisWeek");
  const [filters, setFilters] = useState({
    minProfit: -Infinity,
    maxProfit: Infinity,
    minWinRate: 0,
    maxWinRate: 100,
    minTrades: 0,
    maxTrades: Infinity,
    minRulesFollowed: 0,
    maxRulesFollowed: Infinity,
  });
  const [journalStats, setJournalStats] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [period, filters]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = Cookies.get("token");
      const today = new Date();
      let fromDate, toDate;

      switch (period) {
        case "thisWeek":
          fromDate = startOfWeek(today);
          toDate = endOfWeek(today);
          break;
        case "lastWeek":
          fromDate = startOfWeek(subWeeks(today, 1));
          toDate = endOfWeek(subWeeks(today, 1));
          break;
        case "thisMonth":
          fromDate = startOfMonth(today);
          toDate = endOfMonth(today);
          break;
        case "lastMonth":
          fromDate = startOfMonth(subMonths(today, 1));
          toDate = endOfMonth(subMonths(today, 1));
          break;
      }

      const [journalStatsResponse, monthlyStatsResponse] = await Promise.all([
        axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/journal/journal-stats/${format(
            today,
            "yyyy-MM-dd"
          )}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { period },
          }
        ),
        axios.get(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/journal/stats/${fromDate.getFullYear()}/${fromDate.getMonth() + 1}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              ...filters,
              fromDate: format(fromDate, "yyyy-MM-dd"),
              toDate: format(toDate, "yyyy-MM-dd"),
            },
          }
        ),
      ]);

      setJournalStats(journalStatsResponse.data[period]);
      setMonthlyStats(monthlyStatsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ title, stats, colorClass }) => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Rules you followed</p>
            <p className={`text-2xl font-bold ${colorClass}`}>
              {stats.rulesFollowed}%
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Words Journaled</p>
            <p className={`text-2xl font-bold ${colorClass}`}>
              {stats.totalWords}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Trades taken</p>
            <p className={`text-2xl font-bold ${colorClass}`}>
              {stats.tradeCount}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Win rate</p>
            <p className={`text-2xl font-bold ${colorClass}`}>
              {stats.winRate}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const RuleCard = ({ title, rules, className }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Card className={`${className} cursor-pointer`}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">{title}</CardTitle>
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{rules[0]?.content}</p>
            <p className="mt-2">
              <span className="text-2xl font-bold">
                {rules[0]?.followCount}
              </span>{" "}
              <span className="text-sm text-muted-foreground">
                times this {period.includes("Week") ? "week" : "month"} you{" "}
                {title.includes("Followed") ? "followed" : "broke"}
              </span>
            </p>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {rules.map((rule, index) => (
            <div key={index} className="flex justify-between items-center">
              <p>{rule.content}</p>
              <p>{rule.followCount} times</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );

  const FilterPopover = ({ title, min, max, value, onChange }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[150px]">
          {title}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">{title}</h4>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Minimum</p>
              <Slider
                min={min}
                max={max}
                step={1}
                value={[value[0]]}
                onValueChange={([val]) => onChange([val, value[1]])}
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Maximum</p>
              <Slider
                min={min}
                max={max}
                step={1}
                value={[value[1]]}
                onValueChange={([val]) => onChange([value[0], val])}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tradeboard Intelligence</h1>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="lastWeek">Last Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {journalStats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard
                title="On Profitable Days"
                stats={journalStats.profitableDays}
                colorClass="text-green-500"
              />
              <StatCard
                title="On Loss Making Days"
                stats={journalStats.lossDays}
                colorClass="text-red-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <StatCard
                title="On Break-Even Days"
                stats={
                  journalStats.breakEvenDays || {
                    rulesFollowed: 0,
                    totalWords: 0,
                    tradeCount: 0,
                    winRate: 0,
                  }
                }
                colorClass="text-blue-500"
              />
              <RuleCard
                title="Your Most Followed Rules"
                rules={journalStats.ruleStats.mostFollowed}
                className="bg-primary/50 border-primary"
              />
              <RuleCard
                title="Your Most Broken Rules"
                rules={journalStats.ruleStats.leastFollowed}
                className="bg-red-600/50 border-destructive "
              />
            </div>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Journal Analysis</CardTitle>
                  <div className="flex gap-2">
                    <FilterPopover
                      title="Profit"
                      min={-10000}
                      max={10000}
                      value={[filters.minProfit, filters.maxProfit]}
                      onChange={([min, max]) =>
                        setFilters((prev) => ({
                          ...prev,
                          minProfit: min,
                          maxProfit: max,
                        }))
                      }
                    />
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
                      value={[
                        filters.minRulesFollowed,
                        filters.maxRulesFollowed,
                      ]}
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
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {monthlyStats &&
                    Object.entries(monthlyStats.dailyStats).map(
                      ([date, stats]) => (
                        <Card
                          key={date}
                          className={`${
                            stats.profitLoss > 0
                              ? "bg-green-400/50 border-green-600"
                              : "bg-red-400/50 border-red-600"
                          }`}
                        >
                          <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle className="text-sm font-medium">
                              {format(new Date(date), "EEE, d MMM")}
                            </CardTitle>
                            <Button variant="ghost" size="icon">
                              <ArrowUpRight className="h-4 w-4" />
                            </Button>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <p>
                                <span className="font-medium">Notes:</span>{" "}
                                {stats.notes}
                              </p>
                              <p>
                                <span className="font-medium">Mistakes:</span>{" "}
                                {stats.mistakes}
                              </p>
                              <p>
                                <span className="font-medium">Lessons:</span>{" "}
                                {stats.lessons}
                              </p>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-4">
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Rules Followed
                                </p>
                                <p className="font-medium">
                                  {stats.rulesFollowed}/{stats.totalRules}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Win rate
                                </p>
                                <p className="font-medium">
                                  {stats.winRate.toFixed(2)}%
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  {stats.profitLoss > 0 ? "Profit" : "Loss"}
                                </p>
                                <p className="font-medium">
                                  ₹ {Math.abs(stats.profitLoss).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
