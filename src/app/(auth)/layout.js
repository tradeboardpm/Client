'use client'
import ImageCarousel from "@/components/cards/ImageCarousel";
import { Toaster } from "@/components/ui/sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function AuthLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex items-center justify-center">
        {children} <Toaster />
      </div>
      <div className="hidden md:flex md:w-1/2 bg-primary py-12 px-6 rounded-l-[4rem]">
        <ImageCarousel />
      </div>
    </div>
  );
}
