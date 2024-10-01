'use client'
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, EyeOff } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";

export default function MyAccount() {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <MainLayout>
      <div className="p-6  min-h-screen">
        <div className=" mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">My Account</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Logout</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Logout</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to logout? You will need to login
                    again to access your account.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Logout</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Personal Details</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Edit</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Personal Details</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-name">Name</Label>
                      <Input id="edit-name" defaultValue="Json Taylor" />
                    </div>
                    <div>
                      <Label htmlFor="edit-email">Email</Label>
                      <Input
                        id="edit-email"
                        defaultValue="jsontaylor@gmail.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-phone">Phone number</Label>
                      <Input id="edit-phone" defaultValue="1234567890" />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <Label>Name</Label>
                <Input readOnly value="Json Taylor" />
              </div>
              <div>
                <Label>Email</Label>
                <Input readOnly value="jsontaylor@gmail.com" />
              </div>
              <div>
                <Label>Phone number</Label>
                <Input readOnly value="1234567890" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Password</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Change Password</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">
                        Confirm New Password
                      </Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Update Password</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Label>Current password</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  value="••••••••••••"
                  readOnly
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-6"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Password last changed on: 9 July 2024
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Dashboard Settings</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Edit</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Dashboard Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-order-limit">
                        Daily max order limit
                      </Label>
                      <Input
                        id="edit-order-limit"
                        type="number"
                        defaultValue={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-brokerage">
                        Brokerage of your broker (Rs)
                      </Label>
                      <Input
                        id="edit-brokerage"
                        type="number"
                        defaultValue={20}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-capital">Capital (Rs)</Label>
                      <Input
                        id="edit-capital"
                        type="number"
                        defaultValue={100000}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <Label>Daily max order limit</Label>
                <Input readOnly value="4" />
              </div>
              <div>
                <Label>Brokerage of your broker (Rs)</Label>
                <Input readOnly value="20" />
              </div>
              <div>
                <Label>Capital (Rs)</Label>
                <Input readOnly value="1,00,000" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Subscription Details</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Upgrade</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upgrade Subscription</DialogTitle>
                    <DialogDescription>
                      Choose a new plan to upgrade your subscription.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* Add subscription plan options here */}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Confirm Upgrade</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Active plan</Label>
                <Input readOnly value="6 Month Plan" />
              </div>
              <div>
                <Label>Expiration date</Label>
                <Input readOnly value="12 June 2024" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
