import React from "react";
import { format } from "date-fns";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const JournalCard = ({
  date,
  note,
  mistake,
  lesson,
  rulesFollowedPercentage,
  winRate,
  profit,
  tradesTaken,
}) => {
  const router = useRouter();

  const getProfitColor = () => {
    if (profit > 100) return "bg-emerald-500/20 border border-2 border-emerald-500";
    return "bg-rose-500/20 border border-2 border-rose-500";
  };

  const getProfitBorderColor = () => {
    if (profit > 100) return "border-emerald-500/50 transition-all duration-300";
    return "border-rose-500/50 transition-all duration-300";
  };

  const getArrowColor = () => {
    if (profit > 100) return "text-emerald-700 group-hover:text-emerald-800";
    return "text-rose-500 group-hover:text-rose-700";
  };

  // Format date to "Mon, 01 Dec"
  const formattedDate = format(new Date(date), "EEE, dd MMM");

  // Truncate text to single line with ellipsis
  const truncateText = (text, maxLength = 50) => {
    if (!text) return "N/A";
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const handleCardClick = () => {
    router.push(`/my-journal/${date}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      className={`transition-all duration-300 group hover:shadow-xl hover:scale-[1.02] cursor-pointer ${getProfitColor()}`}
    >
      <CardHeader className={`pb-2 border-b ${getProfitBorderColor()}`}>
        <CardTitle className="text-base flex justify-between font-semibold">
          {formattedDate}
          <span
            className={`border rounded-full p-1 transition-all duration-300 
              group-hover:translate-x-5 group-hover:-translate-y-5 group-hover:scale-125 group-hover:rounded-lg
              ${getProfitBorderColor()} 
              ${getArrowColor()}`}
          >
            <ArrowUpRight size={16} />
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pb-4">
        <div>
          <span className="font-medium text-sm text-foreground/50">Note:</span>
          <p className="whitespace-nowrap overflow-hidden text-ellipsis">
            {truncateText(note)}
          </p>
        </div>
        <div>
          <span className="font-medium text-sm text-foreground/50">
            Mistake:
          </span>
          <p className="whitespace-nowrap overflow-hidden text-ellipsis">
            {truncateText(mistake)}
          </p>
        </div>
        <div>
          <span className="font-medium text-sm text-foreground/50">
            Lesson:
          </span>
          <p className="whitespace-nowrap overflow-hidden text-ellipsis">
            {truncateText(lesson)}
          </p>
        </div>
      </CardContent>
      <CardFooter
        className={`flex justify-between items-center  p-0 border-t ${getProfitBorderColor()}`}
      >
        <div className="flex justify-between space-x-4 w-full p-2">
          <div className="flex flex-col items-center space-x-1 w-full">
            <p className="text-xs">Rules</p>
            <span className={`font-semibold`}>
              {Number(rulesFollowedPercentage).toFixed(2)}%
            </span>
          </div>
          <div
            className={`flex flex-col items-center space-x-1 w-full border-x ${getProfitBorderColor()}`}
          >
            <p className="text-xs">Win Rate</p>
            <span className={`font-semibold`}>
              {Number(winRate).toFixed(2)}%
            </span>
          </div>
          <div className="flex flex-col items-center space-x-1 w-full">
            <p className="text-xs">Profit</p>
            <span className={`font-semibold text-foreground`}>
              {Number(profit).toFixed(2)}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default JournalCard;
