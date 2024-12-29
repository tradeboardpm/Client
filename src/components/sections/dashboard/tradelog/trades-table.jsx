import React from "react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SquarePen, Trash2 } from 'lucide-react';
import { cn } from "@/lib/utils";

export function TradesTable({ trades, onEditOpen, onEditComplete, onDelete }) {
  return (
    <div className="rounded-lg overflow-hidden border">
      <Table className="rounded-b-lg overflow-hidden bg-background">
        <TableHeader className="bg-[#F4E4FF] dark:bg-[#49444c]">
          <TableRow className="border-none text-xs">
            <TableHead className="text-nowrap text-center font-semibold text-foreground">Date</TableHead>
            <TableHead className="text-nowrap text-center font-semibold text-foreground">Instrument</TableHead>
            <TableHead className="text-nowrap text-center font-semibold text-foreground">Equity Type</TableHead>
            <TableHead className="text-nowrap text-center font-semibold text-foreground">Quantity</TableHead>
            <TableHead className="text-nowrap text-center font-semibold text-foreground">Buying Price</TableHead>
            <TableHead className="text-nowrap text-center font-semibold text-foreground">Selling Price</TableHead>
            <TableHead className="text-nowrap text-center font-semibold text-foreground">Exchange charges</TableHead>
            <TableHead className="text-nowrap text-center font-semibold text-foreground">Brokerage</TableHead>
            <TableHead className="text-nowrap text-center font-semibold text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-xs">
          {trades.map((trade) => (
            <TableRow key={trade._id}>
              <TableCell className="text-nowrap text-center">
                {format(new Date(trade.date), "dd-MM-yyyy")}, {trade.time}
              </TableCell>
              <TableCell
                className={cn(
                  !trade.buyingPrice || !trade.sellingPrice
                    ? "text-foreground font-semibold text-center"
                    : trade.buyingPrice < trade.sellingPrice
                    ? "text-[#0ED991] font-semibold text-center"
                    : "text-[#F44C60]/25 font-semibold text-center"
                )}
              >
                {trade.instrumentName}
              </TableCell>
              <TableCell className="text-nowrap text-center">{trade.equityType}</TableCell>
              <TableCell className="text-nowrap text-center">{trade.quantity}</TableCell>
              <TableCell className="text-nowrap text-center">
                {trade.buyingPrice ? `₹ ${trade.buyingPrice}` : "-"}
              </TableCell>
              <TableCell className="text-nowrap text-center">
                {trade.sellingPrice ? `₹ ${trade.sellingPrice}` : "-"}
              </TableCell>
              <TableCell className="text-nowrap text-center">₹ {trade.exchangeRate.toFixed(2)}</TableCell>
              <TableCell className="text-nowrap text-center">₹ {trade.brokerage}</TableCell>
              <TableCell className="text-nowrap text-center">
                <div className="flex items-center gap-2">
                  <button
                    className="text-gray-500/35"
                    variant="ghost"
                    size="icon"
                    onClick={() => trade.isOpen ? onEditOpen(trade) : onEditComplete(trade)}
                  >
                    <SquarePen className="h-4 w-4" />
                  </button>
                  <button
                    className="text-gray-500/35"
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(trade)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

