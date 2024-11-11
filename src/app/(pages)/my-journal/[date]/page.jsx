'use client'
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronsLeft, ChevronsRight, ArrowLeft } from "lucide-react";
import Cookies from "js-cookie";
import { format, addDays, subDays, startOfWeek } from "date-fns";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const JournalPage = ({ params }) => {
  const router = useRouter();
  const [journalData, setJournalData] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date(params.date));

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

  const hasValidData = (data) => {
    return (
      data.tradeCount > 0 ||
      data.profitLoss !== 0 ||
      data.notes?.trim() ||
      data.mistakes?.trim() ||
      data.lessons?.trim() ||
      data.rulesFollowed > 0
    );
  };

  const prepareChartData = () => {
    if (!weeklyStats) return [];
    
    // Filter out dates with no meaningful data
    return Object.entries(weeklyStats)
      .filter(([date, data]) => hasValidData(data))
      .map(([date, data]) => ({
        date: format(new Date(date), "EEE"),
        trades: data.tradeCount,
        profitLoss: data.profitLoss,
        wins: parseInt(data.winsVsLosses?.split(":")[0] || 0),
        losses: parseInt(data.winsVsLosses?.split(":")[1] || 0),
        rulesFollowed: parseInt(data.rulesFollowedVsBroken?.split(":")[0]) || 0,
        rulesBroken: parseInt(data.rulesFollowedVsBroken?.split(":")[1]) || 0,
      }));
  };

  const chartData = prepareChartData();

  if (isLoading) {
    return <div className="text-center py-4">Loading journal...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">Error: {error}</div>;
  }

  return (
    <main className="p-6">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" className="mr-4" onClick={() => router.push("/my-journal")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="primary_gradient rounded-xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-background">
            <Button variant="ghost" size="icon" onClick={() => changeDate(-1)}>
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

      {chartData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Trades Taken</CardTitle>
            </CardHeader>
            <CardContent className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Line type="monotone" dataKey="trades" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Win Rate</CardTitle>
            </CardHeader>
            <CardContent className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Line type="monotone" dataKey="wins" stroke="#4ade80" />
                  <Line type="monotone" dataKey="losses" stroke="#ef4444" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profit & Loss</CardTitle>
            </CardHeader>
            <CardContent className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Line type="monotone" dataKey="profitLoss" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rules</CardTitle>
            </CardHeader>
            <CardContent className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Line type="monotone" dataKey="rulesFollowed" stroke="#4ade80" />
                  <Line type="monotone" dataKey="rulesBroken" stroke="#ef4444" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {journalData && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Journal Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Mistakes:</span>{" "}
                  {journalData.journal.mistakes}
                </p>
                <p>
                  <span className="font-medium">Notes:</span>{" "}
                  {journalData.journal.notes}
                </p>
                <p>
                  <span className="font-medium">Attachments:</span>{" "}
                  {journalData.journal.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href={`${process.env.NEXT_PUBLIC_API_URL}/${attachment}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      Attachment {index + 1}
                    </a>
                  ))}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 space-y-1">
                {journalData.allRules.map((rule) => (
                  <li key={rule._id}>{rule.content}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {journalData.trades.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {journalData.trades.map((trade) => (
                    <div key={trade._id} className="space-y-2">
                      <p>
                        <span className="font-medium">Instrument:</span>{" "}
                        {trade.instrumentName}
                      </p>
                      <p>
                        <span className="font-medium">Equity Type:</span>{" "}
                        {trade.equityType}
                      </p>
                      <p>
                        <span className="font-medium">Action:</span>{" "}
                        {trade.action}
                      </p>
                      <p>
                        <span className="font-medium">Quantity:</span>{" "}
                        {trade.quantity}
                      </p>
                      <p>
                        <span className="font-medium">Buying Price:</span>{" "}
                        {trade.price}
                      </p>
                      <p>
                        <span className="font-medium">Selling Price:</span>{" "}
                        {trade.price}
                      </p>
                      <p>
                        <span className="font-medium">Exchange Charges:</span>{" "}
                        {trade.exchangeRate}
                      </p>
                      <p>
                        <span className="font-medium">Brokerage:</span>{" "}
                        {trade.brokerage}
                      </p>
                      <p>
                        <span className="font-medium">Total Charges:</span>{" "}
                        {trade.totalCharges}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </main>
  );
};

export default JournalPage;