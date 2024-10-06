import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function AddTradeDialog({ onAddTrade }) {
  const [trade, setTrade] = useState({
    instrument: "",
    quantity: "",
    tradeType: "Buy",
    buyingPrice: "",
    sellingPrice: "",
    equityType: "F&O - Options",
    time: "",
    exchangeCharges: "",
    brokerage: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrade({ ...trade, [name]: value });
  };

  const handleSubmit = () => {
    onAddTrade(trade);
    // Reset form
    setTrade({
      instrument: "",
      quantity: "",
      tradeType: "Buy",
      buyingPrice: "",
      sellingPrice: "",
      equityType: "F&O - Options",
      time: "",
      exchangeCharges: "",
      brokerage: "",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Trade
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Trade</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="">
              <Label htmlFor="instrument" className="text-right">
                Instrument
              </Label>
              <Input
                id="instrument"
                name="instrument"
                value={trade.instrument}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                name="quantity"
                value={trade.quantity}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="">
              <Label className="text-right">Trade Type</Label>
              <RadioGroup
                defaultValue="Buy"
                onValueChange={(value) =>
                  setTrade({ ...trade, tradeType: value })
                }
                className="flex col-span-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Buy" id="buy" />
                  <Label htmlFor="buy">Buy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Sell" id="sell" />
                  <Label htmlFor="sell">Sell</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="">
              <Label htmlFor="buyingPrice" className="text-right">
                Buying price
              </Label>
              <Input
                id="buyingPrice"
                name="buyingPrice"
                value={trade.buyingPrice}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="">
              <Label htmlFor="sellingPrice" className="text-right">
                Selling price
              </Label>
              <Input
                id="sellingPrice"
                name="sellingPrice"
                value={trade.sellingPrice}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="">
              <Label htmlFor="equityType" className="text-right">
                Equity type
              </Label>
              <Select
                onValueChange={(value) =>
                  setTrade({ ...trade, equityType: value })
                }
                defaultValue="F&O - Options"
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="F&O - Options">F&O - Options</SelectItem>
                  <SelectItem value="F&O - Futures">F&O - Futures</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input
                id="time"
                name="time"
                type="datetime-local"
                value={trade.time}
                className="col-span-3"
                onChange={handleChange}
              />
            </div>
            <div className="">
              <Label htmlFor="exchangeCharges" className="text-right">
                Exchange charges (Rs)
              </Label>
              <Input
                id="exchangeCharges"
                name="exchangeCharges"
                value={trade.exchangeCharges}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>

          <div className="">
            <Label htmlFor="brokerage" className="text-right">
              Brokerage (Rs)
            </Label>
            <Input
              id="brokerage"
              name="brokerage"
              value={trade.brokerage}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
