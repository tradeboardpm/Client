"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { CalendarAndCharts } from "./CalendarAndCharts";
import { Journals } from "./Journals";
import { Rules } from "./Rules";
import { TradeLog } from "./TradeLog";
import { Spinner } from "@/components/ui/spinner";
import { debounce } from "lodash";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDateStore } from "@/stores/DateStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export default function MainDashboard() {
  const { selectedDate } = useDateStore();
  const [isMobile, setIsMobile] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [journal, setJournal] = useState({
    notes: "",
    lessons: "",
    mistakes: "",
    rules: [],
    attachments: [],
  });
  const [rules, setRules] = useState([]);
  const [trades, setTrades] = useState([]);
  const [profitLossDates, setProfitLossDates] = useState([]);
  const [isJournalSaving, setIsJournalSaving] = useState(false);
  const [tradeSummary, setTradeSummary] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    capital: 0,
    brokerage: 0,
    orderLimit: 0,
  });
  const token = Cookies.get("token");

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsLargeScreen(width >= 1024);
      setIsSidebarExpanded(width >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const axiosInstance = useMemo(
    () =>
      axios.create({
        baseURL: API_URL,
        headers: { Authorization: `Bearer ${token}` },
      }),
    [token]
  );

  const fetchSettings = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/settings");
      setSettings(response.data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  }, [axiosInstance]);

  const fetchProfitLossDates = useCallback(async () => {
    try {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      const response = await axiosInstance.get(
        `/journal/profit-loss-dates/${year}/${month}`
      );
      setProfitLossDates(response.data);
    } catch (error) {
      console.error("Error fetching profit/loss dates:", error);
    }
  }, [selectedDate, axiosInstance]);

