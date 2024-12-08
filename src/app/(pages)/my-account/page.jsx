"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function AccountPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);

  // Dialog states
  const [personalDetailsOpen, setPersonalDetailsOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  // Form states
  const [personalForm, setPersonalForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [settingsForm, setSettingsForm] = useState({
    capital: 0,
    brokerage: 0,
    tradesPerDay: 0,
  });

  // Axios instance with interceptor for bearer token
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // Replace with your API base URL
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add a request interceptor to include the bearer token
  api.interceptors.request.use(
    (config) => {
      const token = Cookies.get("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    fetchUserData();
    fetchSettings();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get("/user/profile");
      setUser(response.data);
      setPersonalForm(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive",
      });
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await api.get("/user/settings");
      setSettings(response.data);
      setSettingsForm(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch settings",
        variant: "destructive",
      });
    }
  };

  const handlePersonalDetailsSubmit = async () => {
    try {
      await api.patch("/user/profile", personalForm);
      setUser(personalForm);
      setPersonalDetailsOpen(false);
      toast({ title: "Success", description: "Profile updated successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      await api.patch("/user/change-password", passwordForm);
      setPasswordDialogOpen(false);
      toast({ title: "Success", description: "Password updated successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      });
    }
  };

  const handleSettingsSubmit = async () => {
    try {
      const response = await api.patch("/user/settings", settingsForm);
      setSettings(response.data);
      setSettingsDialogOpen(false);
      toast({ title: "Success", description: "Settings updated successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Account</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Personal Details Section */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Personal Details</CardTitle>
            <CardDescription>Manage your personal information</CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={() => setPersonalDetailsOpen(true)}
          >
            Edit
          </Button>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Name</Label>
              <Input value={user?.name} readOnly />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={user?.email} readOnly />
            </div>
            <div>
              <Label>Phone number</Label>
              <Input value={user?.phone} readOnly />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Password</CardTitle>
            <CardDescription>Manage your password</CardDescription>
          </div>
          <Button variant="outline" onClick={() => setPasswordDialogOpen(true)}>
            Change Password
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value="********"
              readOnly
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Settings Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Dashboard Settings</CardTitle>
            <CardDescription>Manage your trading preferences</CardDescription>
          </div>
          <Button variant="outline" onClick={() => setSettingsDialogOpen(true)}>
            Edit
          </Button>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Capital</Label>
              <Input value={settings?.capital} readOnly />
            </div>
            <div>
              <Label>Brokerage</Label>
              <Input value={settings?.brokerage} readOnly />
            </div>
            <div>
              <Label>Trades Per Day</Label>
              <Input value={settings?.tradesPerDay} readOnly />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Details Dialog */}
      <Dialog open={personalDetailsOpen} onOpenChange={setPersonalDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Personal Details</DialogTitle>
            <DialogDescription>
              Update your personal information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={personalForm.name}
                onChange={(e) =>
                  setPersonalForm({ ...personalForm, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={personalForm.email}
                onChange={(e) =>
                  setPersonalForm({ ...personalForm, email: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={personalForm.phone}
                onChange={(e) =>
                  setPersonalForm({ ...personalForm, phone: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPersonalDetailsOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handlePersonalDetailsSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current and new password
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPasswordDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handlePasswordSubmit}>Change Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Dashboard Settings</DialogTitle>
            <DialogDescription>
              Update your trading preferences
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="capital">Capital</Label>
              <Input
                id="capital"
                type="number"
                value={settingsForm.capital}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    capital: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="brokerage">Brokerage</Label>
              <Input
                id="brokerage"
                type="number"
                value={settingsForm.brokerage}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    brokerage: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="tradesPerDay">Trades Per Day</Label>
              <Input
                id="tradesPerDay"
                type="number"
                value={settingsForm.tradesPerDay}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    tradesPerDay: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSettingsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSettingsSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
