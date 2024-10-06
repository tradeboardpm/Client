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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


function ImportTradeDialog({ onImportTrades }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = () => {
    // In a real application, you would process the file here
    // For this example, we'll just simulate importing some trades
    const simulatedImportedTrades = [
      { instrument: "AAPL", tradeType: "Buy", quantity: 100, buyingPrice: 150 },
      {
        instrument: "GOOGL",
        tradeType: "Sell",
        quantity: 50,
        buyingPrice: 2800,
      },
    ];
    onImportTrades(simulatedImportedTrades);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Import Trade</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Trade</DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel file to import your trades.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Input id="picture" type="file" onChange={handleFileChange} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleImport} disabled={!file}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ImportTradeDialog;
