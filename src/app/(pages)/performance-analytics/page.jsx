import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";

export default function TradeboardIntelligence() {
  return (
    <MainLayout>
      <div className="p-6 bg-background min-h-screen">
        <div className=" mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Tradeboard Intelligence</h1>
            <Select defaultValue="this-week">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="last-week">Last Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatisticsCard
              title="On Profitable Days"
              stats={{
                rulesFollowed: { value: "80%", color: "text-green-500" },
                wordsJournaled: { value: "100", color: "text-green-500" },
                tradesTaken: { value: "4", color: "text-green-500" },
                winRate: { value: "65%", color: "text-green-500" },
              }}
            />
            <StatisticsCard
              title="On Loss Making Days"
              stats={{
                rulesFollowed: { value: "40%", color: "text-red-500" },
                wordsJournaled: { value: "20", color: "text-red-500" },
                tradesTaken: { value: "8", color: "text-red-500" },
                winRate: { value: "66%", color: "text-red-500" },
              }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatisticsCard
              title="On Break-Even Days"
              stats={{
                rulesFollowed: { value: "60%", color: "text-blue-500" },
                wordsJournaled: { value: "100", color: "text-blue-500" },
                tradesTaken: { value: "2", color: "text-blue-500" },
                winRate: { value: "50", color: "text-blue-500" },
              }}
            />
            <RulesCard
              title="Your Most Followed Rules"
              content="Lorem Ipsum is simply dummy text"
              count={15}
              countText="times this week you followed"
              className="bg-purple-100 border-purple-200"
            />
            <RulesCard
              title="Your Most Broken Rules"
              content="Lorem Ipsum is simply dummy text"
              count={12}
              countText="times this week you broken"
              className="bg-red-100 border-red-200"
            />
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Journal Analysis</CardTitle>
                <div className="flex space-x-2">
                  <Select defaultValue="month">
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="day">Day</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="win-rate">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="win-rate">Win rate</SelectItem>
                      <SelectItem value="trades-taken">Trades Taken</SelectItem>
                      <SelectItem value="rules-followed">
                        Rules Followed
                      </SelectItem>
                      <SelectItem value="profit">Profit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, index) => (
                  <JournalCard
                    key={index}
                    date="Mon, 1 June"
                    notes="Lorem Ipsum is simply"
                    mistakes="Lorem Ipsum is simply"
                    lessons="Lorem Ipsum is simply"
                    rulesFollowed="80%"
                    winRate="75%"
                    profit="₹ 7000"
                    isLoss={index === 2 || index === 6}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

function StatisticsCard({ title, stats }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(stats).map(([key, { value, color }]) => (
            <div key={key}>
              <p className="text-sm text-muted-foreground">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RulesCard({ title, content, count, countText, className }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
        <p className="mt-2">
          <span className="text-2xl font-bold">{count}</span> {countText}
        </p>
      </CardContent>
    </Card>
  );
}

function JournalCard({
  date,
  notes,
  mistakes,
  lessons,
  rulesFollowed,
  winRate,
  profit,
  isLoss,
}) {
  return (
    <Card
      className={`${isLoss ? "bg-red-100 border-red-300" : "bg-green-100 border-green-300"} border  `}
    >
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-sm font-medium">{date}</CardTitle>
        <Button variant="ghost" size="icon">
          <ArrowUpRight />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Notes:</span> {notes}
          </p>
          <p>
            <span className="font-medium">Mistakes:</span> {mistakes}
          </p>
          <p>
            <span className="font-medium">Lessons:</span> {lessons}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div>
            <p className="text-xs text-muted-foreground">Rules Followed</p>
            <p className="font-medium">{rulesFollowed}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Win rate</p>
            <p className="font-medium">{winRate}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {isLoss ? "Loss" : "Profit"}
            </p>
            <p className="font-medium">{profit}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
