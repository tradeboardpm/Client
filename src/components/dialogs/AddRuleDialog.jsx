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
  const [open, setOpen] = useState(false);

  const handleAddRule = () => {
    onAddRule(rule);
    setRule("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            <Label htmlFor="rule">Rule (max 200 characters)</Label>
            <Input
              id="rule"
              value={rule}
              onChange={(e) => setRule(e.target.value.slice(0, 200))}
              maxLength={200}
            />
            <p className="text-sm text-gray-500 mt-1">
              {rule.length}/200 characters
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddRule}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddRuleDialog;
