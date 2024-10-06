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

  return (
    <Dialog>
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
            <Label htmlFor="rule">Rule</Label>
            <Input
              id="rule"
              value={editedRule}
              onChange={(e) => setEditedRule(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onEditRule(editedRule)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditRuleDialog;
