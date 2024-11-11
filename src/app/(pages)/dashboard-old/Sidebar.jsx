import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import CustomCalendar from "@/components/ui/custom-calendar";
import TradesTakenChart from "@/components/charts/TradesTakenChart";
import WinRateChart from "@/components/charts/WinRateChart";
import ProfitLossChart from "@/components/charts/ProfitLossChart";
import RulesChart from "@/components/charts/RulesChart";

const calendarData = {
  "2024-10-01": false,
  "2024-10-05": true,
  "2024-10-10": false,
  "2024-10-15": true,
  "2024-10-20": true,
  "2024-10-25": false,
};

const chartData = [
  {
    day: "Mon",
    tradesTaken: 1,
    win: 2,
    loss: 1,
    profitLoss: -20,
    rulesFollowed: 2,
    rulesBroken: 1,
  },
  {
    day: "Tue",
    tradesTaken: 2,
    win: 2,
    loss: 2,
    profitLoss: 30,
    rulesFollowed: 3,
    rulesBroken: 1,
  },
  {
    day: "Wed",
    tradesTaken: 4,
    win: 3,
    loss: 1,
    profitLoss: 50,
    rulesFollowed: 3,
    rulesBroken: 0,
  },
  {
    day: "Thu",
    tradesTaken: 3,
    win: 2,
    loss: 1,
    profitLoss: 40,
    rulesFollowed: 2,
    rulesBroken: 1,
  },
  {
    day: "Fri",
    tradesTaken: 2,
    win: 2,
    loss: 1,
    profitLoss: 20,
    rulesFollowed: 3,
    rulesBroken: 0,
  },
];

export default function Sidebar({ isSidebarExpanded, toggleSidebar }) {
  return (
    <div
      className={`relative h-fit p-4 space-y-6 transition-all duration-300 ease-in-out ${
        isSidebarExpanded
          ? "w-[19rem] border-l bg-white/50 dark:bg-black/50"
          : "w-12 border-0 bg-none"
      }`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 left-1"
        onClick={toggleSidebar}
      >
        {isSidebarExpanded ? <ChevronRight /> : <ChevronLeft />}
      </Button>
      {isSidebarExpanded && (
        <>
          <div className="mt-12">
            <CustomCalendar data={calendarData} />
          </div>
          <TradesTakenChart chartData={chartData} />
          <WinRateChart chartData={chartData} />
          <ProfitLossChart chartData={chartData} />
          <RulesChart chartData={chartData} />
        </>
      )}
    </div>
  );
}
