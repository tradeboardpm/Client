// app/my-journal/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ArrowUpRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import JournalCard from "@/components/cards/JournalCard";




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

return (
  <div className="py-8 px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center mb-6 primary_gradient p-3 rounded-2xl">
      <div className="flex flex-1 items-center justify-center ">
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
    </div>
    <div className="gap-4">
      {Object.keys(journalData).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
);


};

export default JournalPage;
