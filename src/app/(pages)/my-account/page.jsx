"use client";

import { useEffect, useState } from "react";
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
  const [userDetails, setUserDetails] = useState();
  const [settings, setSettings] = useState();

  // Dialog states
  const [personalDetailsOpen, setPersonalDetailsOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  // Form states
  const [personalForm, setPersonalForm] = useState();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [settingsForm, setSettingsForm] = useState();
  const [otpForm, setOtpForm] = useState({
    emailOtp: "",
    phoneOtp: "",
  });

  const token = Cookies.get("token");
  const userId = Cookies.get("userId");

  useEffect(() => {
    if (!token || !userId) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [userResponse, settingsResponse] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/user/current-user/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/settings`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUserDetails(userResponse.data.data);
        setSettings(settingsResponse.data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch user data",
        });
      }
    };

    fetchData();
  }, [token, userId, router, toast]);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userId");
    router.push("/login");
  };

  const handlePersonalDetailsSubmit = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/update-profile`,
        personalForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.verificationNeeded) {
        setOtpDialogOpen(true);
      } else {
        setSuccessDialogOpen(true);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/change-password`,
        passwordForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOtpDialogOpen(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to change password",
      });
    }
  };

  const handleSettingsSubmit = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/settings`,
        settingsForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSettings(response.data);
      setSettingsDialogOpen(false);
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update settings",
      });
    }
  };

  const handleOtpSubmit = async () => {
    try {
      if (passwordDialogOpen) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/user/verify-password-change`,
          otpForm,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/user/verify-profile-update`,
          otpForm,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      setSuccessDialogOpen(true);
      setOtpDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid OTP",
      });
    }
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
            onClick={() => {
              setPersonalForm(userDetails);
              setPersonalDetailsOpen(true);
            }}
          >
            Edit
          </Button>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Name</Label>
              <Input value={userDetails?.name} readOnly />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={userDetails?.email} readOnly />
            </div>
            <div>
              <Label>Phone number</Label>
              <Input value={userDetails?.phone} readOnly />
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
          <Button
            variant="outline"
            onClick={() => {
              setSettingsForm(settings);
              setSettingsDialogOpen(true);
            }}
          >
            Edit
          </Button>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Daily max order limit</Label>
              <Input value={settings?.orderLimit} readOnly />
            </div>
            <div>
              <Label>Brokerage of your broker (Rs)</Label>
              <Input value={settings?.brokerage} readOnly />
            </div>
            <div>
              <Label>Capital (Rs)</Label>
              <Input value={settings?.capital} readOnly />
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
              <Label>Name</Label>
              <Input
                value={personalForm?.name}
                onChange={(e) =>
                  setPersonalForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={personalForm?.email}
                onChange={(e) =>
                  setPersonalForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={personalForm?.phone}
                onChange={(e) =>
                  setPersonalForm((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
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
              <Label>Current Password</Label>
              <Input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
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
            <Button onClick={handlePasswordSubmit}>Next</Button>
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
              <Label>Daily max order limit</Label>
              <Input
                type="number"
                value={settingsForm?.orderLimit}
                onChange={(e) =>
                  setSettingsForm((prev) => ({
                    ...prev,
                    orderLimit: parseInt(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <Label>Brokerage (Rs)</Label>
              <Input
                type="number"
                value={settingsForm?.brokerage}
                onChange={(e) =>
                  setSettingsForm((prev) => ({
                    ...prev,
                    brokerage: parseInt(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <Label>Capital (Rs)</Label>
              <Input
                type="number"
                value={settingsForm?.capital}
                onChange={(e) =>
                  setSettingsForm((prev) => ({
                    ...prev,
                    capital: parseInt(e.target.value),
                  }))
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

      {/* OTP Dialog */}
      <Dialog open={otpDialogOpen} onOpenChange={setOtpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify OTP</DialogTitle>
            <DialogDescription>
              Enter the OTP sent to your email and phone
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label>Email OTP</Label>
              <Input
                value={otpForm.emailOtp}
                onChange={(e) =>
                  setOtpForm((prev) => ({ ...prev, emailOtp: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Phone OTP</Label>
              <Input
                value={otpForm.phoneOtp}
                onChange={(e) =>
                  setOtpForm((prev) => ({ ...prev, phoneOtp: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOtpDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleOtpSubmit}>Verify</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
            <DialogDescription>
              Your changes have been saved successfully. Please log in again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleLogout}>Okay</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
