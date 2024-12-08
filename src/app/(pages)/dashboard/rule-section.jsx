"use client";

import React, { useState } from "react";
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
import { Info, SquarePen, Trash2, Plus } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const EmptyState = ({ setNewRuleDialog, handleLoadSampleRules, isLoading }) => (
  <Card className="flex flex-col items-center justify-center p-4 ">
    <div className="flex items-center w-full gap-2">
      <h2 className="text-2xl font-semibold">Rules</h2>
      <HoverCard>
        <HoverCardTrigger>
          <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold">Trading Rules</h4>
            <p className="text-sm text-muted-foreground">
              Define and track your trading rules to maintain better discipline
              and consistency in your trading strategy. Check rules you've
              followed for each trading session.
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
    <img src="/images/no_rule.png" alt="No rules yet" className="mb-6 w-48" />
    <h3 className="text-xl font-semibold mb-2">Get Started!</h3>
    <p className="text-gray-500 mb-6">
      Please click below to add your trading rules
    </p>
    <Button
      className="bg-primary hover:primary_gradient text-white mb-4"
      onClick={() => setNewRuleDialog(true)}
    >
      <Plus className="mr-2 h-4 w-4" /> Add Rules
    </Button>
    <div className="text-gray-400 mb-2">OR</div>
    <Button
      variant="outline"
      className="text-primary hover:bg-primary/10"
      onClick={handleLoadSampleRules}
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : "Load Standard Rules"}
    </Button>
  </Card>
);

