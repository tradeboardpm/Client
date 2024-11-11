"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
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
import { MoreVertical, Package, Trash2 } from "lucide-react";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import { toast } from "@/hooks/use-toast";

export default function AccountabilityPartner() {
  const [partners, setPartners] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    relation: "",
    shareDuration: "weekly",
  });

  const detailOptions = [
    { value: "trades", label: "No. of Trades taken" },
    { value: "winrate", label: "Win Rate" },
    { value: "rules", label: "Rules Followed" },
    { value: "pnl", label: "Profit/Loss Chart" },
    { value: "capital", label: "Current Capital" },
    { value: "journaling", label: "Journaling Trend" },
  ];

  // Create axios instance with default headers
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  // Add request interceptor to include token
  api.interceptors.request.use(
    (config) => {
      const token = Cookies.get("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await api.get("/accountability-partner/list");
      setPartners(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch partners",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/accountability-partner/add", {
        ...formData,
        detailsToShare: selectedDetails,
      });
      toast({
        title: "Success",
        description: "Accountability partner added successfully",
      });
      fetchPartners();
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add partner",
        variant: "destructive",
      });
    }
  };

  const handleRemovePartner = async (partnerId) => {
    try {
      await api.delete(`/accountability-partner/remove/${partnerId}`);
      toast({
        title: "Success",
        description: "Accountability partner removed successfully",
      });
      fetchPartners();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove partner",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      relation: "",
      shareDuration: "weekly",
    });
    setSelectedDetails([]);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <Card className="bg-transparent border-none shadow-none flex-1 lg:flex-[2] h-full">
        <CardHeader>
          <CardTitle className="text-2xl">Add Accountability Partner</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="name">Full name*</Label>
                <Input
                  id="name"
                  placeholder="Accountability Partner's full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="email">Email ID*</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Accountability Partner's Email ID"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="relation">Relation</Label>
                <Select
                  value={formData.relation}
                  onValueChange={(value) =>
                    setFormData({ ...formData, relation: value })
                  }
                >
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
                <Label htmlFor="details" className="-mb-4">
                  Select details you want to share*
                </Label>
                <MultiSelector
                  values={selectedDetails}
                  onValuesChange={setSelectedDetails}
                  className="w-full -mt-2 h-fit "
                >
                  <MultiSelectorTrigger className="w-full rounded  bg-card border border-input/25 shadow-sm  p-2">
                    <MultiSelectorInput
                      placeholder="Select details..."
                      className="bg-card text-sm"
                    />
                  </MultiSelectorTrigger>
                  <MultiSelectorContent>
                    <MultiSelectorList>
                      {detailOptions.map((option) => (
                        <MultiSelectorItem
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </MultiSelectorItem>
                      ))}
                    </MultiSelectorList>
                  </MultiSelectorContent>
                </MultiSelector>
              </div>
            </div>
            <div>
              <Label>Share my progress*</Label>
              <RadioGroup
                value={formData.shareDuration}
                onValueChange={(value) =>
                  setFormData({ ...formData, shareDuration: value })
                }
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
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">Add</Button>
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
              {partners.map((partner) => (
                <Card key={partner._id}>
                  <CardContent className="flex justify-between items-center p-4">
                    <div>
                      <h3 className="font-semibold">{partner.name}</h3>
                      <p className="text-sm text-gray-500">
                        Last viewed:{" "}
                        {new Date(partner.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemovePartner(partner._id)}
                    >
                      <Trash2 className="h-4 w-4" />
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
  );
}
