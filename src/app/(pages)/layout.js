"use client";

import { useState, useEffect } from "react";
import Topbar from "@/components/navigation/Topbar";
import Sidebar from "@/components/navigation/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Toaster as Toaster2 } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import AnnouncementManager from "@/components/AnnouncementManager";
import { TooltipProvider } from "@/components/ui/tooltip";
import { toast } from "sonner";

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const router = useRouter();

  const clearCookiesAndRedirect = () => {
    Cookies.remove("userName");
    Cookies.remove("token");
    Cookies.remove("expiry");
    Cookies.remove("userEmail");
    Cookies.remove("userId");
    router.push("/");
  };

  const validateToken = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        clearCookiesAndRedirect();
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/validate-token`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || data.error || data === false) {
        toast.error("Your session has expired. Please log in again.");
        clearCookiesAndRedirect();
      }
    } catch (error) {
      console.error("Token validation error:", error);
      toast.error("An error occurred. Please try logging in again.");
      clearCookiesAndRedirect();
    }
  };

  useEffect(() => {
    // Initial token validation
    validateToken();

    // Set up interval to validate token every minute
    const intervalId = setInterval(validateToken, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = Cookies.get("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/announcements`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setAnnouncements(data);
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleLogout = async () => {
    try {
      const token = Cookies.get("token");

      // Call logout API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      clearCookiesAndRedirect();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex flex-col h-screen bg-background">
      <AnnouncementManager
        announcements={announcements}
        onClose={(announcement) => {
          setAnnouncements((prevAnnouncements) =>
            prevAnnouncements.filter((a) => a._id !== announcement._id)
          );
        }}
      />

      <Topbar toggleSidebar={toggleSidebar} onLogout={handleLogout} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} />
        <div className="flex-1 overflow-auto">
          <Toaster />
          <Toaster2 />
          <TooltipProvider>{children}</TooltipProvider>
        </div>
      </div>
    </div>
  );
}
