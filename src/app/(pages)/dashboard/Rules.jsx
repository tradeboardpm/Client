"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Edit, Trash, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function Rules({
  rules = [],
  journal = { rules: [] },
  handleRuleToggle = () => {},
  handleCreateRule = () => {},
  handleUpdateRule = () => {},
  handleDeleteRule = () => {},
  handleLoadSampleRules = () => {},
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [newRule, setNewRule] = useState("");
  const [editingRule, setEditingRule] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const filteredRules = rules.filter((rule) =>
    rule.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRule = () => {
    handleCreateRule(newRule);
    setNewRule("");
    setIsAddDialogOpen(false);
  };

  const handleEditRule = () => {
    handleUpdateRule(editingRule._id, editingRule.content);
    setEditingRule(null);
    setIsEditDialogOpen(false);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    filteredRules.forEach((rule) => {
      if (selectAll) {
        if (journal.rules.includes(rule._id)) {
          handleRuleToggle(rule._id);
        }
      } else {
        if (!journal.rules.includes(rule._id)) {
          handleRuleToggle(rule._id);
        }
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rules</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <Input
            type="text"
            placeholder="Search rules"
            className="mr-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Rule</DialogTitle>
              </DialogHeader>
              <Input
                value={newRule}
                onChange={(e) => setNewRule(e.target.value.slice(0, 150))}
                placeholder="Enter new rule"
                maxLength={150}
              />
              <p className="text-sm text-muted-foreground mt-2">
                {newRule.length}/150 characters
              </p>
              <DialogFooter>
                <Button onClick={handleAddRule}>Add Rule</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {filteredRules.length === 0 ? (
          <div className="space-y-2">
            <p>No rules found.</p>
            <Button onClick={handleLoadSampleRules}>Load Sample Rules</Button>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Rule</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules.map((rule) => (
                  <TableRow key={rule._id}>
                    <TableCell>
                      <Checkbox
                        id={`rule-${rule._id}`}
                        checked={journal.rules?.includes(rule._id)}
                        onCheckedChange={() => handleRuleToggle(rule._id)}
                      />
                    </TableCell>
                    <TableCell>{rule.content}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog
                          open={isEditDialogOpen}
                          onOpenChange={setIsEditDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingRule(rule)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Rule</DialogTitle>
                            </DialogHeader>
                            <Input
                              value={editingRule?.content || ""}
                              onChange={(e) =>
                                setEditingRule({
                                  ...editingRule,
                                  content: e.target.value.slice(0, 150),
                                })
                              }
                              maxLength={150}
                            />
                            <p className="text-sm text-muted-foreground mt-2">
                              {editingRule?.content.length}/150 characters
                            </p>
                            <DialogFooter>
                              <Button onClick={handleEditRule}>
                                Update Rule
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the rule.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteRule(rule._id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
