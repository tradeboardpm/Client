import React, { useState, useEffect } from "react";
import { Bell, Menu, Sun, Moon, Laptop, X, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const NotificationItem = ({ title, description, time, onDelete }) => (
  <div className="mb-4 p-3 bg-card rounded-lg relative">
    <button className="absolute top-2 right-2" onClick={onDelete}>
      <X className="h-4 w-4" />
    </button>
    <h3 className="font-semibold">{title}</h3>
    <p className="text-sm">{description}</p>
    <p className="text-xs mt-1">{time}</p>
  </div>
);

export default function Topbar({ toggleSidebar }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [theme, setTheme] = useState("system");
  const [notifications, setNotifications] = useState([
    {
      title: "New trade opportunity",
      description: "A new trading signal has been detected for AAPL.",
      time: "5 minutes ago",
      type: "trade",
    },
    // Additional notification objects...
  ]);

  const router = useRouter();

  useEffect(() => {
    const name = Cookies.get("userName");
    if (name) {
      setUsername(name);
    }

    const savedTheme = localStorage.getItem("theme") || "system";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const deleteNotification = (index) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((_, i) => i !== index)
    );
  };

  const applyTheme = (newTheme) => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    let effectiveTheme = newTheme;
    if (newTheme === "system") {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    root.classList.add(effectiveTheme);
    root.style.colorScheme = effectiveTheme;
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-6 w-6" />;
      case "dark":
        return <Moon className="h-6 w-6" />;
      default:
        return <Laptop className="h-6 w-6" />;
    }
  };

  const handleLogout = () => {
    Cookies.remove("userName");
    Cookies.remove("token");
    Cookies.remove("expiry");
    Cookies.remove("userEmail");
    Cookies.remove("userId");
    router.push("/login");
  };

  return (
    <div className="bg-card px-4 py-2 flex justify-between items-center  z-10">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <img
          src="/images/Tradeboard_logo_RGB.png"
          alt="logo"
          className="h-8 object-cover p-1"
        />
      </div>
      <div className="flex items-center space-x-4">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Bell className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[360px]" >
            <SheetHeader>
              <SheetTitle>Notifications</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-100px)] mt-4 pr-4">
              {notifications.map((notification, index) => (
                <NotificationItem
                  key={index}
                  {...notification}
                  onDelete={() => deleteNotification(index)}
                />
              ))}
            </ScrollArea>
          </SheetContent>
        </Sheet>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              {getThemeIcon()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Choose theme</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => changeTheme("light")}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeTheme("dark")}>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeTheme("system")}>
              <Laptop className="mr-2 h-4 w-4" />
              <span>System</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center cursor-pointer">
              <Avatar>
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback>
                  {username ? username.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <span className="font-semibold hidden sm:inline ml-2">
                {username || "User"}
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Action</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span className="text-red-500">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
