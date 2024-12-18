"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Menu } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { JournalSection } from "./journal-section";
import { RulesSection } from "./rule-section";
import { TradesSection } from "./trade-log-section";
import { TradingCalendar } from "./Calendar";
import { usePointsStore } from "@/stores/points-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getUTCDate = (date) => {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
};

const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${Cookies.get("token")}`,
    "Content-Type": "application/json",
  },
});

export default function JournalTradePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [journalData, setJournalData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [capital, setCapital] = useState(0);
  const [brokerage, setBrokerage] = useState(0);
  const [tradesPerDay, setTradesPerDay] = useState(4);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [weeklyMetrics, setWeeklyMetrics] = useState({});
  const [isSideSheetOpen, setIsSideSheetOpen] = useState(false);

  const { setPoints } = usePointsStore();

  const userName = Cookies.get("userName") || "Trader";

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Time update interval
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch data on date change
  useEffect(() => {
    fetchJournalData();
    fetchCapital();
    fetchWeeklyMetrics();
  }, [selectedDate]);

  const fetchCapital = async () => {
    try {
      const response = await api.get("/user/settings");
      setCapital(response.data.capital);
      setBrokerage(response.data.brokerage);
      setPoints(response.data.points);
      setTradesPerDay(response.data.tradesPerDay);
      usePointsStore.getState().setPoints(response.data.points);
    } catch (error) {
      console.error("Error fetching user settings:", error);
    }
  };

  const fetchWeeklyMetrics = async () => {
    try {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const response = await api.get(`/metrics/weekly?date=${formattedDate}`);
      setWeeklyMetrics(response.data || {});
    } catch (error) {
      console.error("Error fetching weekly metrics:", error);
    }
  };

  const fetchJournalData = async () => {
    setIsLoading(true);
    const utcDate = getUTCDate(selectedDate);

    try {
      const response = await api.get("/journals/details", {
        params: { date: utcDate.toISOString() },
      });
      setJournalData(response.data);
    } catch (error) {
      console.error("Error fetching journal data:", error);
      setJournalData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const handleDateChange = (date) => {
    const adjustedDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    setSelectedDate(adjustedDate);

    if (isMobile) {
      setIsSideSheetOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-card">
      <main className="flex-1 overflow-y-auto p-4 w-full bg-background rounded-t-xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl md:text-2xl font-bold">
              Welcome back, {userName}!
            </h2>
          </div>
          <p className="text-lg">{formatTime(currentTime)}</p>
          {isMobile && (
            <Sheet open={isSideSheetOpen} onOpenChange={setIsSideSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] overflow-auto">
                <div className="mt-4 ">
                  <TradingCalendar
                    selectedDate={selectedDate}
                    onSelect={handleDateChange}
                    tradesPerDay={tradesPerDay}
                  />
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>

        <div className="primary_gradient rounded-xl p-2 sm:p-3 md:p-4 mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-center relative">
            <div className="flex-1 w-full sm:w-auto order-2 sm:order-1"></div>
            <div className="w-full sm:w-auto sm:absolute sm:left-1/2 sm:-translate-x-1/2 bg-accent/40 text-center text-background px-2 py-1 rounded-lg mb-2 sm:mb-0 order-1 sm:order-2">
              <p className="text-sm sm:text-base lg:text-xl">
                {formatDate(selectedDate)}
              </p>
            </div>
            <p className="text-background text-sm sm:text-base lg:text-xl order-3">
              Capital: ₹ {capital.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6   mb-8">
          <JournalSection
            selectedDate={selectedDate}
            journalData={journalData}
          />
          <RulesSection
            selectedDate={selectedDate}
            onUpdate={fetchJournalData}
          />
        </div>

        <div >
          <TradesSection
            selectedDate={selectedDate}
            onUpdate={fetchJournalData}
            brokerage={brokerage}
            trades={journalData?.trades || []}
          />
        </div>
      </main>

      {!isMobile && (
        <div
          className={`relative h-full transition-all duration-300 ease-in-out ${
            sidebarExpanded
              ? "w-[19rem]  bg-card"
              : "w-12 border-0 bg-background"
          }`}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 -left-3 z-10 rounded-full p-1 h-fit w-fit bg-card shadow-sm text-xs"
            onClick={toggleSidebar}
          >
            {sidebarExpanded ? (
              <ChevronRight className="size-5" />
            ) : (
              <ChevronLeft className="size-5" />
            )}
          </Button>

          {sidebarExpanded ? (
            <div className="p-4 space-y-6">
              <TradingCalendar
                selectedDate={selectedDate}
                onSelect={handleDateChange}
                tradesPerDay={tradesPerDay}
              />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
