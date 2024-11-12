'use client'

import { Suspense } from "react"
import PartnerVerifyContent from "./partner-verify-content"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function PartnerVerify() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Partner Verification</CardTitle>
          <CardDescription>
            Verifying your accountability partner access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">
                Loading...
              </p>
            </div>
          }>
            <PartnerVerifyContent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}