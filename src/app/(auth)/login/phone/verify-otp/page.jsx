"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const phoneParam = searchParams.get("phone");
    if (phoneParam) {
      setPhone(decodeURIComponent(phoneParam));
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-phone-otp`,
        {
          phone,
          otp,
        }
      );

      if (response.status === 200) {
        const { token, expiresIn, user } = response.data;
        const expiryTime = new Date(new Date().getTime() + expiresIn * 1000);

        Cookies.set("token", token, { expires: expiryTime });
        Cookies.set("userId", user._id, { expires: expiryTime });
        Cookies.set("userName", user.name, { expires: expiryTime });
        Cookies.set("userEmail", user.email, { expires: expiryTime });
        Cookies.set("userPhone", user.phone, { expires: expiryTime });
        Cookies.set("expiry", expiryTime.getTime().toString(), {
          expires: expiryTime,
        });

        router.push("/subscription-plan");
      } else {
        // Handle error
        console.error("Failed to verify OTP");
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
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">OTP Verification</h1>
        <p className="text-muted-foreground text-sm">
          We have sent 6-digit code to your registered mobile number {phone}{" "}
          <Link href="/login" className="text-primary hover:underline">
            Edit Number
          </Link>
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
        <Button variant="link" className="text-primary p-0 h-auto">
          Resend OTP
        </Button>
      </p>
    </div>
  );
}
