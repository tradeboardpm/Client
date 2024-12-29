import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import axios from "axios";
import Cookies from "js-cookie";
import { calculateExchangeCharges } from "@/utils/calculateExchangeCharges";
import { cn } from "@/lib/utils";

export function AddTradeDialog({ open, onOpenChange, onSubmit, brokerage, selectedDate }) {
  const [newTrade, setNewTrade] = useState({
    instrumentName: "",
    quantity: null,
    action: "buy",
    buyingPrice: null,
    sellingPrice: null,
    brokerage: brokerage,
    exchangeRate: 0,
    time: format(selectedDate, "HH:mm"),
    equityType: "INTRADAY",
  });

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

  const handleTradeSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");
      const utcDate = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()));
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
      onSubmit();
      onOpenChange(false);
      resetNewTrade();
    } catch (error) {
      console.error("Error submitting trade:", error);
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
      time: format(selectedDate, "HH:mm"),
      equityType: "INTRADAY",
    });
  };

  const calculateTotalOrder = (trade) => {
    const price =
      trade.action === "buy" ? trade.buyingPrice : trade.sellingPrice;
    return trade.quantity * price + trade.exchangeRate + trade.brokerage;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <div className="bg-[#F4E4FF] dark:bg-[#312d33] p-4 rounded-lg">
            <div className="flex justify-start gap-2 items-center">
              <span className="font-medium">Total Order Amount:</span>
              <span className="text-base font-medium text-primary">
                ₹ {calculateTotalOrder(newTrade)}
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleTradeSubmit} className="bg-primary">
            Add Trade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

