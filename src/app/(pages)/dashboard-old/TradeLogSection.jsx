import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createTrade, updateTrade, deleteTrade } from "./api";
import AddTradeDialog from "@/components/dialogs/AddTradeDialog";
import EditTradeDialog from "@/components/dialogs/EditTradeDialog";
import DeleteTradeDialog from "@/components/dialogs/DeleteTradeDialog";
import ImportTradeDialog from "@/components/dialogs/ImportTradeDialog";
import Image from "next/image";
import { Pencil } from "lucide-react";

export default function TradeLogSection({
  trades,
  totalProfit,
  totalCharges,
  totalRealizedPL,
}) {
  const handleAddTrade = async (trade) => {
    await createTrade(trade);
  };

  const handleEditTrade = async (id, updatedTrade) => {
    await updateTrade(id, updatedTrade);
  };

  const handleDeleteTrade = async (id) => {
    await deleteTrade(id);
  };

  const handleImportTrades = async () => {
    // Implement import logic here
  };

  return (
    <Card>
      {trades.length === 0 ? (
        <>
          <CardHeader>
            <CardTitle>Trade Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 flex flex-col items-center">
              <Image
                src="/images/no_trade.png"
                height={150}
                width={150}
                alt="No trades"
                className="mb-3"
              />
              <h3 className="text-xl font-semibold mb-2">Get Started!</h3>
              <p className="text-accent-foreground/50 text-sm mb-4">
                Please add your trades here or import them automatically using
                your tradebook
              </p>
              <div className="flex items-center justify-center gap-4">
                <AddTradeDialog onAddTrade={handleAddTrade} />
                <ImportTradeDialog onImportTrades={handleImportTrades} />
              </div>
            </div>
          </CardContent>
        </>
      ) : (
        <>
          <CardHeader className="px-5 py-3 flex flex-row items-center justify-between gap-5">
            <CardTitle className="text-lg font-semibold">Trade Log</CardTitle>
            <div className="flex items-center gap-4">
              <AddTradeDialog onAddTrade={handleAddTrade} />
              <ImportTradeDialog onImportTrades={handleImportTrades} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Table className="rounded-lg p-0 overflow-hidden border">
                <TableHeader className="sticky top-0 bg-primary/15 z-10">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Instrument</TableHead>
                    <TableHead>Equity Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Buying Price</TableHead>
                    <TableHead>Selling Price</TableHead>
                    <TableHead>Exchange charges</TableHead>
                    <TableHead>Brokerage</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trades.map((trade, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-sm">{trade.time}</TableCell>
                      <TableCell
                        className={`text-sm ${
                          trade.buyingPrice < trade.sellingPrice
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {trade.instrument}
                      </TableCell>
                      <TableCell className="text-sm">
                        {trade.equityType}
                      </TableCell>
                      <TableCell className="text-sm">
                        {trade.quantity}
                      </TableCell>
                      <TableCell className="text-sm">
                        ₹ {trade.buyingPrice}
                      </TableCell>
                      <TableCell className="text-sm">
                        ₹ {trade.sellingPrice}
                      </TableCell>
                      <TableCell className="text-sm">
                        ₹ {trade.exchangeCharges}
                      </TableCell>
                      <TableCell className="text-sm">
                        ₹ {trade.brokerage}
                      </TableCell>
                      <TableCell className="space-x-2 flex">
                        <EditTradeDialog
                          trade={trade}
                          onEditTrade={(updatedTrade) =>
                            handleEditTrade(trade._id, updatedTrade)
                          }
                        />
                        <DeleteTradeDialog
                          onDeleteTrade={() => handleDeleteTrade(trade._id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-between mt-6 px-4">
                <div className="flex items-center gap-2 bg-green-500/15 text-green-600 px-4 py-2 rounded-md">
                  <Pencil size={16} />
                  <span>
                    Today's Profit: {totalProfit ? `₹ ${totalProfit}` : "N/A"}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-purple-500/15 text-purple-600 px-4 py-2 rounded-md">
                  <Pencil size={16} />
                  <span>Today's Charges: ₹ {totalCharges}</span>
                </div>

                <div className="flex items-center gap-2 bg-red-500/15 text-red-600 px-4 py-2 rounded-md">
                  <Pencil size={16} />
                  <span>
                    Net Realised P&L:{" "}
                    {totalRealizedPL ? `₹ ${totalRealizedPL}` : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}
