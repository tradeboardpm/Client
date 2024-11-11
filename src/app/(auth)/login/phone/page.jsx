"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import axios from "axios";

export default function LoginPage() {
  const [mobile, setMobile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login-phone`,
        {
          phone: mobile,
        }
      );

      if (response.status === 200) {
        router.push(
          `/login/phone/verify-otp?phone=${encodeURIComponent(mobile)}`
        );
      } else {
        // Handle error
        console.error("Failed to send OTP");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg p-8 space-y-8">
      <Button
        variant="outline"
        className="mb-8 rounded-full size-10 p-0 absolute left-10 lg:left-32 top-20"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div className="space-y-2 text-start">
        <h1 className="text-3xl font-bold">Log in with Mobile Number</h1>
        <p className="text-muted-foreground text-sm">
          Please enter your registered mobile no.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile Number</Label>
          <Input
            id="mobile"
            type="tel"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full text-background"
          disabled={isLoading}
        >
          {isLoading ? "Sending OTP..." : "Log in"}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
