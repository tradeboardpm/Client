import React, { useState } from "react";
import { Bell, Menu, X } from "lucide-react";
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

const NotificationItem = ({ title, description, time, onDelete }) => (
  <div className="mb-4 p-3 bg-gray-100 rounded-lg relative">
    <button
      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      onClick={onDelete}
    >
      <X className="h-4 w-4" />
    </button>
    <h3 className="font-semibold">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
    <p className="text-xs text-gray-500 mt-1">{time}</p>
  </div>
);

export default function Topbar({ toggleSidebar }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      title: "New trade opportunity",
      description: "A new trading signal has been detected for AAPL.",
      time: "5 minutes ago",
      type: "trade",
    },
    {
      title: "Account milestone",
      description: "Congratulations! You've completed 100 trades.",
      time: "2 hours ago",
      type: "milestone",
    },
    {
      title: "Market update",
      description:
        "Major index has shown significant movement in the last hour.",
      time: "3 hours ago",
      type: "update",
    },
    {
      title: "Subscription reminder",
      description: "Your premium subscription will renew in 3 days.",
      time: "1 day ago",
      type: "reminder",
    },
    {
      title: "New feature available",
      description: "Check out our new risk management tools in the dashboard.",
      time: "2 days ago",
      type: "feature",
    },
  ]);

  const deleteNotification = (index) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="bg-white px-4 py-2 flex justify-between items-center shadow z-50">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-extrabold text-primary">Tradeboard</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Bell className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
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
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback>JT</AvatarFallback>
          </Avatar>
          <span className="font-semibold hidden sm:inline">Json Taylor</span>
        </div>
      </div>
    </div>
  );
}
