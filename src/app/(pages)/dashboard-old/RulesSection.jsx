import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { createRule, updateRule, deleteRule } from "./api";
import AddRuleDialog from "@/components/dialogs/AddRuleDialog";
import EditRuleDialog from "@/components/dialogs/EditRuleDialog";
import DeleteRuleDialog from "@/components/dialogs/DeleteRuleDialog";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RulesSection({ rules }) {
  const [selectedRules, setSelectedRules] = useState(new Set());

  const toggleSelectRule = (id) => {
    const newSelectedRules = new Set(selectedRules);
    if (newSelectedRules.has(id)) {
      newSelectedRules.delete(id);
    } else {
      newSelectedRules.add(id);
    }
    setSelectedRules(newSelectedRules);
  };

  const toggleSelectAll = () => {
    if (selectedRules.size === rules.length) {
      setSelectedRules(new Set());
    } else {
      setSelectedRules(new Set(rules.map((rule) => rule._id)));
    }
  };

  const handleAddRule = async (rule) => {
    await createRule(rule);
  };

  const handleEditRule = async (id, updatedRule) => {
    await updateRule(id, updatedRule);
  };

  const handleDeleteRule = async (id) => {
    await deleteRule(id);
  };

  return (
    <Card className="flex-1">
      {rules.length === 0 ? (
        <>
          <CardHeader className="px-5 py-4">
            <CardTitle className="text-lg font-semibold">Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 flex flex-col items-center">
              <Image
                src="/images/no_rule.png"
                height={150}
                width={150}
                alt="No rules"
                className="mb-3"
              />
              <h4 className="text-xl font-semibold mb-2">Get Started!</h4>
              <p className="text-gray-600 mb-4">
                Please click below to add your trading rules
              </p>
              <AddRuleDialog onAddRule={handleAddRule} />
            </div>
          </CardContent>
        </>
      ) : (
        <>
          <CardHeader className="px-5 py-3 flex flex-row items-center justify-between gap-5">
            <CardTitle className="text-lg font-semibold">Rules</CardTitle>
            <Input placeholder="Search Rules" className="max-w-xs" />
            <AddRuleDialog onAddRule={handleAddRule} />
          </CardHeader>
          <CardContent>
            <div className="rounded-lg  overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/15 border-none">
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={
                          selectedRules.size === rules.length &&
                          rules.length > 0
                        }
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>My Rules</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
              <ScrollArea className="h-[50vh]">
                <Table>
                  <TableBody>
                    {rules.map((rule) => (
                      <TableRow key={rule._id}>
                        <TableCell className="w-[50px]">
                          <Checkbox
                            checked={selectedRules.has(rule._id)}
                            onCheckedChange={() => toggleSelectRule(rule._id)}
                          />
                        </TableCell>
                        <TableCell className="max-w-[calc(100%-150px)] whitespace-normal break-words">
                          {rule.description}
                        </TableCell>
                        <TableCell className="w-[100px]">
                          <div className="flex gap-2">
                            <EditRuleDialog
                              rule={rule.description}
                              onEditRule={(updatedRule) =>
                                handleEditRule(rule._id, updatedRule)
                              }
                            />
                            <DeleteRuleDialog
                              onDeleteRule={() => handleDeleteRule(rule._id)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}
