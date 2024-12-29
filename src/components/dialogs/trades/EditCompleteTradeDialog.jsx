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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import Cookies from "js-cookie";
import { calculateExchangeCharges } from "@/utils/calculateExchangeCharges";

export function EditCompleteTradeDialog({
  open,
  onOpenChange,
  trade,
  onSubmit,
}) {
  const [editedTrade, setEditedTrade] = React.useState(trade);

  React.useEffect(() => {
    setEditedTrade(trade);
  }, [trade]);

  const handleCompleteTradeEdit = async () => {
    if (!editedTrade) return;
    try {
      const token = Cookies.get("token");
      const buyExchangeCharges = calculateExchangeCharges(
        editedTrade.equityType,
        "buy",
        editedTrade.buyingPrice,
        editedTrade.quantity
      );
      const sellExchangeCharges = calculateExchangeCharges(
        editedTrade.equityType,
        "sell",
        editedTrade.sellingPrice,
        editedTrade.quantity
      );
      const totalExchangeCharges = buyExchangeCharges + sellExchangeCharges;
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/trades/complete/${editedTrade._id}`,
        {
          ...editedTrade,
          instrumentName: editedTrade.instrumentName.toUpperCase(),
          exchangeRate: totalExchangeCharges,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onSubmit();
      onOpenChange(false);
    } catch (error) {
      console.error("Error editing complete trade:", error);
    }
  };

  const calculateTotalOrder = (trade) => {
    return (
      trade.quantity * (trade.buyingPrice + trade.sellingPrice) +
      trade.exchangeRate +
      trade.brokerage
    );
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
                  value={editedTrade.quantity}
                  onChange={(e) =>
                    setEditedTrade({
                      ...editedTrade,
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
                  value={editedTrade.buyingPrice ?? ""}
                  onChange={(e) =>
                    setEditedTrade({
                      ...editedTrade,
                      buyingPrice: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="col-span-2">
                <Label>Selling Price</Label>
                <Input
                  type="number"
                  value={editedTrade.sellingPrice ?? ""}
                  onChange={(e) =>
                    setEditedTrade({
                      ...editedTrade,
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
                  value={
                    calculateExchangeCharges(
                      editedTrade.equityType,
                      "buy",
                      editedTrade.buyingPrice,
                      editedTrade.quantity
                    ) +
                    calculateExchangeCharges(
                      editedTrade.equityType,
                      "sell",
                      editedTrade.sellingPrice,
                      editedTrade.quantity
                    )
                  }
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
          <Button onClick={handleCompleteTradeEdit} className="bg-primary">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
