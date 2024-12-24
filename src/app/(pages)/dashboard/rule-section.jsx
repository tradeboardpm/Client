"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Info,
  SquarePen,
  Trash2,
  Plus,
  PlusCircle,
  Search,
  Loader2,
  X,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const MAX_RULE_LENGTH = 150;

const AddRulesDialog = ({
  open,
  onOpenChange,
  selectedDate,
  onRulesAdded,
  isLoading,
  costPerRule = 0.05, // Default cost per rule
}) => {
  const [rulesList, setRulesList] = useState([""]);
  const [isAddingRules, setIsAddingRules] = useState(false);
  const inputRefs = useRef([]);

  // Calculate total cost of rules
  const totalCost = useMemo(() => {
    const validRulesCount = rulesList.filter(
      (rule) => rule.trim() !== ""
    ).length;
    return (validRulesCount * costPerRule).toFixed(2);
  }, [rulesList, costPerRule]);

  useEffect(() => {
    if (!open) {
      setRulesList([""]);
      inputRefs.current = [];
    }
  }, [open]);

  const handleAddRuleInput = () => {
    // Prevent adding more than 10 rules
    if (rulesList.length < 10) {
      setRulesList([...rulesList, ""]);
    }
  };

  const handleRemoveRuleInput = (index) => {
    const newRulesList = rulesList.filter((_, i) => i !== index);
    setRulesList(newRulesList.length ? newRulesList : [""]);
  };

  const handleRuleChange = (index, value) => {
    // Truncate to 150 characters if needed
    const truncatedValue = value.slice(0, MAX_RULE_LENGTH);
    const newRulesList = [...rulesList];
    newRulesList[index] = truncatedValue;
    setRulesList(newRulesList);
  };

  const handleKeyDown = (e, index) => {
    // If Enter is pressed and the current input is not empty
    if (e.key === "Enter" && rulesList[index].trim() !== "") {
      e.preventDefault(); // Prevent default Enter behavior

      // If it's the last input and not at max limit, add a new input
      if (index === rulesList.length - 1 && rulesList.length < 10) {
        handleAddRuleInput();
        // Focus on the newly added input
        setTimeout(() => {
          inputRefs.current[index + 1]?.focus();
        }, 0);
      }
      // If not the last input, focus on the next input
      else if (index < rulesList.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleClearAll = () => {
    setRulesList([""]);
  };

  const handleAddRules = async () => {
    const validRules = rulesList.filter((rule) => rule.trim() !== "");

    if (validRules.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one rule.",
        variant: "destructive",
      });
      return;
    }

    setIsAddingRules(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${API_URL}/rules/bulk`,
        {
          rules: validRules.map((description) => ({
            description,
            date: selectedDate.toISOString(),
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onRulesAdded(response.data);
      setRulesList([""]);
      onOpenChange(false);

      toast({
        title: "Rules added",
        description: `${validRules.length} rule(s) have been added successfully.`,
      });
    } catch (error) {
      console.error("Error adding rules:", error);
      toast({
        title: "Error",
        description: "Failed to add rules. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingRules(false);
    }
  };

  // Determine if add rule button should be disabled
  const isAddRuleDisabled =
    isAddingRules ||
    rulesList.length >= 10 ||
    rulesList[rulesList.length - 1].trim() === "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className={"border-b pb-2 mb-2"}>
          <DialogTitle className="text-xl mb-1">Add Rules</DialogTitle>
          <DialogDescription className="text-xs">
            Here you can add Rules.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-4 max-h-[300px] overflow-y-auto pr-2">
          {rulesList.map((rule, index) => (
            <div key={index} className="flex flex-col space-y-1 p-2">
              <p className="text-xs">Rule</p>
              <div className="flex items-center space-x-2">
                <Input
                  ref={(el) => {
                    if (el) {
                      inputRefs.current[index] = el;
                    }
                  }}
                  value={rule}
                  onChange={(e) => handleRuleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  placeholder="Enter your rule"
                  maxLength={MAX_RULE_LENGTH}
                  className="flex-1 text-sm"
                />
                {rulesList.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveRuleInput(index)}
                    disabled={isAddingRules}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-right">
                {rule.length}/{MAX_RULE_LENGTH}
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={handleAddRuleInput}
            disabled={isAddRuleDisabled}
            className="w-full mt-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Rule
            {rulesList.length > 0 && ` (${rulesList.length}/10)`}
          </Button>
        </div>
        <DialogFooter className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={handleClearAll}
            disabled={
              isAddingRules || rulesList.every((rule) => rule.trim() === "")
            }
          >
            Clear All
          </Button>
          <Button
            onClick={handleAddRules}
            disabled={
              isAddingRules || rulesList.every((rule) => rule.trim() === "")
            }
          >
            {isAddingRules ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isAddingRules ? "Adding..." : `Add Rules`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Empty State Component
const EmptyState = ({ onAddRule, onLoadSampleRules, isLoading }) => {
  return (
    <Card className="h-full  shadow-[0px_8px_20px_rgba(0,0,0,0.08)] dark:shadow-[0px_8px_20px_rgba(0,0,0,0.32)] ">
      <CardHeader>
        <div className="flex items-center w-full gap-2">
          <h2 className="text-xl font-medium">Rules</h2>
          <HoverCard>
            <HoverCardTrigger>
              <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex flex-col gap-2">
                <h4 className="font-semibold">Trading Rules</h4>
                <p className="text-sm text-muted-foreground">
                  Define and track your trading rules to maintain better
                  discipline and consistency in your trading strategy. Check
                  rules you've followed for each trading session.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center ">
        <img
          src="/images/no_rule.svg"
          alt="No rules yet"
          className="mb-6 w-48"
        />
        <h3 className="text-xl font-semibold mb-2">Get Started!</h3>
        <p className="text-gray-500 mb-6">
          Please click below to add your trading rules
        </p>

        <Button
          className="bg-primary hover:primary_gradient text-white mb-4"
          onClick={onAddRule}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Add Rules
        </Button>

        <div className="text-gray-400 mb-2">OR</div>
        <Button
          variant="outline"
          className="text-primary hover:bg-primary/10"
          onClick={onLoadSampleRules}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? "Loading..." : "Load Standard Rules"}
        </Button>
      </CardContent>
    </Card>
  );
};

export function RulesSection({ selectedDate, onUpdate }) {
  const [rules, setRules] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingRule, setEditingRule] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState(null);
  const [newRulesDialog, setNewRulesDialog] = useState(false);

  const [isLoadingRules, setIsLoadingRules] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState({
    addRule: false,
    editRule: false,
    deleteRule: false,
    followRule: false,
    followAllRules: false,
    loadSampleRules: false,
  });

  useEffect(() => {
    fetchRules();
  }, [selectedDate]);

  const fetchRules = async () => {
    setIsLoadingRules(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.get(`${API_URL}/rules`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { date: selectedDate.toISOString() },
      });

      // Ensure each rule has the correct isFollowed status
      const rulesWithFollowStatus = response.data.map((rule) => ({
        ...rule,
        isFollowed: rule.isFollowed || false,
      }));

      setRules(rulesWithFollowStatus);
    } catch (error) {
      console.error("Error fetching rules:", error);
      toast({
        title: "Error",
        description: "Failed to fetch rules. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRules(false);
    }
  };

  const handleAddRules = (newRules) => {
    setRules((prevRules) => [...prevRules, ...newRules]);
  };

  const handleEditRule = async () => {
    if (!editingRule) return;

    setIsLoadingAction((prev) => ({ ...prev, editRule: true }));
    try {
      const token = Cookies.get("token");
      await axios.patch(
        `${API_URL}/rules/${editingRule._id}`,
        {
          description: editingRule.description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRules((prevRules) =>
        prevRules.map((rule) =>
          rule._id === editingRule._id
            ? { ...rule, description: editingRule.description }
            : rule
        )
      );

      setEditingRule(null);
      toast({
        title: "Rule updated",
        description: "Your rule has been updated successfully.",
      });
    } catch (error) {
      console.error("Error editing rule:", error);
      toast({
        title: "Error",
        description: "Failed to update the rule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAction((prev) => ({ ...prev, editRule: false }));
    }
  };

  const handleDeleteRule = async (ruleId) => {
    setIsLoadingAction((prev) => ({ ...prev, deleteRule: true }));
    try {
      const token = Cookies.get("token");
      await axios.delete(`${API_URL}/rules/${ruleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRules((prevRules) => prevRules.filter((rule) => rule._id !== ruleId));

      setIsDeleteDialogOpen(false);
      setRuleToDelete(null);
      toast({
        title: "Rule deleted",
        description: "Your rule has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting rule:", error);
      toast({
        title: "Error",
        description: "Failed to delete the rule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAction((prev) => ({ ...prev, deleteRule: false }));
    }
  };

  const handleToggleRuleFollow = async (ruleId, isFollowed) => {
    setIsLoadingAction((prev) => ({ ...prev, followRule: true }));
    try {
      const token = Cookies.get("token");
      await axios.post(
        `${API_URL}/rules/follow-unfollow`,
        {
          ruleId,
          date: selectedDate.toISOString(),
          isFollowed: !isFollowed,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRules((prevRules) =>
        prevRules.map((rule) =>
          rule._id === ruleId ? { ...rule, isFollowed: !isFollowed } : rule
        )
      );

      toast({
        title: `Rule ${isFollowed ? "unfollowed" : "followed"}`,
        description: `The rule has been ${
          isFollowed ? "unfollowed" : "followed"
        } successfully.`,
      });
    } catch (error) {
      console.error("Error following/unfollowing rule:", error);
      toast({
        title: "Error",
        description: "Failed to update the rule status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAction((prev) => ({ ...prev, followRule: false }));
    }
  };

  const handleFollowUnfollowAll = async (isFollowed) => {
    setIsLoadingAction((prev) => ({ ...prev, followAllRules: true }));
    try {
      const token = Cookies.get("token");
      await axios.post(
        `${API_URL}/rules/follow-unfollow-all`,
        {
          date: selectedDate.toISOString(),
          isFollowed,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRules((prevRules) =>
        prevRules.map((rule) => ({ ...rule, isFollowed }))
      );

      toast({
        title: `All rules ${isFollowed ? "followed" : "unfollowed"}`,
        description: `All rules have been ${
          isFollowed ? "followed" : "unfollowed"
        } successfully.`,
      });
    } catch (error) {
      console.error("Error following/unfollowing all rules:", error);
      toast({
        title: "Error",
        description: "Failed to update all rules. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAction((prev) => ({ ...prev, followAllRules: false }));
    }
  };

  const handleLoadSampleRules = async () => {
    setIsLoadingAction((prev) => ({ ...prev, loadSampleRules: true }));
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${API_URL}/rules/load-sample`,
        {
          date: selectedDate.toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRules(response.data);

      toast({
        title: "Sample rules loaded",
        description: "Standard trading rules have been loaded successfully.",
      });
    } catch (error) {
      console.error("Error loading sample rules:", error);
      toast({
        title: "Error",
        description: "Failed to load sample rules. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAction((prev) => ({ ...prev, loadSampleRules: false }));
    }
  };

  const filteredRules = rules.filter((rule) =>
    rule.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoadingRules) {
    return (
      <Card className="w-full max-w-4xl h-full mx-auto p-4 flex items-center justify-center">
        <div className="flex items-center">
          <Loader2 className="mr-2 h-8 w-8 animate-spin" />
          <span>Loading rules...</span>
        </div>
      </Card>
    );
  }

  if (rules.length === 0) {
    return (
      <>
        <EmptyState
          onAddRule={() => setNewRulesDialog(true)}
          onLoadSampleRules={handleLoadSampleRules}
          isLoading={isLoadingAction.loadSampleRules}
        />
        <AddRulesDialog
          open={newRulesDialog}
          onOpenChange={setNewRulesDialog}
          selectedDate={selectedDate}
          onRulesAdded={handleAddRules}
          isLoading={isLoadingAction.addRule}
        />
      </>
    );
  }

  return (
    <Card className="w-full  h-full mx-auto p-4 flex-1  shadow-[0px_8px_20px_rgba(0,0,0,0.08)] dark:shadow-[0px_8px_20px_rgba(0,0,0,0.32)] ">
      <CardHeader className="p-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-medium">Rules</CardTitle>
            <HoverCard>
              <HoverCardTrigger>
                <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex flex-col gap-2">
                  <h4 className="font-semibold">Trading Rules</h4>
                  <p className="text-sm text-muted-foreground">
                    Define and track your trading rules to maintain better
                    discipline and consistency in your trading strategy. Check
                    rules you've followed for each trading session.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>

          <div className="flex space-x-2 items-center">
            <div className="relative flex grow max-w-[10.25rem] mr-2 text-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search rules"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 pl-8 text-xs text-gray-400 h-fit "
              />
            </div>

            <Button
              className="bg-primary h-fit text-white text-xs px-3 hover:bg-purple-600"
              onClick={() => setNewRulesDialog(true)}
              disabled={isLoadingAction.addRule}
            >
              {isLoadingAction.addRule ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Add Rules
            </Button>

            <AddRulesDialog
              open={newRulesDialog}
              onOpenChange={setNewRulesDialog}
              selectedDate={selectedDate}
              onRulesAdded={handleAddRules}
              isLoading={isLoadingAction.addRule}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 mt-3">
        <div className="rounded-lg overflow-hidden border">
          <div className="sticky top-0 z-10 grid grid-cols-[auto,1fr,auto] gap-4 p-2 px-4 bg-[#F4E4FF] dark:bg-[#49444c] border-b">
            <div className="flex items-center">
              <Checkbox
                checked={
                  filteredRules.length > 0 &&
                  filteredRules.every((rule) => rule.isFollowed)
                }
                onCheckedChange={(checked) =>
                  handleFollowUnfollowAll(!!checked)
                }
                disabled={isLoadingAction.followAllRules}
                className="border-[#ffffff]"
              />
            </div>
            <span className="font-semibold text-xs">My Rules</span>
            <span className="font-semibold text-xs text-right">Action</span>
          </div>
          <div className="max-h-[55vh] min-h-96 overflow-y-auto bg-[#FAF7FF] dark:bg-[#363637]">
            <div className="divide-y">
              {filteredRules.map((rule) => (
                <div
                  key={rule._id}
                  className="grid grid-cols-[auto,1fr,auto] gap-4 px-4 py-2 items-center hover:bg-secondary/50"
                >
                  <div>
                    <Checkbox
                      checked={rule.isFollowed}
                      onCheckedChange={() =>
                        handleToggleRuleFollow(rule._id, rule.isFollowed)
                      }
                      disabled={isLoadingAction.followRule}
                    />
                  </div>
                  <span className=" text-xs">{rule.description}</span>
                  <div className="flex items-center gap-2 p-0">
                    <button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500/50 hover:text-gray-700 p-0"
                      onClick={() => setEditingRule(rule)}
                      disabled={isLoadingAction.editRule}
                    >
                      <SquarePen className="h-4 w-4" />
                    </button>
                    <button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500/50 hover:text-red-700 p-0"
                      onClick={() => {
                        setRuleToDelete(rule);
                        setIsDeleteDialogOpen(true);
                      }}
                      disabled={isLoadingAction.deleteRule}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>

      <Dialog open={!!editingRule} onOpenChange={() => setEditingRule(null)}>
        <DialogContent>
          <DialogHeader className={"border-b pb-2 mb-2"}>
            <DialogTitle className="text-xl mb-1">Edit Rule</DialogTitle>
            <DialogDescription className="text-xs">Here you can edit your rules.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-1 mb-4 text-sm">
            <p>Rule:</p>
            <Input
              value={editingRule?.description || ""}
              onChange={(e) =>
                setEditingRule(
                  editingRule
                    ? {
                        ...editingRule,
                        description: e.target.value.slice(0, MAX_RULE_LENGTH),
                      }
                    : null
                )
              }
              placeholder="Enter your rule"
              maxLength={MAX_RULE_LENGTH}
            />
            <div className="text-xs text-muted-foreground text-right">
              {editingRule?.description.length || 0}/{MAX_RULE_LENGTH}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingRule(null)}
              disabled={isLoadingAction.editRule}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditRule}
              disabled={
                isLoadingAction.editRule ||
                !editingRule?.description.trim() ||
                editingRule.description ===
                  rules.find((r) => r._id === editingRule._id)?.description
              }
            >
              {isLoadingAction.editRule ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isLoadingAction.editRule ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader className={"border-b pb-2 mb-2"}>
            <DialogTitle className="text-xl mb-1">Delete Rule</DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to delete this rule permanently?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-1 mb-4 text-sm">
            <p>Rule:</p>
            <Input
              value={ruleToDelete?.description || ""}
              readOnly
              className="bg-secondary cursor-not-allowed"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isLoadingAction.deleteRule}
            >
              Cancel
            </Button>
            <Button
              variant=""
              onClick={() => handleDeleteRule(ruleToDelete?._id || "")}
              disabled={isLoadingAction.deleteRule}
            >
              {isLoadingAction.deleteRule ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isLoadingAction.deleteRule ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
