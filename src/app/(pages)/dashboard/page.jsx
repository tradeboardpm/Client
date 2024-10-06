"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import MainLayout from "@/components/layouts/MainLayout";
import {
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Pencil,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import CustomCalendar from "@/components/ui/custom-calendar";
import Cookies from "js-cookie";
import RulesChart from "@/components/charts/RulesChart";
import ProfitLossChart from "@/components/charts/ProfitLossChart";
import TradesTakenChart from "@/components/charts/TradesTakenChart";
import WinRateChart from "@/components/charts/WinRateChart";
import AddRuleDialog from "@/components/dialogs/AddRuleDialog";
import EditRuleDialog from "@/components/dialogs/EditRuleDialog";
import DeleteRuleDialog from "@/components/dialogs/DeleteRuleDialog";
import AddTradeDialog from "@/components/dialogs/AddTradeDialog";
import ImportTradeDialog from "@/components/dialogs/ImportTradeDialog";
import EditTradeDialog from "@/components/dialogs/EditTradeDialog";
import DeleteTradeDialog from "@/components/dialogs/DeleteTradeDialog";

const calendarData = {
  "2024-10-01": false,
  "2024-10-05": true,
  "2024-10-10": false,
  "2024-10-15": true,
  "2024-10-20": true,
  "2024-10-25": false,
};

const chartData = [
  {
    day: "Mon",
    tradesTaken: 1,
    win: 2,
    loss: 1,
    profitLoss: -20,
    rulesFollowed: 2,
    rulesBroken: 1,
  },
  {
    day: "Tue",
    tradesTaken: 2,
    win: 2,
    loss: 2,
    profitLoss: 30,
    rulesFollowed: 3,
    rulesBroken: 1,
  },
  {
    day: "Wed",
    tradesTaken: 4,
    win: 3,
    loss: 1,
    profitLoss: 50,
    rulesFollowed: 3,
    rulesBroken: 0,
  },
  {
    day: "Thu",
    tradesTaken: 3,
    win: 2,
    loss: 1,
    profitLoss: 40,
    rulesFollowed: 2,
    rulesBroken: 1,
  },
  {
    day: "Fri",
    tradesTaken: 2,
    win: 2,
    loss: 1,
    profitLoss: 20,
    rulesFollowed: 3,
    rulesBroken: 0,
  },
];

export default function Dashboard() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [rules, setRules] = useState([]);
  const [selectedRules, setSelectedRules] = useState(new Set());
  const [trades, setTrades] = useState([]);
  const [username, setUsername] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [journals, setJournals] = useState([]);
  const [journalData, setJournalData] = useState({
    notes: "",
    mistakes: "",
    lessons: "",
  });
  const [file, setFile] = useState(null);
  const [checkedRules, setCheckedRules] = useState([]);
  const [todayJournal, setTodayJournal] = useState(null);
  const [totalProfit, setTotalProfit] = useState(null);
  const [totalCharges, setTotalCharges] = useState(null);
  const [totalRealizedPL, setTotalRealizedPL] = useState(null);

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

  useEffect(() => {
    const name = Cookies.get("userName");
    if (name) {
      setUsername(name);
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    fetchJournals();
    fetchRules();
    fetchTrades();

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (journals.length > 0) {
      const today = new Date().toISOString().split("T")[0];
      const journalForToday = journals.find((journal) =>
        journal.date.startsWith(today)
      );
      if (journalForToday) {
        setTodayJournal(journalForToday);
        setJournalData({
          notes: journalForToday.notes,
          mistakes: journalForToday.mistakes,
          lessons: journalForToday.lessons,
        });
        setCheckedRules(journalForToday.rules.map((rule) => rule._id));
      }
    }
  }, [journals]);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const fetchJournals = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/journal`,
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
    }
  };

  const fetchRules = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rules`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch rules");
      }
      const data = await response.json();
      setRules(data);
    } catch (error) {
      console.error("Error fetching rules:", error);
    }
  };

  const fetchTrades = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/trades`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch trades");
      }
      const data = await response.json();
      const trades = data.trades;
      const totalProfit = data.totalProfit || 0;
      const totalCharges = data.totalCharges || 0;
      const totalRealizedPL = data.totalRealizedPL || 0;

      setTrades(trades);
      setTotalProfit(totalProfit);
      setTotalCharges(totalCharges);
      setTotalRealizedPL(totalRealizedPL);
    } catch (error) {
      console.error("Error fetching trades:", error);
    }
  };

  const handleJournalChange = (e) => {
    setJournalData({ ...journalData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmitJournal = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("notes", journalData.notes);
    formData.append("mistakes", journalData.mistakes);
    formData.append("lessons", journalData.lessons);
    if (file) {
      formData.append("file", file);
    }
    checkedRules.forEach((ruleId) => {
      formData.append("checkedRules[]", ruleId);
    });

    try {
      const token = Cookies.get("token");
      const method = todayJournal ? "PUT" : "POST";
      const url = todayJournal
        ? `${process.env.NEXT_PUBLIC_API_URL}/journal/${todayJournal._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/journal`;

      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error(
          `Failed to ${todayJournal ? "update" : "create"} journal`
        );
      }
      fetchJournals();
      setFile(null);
    } catch (error) {
      console.error(
        `Error ${todayJournal ? "updating" : "creating"} journal:`,
        error
      );
    }
  };

  const addRule = async (rule) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: rule }),
      });
      if (!response.ok) {
        throw new Error("Failed to create rule");
      }
      fetchRules();
    } catch (error) {
      console.error("Error creating rule:", error);
    }
  };

  const editRule = async (id, updatedRule) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/rules/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ description: updatedRule }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update rule");
      }
      fetchRules();
    } catch (error) {
      console.error("Error updating rule:", error);
    }
  };

  const deleteRule = async (id) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/rules/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete rule");
      }
      fetchRules();
    } catch (error) {
      console.error("Error deleting rule:", error);
    }
  };

  const toggleSelectAll = () => {
    if (selectedRules.size === rules.length) {
      setSelectedRules(new Set());
      setCheckedRules([]);
    } else {
      setSelectedRules(new Set(rules.map((rule) => rule._id)));
      setCheckedRules(rules.map((rule) => rule._id));
    }
  };

  const toggleSelectRule = (id) => {
    const newSelectedRules = new Set(selectedRules);
    const newCheckedRules = [...checkedRules];
    if (newSelectedRules.has(id)) {
      newSelectedRules.delete(id);
      const index = newCheckedRules.indexOf(id);
      if (index > -1) {
        newCheckedRules.splice(index, 1);
      }
    } else {
      newSelectedRules.add(id);
      newCheckedRules.push(id);
    }
    setSelectedRules(newSelectedRules);
    setCheckedRules(newCheckedRules);
  };

  const addTrade = async (trade) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/trades`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(trade),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add trade");
      }
      fetchTrades();
    } catch (error) {
      console.error("Error adding trade:", error);
    }
  };

  const updateTrade = async (id, updatedTrade) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/trades`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id, ...updatedTrade }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update trade");
      }
      fetchTrades();
    } catch (error) {
      console.error("Error updating trade:", error);
    }
  };

  const deleteTrade = async (id) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/trades/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete trade");
      }
      fetchTrades();
    } catch (error) {
      console.error("Error deleting trade:", error);
    }
  };

  const importTrades = (importedTrades) => {
    setTrades([...trades, ...importedTrades]);
  };

  return (
    <MainLayout>
      <div className="flex h-full">
        <div className={`flex-1 p-6 `}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Welcome back, {username}!</h2>
            <p className="text-xl">{formatTime(currentTime)}</p>
          </div>

          <Card className="bg-transparent border-none shadow-none mb-6">
            <CardHeader className="primary_gradient rounded-xl p-2 sm:p-3 md:p-4">
              <div className="flex flex-col sm:flex-row justify-between items-center relative">
                <div className="flex-1 w-full sm:w-auto order-2 sm:order-1"></div>
                <div className="w-full sm:w-auto sm:absolute sm:left-1/2 sm:-translate-x-1/2 bg-accent/40 text-center text-background px-2 py-1 rounded-lg mb-2 sm:mb-0 order-1 sm:order-2">
                  <p className="text-sm sm:text-base lg:text-xl">
                    {formatDate(currentTime)}
                  </p>
                </div>
                <p className="text-background text-sm sm:text-base lg:text-xl order-3">
                  Capital: ₹ 1000
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-0 bg-transparent mt-4">
              <div className="flex flex-col md:flex-row gap-8 h-2/3">
                {/* Today's Journal */}
                <Card className="flex-1">
                  <CardHeader className="px-5 py-4">
                    <CardTitle className="text-lg font-semibold">
                      Today's Journal{" "}
                      <span className="text-sm font-light">(Saving)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form onSubmit={handleSubmitJournal}>
                      <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          value={journalData.notes}
                          onChange={handleJournalChange}
                          placeholder="Type your notes here..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="mistakes">Mistake</Label>
                        <Textarea
                          id="mistakes"
                          name="mistakes"
                          value={journalData.mistakes}
                          onChange={handleJournalChange}
                          placeholder="Type your mistakes here..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="lessons">Lesson</Label>
                        <Textarea
                          id="lessons"
                          name="lessons"
                          value={journalData.lessons}
                          onChange={handleJournalChange}
                          placeholder="Type your lessons here..."
                        />
                      </div>
                      <div className="flex w-full justify-between mt-4">
                        <Input type="file" onChange={handleFileChange} />
                        <Button type="submit">
                          {todayJournal ? "Update Journal" : "Create Journal"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Rules */}
                <Card className="flex-1">
                  {rules.length === 0 ? (
                    <>
                      <CardHeader className="px-5 py-4">
                        <CardTitle className="text-lg font-semibold">
                          Rules
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8 flex flex-col items-center">
                          <Image
                            src="/images/no_rule.png"
                            height={150}
                            width={150}
                            alt="No rules"
                            className="mb-3"
                          />
                          <h4 className="text-xl font-semibold mb-2">
                            Get Started!
                          </h4>
                          <p className="text-gray-600 mb-4">
                            Please click below to add your trading rules
                          </p>
                          <AddRuleDialog onAddRule={addRule} />
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <>
                      <CardHeader className="px-5 py-3 flex flex-row items-center justify-between gap-5">
                        <CardTitle className="text-lg font-semibold">
                          Rules
                        </CardTitle>
                        <Input
                          placeholder="Search Rules"
                          className="max-w-xs"
                        />
                        <AddRuleDialog onAddRule={addRule} />
                      </CardHeader>
                      <CardContent>
                        <div className="relative overflow-hidden">
                          <div className="max-h-[50vh] overflow-y-auto">
                            <Table className="rounded-lg p-0 overflow-hidden border">
                              <TableHeader className="sticky top-0 bg-primary/15 z-10">
                                <TableRow>
                                  <TableHead className="w-12">
                                    <Checkbox
                                      checked={
                                        selectedRules.size === rules.length &&
                                        rules.length > 0
                                      }
                                      onCheckedChange={toggleSelectAll}
                                    />
                                  </TableHead>
                                  <TableHead className="max-w-[500px]">
                                    My Rules
                                  </TableHead>
                                  <TableHead className="w-[100px]">
                                    Actions
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {rules.map((rule) => (
                                  <TableRow key={rule._id}>
                                    <TableCell className="align-top">
                                      <Checkbox
                                        checked={selectedRules.has(rule._id)}
                                        onCheckedChange={() =>
                                          toggleSelectRule(rule._id)
                                        }
                                      />
                                    </TableCell>
                                    <TableCell className="max-w-[500px] whitespace-normal break-words">
                                      {rule.description}
                                    </TableCell>
                                    <TableCell className="align-top">
                                      <div className="flex gap-2">
                                        <EditRuleDialog
                                          rule={rule.description}
                                          onEditRule={(updatedRule) =>
                                            editRule(rule._id, updatedRule)
                                          }
                                        />
                                        <DeleteRuleDialog
                                          onDeleteRule={() =>
                                            deleteRule(rule._id)
                                          }
                                        />
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </CardContent>
                    </>
                  )}
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            {trades.length === 0 ? (
              <>
                <CardHeader>
                  <CardTitle>Trade Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 flex flex-col items-center">
                    <Image
                      src="/images/no_trade.png"
                      height={150}
                      width={150}
                      alt="No trades"
                      className="mb-3"
                    />
                    <h3 className="text-xl font-semibold mb-2">Get Started!</h3>
                    <p className="text-accent-foreground/50 text-sm mb-4">
                      Please add your trades here or import them automatically
                      using your tradebook
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <AddTradeDialog onAddTrade={addTrade} />
                      <ImportTradeDialog onImportTrades={fetchTrades} />
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <>

                <CardHeader className="px-5 py-3 flex flex-row items-center justify-between gap-5">
                  <CardTitle className="text-lg font-semibold">
                    Trade Log
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    <AddTradeDialog onAddTrade={addTrade} />
                    <ImportTradeDialog onImportTrades={fetchTrades} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Table className="rounded-lg p-0 overflow-hidden border">
                      <TableHeader className="sticky top-0 bg-primary/15 z-10">
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Instrument</TableHead>
                          <TableHead>Equity Type</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Buying Price</TableHead>
                          <TableHead>Selling Price</TableHead>
                          <TableHead>Exchange charges</TableHead>
                          <TableHead>Brokerage</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {trades.map((trade, index) => (
                          <TableRow key={index}>
                            <TableCell className="text-sm">
                              {trade.time}
                            </TableCell>
                            <TableCell
                              className={`text-sm ${
                                trade.buyingPrice < trade.sellingPrice
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {trade.instrument}
                            </TableCell>
                            <TableCell className="text-sm">
                              {trade.equityType}
                            </TableCell>
                            <TableCell className="text-sm">
                              {trade.quantity}
                            </TableCell>
                            <TableCell className="text-sm">
                              ₹ {trade.buyingPrice}
                            </TableCell>
                            <TableCell className="text-sm">
                              ₹ {trade.sellingPrice}
                            </TableCell>
                            <TableCell className="text-sm">
                              ₹ {trade.exchangeCharges}
                            </TableCell>
                            <TableCell className="text-sm">
                              ₹ {trade.brokerage}
                            </TableCell>
                            <TableCell className="space-x-2 flex">
                              <EditTradeDialog
                                trade={trade.description}
                                onEditTrade={(updatedTrade) =>
                                  editTrade(trade._id, updatedTrade)
                                }
                              />
                              <DeleteTradeDialog
                                onDeletetrade={() => deleteTrade(trade._id)}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <div className="flex justify-between mt-6 px-4">
                      <div className="flex items-center gap-2 bg-green-500/15 text-green-600 px-4 py-2 rounded-md">
                        <Pencil size={16} />
                        <span>
                          Today's Profit:{" "}
                          {totalProfit ? `₹ ${totalProfit}` : "N/A"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 bg-purple-500/15 text-purple-600 px-4 py-2 rounded-md">
                        <Pencil size={16} />
                        <span>Today's Charges: ₹ {totalCharges}</span>
                      </div>

                      <div className="flex items-center gap-2 bg-red-500/15 text-red-600 px-4 py-2 rounded-md">
                        <Pencil size={16} />
                        <span>
                          Net Realised P&L:{" "}
                          {totalRealizedPL ? `₹ ${totalRealizedPL}` : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </div>

        {/* Right Sidebar */}
        {!isMobile && (
          <div
            className={`relative h-fit p-4 space-y-6 transition-all duration-300 ease-in-out ${
              isSidebarExpanded
                ? "w-80 border-l bg-white/50 dark:bg-black/50"
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
              <>
                <div className="mt-12">
                  <CustomCalendar data={calendarData} />
                </div>
                <TradesTakenChart chartData={chartData} />
                <WinRateChart chartData={chartData} />
                <ProfitLossChart chartData={chartData} />
                <RulesChart chartData={chartData} />
              </>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
