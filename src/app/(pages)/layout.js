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
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activePopover, setActivePopover] = useState(null);
  const [showPopover, setShowPopover] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("token");
      const expiry = Cookies.get("expiry");

      if (!token || !expiry) {
        router.push("/login");
      } else {
        const expiryTime = Number(expiry);
        if (Date.now() > expiryTime) {
          setTokenExpired(true);
          clearAuthCookies();
        } else {
          const timeUntilExpiry = expiryTime - Date.now();
          setTimeout(() => {
            setTokenExpired(true);
            clearAuthCookies();
          }, timeUntilExpiry);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
    fetchActivePopovers();
  }, [router]);

  const fetchActivePopovers = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/announcements`
      );
      if (response.ok) {
        const popovers = await response.json();
        if (popovers.length > 0) {
          setActivePopover(popovers[0]);
          setShowPopover(true);
        }
      }
    } catch (error) {
      console.error("Error fetching popovers:", error);
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

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
          <AlertDialog open={showPopover} onOpenChange={setShowPopover}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{activePopover?.title}</AlertDialogTitle>
                <AlertDialogDescription>
                  {activePopover?.content}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setShowPopover(false)}>
                  Close
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
