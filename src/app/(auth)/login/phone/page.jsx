"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import axios from "axios";

const countryCodes = [
  { value: "91", label: "India (+91)" },
  { value: "1", label: "United States (+1)" },
  { value: "44", label: "United Kingdom (+44)" },
  { value: "81", label: "Japan (+81)" },
  { value: "86", label: "China (+86)" },
];

export default function LoginPage() {
  const [countryCode, setCountryCode] = useState("91");
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
          phone: `+${countryCode}${mobile}`,
        }
      );

      if (response.status === 200) {
        router.push(
          `/login/phone/verify-otp?phone=${encodeURIComponent(
            `+${countryCode}${mobile}`
          )}`
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
        <p className="text-muted-foreground/65 text-sm">
          Please enter your registered mobile number
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile Number</Label>
          <div className="flex space-x-2">
            <Select
              value={countryCode}
              onValueChange={(value) => setCountryCode(value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Country Code" />
              </SelectTrigger>
              <SelectContent>
                {countryCodes.map((code) => (
                  <SelectItem key={code.value} value={code.value}>
                    {code.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              id="mobile"
              type="tel"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              className="flex-1"
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full text-background"
          disabled={isLoading}
        >
          {isLoading ? "Sending OTP..." : "Send OTP"}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/sign-up" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
