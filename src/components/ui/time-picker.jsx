"use client";
import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

const TimePicker = ({ value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedMinute, setSelectedMinute] = useState("");

  // Generate hours (00-23)
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  // Generate minutes (00-59)
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  useEffect(() => {
    if (value) {
      const [hour, minute] = value.split(":");
      setSelectedHour(hour);
      setSelectedMinute(minute);
    }
  }, [value]);

  const handleTimeSelect = (hour, minute) => {
    const newTime = `${hour}:${minute}`;
    onChange(newTime);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value || "Select time"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 p-2">
        <div className="flex h-60 space-x-2">
          {/* Hours */}
          <div className="flex-1 border rounded-md">
            <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground text-center border-b">
              Hrs
            </div>
            <ScrollArea className="h-48 w-full">
              <div className="p-2">
                {hours.map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant="ghost"
                    className={cn(
                      "w-full justify-center mb-1",
                      selectedHour === hour &&
                        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                    )}
                    onClick={() => {
                      setSelectedHour(hour);
                      handleTimeSelect(hour, selectedMinute || "00");
                    }}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Minutes */}
          <div className="flex-1 border rounded-md">
            <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground text-center border-b">
              Mins
            </div>
            <ScrollArea className="h-48 w-full">
              <div className="p-2">
                {minutes.map((minute) => (
                  <Button
                    size="icon"
                    key={minute}
                    variant="ghost"
                    className={cn(
                      "w-full justify-center mb-1",
                      selectedMinute === minute &&
                        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                    )}
                    onClick={() => {
                      setSelectedMinute(minute);
                      handleTimeSelect(selectedHour || "00", minute);
                    }}
                  >
                    {minute}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TimePicker;
