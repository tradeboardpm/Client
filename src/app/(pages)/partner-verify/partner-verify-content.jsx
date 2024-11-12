"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function PartnerVerifyContent() {
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [partnerId, setPartnerId] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setVerificationStatus("error");
        setErrorMessage("No verification token found");
        return;
      }

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/accountability-partner/verify`,
          { token }
        );
        setVerificationStatus("success");
        setPartnerId(response.data.partnerId);
      } catch (error) {
        setVerificationStatus("error");
        setErrorMessage(
          error.response?.data?.error || "An error occurred during verification"
        );
      }
    };

    verifyToken();
  }, [searchParams]);

  return (
    <>
      <CardContent>
        {verificationStatus === "loading" && (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">
              Verifying your token...
            </p>
          </div>
        )}
        {verificationStatus === "success" && (
          <div className="flex flex-col items-center justify-center py-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <p className="mt-2 text-sm text-center">
              Your partner access has been successfully verified!
            </p>
          </div>
        )}
        {verificationStatus === "error" && (
          <div className="flex flex-col items-center justify-center py-4">
            <XCircle className="h-8 w-8 text-red-500" />
            <p className="mt-2 text-sm text-center text-red-500">
              {errorMessage}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {verificationStatus === "success" && (
          <Link href={`/partner-dashboard/${partnerId}`} passHref>
            <Button>Go to Partner Dashboard</Button>
          </Link>
        )}
        {verificationStatus === "error" && (
          <Link href="/" passHref>
            <Button variant="outline">Return to Home</Button>
          </Link>
        )}
      </CardFooter>
    </>
  );
}
