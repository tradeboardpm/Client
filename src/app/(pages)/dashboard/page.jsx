"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Menu, X } from "lucide-react";
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
  const [journal, setJournal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rules, setRules] = useState(null);
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

      // Store additional user settings
      setBrokerage(response.data.brokerage);
      setPoints(response.data.points);
      setTradesPerDay(response.data.tradesPerDay);

      // Sync points with Zustand store
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
      const journalResponse = await api.get("/journals", {
        params: { date: utcDate.toISOString() },
      });
      setJournal(journalResponse.data);
      setRules(null);
    } catch (error) {
      console.error("Error fetching journal data:", error);
      setJournal(null);

      // If no journal found (404 error), fetch rules
      if (error.response && error.response.status === 404) {
        try {
          const rulesResponse = await api.get("/rules");
          setRules(rulesResponse.data);
        } catch (rulesError) {
          console.error("Error fetching rules:", rulesError);
          setRules(null);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowRule = async (ruleId) => {
    setIsLoading(true);
    try {
      const utcDate = getUTCDate(selectedDate);
      const response = await api.post("/rules/follow-no-journal", {
        ruleId,
        date: utcDate.toISOString(),
      });
      setJournal(response.data);
      setRules(null);
    } catch (error) {
      console.error("Error following rule:", error);
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

    // Close sheet on mobile after date selection
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
    <div className="flex flex-col md:flex-row min-h-screen">
      <main className="flex-1 overflow-y-auto p-4 w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            {isMobile && (
              <Sheet open={isSideSheetOpen} onOpenChange={setIsSideSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px]">
                  <SheetHeader>
                    <SheetTitle>Calendar</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <TradingCalendar
                      selectedDate={selectedDate}
                      onSelect={handleDateChange}
                      tradesPerDay={tradesPerDay}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            )}
            <h2 className="text-xl md:text-2xl font-bold">
              Welcome back, {userName}!
            </h2>
          </div>
          <p className="text-lg">{formatTime(currentTime)}</p>
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

        <div className="grid md:grid-cols-2 gap-6 h-[calc(100vh-300px)] min-h-[500px]">
          {journal ? (
            <>
              <JournalSection selectedDate={selectedDate} />
              <RulesSection
                journal={journal}
                setJournal={setJournal}
                onUpdate={fetchCapital}
              />
            </>
          ) : (
            <>
              <JournalSection selectedDate={selectedDate} />
              <RulesSection
                rules={rules}
                onFollowRule={handleFollowRule}
                onUpdate={fetchCapital}
              />
            </>
          )}
        </div>

        <div className="mt-12">
          <TradesSection
            selectedDate={selectedDate}
            onUpdate={fetchCapital}
            brokerage={brokerage}
          />
        </div>
      </main>

      {!isMobile && (
        <div
          className={`relative h-full transition-all duration-300 ease-in-out ${
            sidebarExpanded
              ? "w-[19rem] border-l bg-popover"
              : "w-12 border-0 bg-transparent"
          }`}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-1 z-10"
            onClick={toggleSidebar}
          >
            {sidebarExpanded ? <ChevronRight /> : <ChevronLeft />}
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