const fetchJournalData = useCallback(async () => {
  try {
    setIsLoading(true);
    const [
      journalResponse,
      rulesResponse,
      weeklyStatsResponse,
      tradeSummaryResponse,
      settingsResponse,
    ] = await Promise.all([
      axiosInstance.get(`/journal/${format(selectedDate, "yyyy-MM-dd")}`),
      axiosInstance.get("/rules"),
      axiosInstance.get(
        `/journal/weekly-stats/${format(selectedDate, "yyyy-MM-dd")}`
      ),
      axiosInstance.get(
        `/trades/trade-summary/${format(selectedDate, "yyyy-MM-dd")}`
      ),
      axiosInstance.get("/settings"),
    ]);

    // If no journal exists for this date, create one
    if (!journalResponse.data.journal) {
      const newJournalResponse = await axiosInstance.post(
        `/journal/${format(selectedDate, "yyyy-MM-dd")}`,
        {
          notes: "",
          lessons: "",
          mistakes: "",
          attachments: [],
          rules: [],
        }
      );
      setJournal(newJournalResponse.data);
    } else {
      setJournal(journalResponse.data.journal);
    }

    setTrades(journalResponse.data.trades);
    setRules(rulesResponse.data);
    setWeeklyStats(weeklyStatsResponse.data);
    setTradeSummary(tradeSummaryResponse.data);
    setSettings(settingsResponse.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    setIsLoading(false);
  }
}, [selectedDate, axiosInstance]);



  useEffect(() => {
    fetchProfitLossDates();
    fetchJournalData();
  }, [fetchProfitLossDates, fetchJournalData]);

  const updateJournal = useMemo(
    () =>
      debounce(async (field, value) => {
        setIsJournalSaving(true);
        try {
          await axiosInstance.put(
            `/journal/update/${format(selectedDate, "yyyy-MM-dd")}`,
            {
              [field]: value,
            }
          );
        } catch (error) {
          console.error("Error updating journal:", error);
        } finally {
          setIsJournalSaving(false);
        }
      }, 1000),
    [selectedDate, axiosInstance]
  );

const handleJournalChange = useCallback(
  (field) => (e) => {
    const value = e.target.value;
    setJournal((prev) => ({
      ...prev,
      [field]: value,
    }));
    updateJournal(field, value);
  },
  [updateJournal]
);

  const handleAttachFile = async (e) => {
    const file = e.target.files[0];
    if (file && journal.attachments.length < 3) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await axiosInstance.post(
          `/journal/${format(selectedDate, "yyyy-MM-dd")}/attach`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setJournal((prev) => ({
          ...prev,
          attachments: response.data.attachments,
        }));
      } catch (error) {
        console.error("Error attaching file:", error);
      }
    }
  };

  const handleDeleteAttachment = async (fileKey) => {
    try {
      await axiosInstance.delete(
        `/journal/${format(selectedDate, "yyyy-MM-dd")}/attach/${fileKey}`
      );
      setJournal((prev) => ({
        ...prev,
        attachments: prev.attachments.filter(
          (attachment) => attachment !== fileKey
        ),
      }));
    } catch (error) {
      console.error("Error deleting attachment:", error);
    }
  };

  const handleRuleToggle = async (ruleId) => {
    try {
      const isAttached = journal.rules.includes(ruleId);
      if (isAttached) {
        await axiosInstance.post("/rules/detach", {
          ruleId,
          journalId: journal._id,
        });
        setJournal((prev) => ({
          ...prev,
          rules: prev.rules.filter((id) => id !== ruleId),
        }));
      } else {
        await axiosInstance.post("/rules/attach", {
          ruleId,
          journalId: journal._id,
        });
        setJournal((prev) => ({
          ...prev,
          rules: [...prev.rules, ruleId],
        }));
      }
    } catch (error) {
      console.error("Error toggling rule:", error);
      // Optionally, revert the local state change if the API call fails
      fetchJournalData();
    }
  };

  const handleCreateRule = async (content) => {
    try {
      const response = await axiosInstance.post("/rules", { content });
      setRules((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error creating rule:", error);
    }
  };

  const handleUpdateRule = async (id, content) => {
    try {
      const response = await axiosInstance.put(`/rules/${id}`, { content });
      setRules((prev) =>
        prev.map((rule) => (rule._id === id ? { ...rule, content } : rule))
      );
    } catch (error) {
      console.error("Error updating rule:", error);
    }
  };

  const handleDeleteRule = async (id) => {
    try {
      await axiosInstance.delete(`/rules/${id}`);
      setRules((prev) => prev.filter((rule) => rule._id !== id));
      setJournal((prev) => ({
        ...prev,
        rules: prev.rules.filter((ruleId) => ruleId !== id),
      }));
    } catch (error) {
      console.error("Error deleting rule:", error);
    }
  };

  const handleLoadSampleRules = async () => {
    try {
      await axiosInstance.post("/rules/load-samples");
      fetchJournalData();
    } catch (error) {
      console.error("Error loading sample rules:", error);
    }
  };

  const handleAddTrade = async (newTrade) => {
    try {
      await axiosInstance.post("/trades", newTrade);
      fetchJournalData();
    } catch (error) {
      console.error("Error adding trade:", error);
    }
  };

  const handleUpdateTrade = async (id, updatedTrade) => {
    try {
      await axiosInstance.put(`/trades/${id}`, updatedTrade);
      fetchJournalData();
    } catch (error) {
      console.error("Error updating trade:", error);
    }
  };

  const handleDeleteTrade = async (id) => {
    try {
      await axiosInstance.delete(`/trades/${id}`);
      fetchJournalData();
    } catch (error) {
      console.error("Error deleting trade:", error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const formatTime = (date) => {
    if (!date) return "";
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    if (!date) return "Select a date";
    try {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Calculate available capital
  const calculateAvailableCapital = () => {
    const initialCapital = settings.capital || 0;
    const netPnL = tradeSummary?.netPnL || 0;
    const total = initialCapital + netPnL;
    return Number(total.toFixed(2)).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const [username, setUsername] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const name = Cookies.get("userName");
    if (name) {
      setUsername(name);
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-row">
      <div className="flex-1 p-6 w-full ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Welcome back, {username}!</h2>
          <p className="text-xl">{formatTime(currentTime)}</p>
        </div>

        <div className="primary_gradient rounded-xl p-2 sm:p-3 md:p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center relative">
            <div className="flex-1 w-full sm:w-auto order-2 sm:order-1"></div>
            <div className="w-full sm:w-auto sm:absolute sm:left-1/2 sm:-translate-x-1/2 bg-accent/40 text-center text-background px-2 py-1 rounded-lg mb-2 sm:mb-0 order-1 sm:order-2">
              <p className="text-sm sm:text-base lg:text-xl">
                {formatDate(selectedDate)}
              </p>
            </div>
            <p className="text-background text-sm sm:text-base lg:text-xl order-3">
              Capital: ₹ {calculateAvailableCapital().toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex  flex-col md:flex-row gap-4 mt-4">
          <div className="w-full space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Journals
                  journal={journal}
                  handleJournalChange={handleJournalChange}
                  handleAttachFile={handleAttachFile}
                  handleDeleteAttachment={handleDeleteAttachment}
                  isJournalSaving={isJournalSaving}
                />
              </div>
              <div className="flex-1">
                <Rules
                  rules={rules}
                  journal={journal}
                  handleRuleToggle={handleRuleToggle}
                  handleCreateRule={handleCreateRule}
                  handleUpdateRule={handleUpdateRule}
                  handleDeleteRule={handleDeleteRule}
                  handleLoadSampleRules={handleLoadSampleRules}
                />
              </div>
            </div>
            <TradeLog
              trades={trades}
              handleAddTrade={handleAddTrade}
              handleUpdateTrade={handleUpdateTrade}
              handleDeleteTrade={handleDeleteTrade}
              tradeSummary={tradeSummary}
            />
          </div>
        </div>
      </div>
      {/* Right Sidebar */}
      {!isMobile && (
        <div
          className={`relative h-fit p-4 space-y-6 transition-all duration-300 ease-in-out ${
            isSidebarExpanded
              ? "w-[19rem] border-l bg-white/50 dark:bg-black/50"
              : "w-12 border-0 bg-none"
          }`}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-1"
            onClick={toggleSidebar}
          >
            {isSidebarExpanded ? <ChevronRight /> : <ChevronLeft />}
          </Button>
          {isSidebarExpanded && (
            <div className="w-full md:w-1/4">
              <CalendarAndCharts
                profitLossDates={profitLossDates}
                weeklyStats={weeklyStats}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}





