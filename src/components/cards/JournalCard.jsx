import React, { useState } from "react";
import { format } from "date-fns";
import { ArrowUpRight, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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
import { Button } from "../ui/button";

const JournalCard = ({
  date,
  note,
  mistake,
  lesson,
  rulesFollowedPercentage,
  winRate,
  profit,
  tradesTaken,
  onDelete,
}) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getProfitColor = () => {
    if (profit > 100) return "bg-[#5BFBC2]/35 border border-[#5BFBC2]";
    return "bg-[#FFE0DE]/50 dark:bg-[#552c29] border border-[#F44C60]";
  };

  const getProfitBorderColor = () => {
    if (profit > 100) return "border-[#0ED991] transition-all duration-300";
    return "border-[#F44C60] transition-all duration-300";
  };

  const getInnerProfitBorderColor = () => {
    if (profit > 100) return "border-[#0ED991]/50 transition-all duration-300";
    return "border-[#F44C60]/50 transition-all duration-300";
  };

  const getArrowColor = () => {
    if (profit > 100) return "text-[#0ED991] group-hover:text-[#0ED99180]";
    return "text-[#F44C60] group-hover:text-[#F44C60]";
  };

  const formattedDate = format(new Date(date), "EEE, dd MMM");

  const truncateText = (text, maxLength = 50) => {
    if (!text) return " ";
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const handleCardClick = (e) => {
    // Prevent navigation if clicking delete button
    if (e.target.closest(".delete-button")) return;
    router.push(`/my-journal/${date}`);
  };

  const handleDelete = () => {
    setShowDeleteDialog(false);
    if (onDelete) onDelete(date);
  };

  return (
    <>
      <Card
        onClick={handleCardClick}
        className={`relative transition-all duration-300 group shadow-[0px_5px_10px_2px_rgba(0,0,0,0.04)] hover:shadow-xl hover:scale-[1.02] max-w-[22.5rem] cursor-pointer border-[1rem] ${getProfitColor()}`}
      >
        <CardHeader className={`pb-2 ${getProfitBorderColor()}`}>
          <CardTitle className="text-base flex justify-between font-semibold">
            <div className="flex items-center gap-2">
              {/* Delete button */}
              <Button
                size="icon"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                }}
                className="delete-button bg-transparent border-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20  opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>

              {formattedDate}
            </div>
            <span
              className={`border rounded-full p-1 transition-all duration-300 size-8 flex items-center justify-center 
                group-hover:translate-x-5 group-hover:-translate-y-5 group-hover:scale-125 group-hover:rounded-lg
                ${getProfitBorderColor()} 
                ${getArrowColor()}`}
            >
              <ArrowUpRight size={16} />
            </span>
          </CardTitle>
          <hr className={`${getInnerProfitBorderColor()}`} />
        </CardHeader>
        <CardContent className="space-y-6 py-4">
          <div className="flex items-center">
            <span className="font-medium text-sm mr-1">Note:</span>
            <span className="whitespace-nowrap overflow-hidden text-ellipsis text-sm text-foreground/50">
              {truncateText(note)}
            </span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-sm mr-1">Mistake:</span>
            <span className="whitespace-nowrap overflow-hidden text-ellipsis text-sm text-foreground/50">
              {truncateText(mistake)}
            </span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-sm mr-1">Lesson:</span>
            <span className="whitespace-nowrap overflow-hidden text-ellipsis text-sm text-foreground/50">
              {truncateText(lesson)}
            </span>
          </div>
          <hr className={`${getInnerProfitBorderColor()}`} />
        </CardContent>
        <CardFooter className="flex justify-between items-center p-0">
          <div className="flex justify-between space-x-4 w-full p-2">
            <div className="flex flex-col items-center space-x-1 w-full">
              <p className="text-xs">Rules</p>
              <span className="font-semibold">
                {Number(rulesFollowedPercentage).toFixed(2)}%
              </span>
            </div>
            <div
              className={`flex flex-col items-center space-x-1 w-full border-x ${getInnerProfitBorderColor()}`}
            >
              <p className="text-xs">Win Rate</p>
              <span className="font-semibold">
                {Number(winRate).toFixed(2)}%
              </span>
            </div>
            <div className="flex flex-col items-center space-x-1 w-full">
              <p className="text-xs">Profit</p>
              <span className="font-semibold text-foreground">
                {Number(profit).toFixed(2)}
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Journal Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to delete this Journal entry? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default JournalCard;
