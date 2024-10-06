"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { ChevronsLeft, ChevronsRight, ArrowUpRight } from "lucide-react";
import Cookies from "js-cookie";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function JournalCard({ journal }) {
  const isLoss = journal.tradeStats.totalProfitLoss < 0;
  const date = new Date(journal.date).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });

  return (
    <Card
      className={`max-w-sm ${
        isLoss
          ? "bg-red-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50 border border-red-600"
          : "bg-green-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50 border border-green-600"
      } border`}
    >
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-sm font-medium">{date}</CardTitle>
        <Button variant="ghost" size="icon">
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Notes:</span> {journal.notes}
          </p>
          <p>
            <span className="font-medium">Mistakes:</span> {journal.mistakes}
          </p>
          <p>
            <span className="font-medium">Lessons:</span> {journal.lessons}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div>
            <p className="text-xs text-muted-foreground">Rules Followed</p>
            <p className="font-medium">
              {journal.ruleStats.percentageApplied}%
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Win rate</p>
            <p className="font-medium">{journal.tradeStats.winRate}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {isLoss ? "Loss" : "Profit"}
            </p>
            <p className="font-medium">
              ₹ {Math.abs(journal.tradeStats.totalProfitLoss)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function JournalList() {
  const [journals, setJournals] = useState([]);
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
        `${process.env.NEXT_PUBLIC_API_URL}/journal?month=${
          currentDate.getMonth() + 1
        }&year=${currentDate.getFullYear()}`,
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
      setJournals(data);
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

  const totalCapital = journals.length > 0 ? journals[0].capital : 0;

  return (
    <MainLayout>
      <main className="p-6">
        <div className="primary_gradient rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-background">
              <button
                onClick={() => changeMonth(-1)}
                className="hover:bg-accent/20 p-1 rounded"
                disabled={isLoading}
              >
                <ChevronsLeft />
              </button>
              <p className="bg-accent/40 text-xl text-background px-2 py-1 rounded-lg">
                {currentDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <button
                onClick={() => changeMonth(1)}
                className="hover:bg-accent/20 p-1 rounded"
                disabled={isLoading}
              >
                <ChevronsRight />
              </button>
            </div>
            <p className="text-background text-lg">Capital: ₹ {totalCapital}</p>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-4">Loading journals...</div>
        )}

        {error && (
          <div className="text-red-500 text-center py-4">Error: {error}</div>
        )}

        {!isLoading && !error && journals.length === 0 && (
          <div className="text-center py-4">
            No journals found for this month.
          </div>
        )}

        <div className="flex items-center gap-4">
          {journals.map((journal) => (
            <JournalCard key={journal._id} journal={journal} />
          ))}
        </div>
      </main>
    </MainLayout>
  );
}
