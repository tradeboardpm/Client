"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast, Toaster } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
    }
    return Promise.reject(error);
  }
);

export default function TradingJournal() {
  const [journal, setJournal] = useState({
    notes: "",
    mistakes: "",
    lessons: "",
  });
  const [rules, setRules] = useState([]);
  const [trades, setTrades] = useState([]);
  const [newRule, setNewRule] = useState("");
  const [newTrade, setNewTrade] = useState({
    instrument: "",
    quantity: 0,
    tradeType: "Buy",
    buyingPrice: 0,
    equityType: "F&O - Options",
    time: "",
    exchangeCharges: 0,
    brokerage: 0,
  });
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([fetchJournal(), fetchRules(), fetchTrades()]);
      } catch (error) {
        console.error("Failed to initialize data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  const fetchJournal = async () => {
    try {
      const res = await api.get("/journal");
      setJournal(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch journal");
    }
  };

  const fetchRules = async () => {
    try {
      const res = await api.get("/rules");
      setRules(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch rules");
    }
  };

  const fetchTrades = async () => {
    try {
      const res = await api.get("/trades");
      setTrades(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch trades");
    }
  };

  const handleJournalChange = (e) => {
    setJournal({ ...journal, [e.target.name]: e.target.value });
  };

  const saveJournal = async () => {
    try {
      const formData = new FormData();
      formData.append("notes", journal.notes);
      formData.append("mistakes", journal.mistakes);
      formData.append("lessons", journal.lessons);

      if (file) {
        formData.append("file", file);
      }

      await api.post("/journal", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFile(null);
      toast.success("Journal saved successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save journal");
    }
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const addRule = async () => {
    if (!newRule.trim()) {
      toast.error("Please enter a rule");
      return;
    }

    try {
      await api.post("/rules", { description: newRule });
      setNewRule("");
      fetchRules();
      toast.success("Rule added successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add rule");
    }
  };

  const toggleRule = async (id, isChecked) => {
    try {
      await api.put(`/rules/${id}`, { isChecked: !isChecked });
      fetchRules();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update rule");
    }
  };

  const deleteRule = async (id) => {
    try {
      await api.delete(`/rules/${id}`);
      fetchRules();
      toast.success("Rule deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete rule");
    }
  };

  const handleTradeChange = (e) => {
    setNewTrade({ ...newTrade, [e.target.name]: e.target.value });
  };

  const handleTradeSelectChange = (name, value) => {
    setNewTrade({ ...newTrade, [name]: value });
  };

  const validateTrade = (trade) => {
    if (!trade.instrument) return "Instrument is required";
    if (!trade.quantity || trade.quantity <= 0)
      return "Valid quantity is required";
    if (!trade.buyingPrice || trade.buyingPrice <= 0)
      return "Valid buying price is required";
    if (!trade.time) return "Time is required";
    return null;
  };

  const addTrade = async () => {
    const validationError = validateTrade(newTrade);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      await api.post("/trades", newTrade);
      setNewTrade({
        instrument: "",
        quantity: 0,
        tradeType: "Buy",
        buyingPrice: 0,
        equityType: "F&O - Options",
        time: "",
        exchangeCharges: 0,
        brokerage: 0,
      });
      fetchTrades();
      toast.success("Trade added successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add trade");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Trading Journal</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Today&apos;s Journal</CardTitle>
          <CardDescription>
            Record your thoughts, mistakes, and lessons for the day
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={journal.notes}
              onChange={handleJournalChange}
              placeholder="Enter your notes here..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mistakes">Mistakes</Label>
            <Textarea
              id="mistakes"
              name="mistakes"
              value={journal.mistakes}
              onChange={handleJournalChange}
              placeholder="What mistakes did you make today?"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lessons">Lessons</Label>
            <Textarea
              id="lessons"
              name="lessons"
              value={journal.lessons}
              onChange={handleJournalChange}
              placeholder="What did you learn today?"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">Attach File</Label>
            <Input id="file" type="file" onChange={handleFileUpload} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={saveJournal}>Save Journal</Button>
        </CardFooter>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Rules</CardTitle>
          <CardDescription>Manage your trading rules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              placeholder="Enter a new rule"
            />
            <Button onClick={addRule}>Add Rule</Button>
          </div>
          <ul className="space-y-2">
            {rules.map((rule) => (
              <li key={rule._id} className="flex items-center space-x-2">
                <Checkbox
                  id={rule._id}
                  checked={rule.isChecked}
                  onCheckedChange={() => toggleRule(rule._id, rule.isChecked)}
                />
                <Label htmlFor={rule._id}>{rule.description}</Label>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteRule(rule._id)}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trades</CardTitle>
          <CardDescription>Record and view your trades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="instrument">Instrument</Label>
              <Input
                id="instrument"
                name="instrument"
                value={newTrade.instrument}
                onChange={handleTradeChange}
                placeholder="e.g., AAPL"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={newTrade.quantity}
                onChange={handleTradeChange}
                placeholder="Enter quantity"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tradeType">Trade Type</Label>
              <Select
                value={newTrade.tradeType}
                onValueChange={(value) =>
                  handleTradeSelectChange("tradeType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trade type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Buy">Buy</SelectItem>
                  <SelectItem value="Sell">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="buyingPrice">Buying Price</Label>
              <Input
                id="buyingPrice"
                name="buyingPrice"
                type="number"
                value={newTrade.buyingPrice}
                onChange={handleTradeChange}
                placeholder="Enter buying price"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="equityType">Equity Type</Label>
              <Select
                value={newTrade.equityType}
                onValueChange={(value) =>
                  handleTradeSelectChange("equityType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select equity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="F&O - Options">F&O - Options</SelectItem>
                  <SelectItem value="F&O - Futures">F&O - Futures</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={newTrade.time}
                onChange={handleTradeChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exchangeCharges">Exchange Charges</Label>
              <Input
                id="exchangeCharges"
                name="exchangeCharges"
                type="number"
                value={newTrade.exchangeCharges}
                onChange={handleTradeChange}
                placeholder="Enter exchange charges"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brokerage">Brokerage</Label>
              <Input
                id="brokerage"
                name="brokerage"
                type="number"
                value={newTrade.brokerage}
                onChange={handleTradeChange}
                placeholder="Enter brokerage"
              />
            </div>
          </div>
          <Button onClick={addTrade}>Add Trade</Button>
        </CardContent>
        <CardFooter>
          <ul className="w-full space-y-2">
            {trades.map((trade) => (
              <li
                key={trade._id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span>
                  {trade.instrument} - {trade.tradeType}
                </span>
                <span>
                  {trade.quantity} @ {trade.buyingPrice}
                </span>
              </li>
            ))}
          </ul>
        </CardFooter>
      </Card>

      <Toaster />
    </div>
  );
}
