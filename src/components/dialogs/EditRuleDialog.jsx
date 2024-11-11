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

function EditRuleDialog({ rule, onEditRule }) {
  const [editedRule, setEditedRule] = useState(rule);
  const [open, setOpen] = useState(false);

  const handleEditRule = () => {
    onEditRule(editedRule);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <SquarePen className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Rule</DialogTitle>
          <DialogDescription>Here you can edit your rules.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="rule">Rule (max 200 characters)</Label>
            <Input
              id="rule"
              value={editedRule}
              onChange={(e) => setEditedRule(e.target.value.slice(0, 200))}
              maxLength={200}
            />
            <p className="text-sm text-gray-500 mt-1">
              {editedRule.length}/200 characters
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleEditRule}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditRuleDialog;
