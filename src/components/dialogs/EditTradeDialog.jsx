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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";

function EditTradeDialog({ trade, onEditTrade }) {
  const [editedTrade, setEditedTrade] = useState(trade);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <SquarePen className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Trade</DialogTitle>
          <DialogDescription>Here you can edit your trades.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="trade">Trade</Label>
            <Input
              id="trade"
              value={editedTrade}
              onChange={(e) => setEditedTrade(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onEditTrade(editedTrade)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditTradeDialog;
