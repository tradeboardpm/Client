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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import axios from "axios";
import Cookies from "js-cookie";
import {
  calculateCharges,
  EQUITY_TYPES,
  TRANSACTION_TYPES,
} from "@/utils/tradeCalculations";
import { cn } from "@/lib/utils";

export function AddTradeDialog({
  open,
  onOpenChange,
  onSubmit,
  brokerage: initialBrokerage,
  selectedDate,
}) {
  const [newTrade, setNewTrade] = useState({
    instrumentName: "",
    quantity: null,
    action: TRANSACTION_TYPES.BUY,
    buyingPrice: null,
    sellingPrice: null,
    brokerage: initialBrokerage,
    exchangeRate: 0,
    time: format(selectedDate, "HH:mm"),
    equityType: EQUITY_TYPES.INTRADAY,
  });

  const [error, setError] = useState("");
  const [calculatedExchangeRate, setCalculatedExchangeRate] = useState(0);
  const [exchangeRateEdited, setExchangeRateEdited] = useState(false);

  useEffect(() => {
    if (
      newTrade.quantity &&
      newTrade.action &&
      newTrade.equityType &&
      (newTrade.buyingPrice || newTrade.sellingPrice)
    ) {
      const price =
        newTrade.action === TRANSACTION_TYPES.BUY
          ? newTrade.buyingPrice
          : newTrade.sellingPrice;
      const charges = calculateCharges({
        equityType: newTrade.equityType,
        action: newTrade.action,
        price,
        quantity: newTrade.quantity,
        brokerage: newTrade.brokerage,
      });
      setCalculatedExchangeRate(charges.totalCharges - charges.brokerage);
      setNewTrade((prev) => ({
        ...prev,
        exchangeRate: charges.totalCharges - charges.brokerage,
      }));
    }
  }, [
    newTrade.buyingPrice,
    newTrade.sellingPrice,
    newTrade.quantity,
    newTrade.action,
    newTrade.equityType,
    newTrade.brokerage,
  ]);

  const handleTradeTypeChange = (value) => {
    setNewTrade((prev) => ({
      ...prev,
      action: value,
      buyingPrice: null,
      sellingPrice: null,
    }));
    setError("");
  };

  const validateTrade = () => {
    if (!newTrade.quantity || newTrade.quantity <= 0) {
      setError("Quantity must be greater than zero");
      return false;
    }

    if (newTrade.action === TRANSACTION_TYPES.BUY && !newTrade.buyingPrice) {
      setError("Please enter a buying price");
      return false;
    }
    if (newTrade.action === TRANSACTION_TYPES.SELL && !newTrade.sellingPrice) {
      setError("Please enter a selling price");
      return false;
    }
    setError("");
    return true;
  };

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    if (value < 0) return;
    setError("");
    setNewTrade({
      ...newTrade,
      quantity: value,
    });
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
      action: TRANSACTION_TYPES.BUY,
      buyingPrice: null,
      sellingPrice: null,
      brokerage: initialBrokerage,
      exchangeRate: 0,
      time: format(selectedDate, "HH:mm"),
      equityType: EQUITY_TYPES.INTRADAY,
    });
    setError("");
  };

  const calculateTotalOrder = (trade) => {
    const price =
      trade.action === TRANSACTION_TYPES.BUY
        ? trade.buyingPrice
        : trade.sellingPrice;
    const charges = calculateCharges({
      equityType: trade.equityType,
      action: trade.action,
      price,
      quantity: trade.quantity,
      brokerage: trade.brokerage,
    });
    return charges.turnover + charges.totalCharges;
  };

  const resetExchangeRate = () => {
    setNewTrade((prev) => ({ ...prev, exchangeRate: calculatedExchangeRate }));
    setExchangeRateEdited(false);
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
                min="1"
                value={newTrade.quantity ?? ""}
                onChange={handleQuantityChange}
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
                value={newTrade.action}
                onValueChange={handleTradeTypeChange}
              >
                <div
                  className={cn(
                    "flex items-center space-x-2 border border-border/25 shadow rounded-lg w-36 p-2",
                    newTrade.action === TRANSACTION_TYPES.BUY
                      ? "bg-[#A073F01A]"
                      : "bg-card"
                  )}
                >
                  <RadioGroupItem value={TRANSACTION_TYPES.BUY} id="buy" />
                  <Label htmlFor="buy" className="w-full">
                    Buy
                  </Label>
                </div>
                <div
                  className={cn(
                    "flex items-center space-x-2 border border-border/25 shadow rounded-lg w-36 p-2",
                    newTrade.action === TRANSACTION_TYPES.SELL
                      ? "bg-[#A073F01A]"
                      : "bg-card"
                  )}
                >
                  <RadioGroupItem value={TRANSACTION_TYPES.SELL} id="sell" />
                  <Label htmlFor="sell" className="w-full">
                    Sell
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="col-span-2">
              <Label>
                {newTrade.action === TRANSACTION_TYPES.BUY
                  ? "Buying"
                  : "Selling"}{" "}
                Price
              </Label>
              <Input
                type="number"
                value={
                  newTrade.action === TRANSACTION_TYPES.BUY
                    ? newTrade.buyingPrice ?? ""
                    : newTrade.sellingPrice ?? ""
                }
                onChange={(e) => {
                  const price = Number(e.target.value);
                  setError("");
                  setNewTrade({
                    ...newTrade,
                    [newTrade.action === TRANSACTION_TYPES.BUY
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
                  <SelectItem value={EQUITY_TYPES.FNO_OPTIONS}>
                    F&O-OPTIONS
                  </SelectItem>
                  <SelectItem value={EQUITY_TYPES.FNO_FUTURES}>
                    F&O-FUTURES
                  </SelectItem>
                  <SelectItem value={EQUITY_TYPES.INTRADAY}>
                    INTRADAY
                  </SelectItem>
                  <SelectItem value={EQUITY_TYPES.DELIVERY}>
                    DELIVERY
                  </SelectItem>
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
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={newTrade.exchangeRate}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setNewTrade({
                      ...newTrade,
                      exchangeRate: value,
                    });
                    setExchangeRateEdited(true);
                  }}
                />
                {exchangeRateEdited && (
                  <Button
                    onClick={resetExchangeRate}
                    variant="outline"
                    size="sm"
                  >
                    Reset
                  </Button>
                )}
              </div>
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
