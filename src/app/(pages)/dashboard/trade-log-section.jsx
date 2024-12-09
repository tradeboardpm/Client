import { useState, useEffect } from "react";
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
import { Plus, Import, Search, SquarePen, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import Cookies from "js-cookie";
import { ImportTradeDialog } from "./import-trade";

export function TradesSection({ selectedDate, brokerage }) {
  const [trades, setTrades] = useState([]);
  const [tradeSummary, setTradeSummary] = useState({
    totalPnL: 0,
    totalCharges: 0,
    netPnL: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [addTradeOpen, setAddTradeOpen] = useState(false);
  const [editTradeOpen, setEditTradeOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [newTrade, setNewTrade] = useState({
    instrumentName: "",
    quantity: null,
    action: "buy",
    buyingPrice: null,
    sellingPrice: null,
    brokerage: brokerage,
    exchangeRate: 1,
    time: format(new Date(), "HH:mm"),
    equityType: "INTRADAY",
  });

   const [tradesData, setTradesData] = useState([]);
   const [importDialogOpen, setImportDialogOpen] = useState(false);

  useEffect(() => {
    fetchTradesData();
  }, [selectedDate]);

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

      // Update trades and summary based on new response structure
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

  const handleTradeEdit = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/trades/${selectedTrade._id}`,
        selectedTrade,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTradesData();
      setEditTradeOpen(false);
      setSelectedTrade(null);
    } catch (error) {
      console.error("Error editing trade:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTradeDelete = async () => {
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
      action: null,
      buyingPrice: null,
      sellingPrice: null,
      brokerage: brokerage,
      exchangeRate: 1,
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
    return trade.quantity * price * trade.exchangeRate;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle>Trade Log</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setAddTradeOpen(true)} className="bg-primary">
            <Plus className="mr-2 h-4 w-4" /> Add Trade
          </Button>

          <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
            <Import className="mr-2 h-4 w-4" /> Import Trade
          </Button>
          {/* ... other elements */}
          <ImportTradeDialog
            open={importDialogOpen}
            onOpenChange={setImportDialogOpen}
            onImportComplete={fetchTradesData}
          />
        </div>
      </CardHeader>
      <CardContent>
        {trades.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium">
                Trades ({filteredTrades.length})
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search trades..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="rounded-lg overflow-hidden">
              <Table className="rounded-b-lg overflow-hidden bg-background">
                <TableHeader className="bg-primary/25 border">
                  <TableRow className="border-none">
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Instrument</TableHead>
                    <TableHead>Equity Type</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Buying Price</TableHead>
                    <TableHead>Selling Price</TableHead>
                    <TableHead>Exchange charges</TableHead>
                    <TableHead>Brokerage</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="border">
                  {filteredTrades.map((trade) => (
                    <TableRow key={trade._id}>
                      <TableCell>
                        {format(new Date(trade.date), "dd-MM-yyyy")}
                      </TableCell>
                      <TableCell>{trade.time}</TableCell>
                      <TableCell
                        className={cn(
                          trade.buyingPrice < trade.sellingPrice
                            ? "text-green-500"
                            : "text-red-500"
                        )}
                      >
                        {trade.instrumentName}
                      </TableCell>
                      <TableCell>{trade.equityType}</TableCell>
                      <TableCell>{trade.action}</TableCell>
                      <TableCell>{trade.quantity}</TableCell>
                      <TableCell>₹ {trade.buyingPrice}</TableCell>
                      <TableCell>₹ {trade.sellingPrice}</TableCell>
                      <TableCell>{trade.exchangeRate}</TableCell>
                      <TableCell>₹ {trade.brokerage}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedTrade(trade);
                              setEditTradeOpen(true);
                            }}
                          >
                            <SquarePen className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedTrade(trade);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {trades.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div
                    className={`rounded-lg p-2 flex items-center gap-2 ${
                      tradeSummary.totalPnL >= 0
                        ? "bg-green-600/20"
                        : "bg-red-600/20"
                    }`}
                  >
                    <div
                      className={`text-sm font-medium ${
                        tradeSummary.totalPnL >= 0
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      Today's Profit:
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        tradeSummary.totalPnL >= 0
                          ? "text-green-900"
                          : "text-red-900"
                      }`}
                    >
                      ₹ {tradeSummary.totalPnL.toFixed(2)}
                    </div>
                  </div>

                  <div className="rounded-lg bg-primary/20 flex items-center gap-2 p-2">
                    <div className="text-sm font-medium text-primary">
                      Today's Charges:
                    </div>
                    <div className="text-lg font-bold text-primary">
                      ₹ {tradeSummary.totalCharges.toFixed(2)}
                    </div>
                  </div>

                  <div
                    className={`rounded-lg p-2 flex items-center gap-2 ${
                      tradeSummary.netPnL >= 0
                        ? "bg-green-600/20"
                        : "bg-red-600/20"
                    }`}
                  >
                    <div
                      className={`text-sm font-medium ${
                        tradeSummary.netPnL >= 0
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      Net Realised P&L:
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        tradeSummary.netPnL >= 0
                          ? "text-green-900"
                          : "text-red-900"
                      }`}
                    >
                      ₹ {tradeSummary.netPnL.toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <img
              src="/images/no_trade.png"
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
          <DialogHeader>
            <DialogTitle>Add New Trade</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-2">
                <Label>Instrument Name</Label>
                <Input
                  value={newTrade.instrumentName}
                  onChange={(e) =>
                    setNewTrade({ ...newTrade, instrumentName: e.target.value })
                  }
                />
              </div>

              <div className="col-span-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={newTrade.quantity}
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
                  className=" flex space-x-4"
                  value={newTrade.action}
                  onValueChange={(value) =>
                    setNewTrade({ ...newTrade, action: value })
                  }
                >
                  <div className="flex items-center space-x-2 bg-card border border-border/25 shadow rounded-lg w-full p-2">
                    <RadioGroupItem value="buy" id="buy" />
                    <Label htmlFor="buy" className="w-full">Buy</Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-card border border-border/25  shadow rounded-lg w-full p-2">
                    <RadioGroupItem value="sell" id="sell" />
                    <Label htmlFor="sell" className="w-full">Sell</Label>
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
                      ? newTrade.buyingPrice
                      : newTrade.sellingPrice
                  }
                  onChange={(e) =>
                    setNewTrade({
                      ...newTrade,
                      [newTrade.action === "buy"
                        ? "buyingPrice"
                        : "sellingPrice"]: Number(e.target.value),
                    })
                  }
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
                    <SelectItem value="F&O-OPTIONS">Options</SelectItem>
                    <SelectItem value="F&O-FUTURES">Futures</SelectItem>
                    <SelectItem value="INTRADAY">Intraday</SelectItem>
                    <SelectItem value="DELIVERY">Delivery</SelectItem>
                    <SelectItem value="OTHERS">Others</SelectItem>
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

                <Input
                  type="number"
                  value={newTrade.exchangeRate}
                  onChange={(e) =>
                    setNewTrade({
                      ...newTrade,
                      exchangeRate: Number(e.target.value),
                    })
                  }
                />
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
                <span className="text-lg font-bold">
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

      {/* Edit Trade Dialog */}
      <Dialog open={editTradeOpen} onOpenChange={setEditTradeOpen}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Edit Trade</DialogTitle>
          </DialogHeader>
          {selectedTrade && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="col-span-4">Instrument Name</Label>
                <Input
                  className="col-span-4"
                  value={selectedTrade.instrumentName}
                  onChange={(e) =>
                    setSelectedTrade({
                      ...selectedTrade,
                      instrumentName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="col-span-2">Quantity</Label>
                <Label className="col-span-2">
                  {selectedTrade.action === "buy" ? "Buying" : "Selling"} Price
                </Label>
                <Input
                  type="number"
                  className="col-span-2"
                  value={selectedTrade.quantity}
                  onChange={(e) =>
                    setSelectedTrade({
                      ...selectedTrade,
                      quantity: Number(e.target.value),
                    })
                  }
                />
                <Input
                  type="number"
                  className="col-span-2"
                  value={
                    selectedTrade.action === "buy"
                      ? selectedTrade.buyingPrice
                      : selectedTrade.sellingPrice
                  }
                  onChange={(e) =>
                    setSelectedTrade({
                      ...selectedTrade,
                      [selectedTrade.action === "buy"
                        ? "buyingPrice"
                        : "sellingPrice"]: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="col-span-2">Action</Label>
                <RadioGroup
                  className="col-span-2 flex space-x-4"
                  value={selectedTrade.action}
                  onValueChange={(value) =>
                    setSelectedTrade({ ...selectedTrade, action: value })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="buy" id="edit-buy" />
                    <Label htmlFor="edit-buy">Buy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sell" id="edit-sell" />
                    <Label htmlFor="edit-sell">Sell</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="col-span-2">Equity Type</Label>
                <Label className="col-span-2">Time</Label>
                <Select
                  value={selectedTrade.equityType}
                  onValueChange={(value) =>
                    setSelectedTrade({ ...selectedTrade, equityType: value })
                  }
                >
                  <SelectTrigger className="col-span-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="F&O-OPTIONS">Options</SelectItem>
                    <SelectItem value="F&O-FUTURES">Futures</SelectItem>
                    <SelectItem value="INTRADAY">Intraday</SelectItem>
                    <SelectItem value="DELIVERY">Delivery</SelectItem>
                    <SelectItem value="OTHERS">Others</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="time"
                  className="col-span-2"
                  value={selectedTrade.time}
                  onChange={(e) =>
                    setSelectedTrade({ ...selectedTrade, time: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="col-span-2">Exchange Charges (₹)</Label>
                <Label className="col-span-2">Brokerage (₹)</Label>
                <Input
                  type="number"
                  className="col-span-2"
                  value={selectedTrade.exchangeRate}
                  onChange={(e) =>
                    setSelectedTrade({
                      ...selectedTrade,
                      exchangeRate: Number(e.target.value),
                    })
                  }
                />
                <Input
                  type="number"
                  className="col-span-2"
                  value={selectedTrade.brokerage}
                  onChange={(e) =>
                    setSelectedTrade({
                      ...selectedTrade,
                      brokerage: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Order Amount:</span>
                  <span className="text-lg font-bold">
                    ₹ {calculateTotalOrder(selectedTrade)}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTradeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleTradeEdit} className="bg-primary">
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
