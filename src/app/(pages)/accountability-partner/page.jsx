"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreVertical, Package } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";

export default function AccountabilityPartner() {
  const [partners, setPartners] = useState([
    { name: "Rahul Sharma", lastViewed: "22 June 2024, 12:40:12 PM" },
    { name: "Rahul Sharma", lastViewed: "22 June 2024, 12:40:12 PM" },
    { name: "Rahul Sharma", lastViewed: "22 June 2024, 12:40:12 PM" },
    { name: "Rahul Sharma", lastViewed: "22 June 2024, 12:40:12 PM" },
  ]);

  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row h-full">
        <Card className="bg-transparent border-none shadow-none flex-1 lg:flex-[2] h-full">
          <CardHeader>
            <CardTitle className="text-2xl">Add Accountability Partner</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="fullName">Full name*</Label>
                  <Input
                    id="fullName"
                    placeholder="Accountability Partner's full name"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="email">Email ID*</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Accountability Partner's Email ID"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="relation">Relation</Label>
                  <Select>
                    <SelectTrigger id="relation">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mentor">Mentor</SelectItem>
                      <SelectItem value="family">Family Member</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="colleague">Colleague</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label htmlFor="details">
                    Select details you want to share*
                  </Label>
                  <Select>
                    <SelectTrigger id="details">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trades">
                        No. of Trades taken
                      </SelectItem>
                      <SelectItem value="winrate">Win Rate</SelectItem>
                      <SelectItem value="rules">Rules Followed</SelectItem>
                      <SelectItem value="pnl">Profit/Loss Chart</SelectItem>
                      <SelectItem value="capital">Current Capital</SelectItem>
                      <SelectItem value="journaling">
                        Journaling Trend
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Share my progress*</Label>
                <RadioGroup
                  defaultValue="weekly"
                  className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly">Weekly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly">Monthly</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="text-sm text-gray-500">
                Your accountability partner will receive progress analysis
                starting from today.
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button>Add</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-none border-none shadow-none flex-1 h-full bg-accent mt-4 lg:mt-0">
          <CardHeader>
            <CardTitle className="text-2xl">My Accountability Partners</CardTitle>
          </CardHeader>
          <CardContent>
            {partners.length > 0 ? (
              <div className="space-y-4">
                {partners.map((partner, index) => (
                  <Card key={index}>
                    <CardContent className="flex justify-between items-center p-4">
                      <div>
                        <h3 className="font-semibold">{partner.name}</h3>
                        <p className="text-sm text-gray-500">
                          Last viewed: {partner.lastViewed}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  No data
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Please add your Accountability Partner
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
