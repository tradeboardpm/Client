"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    } else {
      // Redirect to signup if email is not found
      router.push("/sign-up");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail, otp }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "OTP verification failed");
      }

      // Clear the stored email
      localStorage.removeItem("userEmail");

      // Redirect to login page on successful verification
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/resend-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend OTP");
      }

      alert("New OTP sent successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
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
            We have sent a 6-digit code to your registered email
            {userEmail && ` (${userEmail})`}
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
              maxLength={6}
            />
          </div>
          <Button
            type="submit"
            className="w-full text-background bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Didn't Get OTP?{" "}
          <Button
            variant="link"
            className="text-primary p-0 h-auto"
            onClick={handleResendOTP}
            disabled={isLoading}
          >
            Resend OTP
          </Button>
        </p>
      </div>
    </AuthLayout>
  );
}
