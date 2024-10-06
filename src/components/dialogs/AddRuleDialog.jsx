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
import { PlusCircle } from "lucide-react";

function AddRuleDialog({ onAddRule }) {
  const [rule, setRule] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Rule
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Rule</DialogTitle>
          <DialogDescription>Here you can add your rules.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="rule">Rule</Label>
            <Input
              id="rule"
              value={rule}
              onChange={(e) => setRule(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onAddRule(rule)}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddRuleDialog;
