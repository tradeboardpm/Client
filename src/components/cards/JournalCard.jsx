import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const JournalCard = ({ date, stats }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const isLoss = stats.profitLoss < 0;

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });

  const getGradientClass = (isLoss) => {
    if (isLoss) {
      return "bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50";
    }
    return "bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50";
  };

  const getBorderClass = (isLoss) => {
    return isLoss
      ? "border-red-300 dark:border-red-700"
      : "border-green-300 dark:border-green-700";
  };

  return (
    <Card
      className={`group relative w-full transition-all duration-300 ease-in-out ${getGradientClass(
        isLoss
      )} border-2 ${getBorderClass(isLoss)} cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(`/my-journal/${date}`)}
    >
      <div
        className={`absolute top-3 right-3 transition-transform duration-300 ${
          isHovered
            ? `scale-125 border rounded-full ${
                isLoss
                  ? " border-red-600 bg-background/45"
                  : " border-green-600 bg-background/45"
              }`
            : "scale-0 border-collapse"
        }`}
      >
        <ArrowUpRight
          className={`h-5 w-5 ${
            isLoss
              ? "text-red-600 dark:text-red-400"
              : "text-green-600 dark:text-green-400"
          }`}
        />
      </div>

      <CardHeader>
        <CardTitle className="text-lg font-semibold">{formattedDate}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col justify-between h-[calc(100%-4rem)]">
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Notes
            </p>
            <p className="text-sm line-clamp-2">
              {stats.notes ? stats.notes : "—"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Mistakes
            </p>
            <p className="text-sm line-clamp-2">
              {stats.mistakes ? stats.mistakes : "—"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Lessons
            </p>
            <p className="text-sm line-clamp-2">
              {stats.lessons ? stats.lessons : "—"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-2">
          <div className="text-center p-2 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm shadow-sm">
            <p className="text-xs text-gray-600 dark:text-gray-400">Rules</p>
            <p className="text-sm font-semibold mt-1">
              {Math.round((stats.rulesFollowed / stats.totalRules) * 100)}%
            </p>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm shadow-sm">
            <p className="text-xs text-gray-600 dark:text-gray-400">Win Rate</p>
            <p className="text-sm font-semibold mt-1">{stats.winRate}%</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm shadow-sm">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {isLoss ? "Loss" : "Profit"}
            </p>
            <p
              className={`text-sm font-semibold mt-1 ${
                isLoss ? "text-red-600" : "text-green-600"
              }`}
            >
              ₹{Math.abs(stats.profitLoss).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JournalCard;
