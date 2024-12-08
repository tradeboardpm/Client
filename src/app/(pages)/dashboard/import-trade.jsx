import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import axios from "axios";
import Cookies from "js-cookie";
import { FileUp, UploadCloud } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const columnOptions = [
  { value: "instrumentName", label: "Instrument Name" },
  { value: "quantity", label: "Quantity" },
  { value: "buyingPrice", label: "Buying Price" },
  { value: "sellingPrice", label: "Selling Price" },
  { value: "brokerage", label: "Brokerage" },
  { value: "exchangeRate", label: "Exchange Rate" },
  { value: "time", label: "Time" },
  { value: "date", label: "Date" },
  { value: "equityType", label: "Equity Type" },
];

const equityTypeOptions = [
  { value: "F&O-OPTIONS", label: "Options" },
  { value: "F&O-FUTURES", label: "Futures" },
  { value: "INTRADAY", label: "Intraday" },
  { value: "DELIVERY", label: "Delivery" },
  { value: "OTHERS", label: "Others" },
];

const actionOptions = [
  { value: "buy", label: "Buy" },
  { value: "sell", label: "Sell" },
  { value: "both", label: "Both" },
];

export function ImportTradeDialog({ open, onOpenChange, onImportComplete }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});
  const [manualTimeEntries, setManualTimeEntries] = useState({});
  const [manualDateEntries, setManualDateEntries] = useState({});
  const [rowEquityTypes, setRowEquityTypes] = useState({});
  const [rowActions, setRowActions] = useState({});

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (json.length === 0) {
        console.error("The file is empty");
        setPreview([]);
        setColumnMapping({});
        return;
      }

      const fullData = json.slice(1); // Skip header row
      setPreview(fullData);

      // Initialize column mapping
      const initialMapping = {};
      json[0].forEach((header, index) => {
        const matchingOption = columnOptions.find((option) =>
          header.toLowerCase().includes(option.value.toLowerCase())
        );
        if (matchingOption) {
          initialMapping[index] = matchingOption.value;
        }
      });
      setColumnMapping(initialMapping);

      // Initialize row-level selections
      const initialRowEquityTypes = {};
      const initialRowActions = {};
      fullData.forEach((_, index) => {
        initialRowEquityTypes[index] = "NONE";
        initialRowActions[index] = "NONE";
      });
      setRowEquityTypes(initialRowEquityTypes);
      setRowActions(initialRowActions);
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    maxFiles: 1,
  });

  const handleColumnMappingChange = (columnIndex, value) => {
    setColumnMapping((prev) => {
      const newMapping = { ...prev };
      if (!value || value === "NONE") {
        delete newMapping[columnIndex];
        return newMapping;
      }
      return { ...prev, [columnIndex]: value };
    });
  };

  const handleRowEquityTypeChange = (rowIndex, value) => {
    setRowEquityTypes((prev) => ({
      ...prev,
      [rowIndex]: value,
    }));
  };

  const handleRowActionChange = (rowIndex, value) => {
    setRowActions((prev) => ({
      ...prev,
      [rowIndex]: value,
    }));
  };

  const handleManualTimeEntry = (rowIndex, time) => {
    setManualTimeEntries((prev) => ({
      ...prev,
      [rowIndex]: time,
    }));
  };

  const handleManualDateEntry = (rowIndex, date) => {
    setManualDateEntries((prev) => ({
      ...prev,
      [rowIndex]: date,
    }));
  };

  const handleImport = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const trades = preview.map((row, rowIndex) => {
        const trade = {};
        Object.entries(columnMapping).forEach(([index, field]) => {
          if (field === "time" && manualTimeEntries[rowIndex]) {
            trade[field] = manualTimeEntries[rowIndex];
          } else if (field === "date" && manualDateEntries[rowIndex]) {
            trade[field] = manualDateEntries[rowIndex];
          } else {
            trade[field] = row[index];
          }
        });

        if (rowEquityTypes[rowIndex] !== "NONE") {
          trade.equityType = rowEquityTypes[rowIndex];
        }
        if (rowActions[rowIndex] !== "NONE") {
          trade.action = rowActions[rowIndex];
        }

        // Handle "both" action
        if (trade.action === "both") {
          trade.buyingPrice = trade.buyingPrice || 0;
          trade.sellingPrice = trade.sellingPrice || 0;
        }

        return trade;
      });

      try {
        const token = Cookies.get("token");
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/trades/import`,
          trades,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        onImportComplete();
        onOpenChange(false);
      } catch (error) {
        console.error("Error importing trades:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center text-primary">
            <FileUp className="mr-3" size={28} />
            Import Trades
          </DialogTitle>
          <DialogDescription>
            Select and map columns from your trade file
          </DialogDescription>
        </DialogHeader>
        {file && preview.length > 0 ? (
          <div className="overflow-auto flex-grow bg-secondary/10 rounded-lg p-2">
            <Table>
              <TableHeader className="sticky top-0 bg-secondary/20 z-10">
                <TableRow>
                  <TableHead className="min-w-[100px] text-foreground font-semibold">
                    Row
                  </TableHead>
                  {preview[0] &&
                    preview[0].map((header, index) => (
                      <TableHead key={index} className="min-w-[200px]">
                        <div className="mb-2 text-xs text-muted-foreground">
                          {header}
                        </div>
                        <Select
                          value={columnMapping[index] || "NONE"}
                          onValueChange={(value) =>
                            handleColumnMappingChange(index, value)
                          }
                        >
                          <SelectTrigger className="border-primary/30">
                            <SelectValue placeholder="Select column" />
                          </SelectTrigger>
                          <SelectContent>
                            {columnOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className="hover:bg-secondary"
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                            <SelectItem
                              key="skip"
                              value="NONE"
                              className="hover:bg-secondary text-muted-foreground"
                            >
                              Skip column
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableHead>
                    ))}
                  <TableHead className="min-w-[150px] text-foreground font-semibold">
                    Equity Type
                  </TableHead>
                  <TableHead className="min-w-[150px] text-foreground font-semibold">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {preview.map((row, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    className="hover:bg-secondary/20 transition-colors"
                  >
                    <TableCell className="font-medium text-xs text-muted-foreground">
                      Row {rowIndex + 1}
                    </TableCell>
                    {row.map((cell, cellIndex) => {
                      const mappedColumn = columnMapping[cellIndex];
                      return (
                        <TableCell key={cellIndex} className="py-3">
                          {mappedColumn === "time" ? (
                            <div className="flex items-center space-x-2">
                              <div className="flex-grow text-sm text-foreground">
                                {cell}
                              </div>
                              <Input
                                type="time"
                                className="w-24 border-primary/30"
                                value={manualTimeEntries[rowIndex] || ""}
                                onChange={(e) =>
                                  handleManualTimeEntry(
                                    rowIndex,
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          ) : mappedColumn === "date" ? (
                            <div className="flex items-center space-x-2">
                              <div className="flex-grow text-sm text-foreground">
                                {cell}
                              </div>
                              <Input
                                type="date"
                                className="w-32 border-primary/30"
                                value={manualDateEntries[rowIndex] || ""}
                                onChange={(e) =>
                                  handleManualDateEntry(
                                    rowIndex,
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          ) : (
                            <span className="text-sm text-foreground">
                              {cell}
                            </span>
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      <Select
                        value={rowEquityTypes[rowIndex] || "NONE"}
                        onValueChange={(value) =>
                          handleRowEquityTypeChange(rowIndex, value)
                        }
                      >
                        <SelectTrigger className="border-primary/30">
                          <SelectValue placeholder="Select Equity Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {equityTypeOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="hover:bg-secondary"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                          <SelectItem
                            value="NONE"
                            className="hover:bg-secondary text-muted-foreground"
                          >
                            Not specified
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={rowActions[rowIndex] || "NONE"}
                        onValueChange={(value) =>
                          handleRowActionChange(rowIndex, value)
                        }
                      >
                        <SelectTrigger className="border-primary/30">
                          <SelectValue placeholder="Select Action" />
                        </SelectTrigger>
                        <SelectContent>
                          {actionOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="hover:bg-secondary"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                          <SelectItem
                            value="NONE"
                            className="hover:bg-secondary text-muted-foreground"
                          >
                            Not specified
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : file ? (
          <div className="text-center text-destructive bg-destructive/10 p-6 rounded-lg">
            The selected file is empty or could not be read. Please try another
            file.
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed border-primary/30 p-10 text-center cursor-pointer",
              "hover:bg-secondary/20 transition-colors group rounded-lg",
              "flex flex-col items-center justify-center"
            )}
          >
            <input {...getInputProps()} />
            <UploadCloud
              size={48}
              className="mb-4 text-primary group-hover:text-primary/80 transition-colors"
            />
            <p className="text-foreground group-hover:text-primary transition-colors">
              Drag and drop an Excel or CSV file here, or click to select a file
            </p>
            {/* Previous code remains the same */}
            <p className="text-xs text-muted-foreground mt-2">
              Supported formats: .xlsx, .xls, .csv
            </p>
          </div>
        )}
        <DialogFooter className="border-t pt-4 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!file}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Import Trades
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}