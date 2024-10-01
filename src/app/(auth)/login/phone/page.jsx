"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import AuthLayout from "@/components/layouts/AuthLayout";

export default function LoginPage() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempted with:", mobile, password);
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-lg p-8 space-y-8 ">
        <Button
          variant="outline"
          className="mb-8 rounded-full size-10 p-0 absolute left-10 lg:left-32 top-20"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="space-y-2 text-start">
          <h1 className="text-3xl font-bold">Log in with Mobile Number </h1>
          <p className="text-muted-foreground text-sm">
            Please enter your registered mobile no. and password
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              type="number"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setmobile(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline block text-right"
          >
            Forgot Password?
          </Link>
          <Button type="submit" className="w-full text-background">
            Log in
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
