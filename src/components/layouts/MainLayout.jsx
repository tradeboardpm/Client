"use client";

import { useState, useEffect } from "react";
import Topbar from "../navigation/Topbar";
import Sidebar from "../navigation/Sidebar";
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

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
   const [tokenExpired, setTokenExpired] = useState(false);
   const router = useRouter();

   useEffect(() => {
     const checkAuth = () => {
       const token = Cookies.get("token");
       const expiry = Cookies.get("expiry");

       if (!token) {
         // No token found, redirect to login
         router.push("/login");
       } else if (expiry && Date.now() > Number(expiry)) {
         // Token expired
         setTokenExpired(true);
         clearAuthCookies();
       }
     };

     checkAuth();
   }, [router]);

   const clearAuthCookies = () => {
     Cookies.remove("token");
     Cookies.remove("name");
     Cookies.remove("role");
     Cookies.remove("expiry");
     Cookies.remove("email");
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
            <AlertDialogTrigger></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Token Expired</AlertDialogTitle>
                <AlertDialogDescription>
                  Your session has expired. Please log in again.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleLoginRedirect}>
                  Login Again
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
