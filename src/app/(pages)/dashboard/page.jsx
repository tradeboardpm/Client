"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MainLayout from "@/components/layouts/MainLayout";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  TrendingUp,
  Trash2,
  ImageIcon,
  SquarePen,
} from "lucide-react";
import Image from "next/image";
import CustomCalendar from "@/components/ui/custom-calendar";
import Cookies from "js-cookie";

const calendarData = {
  "2024-10-01": false,
  "2024-10-05": true,
  "2024-10-10": false,
  "2024-10-15": true,
  "2024-10-20": true,
  "2024-10-25": false,
};

// Sample data for the charts
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

const tradesTakenConfig = {
  tradesTaken: {
    label: "Trades Taken",
    color: "hsl(var(--primary))",
  },
};

const winRateConfig = {
  win: {
    label: "Win",
    color: "hsl(var(--chart-1))",
  },
  loss: {
    label: "Loss",
    color: "hsl(var(--chart-2))",
  },
};

const profitLossConfig = {
  profitLoss: {
    label: "Profit & Loss",
    color: "hsl(var(--primary))",
  },
};

const rulesConfig = {
  rulesFollowed: {
    label: "Followed",
    color: "hsl(var(--chart-1))",
  },
  rulesBroken: {
    label: "Broken",
    color: "hsl(var(--chart-2))",
  },
};

function TradesTakenChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trades Taken</CardTitle>
        <CardDescription>Daily Trade limit: 4</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={tradesTakenConfig}>
          <LineChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis hide domain={[0, 4]} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              type="monotone"
              dataKey="tradesTaken"
              stroke="var(--color-tradesTaken)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-tradesTaken)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Average trades: 2.4 per day <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}

function WinRateChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Win Rate</CardTitle>
        <CardDescription>Wins vs Losses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={winRateConfig}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="win"
              stackId="a"
              fill="var(--color-win)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="loss"
              stackId="a"
              fill="var(--color-loss)"
              radius={[0, 0, 4, 4]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Win rate: 68.75% <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}

function ProfitLossChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit & Loss</CardTitle>
        <CardDescription>Daily P&L</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={profitLossConfig}>
          <LineChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              type="monotone"
              dataKey="profitLoss"
              stroke="var(--color-profitLoss)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-profitLoss)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total P&L: $120 <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}

function RulesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rules</CardTitle>
        <CardDescription>Followed vs Broken</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={rulesConfig}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="rulesFollowed"
              stackId="a"
              fill="var(--color-rulesFollowed)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="rulesBroken"
              stackId="a"
              fill="var(--color-rulesBroken)"
              radius={[0, 0, 4, 4]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Rules followed: 86.67% <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}

