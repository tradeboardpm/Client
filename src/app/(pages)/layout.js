"use client";

import { useState, useEffect, useCallback } from "react";
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
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();

  const clearCookiesAndRedirect = useCallback(() => {
    Cookies.remove("userName");
    Cookies.remove("token");
    Cookies.remove("expiry");
    Cookies.remove("userEmail");
    Cookies.remove("userId");
    router.push("/");
  }, [router]);

  const validateToken = useCallback(async () => {
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
  }, [clearCookiesAndRedirect]);

  useEffect(() => {
    validateToken();
    const intervalId = setInterval(validateToken, 60000);
    return () => clearInterval(intervalId);
  }, [validateToken]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = Cookies.get("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/announcement`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();

          // Separate notifications and announcements
          const notificationItems = data.filter(
            (item) => item.type === "notification"
          );
          const announcementItems = data.filter(
            (item) => item.type !== "notification"
          );

          setNotifications(notificationItems);
          setAnnouncements(announcementItems);
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
    // Poll for new announcements every minute
    const intervalId = setInterval(fetchAnnouncements, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = async () => {
    try {
      const token = Cookies.get("token");
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      clearCookiesAndRedirect();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleRemoveAnnouncement = useCallback((announcement) => {
    setAnnouncements((prevAnnouncements) =>
      prevAnnouncements.filter((a) => a._id !== announcement._id)
    );
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      <AnnouncementManager
        announcements={announcements}
        onClose={handleRemoveAnnouncement}
      />

      <Topbar
        toggleSidebar={toggleSidebar}
        onLogout={handleLogout}
        notifications={notifications}
      />

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
