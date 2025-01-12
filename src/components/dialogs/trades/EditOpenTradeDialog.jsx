import React from "react";
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
import axios from "axios";
import Cookies from "js-cookie";
import {
  calculateCharges,
  EQUITY_TYPES,
  TRANSACTION_TYPES,
} from "@/utils/tradeCalculations";
import { cn } from "@/lib/utils";

export function EditOpenTradeDialog({ open, onOpenChange, trade, onSubmit }) {
  const [editedTrade, setEditedTrade] = React.useState(trade);
  const [error, setError] = React.useState("");
  const [calculatedExchangeRate, setCalculatedExchangeRate] = React.useState(0);
  const [exchangeRateEdited, setExchangeRateEdited] = React.useState(false);

  React.useEffect(() => {
    setEditedTrade(trade);
    setError("");
  }, [trade]);

  React.useEffect(() => {
    if (editedTrade) {
      const charges = calculateCharges({
        equityType: editedTrade.equityType,
        action: editedTrade.action,
        price:
          editedTrade.action === TRANSACTION_TYPES.BUY
            ? editedTrade.buyingPrice
            : editedTrade.sellingPrice,
        quantity: editedTrade.quantity,
        brokerage: editedTrade.brokerage,
      });
      setCalculatedExchangeRate(charges.totalCharges - charges.brokerage);
    }
  }, [editedTrade]);

  const validateTrade = () => {
    if (!editedTrade.quantity || editedTrade.quantity <= 0) {
      setError("Quantity must be greater than zero");
      return false;
    }

    if (
      editedTrade.action === TRANSACTION_TYPES.BUY &&
      !editedTrade.buyingPrice
    ) {
      setError("Please enter a buying price");
      return false;
    }
    if (
      editedTrade.action === TRANSACTION_TYPES.SELL &&
      !editedTrade.sellingPrice
    ) {
      setError("Please enter a selling price");
      return false;
    }
    setError("");
    return true;
  };

  const handleTradeTypeChange = (value) => {
    setEditedTrade((prev) => ({
      ...prev,
      action: value,
      buyingPrice: null,
      sellingPrice: null,
    }));
    setError("");
  };

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    if (value < 0) return;
    setError("");
    setEditedTrade({
      ...editedTrade,
      quantity: value,
    });
  };

  const handleOpenTradeEdit = async () => {
    if (!editedTrade) return;
    if (!validateTrade()) return;

    try {
      const token = Cookies.get("token");
      const charges = calculateCharges({
        equityType: editedTrade.equityType,
        action: editedTrade.action,
        price:
          editedTrade.action === TRANSACTION_TYPES.BUY
            ? editedTrade.buyingPrice
            : editedTrade.sellingPrice,
        quantity: editedTrade.quantity,
        brokerage: editedTrade.brokerage,
      });
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/trades/open/${editedTrade._id}`,
        {
          ...editedTrade,
          instrumentName: editedTrade.instrumentName.toUpperCase(),
          exchangeRate: editedTrade.exchangeRate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onSubmit();
      onOpenChange(false);
      setError("");
    } catch (error) {
      console.error("Error editing open trade:", error);
    }
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
    setEditedTrade((prev) => ({
      ...prev,
      exchangeRate: calculatedExchangeRate,
    }));
    setExchangeRateEdited(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[50vw]">
        <DialogHeader className="border-b pb-4">
          <DialogTitle>Edit Open Trade</DialogTitle>
        </DialogHeader>
        {editedTrade && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-2">
                <Label>Instrument Name</Label>
                <Input
                  value={editedTrade.instrumentName}
                  onChange={(e) =>
                    setEditedTrade({
                      ...editedTrade,
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
                  value={editedTrade.quantity}
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
                  value={editedTrade.action}
                  onValueChange={handleTradeTypeChange}
                >
                  <div
                    className={cn(
                      "flex items-center space-x-2 border border-border/25 shadow rounded-lg w-36 p-2",
                      editedTrade.action === TRANSACTION_TYPES.BUY
                        ? "bg-[#A073F01A]"
                        : "bg-card"
                    )}
                  >
                    <RadioGroupItem
                      value={TRANSACTION_TYPES.BUY}
                      id="edit-open-buy"
                    />
                    <Label htmlFor="edit-open-buy" className="w-full">
                      Buy
                    </Label>
                  </div>
                  <div
                    className={cn(
                      "flex items-center space-x-2 border border-border/25 shadow rounded-lg w-36 p-2",
                      editedTrade.action === TRANSACTION_TYPES.SELL
                        ? "bg-[#A073F01A]"
                        : "bg-card"
                    )}
                  >
                    <RadioGroupItem
                      value={TRANSACTION_TYPES.SELL}
                      id="edit-open-sell"
                    />
                    <Label htmlFor="edit-open-sell" className="w-full">
                      Sell
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="col-span-2">
                <Label>
                  {editedTrade.action === TRANSACTION_TYPES.BUY
                    ? "Buying"
                    : "Selling"}{" "}
                  Price
                </Label>
                <Input
                  type="number"
                  value={
                    editedTrade.action === TRANSACTION_TYPES.BUY
                      ? editedTrade.buyingPrice ?? ""
                      : editedTrade.sellingPrice ?? ""
                  }
                  onChange={(e) => {
                    const price = Number(e.target.value);
                    setError("");
                    setEditedTrade({
                      ...editedTrade,
                      [editedTrade.action === TRANSACTION_TYPES.BUY
                        ? "buyingPrice"
                        : "sellingPrice"]: price,
                    });
                  }}
                />
                {error && !error.includes("Quantity") && (
                  <p className="text-sm text-red-500 mt-1">{error}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-2">
                <Label>Equity Type</Label>
                <Select
                  value={editedTrade.equityType}
                  onValueChange={(value) =>
                    setEditedTrade({ ...editedTrade, equityType: value })
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
                  value={editedTrade.time}
                  onChange={(e) =>
                    setEditedTrade({
                      ...editedTrade,
                      time: e.target.value,
                    })
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
                    value={editedTrade.exchangeRate}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setEditedTrade({
                        ...editedTrade,
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
                  value={editedTrade.brokerage}
                  onChange={(e) =>
                    setEditedTrade({
                      ...editedTrade,
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
                  ₹ {calculateTotalOrder(editedTrade)}
                </span>
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleOpenTradeEdit} className="bg-primary">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
