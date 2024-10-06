import React from 'react'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
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
import { TrendingUp } from 'lucide-react';

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

const RulesChart = ({chartData }) => {
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
};

export default RulesChart
