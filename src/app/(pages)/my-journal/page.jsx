// app/my-journal/page.jsx
"use client";

import { useState, useEffect } from "react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import Cookies from "js-cookie";
import JournalCard from "@/components/cards/JournalCard";

export default function JournalList() {
  const [journalData, setJournalData] = useState({
    dailyStats: {},
    monthlyStats: {},
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJournals();
  }, [currentDate]);

  const fetchJournals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = Cookies.get("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/journal/stats/${currentDate.getFullYear()}/${
          currentDate.getMonth() + 1
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch journals");
      }

      const data = await response.json();
      setJournalData(data);
    } catch (error) {
      console.error("Error fetching journals:", error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  const changeMonth = (increment) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + increment);
      return newDate;
    });
  };

  const hasData = (stats) => {
    return (
      stats.tradeCount > 0 ||
      stats.notes.trim() !== "" ||
      stats.mistakes.trim() !== "" ||
      stats.lessons.trim() !== "" ||
      stats.rulesFollowed > 0 ||
      stats.profitLoss !== 0
    );
  };

  const filteredDailyStats = Object.entries(journalData.dailyStats)
    .filter(([_, stats]) => hasData(stats))
    .sort(
      ([dateA], [dateB]) =>
        new Date(dateB).getTime() - new Date(dateA).getTime()
    );

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <div className="primary_gradient rounded-xl p-3 mb-8 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => changeMonth(-1)}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              disabled={isLoading}
            >
              <ChevronsLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-medium text-white px-4 py-2 rounded-lg bg-white/10">
              {currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <button
              onClick={() => changeMonth(1)}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              disabled={isLoading}
            >
              <ChevronsRight className="h-5 w-5" />
            </button>
          </div>
          <div className="flex gap-6 text-white">
            <div className="text-center">
              <p className="text-sm opacity-80">Total P&L</p>
              <p className="text-lg font-semibold">
                ₹
                {(
                  journalData.monthlyStats.totalProfitLoss || 0
                ).toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm opacity-80">Win Rate</p>
              <p className="text-lg font-semibold">
                {journalData.monthlyStats.overallWinRate || 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-8 text-gray-600">
          Loading your journals...
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-red-500">Error: {error}</div>
      )}

      {!isLoading && !error && filteredDailyStats.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          No journals found for this month.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDailyStats.map(([date, stats]) => (
          <JournalCard key={date} date={date} stats={stats} />
        ))}
      </div>
    </main>
  );
}
