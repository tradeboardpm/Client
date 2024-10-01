"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import AuthLayout from "@/components/layouts/AuthLayout";

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle OTP verification logic here
    console.log("OTP verification attempted with:", otp);
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
        <div className="space-y-2 ">
          <h1 className="text-3xl font-bold">OTP Verification</h1>
          <p className="text-muted-foreground text-sm ">
            We have sent 4-digit code to your registered email
            ank*****@gmail.com{" "}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="otp" className="sr-only">
              Enter OTP
            </label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="text-center text-lg"
              maxLength={4}
            />
          </div>
          <Button
            type="submit"
            className="w-full text-background bg-primary hover:bg-primary/90"
          >
            Verify OTP
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Didn't Get OTP?{" "}
          <Button variant="link" className="text-primary p-0 h-auto">
            Resend OTP
          </Button>
        </p>
      </div>
    </AuthLayout>
  );
}
