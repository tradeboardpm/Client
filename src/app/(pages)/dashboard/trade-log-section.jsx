import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Plus, Import, Search, SquarePen, Trash2, Info } from 'lucide-react';
import { cn } from "@/lib/utils";
import axios from "axios";
import Cookies from "js-cookie";
import { ImportTradeDialog } from "./import-trade";
import { calculateExchangeCharges } from "@/utils/calculateExchangeCharges";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";


export function TradesSection({ selectedDate, brokerage }) {
  const [trades, setTrades] = useState([]);
  const [tradeSummary, setTradeSummary] = useState({
    totalPnL: 0,
    totalCharges: 0,
    totalNetPnL: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [addTradeOpen, setAddTradeOpen] = useState(false);
  const [editOpenTradeOpen, setEditOpenTradeOpen] = useState(false);
  const [editCompleteTradeOpen, setEditCompleteTradeOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [newTrade, setNewTrade] = useState({
    instrumentName: "",
    quantity: null,
    action: "buy",
    buyingPrice: null,
    sellingPrice: null,
    brokerage: brokerage,
    exchangeRate: 0,
    time: format(new Date(), "HH:mm"),
    equityType: "INTRADAY",
  });

  const [importDialogOpen, setImportDialogOpen] = useState(false);

  useEffect(() => {
    fetchTradesData();
  }, [selectedDate]);

  useEffect(() => {
    if (
      newTrade.quantity &&
      newTrade.action &&
      newTrade.equityType &&
      (newTrade.buyingPrice || newTrade.sellingPrice)
    ) {
      const price =
        newTrade.action === "buy"
          ? newTrade.buyingPrice
          : newTrade.sellingPrice;
      const exchangeCharges = calculateExchangeCharges(
        newTrade.equityType,
        newTrade.action,
        price,
        newTrade.quantity
      );
      setNewTrade((prev) => ({ ...prev, exchangeRate: exchangeCharges }));
    }
  }, [
    newTrade.buyingPrice,
    newTrade.sellingPrice,
    newTrade.quantity,
    newTrade.action,
    newTrade.equityType,
  ]);

  const getUTCDate = (date) => {
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
  };

  const fetchTradesData = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      const utcDate = getUTCDate(selectedDate);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/trades/by-date`,
        {
          params: { date: utcDate.toISOString() },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTrades(response.data.trades);
      setTradeSummary(response.data.summary);
    } catch (error) {
      console.error("Error fetching trades data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTradeSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      const utcDate = getUTCDate(selectedDate);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/trades`,
        {
          ...newTrade,
          instrumentName: newTrade.instrumentName.toUpperCase(),
          date: utcDate.toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTradesData();
      setAddTradeOpen(false);
      resetNewTrade();
    } catch (error) {
      console.error("Error submitting trade:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenTradeEdit = async () => {
    if (!selectedTrade) return;
    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      const exchangeCharges = calculateExchangeCharges(
        selectedTrade.equityType,
        selectedTrade.action,
        selectedTrade.action === "buy" ? selectedTrade.buyingPrice : selectedTrade.sellingPrice,
        selectedTrade.quantity
      );
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/trades/open/${selectedTrade._id}`,
        {
          ...selectedTrade,
          instrumentName: selectedTrade.instrumentName.toUpperCase(),
          exchangeRate: exchangeCharges,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTradesData();
      setEditOpenTradeOpen(false);
      setSelectedTrade(null);
    } catch (error) {
      console.error("Error editing open trade:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteTradeEdit = async () => {
    if (!selectedTrade) return;
    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      const buyExchangeCharges = calculateExchangeCharges(
        selectedTrade.equityType,
        "buy",
        selectedTrade.buyingPrice,
        selectedTrade.quantity
      );
      const sellExchangeCharges = calculateExchangeCharges(
        selectedTrade.equityType,
        "sell",
        selectedTrade.sellingPrice,
        selectedTrade.quantity
      );
      const totalExchangeCharges = buyExchangeCharges + sellExchangeCharges;
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/trades/complete/${selectedTrade._id}`,
        {
          ...selectedTrade,
          instrumentName: selectedTrade.instrumentName.toUpperCase(),
          exchangeRate: totalExchangeCharges,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTradesData();
      setEditCompleteTradeOpen(false);
      setSelectedTrade(null);
    } catch (error) {
      console.error("Error editing complete trade:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTradeDelete = async () => {
    if (!selectedTrade) return;
    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/trades/${selectedTrade._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTradesData();
      setDeleteDialogOpen(false);
      setSelectedTrade(null);
    } catch (error) {
      console.error("Error deleting trade:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetNewTrade = () => {
    setNewTrade({
      instrumentName: "",
      quantity: null,
      action: "buy",
      buyingPrice: null,
      sellingPrice: null,
      brokerage: brokerage,
      exchangeRate: 0,
      time: format(new Date(), "HH:mm"),
      equityType: "INTRADAY",
    });
  };

  const filteredTrades = trades.filter((trade) =>
    trade.instrumentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateTotalOrder = (trade) => {
    const price =
      trade.action === "buy" ? trade.buyingPrice : trade.sellingPrice;
    return trade.quantity * price + trade.exchangeRate + trade.brokerage;
  };

  return (
    <Card className=" shadow-[0px_8px_20px_rgba(0,0,0,0.08)] dark:shadow-[0px_8px_20px_rgba(0,0,0,0.32)] p-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-3 border-b border-primary/15">
        <div className="space-y-1 text-xl">
          <CardTitle>Trade Log</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setAddTradeOpen(true)} className="bg-primary">
            <Plus className="mr-2 h-4 w-4" /> Add Trade
          </Button>
          <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
            <Import className="mr-2 h-4 w-4" /> Import Trade
          </Button>
          <ImportTradeDialog
            open={importDialogOpen}
            onOpenChange={setImportDialogOpen}
            onImportComplete={fetchTradesData}
            defaultBrokerage={brokerage}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 mt-3">
        {trades.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold">
                Total Trades ({filteredTrades.length})
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search trades..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className=" text-xs pl-8"
                />
              </div>
            </div>

            <div className="rounded-lg overflow-hidden">
              <div className="rounded-lg overflow-hidden border">
                <Table className="rounded-b-lg overflow-hidden bg-background">
                  <TableHeader className="bg-[#F4E4FF] dark:bg-[#49444c]">
                    <TableRow className="border-none text-xs">
                      <TableHead className="text-nowrap text-center font-semibold  text-foreground">
                        Date
                      </TableHead>
                      <TableHead className="text-nowrap text-center font-semibold  text-foreground">
                        Instrument
                      </TableHead>
                      <TableHead className="text-nowrap text-center font-semibold  text-foreground">
                        Equity Type
                      </TableHead>
                      <TableHead className="text-nowrap text-center font-semibold  text-foreground">
                        Quantity
                      </TableHead>
                      <TableHead className="text-nowrap text-center font-semibold  text-foreground">
                        Buying Price
                      </TableHead>
                      <TableHead className="text-nowrap text-center font-semibold  text-foreground">
                        Selling Price
                      </TableHead>
                      <TableHead className="text-nowrap text-center font-semibold  text-foreground">
                        Exchange charges
                      </TableHead>
                      <TableHead className="text-nowrap text-center font-semibold  text-foreground">
                        Brokerage
                      </TableHead>
                      <TableHead className="text-nowrap text-center font-semibold  text-foreground">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-xs">
                    {filteredTrades.map((trade) => (
                      <TableRow key={trade._id}>
                        <TableCell className="text-nowrap text-center">
                          {format(new Date(trade.date), "dd-MM-yyyy")}
                          {", "}
                          {trade.time}
                        </TableCell>
                        <TableCell
                          className={cn(
                            !trade.buyingPrice || !trade.sellingPrice
                              ? "text-foreground font-semibold text-center"
                              : trade.buyingPrice < trade.sellingPrice
                              ? "text-[#0ED991] font-semibold text-center"
                              : "text-[#F44C60]/25 font-semibold text-center"
                          )}
                        >
                          {trade.instrumentName}
                        </TableCell>
                        <TableCell className="text-nowrap text-center">
                          {trade.equityType}
                        </TableCell>
                        <TableCell className="text-nowrap text-center">
                          {trade.quantity}
                        </TableCell>
                        <TableCell className="text-nowrap text-center">
                          {trade.buyingPrice ? `₹ ${trade.buyingPrice}` : "-"}
                        </TableCell>
                        <TableCell className="text-nowrap text-center">
                          {trade.sellingPrice ? `₹ ${trade.sellingPrice}` : "-"}
                        </TableCell>
                        <TableCell className="text-nowrap text-center">
                          ₹ {trade.exchangeRate.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-nowrap text-center">
                          ₹ {trade.brokerage}
                        </TableCell>
                        <TableCell className="text-nowrap text-center">
                          <div className="flex items-center gap-2">
                            <button
                              className="text-gray-500/35"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedTrade(trade);
                                trade.isOpen
                                  ? setEditOpenTradeOpen(true)
                                  : setEditCompleteTradeOpen(true);
                              }}
                            >
                              <SquarePen className="h-4 w-4" />
                            </button>
                            <button
                              className="text-gray-500/35"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedTrade(trade);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {trades.length > 0 && (
                <div className="flex gap-6 items-center justify-between mt-6">
                  <div
                    className={`rounded-lg p-1 flex items-center gap-2 w-fit px-4 ${
                      tradeSummary.totalPnL >= 0
                        ? "bg-[#0ED991]/15"
                        : "bg-[#F44C60]/15"
                    }`}
                  >
                    <div
                      className={`text-sm font-normal ${
                        tradeSummary.totalPnL >= 0
                          ? "text-[#0ED991]"
                          : "text-[#F44C60]"
                      }`}
                    >
                      Today's Profit:
                    </div>
                    <div
                      className={`text-base font-medium ${
                        tradeSummary.totalPnL >= 0
                          ? "text-[#0ED991]"
                          : "text-[#F44C60]"
                      }`}
                    >
                      ₹ {tradeSummary.totalPnL.toFixed(2)}
                    </div>
                  </div>

                  <div className="rounded-lg bg-primary/20 flex items-center gap-2 p-1 w-fit px-4">
                    <div className="text-sm font-medium text-primary">
                      <span className="flex gap-1 items-center">
                        Today's Charges
                        <HoverCard>
                          <HoverCardTrigger>
                            <Info className="h-4 w-4 text-primary cursor-pointer" />
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="flex flex-col gap-2">
                              <p className="text-sm text-muted-foreground">
                                Today's Charges = Exchange charges + Brokerage
                              </p>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                        :
                      </span>
                    </div>
                    <div className="text-base font-medium text-primary">
                      ₹ {tradeSummary.totalCharges.toFixed(2)}
                    </div>
                  </div>

                  <div
                    className={`rounded-lg p-1 flex items-center gap-2 w-fit px-4 ${
                      tradeSummary.totalNetPnL >= 0
                        ? "bg-[#0ED991]/15"
                        : "bg-[#F44C60]/15"
                    }`}
                  >
                    <div
                      className={`text-sm font-normal ${
                        tradeSummary.totalNetPnL >= 0
                          ? "text-[#0ED991]"
                          : "text-[#F44C60]"
                      }`}
                    >
                      Net Realised P&L:
                    </div>
                    <div
                      className={`text-base font-medium ${
                        tradeSummary.totalNetPnL >= 0
                          ? "text-[#0ED991]"
                          : "text-[#F44C60]"
                      }`}
                    >
                      ₹ {tradeSummary.totalNetPnL?.toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <img
              src="/images/no_trade.svg"
              alt="No trades"
              className="w-64 h-64 mb-6"
            />
            <h3 className="text-xl font-semibold mb-2">Get Started!</h3>
            <p className="text-muted-foreground mb-6">
              Please click on buttons to add or import your today's trades
            </p>
          </div>
        )}
      </CardContent>

      {/* Add Trade Dialog */}
      <Dialog open={addTradeOpen} onOpenChange={setAddTradeOpen}>
        <DialogContent className="md:max-w-[50vw]">
          <DialogHeader className="border-b pb-4">
            <DialogTitle>Add Trade</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-2">
                <Label>Instrument Name</Label>
                <Input
                  value={newTrade.instrumentName}
                  onChange={(e) =>
                    setNewTrade({
                      ...newTrade,
                      instrumentName: e.target.value.toUpperCase(),
                    })
                  }
                />
              </div>

              <div className="col-span-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={newTrade.quantity ?? ""}
                  onChange={(e) =>
                    setNewTrade({
                      ...newTrade,
                      quantity: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-2">
                <Label>Trade Type</Label>
                <RadioGroup
                  className="flex space-x-4"
                  value={newTrade.action}
                  onValueChange={(value) =>
                    setNewTrade({ ...newTrade, action: value })
                  }
                >
                  <div
                    className={cn(
                      "flex items-center space-x-2 border border-border/25 shadow rounded-lg w-36 p-2",
                      newTrade.action === "buy" ? "bg-[#A073F01A]" : "bg-card"
                    )}
                  >
                    <RadioGroupItem value="buy" id="buy" />
                    <Label htmlFor="buy" className="w-full">
                      Buy
                    </Label>
                  </div>
                  <div
                    className={cn(
                      "flex items-center space-x-2 border border-border/25 shadow rounded-lg w-36 p-2",
                      newTrade.action === "sell" ? "bg-[#A073F01A]" : "bg-card"
                    )}
                  >
                    <RadioGroupItem value="sell" id="sell" />
                    <Label htmlFor="sell" className="w-full">
                      Sell
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="col-span-2">
                <Label>
                  {newTrade.action === "buy" ? "Buying" : "Selling"} Price
                </Label>
                <Input
                  type="number"
                  value={
                    newTrade.action === "buy"
                      ? newTrade.buyingPrice ?? ""
                      : newTrade.sellingPrice ?? ""
                  }
                  onChange={(e) => {
                    const price = Number(e.target.value);
                    setNewTrade({
                      ...newTrade,
                      [newTrade.action === "buy"
                        ? "buyingPrice"
                        : "sellingPrice"]: price,
                    });
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-2">
                <Label>Equity Type</Label>
                <Select
                  value={newTrade.equityType}
                  onValueChange={(value) =>
                    setNewTrade({ ...newTrade, equityType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="F&O-OPTIONS">F&O-OPTIONS</SelectItem>
                    <SelectItem value="F&O-FUTURES">F&O-FUTURES</SelectItem>
                    <SelectItem value="INTRADAY">INTRADAY</SelectItem>
                    <SelectItem value="DELIVERY">DELIVERY</SelectItem>
                    <SelectItem value="OTHERS">OTHERS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>Time</Label>
                <Input
                  type="time"
                  value={newTrade.time}
                  onChange={(e) =>
                    setNewTrade({ ...newTrade, time: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-2">
                <Label>Exchange Charges (₹)</Label>
                <Input type="number" value={newTrade.exchangeRate} readOnly />
              </div>
              <div className="col-span-2">
                <Label>Brokerage (₹)</Label>
                <Input
                  type="number"
                  value={newTrade.brokerage}
                  onChange={(e) =>
                    setNewTrade({
                      ...newTrade,
                      brokerage: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="bg-secondary/50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Order Amount:</span>
                <span className="text-base font-medium">
                  ₹ {calculateTotalOrder(newTrade)}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddTradeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleTradeSubmit} className="bg-primary">
              Add Trade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Open Trade Dialog */}
      <Dialog open={editOpenTradeOpen} onOpenChange={setEditOpenTradeOpen}>
        <DialogContent className="md:max-w-[50vw]">
          <DialogHeader className="border-b pb-4">
            <DialogTitle>Edit Open Trade</DialogTitle>
          </DialogHeader>
          {selectedTrade && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-span-2">
                  <Label>Instrument Name</Label>
                  <Input
                    value={selectedTrade.instrumentName}
                    onChange={(e) =>
                      setSelectedTrade({
                        ...selectedTrade,
                        instrumentName: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={selectedTrade.quantity}
                    onChange={(e) =>
                      setSelectedTrade({
                        ...selectedTrade,
                        quantity: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-span-2">
                  <Label>Trade Type</Label>
                  <RadioGroup
                    className="flex space-x-4"
                    value={selectedTrade.action}
                    onValueChange={(value) =>
                      setSelectedTrade({ ...selectedTrade, action: value })
                    }
                  >
                    <div
                      className={cn(
                        "flex items-center space-x-2 border border-border/25 shadow rounded-lg w-36 p-2",
                        selectedTrade.action === "buy"
                          ? "bg-[#A073F01A]"
                          : "bg-card"
                      )}
                    >
                      <RadioGroupItem value="buy" id="edit-open-buy" />
                      <Label htmlFor="edit-open-buy" className="w-full">
                        Buy
                      </Label>
                    </div>
                    <div
                      className={cn(
                        "flex items-center space-x-2 border border-border/25 shadow rounded-lg w-36 p-2",
                        selectedTrade.action === "sell"
                          ? "bg-[#A073F01A]"
                          : "bg-card"
                      )}
                    >
                      <RadioGroupItem value="sell" id="edit-open-sell" />
                      <Label htmlFor="edit-open-sell" className="w-full">
                        Sell
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="col-span-2">
                  <Label>
                    {selectedTrade.action === "buy" ? "Buying" : "Selling"}{" "}
                    Price
                  </Label>
                  <Input
                    type="number"
                    value={
                      selectedTrade.action === "buy"
                        ? selectedTrade.buyingPrice ?? ""
                        : selectedTrade.sellingPrice ?? ""
                    }
                    onChange={(e) => {
                      const price = Number(e.target.value);
                      setSelectedTrade({
                        ...selectedTrade,
                        [selectedTrade.action === "buy"
                          ? "buyingPrice"
                          : "sellingPrice"]: price,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-span-2">
                  <Label>Equity Type</Label>
                  <Select
                    value={selectedTrade.equityType}
                    onValueChange={(value) =>
                      setSelectedTrade({ ...selectedTrade, equityType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="F&O-OPTIONS">F&O-OPTIONS</SelectItem>
                      <SelectItem value="F&O-FUTURES">F&O-FUTURES</SelectItem>
                      <SelectItem value="INTRADAY">INTRADAY</SelectItem>
                      <SelectItem value="DELIVERY">DELIVERY</SelectItem>
                      <SelectItem value="OTHERS">OTHERS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={selectedTrade.time}
                    onChange={(e) =>
                      setSelectedTrade({
                        ...selectedTrade,
                        time: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-span-2">
                  <Label>Exchange Charges (₹)</Label>
                  <Input
                    type="number"
                    value={calculateExchangeCharges(
                      selectedTrade.equityType,
                      selectedTrade.action,
                      selectedTrade.action === "buy"
                        ? selectedTrade.buyingPrice
                        : selectedTrade.sellingPrice,
                      selectedTrade.quantity
                    )}
                    readOnly
                  />
                </div>
                <div className="col-span-2">
                  <Label>Brokerage (₹)</Label>
                  <Input
                    type="number"
                    value={selectedTrade.brokerage}
                    onChange={(e) =>
                      setSelectedTrade({
                        ...selectedTrade,
                        brokerage: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Order Amount:</span>
                  <span className="text-base font-medium">
                    ₹ {calculateTotalOrder(selectedTrade)}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditOpenTradeOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleOpenTradeEdit} className="bg-primary">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Complete Trade Dialog */}
      <Dialog
        open={editCompleteTradeOpen}
        onOpenChange={setEditCompleteTradeOpen}
      >
        <DialogContent className="md:max-w-[50vw]">
          <DialogHeader className="border-b pb-4">
            <DialogTitle>Edit Complete Trade</DialogTitle>
          </DialogHeader>
          {selectedTrade && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-span-2">
                  <Label>Instrument Name</Label>
                  <Input
                    value={selectedTrade.instrumentName}
                    onChange={(e) =>
                      setSelectedTrade({
                        ...selectedTrade,
                        instrumentName: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={selectedTrade.quantity}
                    onChange={(e) =>
                      setSelectedTrade({
                        ...selectedTrade,
                        quantity: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-span-2">
                  <Label>Buying Price</Label>
                  <Input
                    type="number"
                    value={selectedTrade.buyingPrice ?? ""}
                    onChange={(e) =>
                      setSelectedTrade({
                        ...selectedTrade,
                        buyingPrice: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label>Selling Price</Label>
                  <Input
                    type="number"
                    value={selectedTrade.sellingPrice ?? ""}
                    onChange={(e) =>
                      setSelectedTrade({
                        ...selectedTrade,
                        sellingPrice: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-span-2">
                  <Label>Equity Type</Label>
                  <Select
                    value={selectedTrade.equityType}
                    onValueChange={(value) =>
                      setSelectedTrade({ ...selectedTrade, equityType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="F&O-OPTIONS">F&O-OPTIONS</SelectItem>
                      <SelectItem value="F&O-FUTURES">F&O-FUTURES</SelectItem>
                      <SelectItem value="INTRADAY">INTRADAY</SelectItem>
                      <SelectItem value="DELIVERY">DELIVERY</SelectItem>
                      <SelectItem value="OTHERS">OTHERS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={selectedTrade.time}
                    onChange={(e) =>
                      setSelectedTrade({
                        ...selectedTrade,
                        time: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-span-2">
                  <Label>Exchange Charges (₹)</Label>
                  <Input
                    type="number"
                    value={
                      calculateExchangeCharges(
                        selectedTrade.equityType,
                        "buy",
                        selectedTrade.buyingPrice,
                        selectedTrade.quantity
                      ) +
                      calculateExchangeCharges(
                        selectedTrade.equityType,
                        "sell",
                        selectedTrade.sellingPrice,
                        selectedTrade.quantity
                      )
                    }
                    readOnly
                  />
                </div>
                <div className="col-span-2">
                  <Label>Brokerage (₹)</Label>
                  <Input
                    type="number"
                    value={selectedTrade.brokerage}
                    onChange={(e) =>
                      setSelectedTrade({
                        ...selectedTrade,
                        brokerage: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Order Amount:</span>
                  <span className="text-base font-medium">
                    ₹ {calculateTotalOrder(selectedTrade)}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditCompleteTradeOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCompleteTradeEdit} className="bg-primary">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Trade</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this trade? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleTradeDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

