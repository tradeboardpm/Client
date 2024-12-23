"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import GoogleLoginButton from "@/components/buttons/google-button";
import { Mail, Phone } from "lucide-react";

export default function LoginOptionsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/google-login`,
        {
          token: credentialResponse.credential,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token, user, expiresIn } = response.data;

      // Store token and user info
      Cookies.set("token", token, {
        expires: expiresIn / 86400, // Convert seconds to days
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      Cookies.set("expiry", String(Date.now() + expiresIn * 1000), {
        expires: expiresIn / 86400,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      Cookies.set("userEmail", user.email, {
        expires: expiresIn / 86400,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      Cookies.set("userName", user.name, {
        expires: expiresIn / 86400,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      Cookies.set("userId", user._id, {
        expires: expiresIn / 86400,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      toast.success("Logged in successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login failed");
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <div className="w-fit max-w-lg  space-y-8">
        <div className="space-y-2 text-start">
          <h1 className="text-3xl font-bold">Log in to your account</h1>
          <p className="text-muted-foreground/65 text-sm ">
            Please select any one of them
          </p>
        </div>
        <div className="space-y-4">
          <GoogleLoginButton
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            disabled={isLoading}
            text="Log in with Google"
          />

          <Button
            variant="secondary"
            className="w-full bg-[#F3F6F8] justify-center border border-[#E7E7EA] font-medium text-xs shadow-[0px_6px_16px_rgba(0,0,0,0.04)]"
            onClick={() => router.push("/login/email")}
            disabled={isLoading}
          >
            <Mail className="h-5 mr-2" />
            Log in with Email
          </Button>

          <Button
            variant="secondary"
            className="w-full bg-[#F3F6F8] justify-center border border-[#E7E7EA] font-medium text-xs shadow-[0px_6px_16px_rgba(0,0,0,0.04)]"
            onClick={() => router.push("/login/phone")}
            disabled={isLoading}
          >
            <Phone className="h-5 mr-2" />
            Log in with Mobile Number
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </GoogleOAuthProvider>
  );
}
