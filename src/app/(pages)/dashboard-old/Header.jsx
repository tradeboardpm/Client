import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Cookies from "js-cookie";

export default function DashboardHeader() {
  const [username, setUsername] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const name = Cookies.get("userName");
    if (name) {
      setUsername(name);
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Card className="bg-transparent border-none shadow-none mb-6">
      <CardContent className="p-0 bg-transparent mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold ">Welcome back, {username}!</h2>
        <p className="text-xl text-right">{formatTime(currentTime)}</p>
      </CardContent>
      <CardHeader className="primary_gradient rounded-xl p-2 sm:p-3 md:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center relative">
          <div className="flex-1 w-full sm:w-auto order-2 sm:order-1"></div>
          <div className="w-full sm:w-auto sm:absolute sm:left-1/2 sm:-translate-x-1/2 bg-accent/40 text-center text-background px-2 py-1 rounded-lg mb-2 sm:mb-0 order-1 sm:order-2">
            <p className="text-sm sm:text-base lg:text-xl">
              {formatDate(currentTime)}
            </p>
          </div>
          <p className="text-background text-sm sm:text-base lg:text-xl order-3">
            Capital: ₹ 1000
          </p>
        </div>
      </CardHeader>
    </Card>
  );
}