export default function Dashboard() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [rules, setRules] = useState([]);
const [selectedRules, setSelectedRules] = useState(new Set());
  const [trades, setTrades] = useState([]);
  const [username, setUsername] = useState("");
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);

      return () => {
        clearInterval(timer);
      };
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

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsLargeScreen(width >= 1024);
      setIsSidebarExpanded(width >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

    useEffect(() => {
      const name = Cookies.get("userName");
      if (name) {
        setUsername(name);
      }
    }, []);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const addRule = (rule) => {
    setRules([...rules, rule]);
  };

  const editRule = (index, updatedRule) => {
    const newRules = [...rules];
    newRules[index] = updatedRule;
    setRules(newRules);
  };

  const deleteRule = (index) => {
    const newRules = rules.filter((_, i) => i !== index);
    setRules(newRules);
  };

  const toggleSelectAll = () => {
    if (selectedRules.size === rules.length) {
      setSelectedRules(new Set());
    } else {
      setSelectedRules(new Set(rules.map((_, i) => i)));
    }
  };

  const toggleSelectRule = (index) => {
    const newSelectedRules = new Set(selectedRules);
    if (newSelectedRules.has(index)) {
      newSelectedRules.delete(index);
    } else {
      newSelectedRules.add(index);
    }
    setSelectedRules(newSelectedRules);
  };

  const addTrade = (trade) => {
    setTrades([...trades, trade]);
  };

  const importTrades = (importedTrades) => {
    setTrades([...trades, ...importedTrades]);
  };

  return (
    <MainLayout>
      <div className="flex h-full">
        <div className={`flex-1 p-6 overflow `}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Welcome back, {username}!</h2>
            <p className="text-xl">{formatTime(currentTime)}</p>
          </div>

          <Card className="bg-transparent border-none shadow-none mb-6">
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
            <CardContent className="p-0 bg-transparent mt-4">
              <div className="flex flex-col md:flex-row gap-8 h-2/3">
                {/* Today's Journal */}
                <Card className="flex-1">
                  <CardHeader className="px-5 py-4">
                    <CardTitle className="text-lg font-semibold">
                      Today's Journal{" "}
                      <span className="text-sm font-light">(Saving)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Type your notes here..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="mistakes">Mistake</Label>
                      <Textarea
                        id="mistakes"
                        placeholder="Type your mistakes here..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="lessons">Lesson</Label>
                      <Textarea
                        id="lessons"
                        placeholder="Type your lessons here..."
                      />
                    </div>
                    <div className="flex w-full justify-end">
                      <Button variant="outline" className="text-primary">
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Attach
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                {/* Rules */}

                <Card className="flex-1">
                  {rules.length === 0 ? (
                    <>
                      <CardHeader className="px-5 py-4">
                        <CardTitle className="text-lg font-semibold">
                          Rules
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8 flex flex-col items-center">
                          <Image
                            src="/images/no_rule.png"
                            height={150}
                            width={150}
                            alt="No rules"
                            className="mb-3"
                          />
                          <h4 className="text-xl font-semibold mb-2">
                            Get Started!
                          </h4>
                          <p className="text-gray-600 mb-4">
                            Please click below to add your trading rules
                          </p>
                          <AddRuleDialog onAddRule={addRule} />
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <>
                      <CardHeader className="px-5 py-3 flex flex-row items-center justify-between gap-5">
                        <CardTitle className="text-lg font-semibold">
                          Rules
                        </CardTitle>
                        <Input
                          placeholder="Search Rules"
                          className="max-w-xs"
                        />
                        <AddRuleDialog onAddRule={addRule} />
                      </CardHeader>
                      <CardContent>
                        <div className="relative overflow-hidden">
                          <div className="max-h-[50vh] overflow-y-auto">
                            <Table className="rounded-lg p-0 overflow-hidden border">
                              <TableHeader className="sticky top-0 bg-primary/15 z-10">
                                <TableRow>
                                  <TableHead className="w-12">
                                    <Checkbox
                                      checked={
                                        selectedRules.size === rules.length &&
                                        rules.length > 0
                                      }
                                      onCheckedChange={toggleSelectAll}
                                    />
                                  </TableHead>
                                  <TableHead className="max-w-[500px]">
                                    My Rules
                                  </TableHead>
                                  <TableHead className="w-[100px]">
                                    Actions
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {rules.map((rule, index) => (
                                  <TableRow key={index}>
                                    <TableCell className="align-top">
                                      <Checkbox
                                        checked={selectedRules.has(index)}
                                        onCheckedChange={() =>
                                          toggleSelectRule(index)
                                        }
                                      />
                                    </TableCell>
                                    <TableCell className="max-w-[500px] whitespace-normal break-words">
                                      {rule}
                                    </TableCell>
                                    <TableCell className="align-top">
                                      <div className="flex gap-2">
                                        <EditRuleDialog
                                          rule={rule}
                                          onEditRule={(updatedRule) =>
                                            editRule(index, updatedRule)
                                          }
                                        />
                                        <DeleteRuleDialog
                                          onDeleteRule={() => deleteRule(index)}
                                        />
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </CardContent>
                    </>
                  )}
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trade Log</CardTitle>
            </CardHeader>
            <CardContent>
              {trades.length === 0 ? (
                <div className="text-center py-8 flex flex-col items-center">
                  <Image
                    src="/images/no_trade.png"
                    height={150}
                    width={150}
                    className="mb-3"
                  />
                  <h3 className="text-xl font-semibold mb-2">Get Started!</h3>
                  <p className="text-accent-foreground/50 text-sm mb-4">
                    Please add your trades here or import them automatically
                    using your tradebook
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <AddTradeDialog onAddTrade={addTrade} />
                    <ImportTradeDialog onImportTrades={importTrades} />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {trades.map((trade, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <p>
                        {trade.instrument} - {trade.tradeType} -{" "}
                        {trade.quantity}
                      </p>
                      <p>{trade.buyingPrice}</p>
                    </div>
                  ))}
                  <div className="space-x-4">
                    <AddTradeDialog onAddTrade={addTrade} />
                    <ImportTradeDialog onImportTrades={importTrades} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        {!isMobile && (
          <div
            className={`relative  h-fit  p-4 space-y-6   transition-all duration-300 ease-in-out ${
              isSidebarExpanded
                ? "w-80 border-l bg-white/50 dark:bg-black/50 "
                : "w-12  border-0 bg-none"
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
                <TradesTakenChart />
                <WinRateChart />
                <ProfitLossChart />
                <RulesChart />
              </>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

function AddRuleDialog({ onAddRule }) {
  const [rule, setRule] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Rule
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Rule</DialogTitle>
          <DialogDescription>Here you can add your rules.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="rule">Rule</Label>
            <Input
              id="rule"
              value={rule}
              onChange={(e) => setRule(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onAddRule(rule)}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditRuleDialog({ rule, onEditRule }) {
  const [editedRule, setEditedRule] = useState(rule);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <SquarePen className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Rule</DialogTitle>
          <DialogDescription>Here you can edit your rules.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="rule">Rule</Label>
            <Input
              id="rule"
              value={editedRule}
              onChange={(e) => setEditedRule(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onEditRule(editedRule)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteRuleDialog({ onDeleteRule }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Rule</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this rule permanently?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={onDeleteRule}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddTradeDialog({ onAddTrade }) {
  const [trade, setTrade] = useState({
    instrument: "",
    quantity: "",
    tradeType: "Buy",
    buyingPrice: "",
    equityType: "F&O - Options",
    time: "",
    exchangeCharges: "",
    brokerage: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrade({ ...trade, [name]: value });
  };

  const handleSubmit = () => {
    onAddTrade(trade);
    // Reset form
    setTrade({
      instrument: "",
      quantity: "",
      tradeType: "Buy",
      buyingPrice: "",
      equityType: "F&O - Options",
      time: "",
      exchangeCharges: "",
      brokerage: "",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Trade
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Trade</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="instrument" className="text-right">
              Instrument
            </Label>
            <Input
              id="instrument"
              name="instrument"
              value={trade.instrument}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="quantity"
              name="quantity"
              value={trade.quantity}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Trade Type</Label>
            <RadioGroup
              defaultValue="Buy"
              onValueChange={(value) =>
                setTrade({ ...trade, tradeType: value })
              }
              className="flex col-span-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Buy" id="buy" />
                <Label htmlFor="buy">Buy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Sell" id="sell" />
                <Label htmlFor="sell">Sell</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="buyingPrice" className="text-right">
              Buying price
            </Label>
            <Input
              id="buyingPrice"
              name="buyingPrice"
              value={trade.buyingPrice}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="equityType" className="text-right">
              Equity type
            </Label>
            <Select
              onValueChange={(value) =>
                setTrade({ ...trade, equityType: value })
              }
              defaultValue="F&O - Options"
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="F&O - Options">F&O - Options</SelectItem>
                <SelectItem value="F&O - Futures">F&O - Futures</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <Input
              id="time"
              name="time"
              type="time"
              value={trade.time}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="exchangeCharges" className="text-right">
              Exchange charges (Rs)
            </Label>
            <Input
              id="exchangeCharges"
              name="exchangeCharges"
              value={trade.exchangeCharges}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="brokerage" className="text-right">
              Brokerage (Rs)
            </Label>
            <Input
              id="brokerage"
              name="brokerage"
              value={trade.brokerage}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ImportTradeDialog({ onImportTrades }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = () => {
    // In a real application, you would process the file here
    // For this example, we'll just simulate importing some trades
    const simulatedImportedTrades = [
      { instrument: "AAPL", tradeType: "Buy", quantity: 100, buyingPrice: 150 },
      {
        instrument: "GOOGL",
        tradeType: "Sell",
        quantity: 50,
        buyingPrice: 2800,
      },
    ];
    onImportTrades(simulatedImportedTrades);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Import Trade</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Trade</DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel file to import your trades.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Input id="picture" type="file" onChange={handleFileChange} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleImport} disabled={!file}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
