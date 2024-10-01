"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/layouts/AuthLayout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sending OTP logic here
    console.log("OTP send attempted for email:", email);
    // Redirect to OTP verification page
    router.push("/otp-verification");
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-lg p-8 space-y-8">
        <Button
          variant="outline"
          className="mb-8 rounded-full size-10 p-0 absolute left-10 lg:left-32 top-20"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Forgot Password?</h1>
          <p className="text-muted-foreground text-sm">
            Please enter your email to reset the password
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email ID</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Send OTP
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
