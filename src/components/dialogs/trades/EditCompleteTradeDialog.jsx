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
} from "@/utils/calculateExchangeCharges";

export function EditCompleteTradeDialog({
  open,
  onOpenChange,
  trade,
  onSubmit,
}) {
  const [editedTrade, setEditedTrade] = useState(trade);
  const [error, setError] = useState("");
  const [charges, setCharges] = useState(null);

  useEffect(() => {
    setEditedTrade(trade);
    setError(""); // Clear error when trade changes
  }, [trade]);

  useEffect(() => {
    if (editedTrade) {
      const buyCharges = calculateCharges({
        equityType: editedTrade.equityType,
        action: TRANSACTION_TYPES.BUY,
        price: editedTrade.buyingPrice,
        quantity: editedTrade.quantity,
        brokerage: editedTrade.brokerage,
      });
      const sellCharges = calculateCharges({
        equityType: editedTrade.equityType,
        action: TRANSACTION_TYPES.SELL,
        price: editedTrade.sellingPrice,
        quantity: editedTrade.quantity,
        brokerage: editedTrade.brokerage,
      });
      const totalCharges = {
        ...buyCharges,
        totalCharges: buyCharges.totalCharges + sellCharges.totalCharges,
        exchangeCharges:
          buyCharges.exchangeCharges + sellCharges.exchangeCharges,
      };
      setCharges(totalCharges);
      setEditedTrade((prev) => ({
        ...prev,
        exchangeRate: totalCharges.exchangeCharges,
      }));
    }
  }, [editedTrade]);

  const validateTrade = () => {
    if (!editedTrade.quantity || editedTrade.quantity <= 0) {
      setError("Quantity must be greater than zero");
      return false;
    }

    if (!editedTrade.buyingPrice || editedTrade.buyingPrice <= 0) {
      setError("Please enter a valid buying price");
      return false;
    }

    if (!editedTrade.sellingPrice || editedTrade.sellingPrice <= 0) {
      setError("Please enter a valid selling price");
      return false;
    }

    setError("");
    return true;
  };

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    if (value < 0) return; // Prevent negative values
    setError(""); // Clear error when user starts typing
    setEditedTrade({
      ...editedTrade,
      quantity: value,
    });
  };

  const handleCompleteTradeEdit = async () => {
    if (!editedTrade) return;
    if (!validateTrade()) return;

    try {
      const token = Cookies.get("token");
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/trades/complete/${editedTrade._id}`,
        {
          ...editedTrade,
          instrumentName: editedTrade.instrumentName.toUpperCase(),
          exchangeRate: charges.exchangeCharges,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onSubmit();
      onOpenChange(false);
      setError(""); // Clear error on successful submission
    } catch (error) {
      console.error("Error editing complete trade:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[50vw]">
        <DialogHeader className="border-b pb-4">
          <DialogTitle>Edit Complete Trade</DialogTitle>
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
                <Label>Buying Price</Label>
                <Input
                  type="number"
                  value={editedTrade.buyingPrice ?? ""}
                  onChange={(e) => {
                    setError(""); // Clear error when user starts typing
                    setEditedTrade({
                      ...editedTrade,
                      buyingPrice: Number(e.target.value),
                    });
                  }}
                />
                {error && error.includes("buying price") && (
                  <p className="text-sm text-red-500 mt-1">{error}</p>
                )}
              </div>
              <div className="col-span-2">
                <Label>Selling Price</Label>
                <Input
                  type="number"
                  value={editedTrade.sellingPrice ?? ""}
                  onChange={(e) => {
                    setError(""); // Clear error when user starts typing
                    setEditedTrade({
                      ...editedTrade,
                      sellingPrice: Number(e.target.value),
                    });
                  }}
                />
                {error && error.includes("selling price") && (
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
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCompleteTradeEdit} className="bg-primary">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
