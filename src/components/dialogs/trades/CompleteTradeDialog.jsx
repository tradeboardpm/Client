import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import axios from "axios";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";
import {
  calculateCharges,
  EQUITY_TYPES,
  TRANSACTION_TYPES,
} from "@/utils/calculateExchangeCharges";

export function CompleteTradeDialog({
  open,
  onOpenChange,
  onSubmit,
  trade,
  brokerage,
  selectedDate,
}) {
  const [completeTrade, setCompleteTrade] = useState({
    instrumentName: "",
    quantity: null,
    action: TRANSACTION_TYPES.SELL,
    buyingPrice: null,
    sellingPrice: null,
    brokerage: brokerage,
    exchangeRate: 0,
    time: format(selectedDate, "HH:mm"),
    equityType: "",
  });

  const [error, setError] = useState("");
  const [charges, setCharges] = useState(null);

  useEffect(() => {
    if (trade) {
      setCompleteTrade({
        instrumentName: trade.instrumentName,
        quantity: trade.quantity,
        action:
          trade.action === TRANSACTION_TYPES.BUY
            ? TRANSACTION_TYPES.SELL
            : TRANSACTION_TYPES.BUY,
        buyingPrice: null,
        sellingPrice: null,
        brokerage: brokerage,
        exchangeRate: 0,
        time: format(selectedDate, "HH:mm"),
        equityType: trade.equityType,
      });
    }
  }, [trade, selectedDate, brokerage]);

  useEffect(() => {
    if (
      completeTrade.quantity &&
      completeTrade.action &&
      completeTrade.equityType &&
      (completeTrade.buyingPrice || completeTrade.sellingPrice)
    ) {
      const price =
        completeTrade.action === TRANSACTION_TYPES.BUY
          ? completeTrade.buyingPrice
          : completeTrade.sellingPrice;
      const calculatedCharges = calculateCharges({
        equityType: completeTrade.equityType,
        action: completeTrade.action,
        price,
        quantity: completeTrade.quantity,
        brokerage: completeTrade.brokerage,
      });
      setCharges(calculatedCharges);
      setCompleteTrade((prev) => ({
        ...prev,
        exchangeRate: calculatedCharges.exchangeCharges,
      }));
    }
  }, [
    completeTrade.buyingPrice,
    completeTrade.sellingPrice,
    completeTrade.quantity,
    completeTrade.action,
    completeTrade.equityType,
    completeTrade.brokerage,
  ]);

  const validateTrade = () => {
    if (!completeTrade.quantity || completeTrade.quantity <= 0) {
      setError("Quantity must be greater than zero");
      return false;
    }

    if (
      completeTrade.action === TRANSACTION_TYPES.BUY &&
      !completeTrade.buyingPrice
    ) {
      setError("Please enter a buying price");
      return false;
    }
    if (
      completeTrade.action === TRANSACTION_TYPES.SELL &&
      !completeTrade.sellingPrice
    ) {
      setError("Please enter a selling price");
      return false;
    }
    setError("");
    return true;
  };

  const handleTradeSubmit = async (e) => {
    e.preventDefault();

    if (!validateTrade()) {
      return;
    }

    try {
      const token = Cookies.get("token");
      const utcDate = new Date(
        Date.UTC(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        )
      );

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/trades`,
        {
          instrumentName: completeTrade.instrumentName.toUpperCase(),
          quantity: completeTrade.quantity,
          action: completeTrade.action,
          buyingPrice: completeTrade.buyingPrice,
          sellingPrice: completeTrade.sellingPrice,
          brokerage: completeTrade.brokerage,
          exchangeRate: completeTrade.exchangeRate,
          time: completeTrade.time,
          equityType: completeTrade.equityType,
          date: utcDate.toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onSubmit();
      onOpenChange(false);
    } catch (error) {
      console.error("Error completing trade:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[50vw]">
        <DialogHeader className="border-b pb-4">
          <DialogTitle>Complete Trade</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-2">
              <Label>Instrument Name</Label>
              <Input value={completeTrade.instrumentName} disabled />
            </div>
            <div className="col-span-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                value={completeTrade.quantity ?? ""}
                onChange={(e) =>
                  setCompleteTrade({
                    ...completeTrade,
                    quantity: Number(e.target.value),
                  })
                }
              />
              {error && error.includes("Quantity") && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-2">
              <Label>Trade Type</Label>
              <RadioGroup
                className="flex space-x-4"
                value={completeTrade.action}
                disabled
              >
                <div
                  className={cn(
                    "flex items-center space-x-2 border border-border/25 shadow rounded-lg w-36 p-2",
                    completeTrade.action === "buy"
                      ? "bg-[#A073F01A]"
                      : "bg-card"
                  )}
                >
                  <RadioGroupItem value="buy" id="complete-buy" disabled />
                  <Label htmlFor="complete-buy" className="w-full">
                    Buy
                  </Label>
                </div>
                <div
                  className={cn(
                    "flex items-center space-x-2 border border-border/25 shadow rounded-lg w-36 p-2",
                    completeTrade.action === "sell"
                      ? "bg-[#A073F01A]"
                      : "bg-card"
                  )}
                >
                  <RadioGroupItem value="sell" id="complete-sell" disabled />
                  <Label htmlFor="complete-sell" className="w-full">
                    Sell
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="col-span-2">
              <Label>
                {completeTrade.action === "buy" ? "Buying" : "Selling"} Price
              </Label>
              <Input
                type="number"
                value={
                  completeTrade.action === "buy"
                    ? completeTrade.buyingPrice ?? ""
                    : completeTrade.sellingPrice ?? ""
                }
                onChange={(e) => {
                  const price = Number(e.target.value);
                  setError("");
                  setCompleteTrade({
                    ...completeTrade,
                    [completeTrade.action === "buy"
                      ? "buyingPrice"
                      : "sellingPrice"]: price,
                  });
                }}
              />
              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-2">
              <Label>Equity Type</Label>
              <Input value={completeTrade.equityType} disabled />
            </div>
            <div className="col-span-2">
              <Label>Time</Label>
              <Input
                type="time"
                value={completeTrade.time}
                onChange={(e) =>
                  setCompleteTrade({ ...completeTrade, time: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-2">
              <Label>Exchange Charges (₹)</Label>
              <Input
                type="number"
                value={charges ? charges.exchangeCharges.toFixed(2) : "0.00"}
                readOnly
              />
            </div>
            <div className="col-span-2">
              <Label>Brokerage (₹)</Label>
              <Input
                type="number"
                value={completeTrade.brokerage}
                onChange={(e) =>
                  setCompleteTrade({
                    ...completeTrade,
                    brokerage: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
          {charges && (
            <div className="bg-[#F4E4FF] dark:bg-[#312d33] p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Charges:</span>
                <span className="text-base font-medium text-primary">
                  ₹ {charges.totalCharges.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-medium">Break-even Point:</span>
                <span className="text-base font-medium text-primary">
                  ₹ {charges.breakEvenPoints.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleTradeSubmit} className="bg-primary">
            Complete Trade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
