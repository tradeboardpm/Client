"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { format, addDays, parseISO } from "date-fns";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WeeklyCharts } from "../../dashboard/Charts";
import { Checkbox } from "@/components/ui/checkbox";

const JournalDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const [journalDetails, setJournalDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(parseISO(params.date));

  useEffect(() => {
    const fetchJournalDetails = async () => {
      try {
        setIsLoading(true);
        const token = Cookies.get("token");
        const formattedDate = format(currentDate, "yyyy-MM-dd");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/journals/details?date=${formattedDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setJournalDetails(response.data);
      } catch (error) {
        console.error("Error fetching journal details:", error);
        setJournalDetails(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJournalDetails();
  }, [currentDate, params.date]);

  const changeDate = (days) => {
    const newDate = addDays(currentDate, days);
    const formattedDate = format(newDate, "yyyy-MM-dd");
    router.push(`/my-journal/${formattedDate}`);
    setCurrentDate(newDate);
  };

  const renderDateNavigation = () => (
    <nav aria-label="Journal Date Navigation">
      <button
        onClick={() => router.push("/my-journal")}
        className="flex items-center text-foreground/70 hover:text-foreground transition-colors mb-4 rounded-full border size-10 justify-center"
        aria-label="Back to Journal List"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <div className="flex items-center mb-6 space-x-4 primary_gradient rounded-xl">
        <div className="flex flex-1 bg-accent/20 p-2 rounded-lg items-center justify-center gap-4">
          <button
            onClick={() => changeDate(-1)}
            className="p-1 hover:bg-accent/50 rounded-full transition-colors"
            aria-label="Previous Day"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-medium bg-accent/50 px-4 py-2 rounded-lg">
            {format(currentDate, "EEE, d MMM yyyy")}
          </h2>
          <button
            onClick={() => changeDate(1)}
            className="p-1 hover:bg-accent/50 rounded-full transition-colors"
            aria-label="Next Day"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );

  const renderLoadingState = () => (
    <main className="grid grid-cols-[1fr_18rem]">
      <section className="container p-6">
        {renderDateNavigation()}
        <div className="flex justify-center items-center h-screen">
          <p>Loading...</p>
        </div>
      </section>
    </main>
  );

  const renderNoJournalState = () => (
    <main className="grid grid-cols-[1fr_18rem]">
      <section className="container p-6">
        {renderDateNavigation()}
        <div className="flex justify-center items-center h-screen">
          <p>No journal details found.</p>
        </div>
      </section>
    </main>
  );

  const renderJournalDetails = () => {
    const journalData = journalDetails?.journalDetails || {};
    return (
      <main className="grid grid-cols-[1fr_18rem]">
        <section className="container p-6">
          {renderDateNavigation()}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Journal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <article>
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <textarea
                    readOnly
                    className="w-full p-2 rounded-md resize-none bg-background border"
                    value={journalData.note || "No notes"}
                    rows={3}
                  />
                </article>
                <article>
                  <h3 className="font-semibold mb-2">Mistakes</h3>
                  <textarea
                    readOnly
                    className="w-full p-2 rounded-md resize-none bg-background border"
                    value={journalData.mistake || "No mistakes recorded"}
                    rows={3}
                  />
                </article>
                <article>
                  <h3 className="font-semibold mb-2">Lessons</h3>
                  <textarea
                    readOnly
                    className="w-full p-2 rounded-md resize-none bg-background border"
                    value={journalData.lesson || "No lessons learned"}
                    rows={3}
                  />
                </article>
              </CardContent>
              <CardFooter>
                {journalData.attachedFiles?.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {journalData.attachedFiles.map((file) => (
                      <figure
                        key={file}
                        className="relative group rounded-lg overflow-hidden shadow border"
                      >
                        <img
                          src={file}
                          alt="Attached file"
                          className="w-full h-20 object-cover"
                        />
                      </figure>
                    ))}
                  </div>
                )}
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox readOnly checked={false} />
                      </TableHead>
                      <TableHead>Rule Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {journalData.rulesFollowed?.map((rule) => (
                      <TableRow key={rule.originalId}>
                        <TableCell>
                          <Checkbox checked={true} readOnly />
                        </TableCell>
                        <TableCell>{rule.description}</TableCell>
                      </TableRow>
                    ))}
                    {journalData.rulesUnfollowed?.map((rule) => (
                      <TableRow key={rule.originalId}>
                        <TableCell>
                          <Checkbox checked={false} readOnly />
                        </TableCell>
                        <TableCell>{rule.description}</TableCell>
                      </TableRow>
                    ))}
                    {(!journalData.rulesFollowed ||
                      journalData.rulesFollowed.length === 0) &&
                      (!journalData.rulesUnfollowed ||
                        journalData.rulesUnfollowed.length === 0) && (
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            className="text-center text-muted-foreground"
                          >
                            No rules tracked
                          </TableCell>
                        </TableRow>
                      )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {journalData.trades?.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-xl">Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Instrument</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Buying Price</TableHead>
                      <TableHead>Selling Price</TableHead>
                      <TableHead>Brokerage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {journalData.trades.map((trade) => (
                      <TableRow key={trade._id}>
                        <TableCell>{trade.time}</TableCell>
                        <TableCell>{trade.instrumentName}</TableCell>
                        <TableCell>{trade.equityType}</TableCell>
                        <TableCell>{trade.action}</TableCell>
                        <TableCell>{trade.quantity}</TableCell>
                        <TableCell>
                          ₹{(trade.buyingPrice ?? 0).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          ₹{(trade.sellingPrice ?? 0).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          ₹{(trade.brokerage ?? 0).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <footer className="grid grid-cols-3 gap-4 mt-6">
                  <div
                    className={`rounded-lg p-2 flex items-center gap-2 ${
                      journalDetails.summary?.totalPnL >= 0
                        ? "bg-green-600/20"
                        : "bg-red-600/20"
                    }`}
                  >
                    <div
                      className={`text-sm font-medium ${
                        journalDetails.summary?.totalPnL >= 0
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      Today's Profit:
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        journalDetails.summary?.totalPnL >= 0
                          ? "text-green-900"
                          : "text-red-900"
                      }`}
                    >
                      ₹ {(journalDetails.summary?.totalPnL ?? 0).toFixed(2)}
                    </div>
                  </div>

                  <div className="rounded-lg bg-primary/20 flex items-center gap-2 p-2">
                    <div className="text-sm font-medium text-primary">
                      Today's Charges:
                    </div>
                    <div className="text-lg font-bold text-primary">
                      ₹ {(journalDetails.summary?.totalCharges ?? 0).toFixed(2)}
                    </div>
                  </div>

                  <div
                    className={`rounded-lg p-2 flex items-center gap-2 ${
                      journalDetails.summary?.netPnL >= 0
                        ? "bg-green-600/20"
                        : "bg-red-600/20"
                    }`}
                  >
                    <div
                      className={`text-sm font-medium ${
                        journalDetails.summary?.netPnL >= 0
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      Net Realised P&L:
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        journalDetails.summary?.netPnL >= 0
                          ? "text-green-900"
                          : "text-red-900"
                      }`}
                    >
                      ₹ {(journalDetails.summary?.netPnL ?? 0).toFixed(2)}
                    </div>
                  </div>
                </footer>
              </CardContent>
            </Card>
          )}
        </section>

        <aside className="bg-card/75 p-4">
          <h2 className="text-xl font-bold mb-2">Performance</h2>
          <WeeklyCharts selectedDate={format(currentDate, "yyyy-MM-dd")} />
        </aside>
      </main>
    );
  };

  if (isLoading) return renderLoadingState();
  if (!journalDetails) return renderNoJournalState();

  return renderJournalDetails();
};

export default JournalDetailsPage;
