"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ArrowUpRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import JournalCard from "@/components/cards/JournalCard";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const JournalCardSkeleton = () => {
  return (
    <Card className="transition-all duration-300 group shadow-[0px_5px_10px_2px_rgba(0,0,0,0.04)] max-w-[22.5rem] border-[1rem] bg-card/50">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="h-5 w-24 bg-muted animate-pulse rounded" />
          <div className="h-6 w-6 bg-muted animate-pulse rounded-full" />
        </div>
        <div className="h-[1px] w-full bg-muted mt-2" />
      </CardHeader>
      <CardContent className="space-y-6 py-4">
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="h-4 w-10 bg-muted animate-pulse rounded mr-2" />
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex items-center">
            <div className="h-4 w-14 bg-muted animate-pulse rounded mr-2" />
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex items-center">
            <div className="h-4 w-12 bg-muted animate-pulse rounded mr-2" />
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="h-[1px] w-full bg-muted" />
      </CardContent>
      <CardFooter className="p-0">
        <div className="flex justify-between space-x-4 w-full p-2">
          <div className="flex flex-col items-center w-full space-y-1">
            <div className="h-3 w-8 bg-muted animate-pulse rounded" />
            <div className="h-4 w-12 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex flex-col items-center w-full space-y-1 border-x border-muted px-2">
            <div className="h-3 w-12 bg-muted animate-pulse rounded" />
            <div className="h-4 w-12 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex flex-col items-center w-full space-y-1">
            <div className="h-3 w-10 bg-muted animate-pulse rounded" />
            <div className="h-4 w-12 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

const JournalPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [journalData, setJournalData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchJournalData = async () => {
      try {
        setIsLoading(true);
        const token = Cookies.get("token");
        const response = await axios.get(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/journals/monthly?year=${currentDate.getFullYear()}&month=${
            currentDate.getMonth() + 1
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setJournalData(response.data);
      } catch (error) {
        console.error("Error fetching journal data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJournalData();
  }, [currentDate]);

  const changeMonth = (direction) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + direction);
      return newDate;
    });
  };

  const renderSkeletons = () => {
    return Array(8)
      .fill(null)
      .map((_, index) => <JournalCardSkeleton key={`skeleton-${index}`} />);
  };

  return (
    <div className="bg-card">
      <div className="py-8 px-4 sm:px-6 lg:px-8 bg-background rounded-t-xl">
        <div className="flex justify-between items-center mb-6 primary_gradient p-3 rounded-2xl">
          <div className="flex flex-1 items-center justify-center">
            <div className="flex items-center justify-between w-80">
              <button
                onClick={() => changeMonth(-1)}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors flex-shrink-0"
                disabled={isLoading}
              >
                <ChevronsLeft className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-medium text-white px-4 py-2 rounded-lg bg-[#ffffff]/30 w-52 text-center">
                {currentDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <button
                onClick={() => changeMonth(1)}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors flex-shrink-0"
                disabled={isLoading}
              >
                <ChevronsRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="gap-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {renderSkeletons()}
            </div>
          ) : Object.keys(journalData).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Object.keys(journalData).map((date) => (
                <JournalCard
                  key={date}
                  date={date}
                  note={journalData[date].note}
                  mistake={journalData[date].mistake}
                  lesson={journalData[date].lesson}
                  rulesFollowedPercentage={
                    journalData[date].rulesFollowedPercentage
                  }
                  winRate={journalData[date].winRate}
                  profit={journalData[date].profit}
                  tradesTaken={journalData[date].tradesTaken}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-[55vh]">
              <img
                src="/images/no_box.png"
                alt="No Data"
                className="w-36 h-36 mb-4"
              />
              <p className="text-foreground/40 text-lg text-center">
                <span className="font-extrabold text-xl text-foreground">
                  No Data
                </span>
                <br />
                Please start journaling daily to see your monthly journals here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
