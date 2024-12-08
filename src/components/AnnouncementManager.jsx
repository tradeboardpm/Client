import React, { useState, useEffect, useMemo } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle, Info, Clock, Megaphone } from "lucide-react";

// Announcement type configuration
const ANNOUNCEMENT_TYPES = {
  banner: {
    icon: Megaphone,
    color: "bg-blue-500",
    textColor: "text-white",
  },
  alert: {
    icon: AlertTriangle,
    color: "bg-red-500",
    textColor: "text-white",
  },
  downtime: {
    icon: Clock,
    color: "bg-orange-500",
    textColor: "text-white",
  },
  announcement: {
    icon: Info,
    color: "bg-green-500",
    textColor: "text-white",
  },
  promotional: {
    icon: Megaphone,
    color: "bg-purple-500",
    textColor: "text-white",
  },
  feature_update: {
    icon: Info,
    color: "bg-teal-500",
    textColor: "text-white",
  },
};

const AnnouncementManager = ({ announcements, onClose }) => {
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [closedAnnouncements, setClosedAnnouncements] = useState([]);

  // Sort and filter announcements, excluding closed ones
  const sortedAnnouncements = useMemo(() => {
    return announcements
      .filter(
        (announcement) =>
          new Date(announcement.expirationTime) > new Date() &&
          announcement.isActive &&
          !closedAnnouncements.includes(announcement._id)
      )
      .sort(
        (a, b) =>
          b.priority - a.priority ||
          new Date(a.expirationTime) - new Date(b.expirationTime)
      );
  }, [announcements, closedAnnouncements]);

  useEffect(() => {
    // Select the highest priority active announcement
    if (sortedAnnouncements.length > 0) {
      setCurrentAnnouncement(sortedAnnouncements[0]);
    } else {
      setCurrentAnnouncement(null);
    }
  }, [sortedAnnouncements]);

  useEffect(() => {
    if (!currentAnnouncement) return;

    const timer = setInterval(() => {
      const remaining =
        new Date(currentAnnouncement.expirationTime) - new Date();

      if (remaining <= 0) {
        clearInterval(timer);
        handleCloseAnnouncement(currentAnnouncement);
        return;
      }

      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentAnnouncement]);

  const handleCloseAnnouncement = (announcement) => {
    // Add the announcement ID to closed list
    setClosedAnnouncements((prev) => [...prev, announcement._id]);

    // Call the parent's onClose method
    onClose(announcement);
  };

  const renderBanner = (announcement) => {
    const {
      icon: Icon,
      color,
      textColor,
    } = ANNOUNCEMENT_TYPES[announcement.type] || {};
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    return (
      <div
        className={`fixed top-0 left-0 right-0 z-50 ${color} ${textColor} p-3 flex items-center justify-between`}
      >
        <div className="flex items-center space-x-3">
          {Icon && <Icon className="w-6 h-6" />}
          <span className="font-semibold">{announcement.title}</span>
          <span>{announcement.content}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Expires in: </span>
          <Badge variant="secondary">
            {days}d {hours}h {minutes}m {seconds}s
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleCloseAnnouncement(announcement)}
            className="hover:bg-opacity-20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  };

  const renderDowntimeOverlay = (announcement) => {
    return (
      <div className="fixed inset-0 z-[9999] bg-red-500/90 flex flex-col items-center justify-center text-white p-6">
        <AlertTriangle className="w-24 h-24 mb-6" />
        <h2 className="text-3xl font-bold mb-4">{announcement.title}</h2>
        <p className="text-xl text-center mb-6">{announcement.content}</p>
        <Badge variant="destructive" className="mb-4">
          System Downtime in Progress
        </Badge>
        <Button
          onClick={() => handleCloseAnnouncement(announcement)}
          variant="outline"
        >
          Close
        </Button>
      </div>
    );
  };

  const renderAnnouncementDialog = (announcement) => {
    const { icon: Icon } = ANNOUNCEMENT_TYPES[announcement.type] || {};

    return (
      <AlertDialog
        open={!!announcement}
        onOpenChange={() => handleCloseAnnouncement(announcement)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            {Icon && (
              <div className="flex justify-center mb-4">
                <Icon className="w-12 h-12 text-primary" />
              </div>
            )}
            <AlertDialogTitle>{announcement.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {announcement.content}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => handleCloseAnnouncement(announcement)}
            >
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  const renderAnnouncement = (announcement) => {
    switch (announcement.type) {
      case "banner":
        return renderBanner(announcement);
      case "downtime":
        return renderDowntimeOverlay(announcement);
      case "alert":
      case "announcement":
      case "promotional":
      case "feature_update":
        return renderAnnouncementDialog(announcement);
      default:
        return null;
    }
  };

  return currentAnnouncement ? renderAnnouncement(currentAnnouncement) : null;
};

export default AnnouncementManager;
