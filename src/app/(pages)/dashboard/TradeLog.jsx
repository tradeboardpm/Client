"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Search, Edit, Trash, Plus, Import } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDateStore } from "@/stores/DateStore";

export function TradeLog({
  trades = [],
  handleAddTrade,
  handleUpdateTrade,
  handleDeleteTrade,
  tradeSummary = { netPnL: 0, totalCharges: 0 },
}) {
  const { selectedDate } = useDateStore();
  const [isAddingTrade, setIsAddingTrade] = useState(false);
  const [isEditingTrade, setIsEditingTrade] = useState(false);
  const [isDeletingTrade, setIsDeletingTrade] = useState(false);
  const [currentTrade, setCurrentTrade] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTrade, setNewTrade] = useState({
    date: format(selectedDate, "yyyy-MM-dd"), // Initialize with selected date
    time: "",
    instrumentName: "",
    equityType: "Options",
    action: "buy",
    quantity: 0,
    price: 0,
    exchangeRate: 1,
    brokerage: 20,
  });

  // Add useEffect to update newTrade.date when selectedDate changes
  useEffect(() => {
    setNewTrade((prev) => ({
      ...prev,
      date: format(selectedDate, "yyyy-MM-dd"),
    }));
  }, [selectedDate]);

  const filteredTrades = trades.filter((trade) =>
    trade.instrumentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateProfit = (trade) => {
    const totalValue = trade.price * trade.quantity;
    return trade.action === "sell" ? totalValue : -totalValue;
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    if (isEditingTrade) {
      setCurrentTrade((prev) => ({ ...prev, [field]: value }));
    } else {
      setNewTrade((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSelectChange = (value, field) => {
    if (isEditingTrade) {
      setCurrentTrade((prev) => ({ ...prev, [field]: value }));
    } else {
      setNewTrade((prev) => ({ ...prev, [field]: value }));
    }
  };

  const resetForm = () => {
    setNewTrade({
      date: format(selectedDate, "yyyy-MM-dd"), // Use selected date
      time: "",
      instrumentName: "",
      equityType: "Options",
      action: "buy",
      quantity: 0,
      price: 0,
      exchangeRate: 1,
      brokerage: 20,
    });
    setCurrentTrade(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tradeData = isEditingTrade ? currentTrade : newTrade;
    const formattedTrade = {
      ...tradeData,
      quantity: Number(tradeData.quantity),
      price: Number(tradeData.price),
      exchangeRate: Number(tradeData.exchangeRate),
      brokerage: Number(tradeData.brokerage),
    };

    if (isEditingTrade) {
      handleUpdateTrade(currentTrade._id, formattedTrade);
      setIsEditingTrade(false);
    } else {
      handleAddTrade(formattedTrade);
      setIsAddingTrade(false);
    }
    resetForm();
  };

  const openEditDialog = (trade) => {
    setCurrentTrade(trade);
    setIsEditingTrade(true);
  };

  const openDeleteDialog = (trade) => {
    setCurrentTrade(trade);
    setIsDeletingTrade(true);
  };

  const confirmDelete = () => {
    handleDeleteTrade(currentTrade._id);
    setIsDeletingTrade(false);
    resetForm();
  };

  const calculateTotalAmount = (trade) => {
    const quantity = Number(trade.quantity) || 0;
    const price = Number(trade.price) || 0;
    return quantity * price;
  };

  const renderForm = () => {
    const trade = isEditingTrade ? currentTrade : newTrade;
    const totalAmount = calculateTotalAmount(trade);

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="instrumentName">Instrument Name</Label>
            <Input
              id="instrumentName"
              value={trade.instrumentName}
              onChange={(e) => handleInputChange(e, "instrumentName")}
              required
            />
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={trade.quantity}
              onChange={(e) => handleInputChange(e, "quantity")}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Action</Label>
            <RadioGroup
              value={trade.action}
              onValueChange={(value) => handleSelectChange(value, "action")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2 bg-card p-2 border rounded-lg shadow-sm">
                <RadioGroupItem value="buy" id="buy" />
                <Label htmlFor="buy">Buy</Label>
              </div>
              <div className="flex items-center space-x-2 bg-card p-2 border rounded-lg shadow-sm">
                <RadioGroupItem value="sell" id="sell" />
                <Label htmlFor="sell">Sell</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="price">
              {trade.action === "buy" ? "Buying Price" : "Selling Price"}
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={trade.price}
              onChange={(e) => handleInputChange(e, "price")}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="equityType">Equity Type</Label>
            <Select
              value={trade.equityType}
              onValueChange={(value) => handleSelectChange(value, "equityType")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Options">Options</SelectItem>
                <SelectItem value="Futures">Futures</SelectItem>
                <SelectItem value="Equity">Equity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={trade.time}
              onChange={(e) => handleInputChange(e, "time")}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="exchangeRate">Exchange Charges (Rs)</Label>
            <Input
              id="exchangeRate"
              type="number"
              step="0.01"
              value={trade.exchangeRate}
              onChange={(e) => handleInputChange(e, "exchangeRate")}
              required
            />
          </div>
          <div>
            <Label htmlFor="brokerage">Brokerage (Rs)</Label>
            <Input
              id="brokerage"
              type="number"
              step="0.01"
              value={trade.brokerage}
              onChange={(e) => handleInputChange(e, "brokerage")}
              required
            />
          </div>
        </div>
        <div className="mt-6 p-4 bg-primary/10 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Order Amount:</span>
            <span className="text-lg text-primary font-bold">
              ₹ {totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              isEditingTrade
                ? setIsEditingTrade(false)
                : setIsAddingTrade(false)
            }
          >
            Cancel
          </Button>
          <Button type="submit">
            {isEditingTrade ? "Update Trade" : "Add Trade"}
          </Button>
        </DialogFooter>
      </form>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Trade Log</CardTitle>
        {trades.length > 0 && (
          <div className="flex space-x-2">
            <Button onClick={() => setIsAddingTrade(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Trade
            </Button>
            <Button variant="outline">
              <Import className="mr-2 h-4 w-4" />
              Import Trade
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {trades.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <img
              src="/images/no_trade.png"
              alt="No trades"
              className="w-48 h-32 mb-6"
            />
            <p className="text-muted-foreground mb-4">No trades added yet</p>
            <div className="flex space-x-4">
              <Button onClick={() => setIsAddingTrade(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Trade
              </Button>
              <Button variant="outline">
                <Import className="mr-2 h-4 w-4" />
                Import Trade
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">
                Trades ({trades.length})
              </div>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search trades..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Instrument</TableHead>
                    <TableHead>Equity Type</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Exchange charges</TableHead>
                    <TableHead>Brokerage</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrades.map((trade) => {
                    const profit = calculateProfit(trade);
                    const textColor =
                      profit >= 0 ? "text-green-500" : "text-red-500";

                    return (
                      <TableRow key={trade._id}>
                        <TableCell>
                          {format(new Date(trade.date), "dd-MM-yyyy")}{" "}
                          {trade.time}
                        </TableCell>
                        <TableCell className={textColor}>
                          {trade.instrumentName}
                        </TableCell>
                        <TableCell>{trade.equityType}</TableCell>
                        <TableCell>{trade.action}</TableCell>
                        <TableCell>{trade.quantity}</TableCell>
                        <TableCell>₹ {trade.price}</TableCell>
                        <TableCell>₹ {trade.exchangeRate}</TableCell>
                        <TableCell>₹ {trade.brokerage}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(trade)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteDialog(trade)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2 text-green-500 bg-green-500/25 p-1 rounded-lg">
                  <span>Today's Profit:</span>
                  <span>₹ {tradeSummary.totalProfit.toFixed(2)}</span>
                </div>
                <div className="flex items-center space-x-2  text-primary bg-primary/25 p-1 rounded-lg">
                  <span>Today's Charges:</span>
                  <span>₹ {tradeSummary.totalCharges.toFixed(2)}</span>
                </div>
                <div
                  className={
                    tradeSummary.netPnL >= 0
                      ? "text-green-500 bg-green-500/25 p-1 rounded-lg flex items-center space-x-2"
                      : "text-red-500 bg-red-500/25 p-1 rounded-lg flex items-center space-x-2"
                  }
                >
                  <span>Net Realised P&L:</span>
                  <span>₹ {tradeSummary.netPnL.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </>
        )}

        <Dialog open={isAddingTrade} onOpenChange={setIsAddingTrade}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Trade</DialogTitle>
            </DialogHeader>
            {renderForm()}
          </DialogContent>
        </Dialog>

        <Dialog open={isEditingTrade} onOpenChange={setIsEditingTrade}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Trade</DialogTitle>
            </DialogHeader>
            {renderForm()}
          </DialogContent>
        </Dialog>

        <Dialog open={isDeletingTrade} onOpenChange={setIsDeletingTrade}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this trade?</p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeletingTrade(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
