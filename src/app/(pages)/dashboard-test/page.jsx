"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import Cookies from "js-cookie";

export default function Dashboard() {
  // State Management
  const [activeTab, setActiveTab] = useState("journal");

  // Journal States
  const [journals, setJournals] = useState([]);
  const [rules, setRules] = useState([]);
  const [newRule, setNewRule] = useState("");
  const [journalData, setJournalData] = useState({
    notes: "",
    mistakes: "",
    lessons: "",
  });
  const [file, setFile] = useState(null);
  const [checkedRules, setCheckedRules] = useState([]);
  const [todayJournal, setTodayJournal] = useState(null);
  const [editingRule, setEditingRule] = useState(null);

  // Trade States
  const [trades, setTrades] = useState([]);
  const [editingTrade, setEditingTrade] = useState(null);
  const [tradeForm, setTradeForm] = useState({
    instrument: "",
    quantity: "",
    tradeType: "BUY",
    buyingPrice: "",
    equityType: "EQUITY",
    exchangeCharges: "",
    brokerage: "",
    time: new Date().toISOString().slice(0, 16),
  });

  // Initial Data Fetch
  useEffect(() => {
    fetchJournals();
    fetchRules();
    fetchTrades();
  }, []);

  // Journal Auto-load Effect
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

  // API Functions for Journals
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
      if (!response.ok) throw new Error("Failed to fetch journals");
      const data = await response.json();
      setJournals(data);
    } catch (error) {
      console.error("Error fetching journals:", error);
    }
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
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok)
        throw new Error(
          `Failed to ${todayJournal ? "update" : "create"} journal`
        );
      fetchJournals();
      setFile(null);
    } catch (error) {
      console.error(
        `Error ${todayJournal ? "updating" : "creating"} journal:`,
        error
      );
    }
  };

  // API Functions for Rules
  const fetchRules = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rules`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch rules");
      const data = await response.json();
      setRules(data);
    } catch (error) {
      console.error("Error fetching rules:", error);
    }
  };

  const handleCreateRule = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: newRule }),
      });
      if (!response.ok) throw new Error("Failed to create rule");
      setNewRule("");
      fetchRules();
    } catch (error) {
      console.error("Error creating rule:", error);
    }
  };

  const handleUpdateRule = async (id, description) => {
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
          body: JSON.stringify({ description }),
        }
      );
      if (!response.ok) throw new Error("Failed to update rule");
      fetchRules();
      setEditingRule(null);
    } catch (error) {
      console.error("Error updating rule:", error);
    }
  };

  const handleDeleteRule = async (id) => {
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
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to delete rule");
      }
      fetchRules();
    } catch (error) {
      console.error("Error deleting rule:", error);
      alert(error.message);
    }
  };

  // API Functions for Trades
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
      if (!response.ok) throw new Error("Failed to fetch trades");
      const data = await response.json();
      setTrades(data);
    } catch (error) {
      console.error("Error fetching trades:", error);
    }
  };

  const handleTradeSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");
      const method = editingTrade ? "PUT" : "POST";
      const url = editingTrade
        ? `${process.env.NEXT_PUBLIC_API_URL}/trades/${editingTrade._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/trades`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tradeForm),
      });

      if (!response.ok)
        throw new Error(
          `Failed to ${editingTrade ? "update" : "create"} trade`
        );

      fetchTrades();
      resetTradeForm();
    } catch (error) {
      console.error("Error submitting trade:", error);
    }
  };

  const handleDeleteTrade = async (id) => {
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
      if (!response.ok) throw new Error("Failed to delete trade");
      fetchTrades();
    } catch (error) {
      console.error("Error deleting trade:", error);
    }
  };

  // Helper Functions
  const handleJournalChange = (e) => {
    setJournalData({ ...journalData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleRuleCheck = (ruleId) => {
    setCheckedRules((prev) =>
      prev.includes(ruleId)
        ? prev.filter((id) => id !== ruleId)
        : [...prev, ruleId]
    );
  };

  const resetTradeForm = () => {
    setTradeForm({
      instrument: "",
      quantity: "",
      tradeType: "BUY",
      buyingPrice: "",
      equityType: "EQUITY",
      exchangeCharges: "",
      brokerage: "",
      time: new Date().toISOString().slice(0, 16),
    });
    setEditingTrade(null);
  };

  const handleEditTrade = (trade) => {
    setEditingTrade(trade);
    setTradeForm({
      ...trade,
      time: new Date(trade.time).toISOString().slice(0, 16),
    });
  };

  // Render Component
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Trading Journal Dashboard</h1>

      <Tabs defaultValue="journal" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="journal">Journal</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
        </TabsList>

        <TabsContent value="journal">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {todayJournal
                  ? "Edit Today's Journal Entry"
                  : "Create Journal Entry"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitJournal} className="space-y-4">
                <Textarea
                  name="notes"
                  placeholder="Notes"
                  value={journalData.notes}
                  onChange={handleJournalChange}
                />
                <Textarea
                  name="mistakes"
                  placeholder="Mistakes"
                  value={journalData.mistakes}
                  onChange={handleJournalChange}
                />
                <Textarea
                  name="lessons"
                  placeholder="Lessons"
                  value={journalData.lessons}
                  onChange={handleJournalChange}
                />
                <Input type="file" onChange={handleFileChange} />
                <div className="space-y-2">
                  {rules.map((rule) => (
                    <div key={rule._id} className="flex items-center space-x-2">
                      <Checkbox
                        id={rule._id}
                        checked={checkedRules.includes(rule._id)}
                        onCheckedChange={() => handleRuleCheck(rule._id)}
                      />
                      <label htmlFor={rule._id}>{rule.description}</label>
                    </div>
                  ))}
                </div>
                <Button type="submit">
                  {todayJournal ? "Update Journal" : "Create Journal"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Manage Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Input
                  placeholder="New rule"
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                />
                <Button onClick={handleCreateRule}>Add Rule</Button>
              </div>
              <div className="space-y-2">
                {rules.map((rule) => (
                  <div key={rule._id} className="flex items-center space-x-2">
                    {editingRule === rule._id ? (
                      <Input
                        value={rule.description}
                        onChange={(e) =>
                          setRules(
                            rules.map((r) =>
                              r._id === rule._id
                                ? { ...r, description: e.target.value }
                                : r
                            )
                          )
                        }
                        onBlur={() =>
                          handleUpdateRule(rule._id, rule.description)
                        }
                      />
                    ) : (
                      <span>{rule.description}</span>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => setEditingRule(rule._id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteRule(rule._id)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Journal Entries</CardTitle>
            </CardHeader>
            <CardContent>
              {journals?.length > 0 ? (
                journals.map((journal) => (
                  <div key={journal._id} className="mb-4 p-4 border rounded">
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(journal.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Notes:</strong> {journal.notes}
                    </p>
                    <p>
                      <strong>Mistakes:</strong> {journal.mistakes}
                    </p>
                    <p>
                      <strong>Lessons:</strong> {journal.lessons}
                    </p>
                    {journal.attachments && journal.attachments.length > 0 && (
                      <p>
                        <strong>Attachments:</strong>{" "}
                        {journal.attachments.join(", ")}
                      </p>
                    )}
                    {journal.rules && journal.rules.length > 0 && (
                      <p>
                        <strong>Rules followed:</strong>{" "}
                        {journal.rules
                          .map((rule) => rule.description)
                          .join(", ")}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No journal entries found
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trades">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingTrade ? "Edit Trade" : "Add New Trade"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTradeSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Instrument"
                    value={tradeForm.instrument}
                    onChange={(e) =>
                      setTradeForm({ ...tradeForm, instrument: e.target.value })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={tradeForm.quantity}
                    onChange={(e) =>
                      setTradeForm({ ...tradeForm, quantity: e.target.value })
                    }
                  />
                  <Select
                    value={tradeForm.tradeType}
                    onValueChange={(value) =>
                      setTradeForm({ ...tradeForm, tradeType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Trade Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BUY">Buy</SelectItem>
                      <SelectItem value="SELL">Sell</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={tradeForm.equityType}
                    onValueChange={(value) =>
                      setTradeForm({ ...tradeForm, equityType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Equity Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EQUITY">Equity</SelectItem>
                      <SelectItem value="FNO">F&O</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Buying Price"
                    value={tradeForm.buyingPrice}
                    onChange={(e) =>
                      setTradeForm({
                        ...tradeForm,
                        buyingPrice: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Exchange Charges"
                    value={tradeForm.exchangeCharges}
                    onChange={(e) =>
                      setTradeForm({
                        ...tradeForm,
                        exchangeCharges: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Brokerage"
                    value={tradeForm.brokerage}
                    onChange={(e) =>
                      setTradeForm({ ...tradeForm, brokerage: e.target.value })
                    }
                  />
                  <Input
                    type="datetime-local"
                    value={tradeForm.time}
                    onChange={(e) =>
                      setTradeForm({ ...tradeForm, time: e.target.value })
                    }
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit">
                    {editingTrade ? "Update Trade" : "Add Trade"}
                  </Button>
                  {editingTrade && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetTradeForm}
                    >
                      Cancel Edit
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trade History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trades.map((trade) => (
                  <div
                    key={trade._id}
                    className="p-4 border rounded flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold">{trade.instrument}</p>
                      <p>
                        {trade.tradeType} - {trade.quantity} units at ₹
                        {trade.buyingPrice}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(trade.time), "PPpp")}
                      </p>
                      <p className="text-sm">
                        Charges: ₹{trade.exchangeCharges} | Brokerage: ₹
                        {trade.brokerage}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handleEditTrade(trade)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteTrade(trade._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}