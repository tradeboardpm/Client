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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const JournalDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const [journalDetails, setJournalDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // const [currentDate, setCurrentDate] = useState(parseISO(params.date));
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
            className="p-1 hover:bg-[#ffffff]/50 text-background rounded-full transition-colors"
            aria-label="Previous Day"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className=" px-4 py-2 rounded-lg text-xl font-medium text-white g bg-[#ffffff]/30">
            {format(currentDate, "EEE, d MMM yyyy")}
          </h2>
          <button
            onClick={() => changeDate(1)}
            className="p-1 hover:bg-[#ffffff]/50 text-background rounded-full transition-colors"
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
      <div className="bg-card">
        <main className="grid grid-cols-[1fr_18rem]">
          <section className=" p-6  bg-background rounded-t-xl">
            {renderDateNavigation()}
            <div className="grid grid-cols-2 gap-4">
              <Card className="flex-1 w-full h-full flex justify-between flex-col pb-6 shadow-[0px_8px_20px_rgba(0,0,0,0.08)] dark:shadow-[0px_8px_20px_rgba(0,0,0,0.32)]">
                <CardHeader>
                  <CardTitle className="text-xl">Journal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 h-full flex flex-col">
                  <div className="space-y-2 flex flex-col flex-1">
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea
                      readOnly
                      className="resize-none h-full flex-1 bg-[#FAF7FF] dark:bg-[#363637] shadow-[0px_2px_8px_rgba(0,0,0,0.02)]  border-t-0"
                      value={journalData.note || "No notes"}
                    />
                  </div>

                  <div className="space-y-2 flex flex-col flex-1">
                    <label className="text-sm font-medium">Mistakes</label>
                    <Textarea
                      readOnly
                      className="resize-none h-full flex-1 bg-[#FAF7FF] dark:bg-[#363637] shadow-[0px_2px_8px_rgba(0,0,0,0.02)]  border-t-0"
                      value={journalData.mistake || "No mistakes recorded"}
                    />
                  </div>

                  <div className="space-y-2 flex flex-col flex-1">
                    <label className="text-sm font-medium">Lessons</label>
                    <Textarea
                      readOnly
                      className="resize-none h-full flex-1 bg-[#FAF7FF] dark:bg-[#363637] shadow-[0px_2px_8px_rgba(0,0,0,0.02)]  border-t-0"
                      value={journalData.lesson || "No lessons learned"}
                    />
                  </div>
                </CardContent>
                <CardFooter className="h-fit p-0 px-6">
                  {journalData.attachedFiles?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {journalData.attachedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="relative group rounded-lg overflow-hidden w-20 h-9 shadow border"
                        >
                          <img
                            src={file}
                            alt={`Uploaded file ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardFooter>
              </Card>

              <Card className="w-full max-w-4xl h-full mx-auto p-4 flex-1 shadow-[0px_8px_20px_rgba(0,0,0,0.08)] dark:shadow-[0px_8px_20px_rgba(0,0,0,0.32)]">
                <CardHeader className="p-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">Rules</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 mt-3">
                  <div className="rounded-lg overflow-hidden border">
                    <div className="sticky top-0 z-10 grid grid-cols-[auto,1fr,auto] gap-4 p-2 px-4 bg-[#F4E4FF] dark:bg-[#49444c] border-b">
                      <div className="flex items-center">
                        <Checkbox
                          checked={false}
                          // Add onCheckedChange handler for follow/unfollow all
                        />
                      </div>
                      <span className="font-medium">My Rules</span>
                      {/* <span className="font-medium text-right">Action</span> */}
                    </div>
                    <div className="max-h-[50vh] min-h-96 overflow-y-auto">
                      <div className="divide-y">
                        {journalData.rules?.map((rule) => (
                          <div
                            key={rule._id}
                            className="grid grid-cols-[auto,1fr,auto] gap-4 px-4 py-2 items-center hover:bg-secondary/50"
                          >
                            <div>
                              <Checkbox
                                checked={rule.isFollowed}
                                // Add onCheckedChange handler
                              />
                            </div>
                            <span className="text-gray-700 text-[0.8rem]">
                              {rule.description}
                            </span>
                          </div>
                        ))}

                        {(!journalData.rules ||
                          journalData.rules.length === 0) && (
                          <div className="text-center text-muted-foreground p-4">
                            No rules tracked
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {journalData.trades?.length > 0 && (
              <Card className="mt-4 shadow-[0px_8px_20px_rgba(0,0,0,0.08)] dark:shadow-[0px_8px_20px_rgba(0,0,0,0.32)]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div className="space-y-1 text-xl">
                    <CardTitle>Trades</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg overflow-hidden border">
                    <Table className="rounded-b-lg overflow-hidden bg-background">
                      <TableHeader className="bg-[#F4E4FF] dark:bg-[#49444c]">
                        <TableRow className="border-none">
                          <TableHead className="text-nowrap text-[0.8rem] text-center">
                            Time
                          </TableHead>
                          <TableHead className="text-nowrap text-[0.8rem] text-center">
                            Instrument
                          </TableHead>
                          <TableHead className="text-nowrap text-[0.8rem] text-center">
                            Type
                          </TableHead>
                          <TableHead className="text-nowrap text-[0.8rem] text-center">
                            Action
                          </TableHead>
                          <TableHead className="text-nowrap text-[0.8rem] text-center">
                            Quantity
                          </TableHead>
                          <TableHead className="text-nowrap text-[0.8rem] text-center">
                            Buying Price
                          </TableHead>
                          <TableHead className="text-nowrap text-[0.8rem] text-center">
                            Selling Price
                          </TableHead>
                          <TableHead className="text-nowrap text-[0.8rem] text-center">
                            Brokerage
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {journalData.trades.map((trade) => (
                          <TableRow key={trade._id}>
                            <TableCell className="text-nowrap text-[0.8rem] text-center">
                              {trade.time}
                            </TableCell>
                            <TableCell
                              className={cn(
                                !trade.buyingPrice || !trade.sellingPrice
                                  ? "text-foreground font-semibold  text-center"
                                  : trade.buyingPrice < trade.sellingPrice
                                  ? "text-green-500 font-semibold  text-center"
                                  : "text-red-500 font-semibold  text-center"
                              )}
                            >
                              {trade.instrumentName}
                            </TableCell>
                            <TableCell className="text-nowrap text-[0.8rem] text-center">
                              {trade.equityType}
                            </TableCell>
                            <TableCell className="text-nowrap text-[0.8rem] text-center">
                              {trade.action}
                            </TableCell>
                            <TableCell className="text-nowrap text-[0.8rem] text-center">
                              {trade.quantity}
                            </TableCell>
                            <TableCell className="text-nowrap text-[0.8rem] text-center">
                              {trade.buyingPrice
                                ? `₹${trade.buyingPrice.toFixed(2)}`
                                : "-"}
                            </TableCell>
                            <TableCell className="text-nowrap text-[0.8rem] text-center">
                              {trade.sellingPrice
                                ? `₹${trade.sellingPrice.toFixed(2)}`
                                : "-"}
                            </TableCell>
                            <TableCell className="text-nowrap text-[0.8rem] text-center">
                              {trade.brokerage
                                ? `₹${trade.brokerage.toFixed(2)}`
                                : "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex gap-6 items-center justify-between mt-6">
                    <div
                      className={`rounded-lg p-2 flex items-center gap-2 w-fit ${
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
                        className={`text-lg font-medium ${
                          journalDetails.summary?.totalPnL >= 0
                            ? "text-green-900"
                            : "text-red-900"
                        }`}
                      >
                        ₹ {(journalDetails.summary?.totalPnL ?? 0).toFixed(2)}
                      </div>
                    </div>

                    <div className="rounded-lg bg-[#A073F0]/25 flex items-center gap-2 p-2 w-fit">
                      <div className="text-sm font-medium text-primary">
                        Today's Charges:
                      </div>
                      <div className="text-lg font-medium text-primary">
                        ₹{" "}
                        {(journalDetails.summary?.totalCharges ?? 0).toFixed(2)}
                      </div>
                    </div>

                    <div
                      className={`rounded-lg p-2 flex items-center gap-2 w-fit ${
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
                        className={`text-lg font-medium ${
                          journalDetails.summary?.netPnL >= 0
                            ? "text-green-900"
                            : "text-red-900"
                        }`}
                      >
                        ₹ {(journalDetails.summary?.netPnL ?? 0).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </section>

          <aside className="bg-card p-4">
            <h2 className="text-xl font-medium mb-2">Performance</h2>
            {/* <WeeklyCharts selectedDate={format(currentDate, "yyyy-MM-dd")} /> */}
            {/* <WeeklyCharts selectedDate={format(currentDate, "yyyy-MM-dd")} /> */}
            <WeeklyCharts
              selectedDate={format(currentDate, "yyyy-MM-dd")}
              // Optional: Add a console.log to verify the date
              onMount={() => {
                console.log(
                  "Current Date Passed to WeeklyCharts:",
                  format(currentDate, "yyyy-MM-dd")
                );
              }}
            />
          </aside>
        </main>
      </div>
    );
  };

  if (isLoading) return renderLoadingState();
  if (!journalDetails) return renderNoJournalState();

  return renderJournalDetails();
};

export default JournalDetailsPage;
