"use client";

import { useState, useEffect } from "react";
import Topbar from "@/components/navigation/Topbar";
import Sidebar from "@/components/navigation/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function MainLayout({
  children,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("token");
      const expiry = Cookies.get("expiry");

      if (!token || !expiry) {
        // No token or expiry found, redirect to login
        router.push("/login");
      } else {
        const expiryTime = Number(expiry);
        if (Date.now() > expiryTime) {
          // Token expired
          setTokenExpired(true);
          clearAuthCookies();
        } else {
          // Set up a timeout to clear cookies when they expire
          const timeUntilExpiry = expiryTime - Date.now();
          setTimeout(() => {
            setTokenExpired(true);
            clearAuthCookies();
          }, timeUntilExpiry);
        }
      }
    };

    checkAuth();
  }, [router]);

  const clearAuthCookies = () => {
    Cookies.remove("userName");
    Cookies.remove("token");
    Cookies.remove("expiry");
    Cookies.remove("userEmail");
    Cookies.remove("userId");
  };

  const handleLoginRedirect = () => {
    setTokenExpired(false);
    router.push("/login");
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex flex-col h-screen bg-background">
      <Topbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} />
        <div className="flex-1 overflow-auto ">
          <Toaster />
          {children}
          <AlertDialog open={tokenExpired} onOpenChange={setTokenExpired}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Session Expired</AlertDialogTitle>
                <AlertDialogDescription>
                  Your session has expired. Please log in again.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={handleLoginRedirect}>
                  Login Again
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