export function RulesSection({ journal, setJournal, rules, onFollowRule }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingRule, setEditingRule] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState(null);
  const [newRuleDialog, setNewRuleDialog] = useState(false);
  const [newRuleDescription, setNewRuleDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddRule = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${API_URL}/rules`,
        {
          description: newRuleDescription,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (journal) {
        setJournal({
          ...journal,
          rulesUnfollowed: [...journal.rulesUnfollowed, response.data],
        });
      } else if (rules) {
        onFollowRule(response.data._id);
      }
      setNewRuleDescription("");
      setNewRuleDialog(false);
    } catch (error) {
      console.error("Error adding rule:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRule = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.patch(
        `${API_URL}/rules/${editingRule._id}`,
        {
          description: editingRule.description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (journal) {
        const updatedJournal = {
          ...journal,
          rulesFollowed: journal.rulesFollowed.map((rule) =>
            rule._id === editingRule._id ? response.data : rule
          ),
          rulesUnfollowed: journal.rulesUnfollowed.map((rule) =>
            rule._id === editingRule._id ? response.data : rule
          ),
        };
        setJournal(updatedJournal);
      } else if (rules) {
        onFollowRule(response.data._id);
      }
      setEditingRule(null);
    } catch (error) {
      console.error("Error editing rule:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRuleFollow = async (ruleId, isFollowed) => {
    setIsLoading(true);
    try {
      if (journal) {
        const token = Cookies.get("token");
        const response = await axios.post(
          `${API_URL}/journals/follow-unfollow-rule`,
          {
            journalId: journal._id,
            ruleId,
            isFollowed: !isFollowed,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setJournal(response.data);
      } else if (rules) {
        onFollowRule(ruleId);
      }
    } catch (error) {
      console.error("Error following/unfollowing rule:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRule = async (ruleId) => {
    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      await axios.delete(`${API_URL}/rules/${ruleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (journal) {
        const updatedJournal = {
          ...journal,
          rulesFollowed: journal.rulesFollowed.filter(
            (rule) => rule._id !== ruleId
          ),
          rulesUnfollowed: journal.rulesUnfollowed.filter(
            (rule) => rule._id !== ruleId
          ),
        };
        setJournal(updatedJournal);
      } else if (rules) {
        onFollowRule(null); // Refresh rules after deletion
      }
      setIsDeleteDialogOpen(false);
      setRuleToDelete(null);
    } catch (error) {
      console.error("Error deleting rule:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUnfollowAll = async (isFollowed) => {
    if (!journal) return;
    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${API_URL}/journals/follow-unfollow-all`,
        {
          journalId: journal._id,
          isFollowed,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setJournal(response.data);
    } catch (error) {
      console.error("Error following/unfollowing all rules:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSampleRules = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${API_URL}/rules/load-sample`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (journal) {
        setJournal({
          ...journal,
          rulesUnfollowed: response.data,
        });
      } else if (rules) {
        onFollowRule(response.data[0]._id);
      }
    } catch (error) {
      console.error("Error loading sample rules:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const allRules = journal
    ? [
        ...(journal.rulesFollowed || []).map((rule) => ({
          ...rule,
          isFollowed: true,
        })),
        ...(journal.rulesUnfollowed || []).map((rule) => ({
          ...rule,
          isFollowed: false,
        })),
      ]
    : rules || [];

  const filteredRules = allRules.filter((rule) =>
    rule.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (allRules.length === 0) {
    return (
      <EmptyState
        setNewRuleDialog={setNewRuleDialog}
        handleLoadSampleRules={handleLoadSampleRules}
        isLoading={isLoading}
      />
    );
  }

  return (
    <Card className="w-full max-w-4xl h-full mx-auto p-4 flex-1">
      <CardHeader className="p-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl">Rules</CardTitle>
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
          <div className="flex items-center gap-4">
            <div className="relative w-36">
              <Input
                placeholder="Search rules"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
              <svg
                className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <Dialog open={newRuleDialog} onOpenChange={setNewRuleDialog}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-purple-600 px-1 w-fit text-white">
                  <Plus className="mr-1 h-4 w-4" /> Add Rules
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Rule</DialogTitle>
                  <DialogDescription>
                    Add a new trading rule. Maximum 150 characters.
                  </DialogDescription>
                </DialogHeader>
                <Input
                  value={newRuleDescription}
                  onChange={(e) => setNewRuleDescription(e.target.value)}
                  placeholder="Enter your rule"
                  maxLength={150}
                />
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setNewRuleDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddRule} disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add Rule"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 mt-3">
        <div className="rounded-lg overflow-hidden">
          <div className="sticky top-0 z-10 grid grid-cols-[auto,1fr,auto] gap-4 p-2 px-4 bg-primary/25 border-b">
            <div className="flex items-center">
              <Checkbox
                checked={
                  filteredRules.length > 0 &&
                  filteredRules.every((rule) => rule.isFollowed)
                }
                onCheckedChange={(checked) => handleFollowUnfollowAll(checked)}
                disabled={isLoading || !journal}
              />
            </div>
            <span className="font-medium">My Rules</span>
            <span className="font-medium text-right">Action</span>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            <div className="divide-y">
              {filteredRules.map((rule) => (
                <div
                  key={rule._id || rule.originalId}
                  className="grid grid-cols-[auto,1fr,auto] gap-4 px-4 py-2 items-center hover:bg-secondary/50"
                >
                  <div>
                    <Checkbox
                      checked={rule.isFollowed}
                      onCheckedChange={() =>
                        handleToggleRuleFollow(rule._id || rule.originalId, rule.isFollowed)
                      }
                      disabled={isLoading}
                    />
                  </div>
                  <span className="text-gray-700">{rule.description}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => setEditingRule(rule)}
                      disabled={isLoading}
                    >
                      <SquarePen className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => {
                        setRuleToDelete(rule);
                        setIsDeleteDialogOpen(true);
                      }}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>

      {/* Edit Rule Dialog */}
      <Dialog open={!!editingRule} onOpenChange={() => setEditingRule(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Rule</DialogTitle>
            <DialogDescription>
              Edit your trading rule. Maximum 150 characters.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={editingRule?.description || ""}
            onChange={(e) =>
              setEditingRule({ ...editingRule, description: e.target.value })
            }
            placeholder="Enter your rule"
            maxLength={150}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRule(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditRule} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Rule</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this rule? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteRule(ruleToDelete._id)}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
