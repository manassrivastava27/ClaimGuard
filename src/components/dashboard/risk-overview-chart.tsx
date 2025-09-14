"use client";

import React, { useMemo } from "react";
import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ClaimWithPrediction } from "@/lib/types";

export function RiskOverviewChart({ data }: { data: ClaimWithPrediction[] }) {
  const chartData = useMemo(() => {
    const bins = Array(10).fill(0).map(() => ({ claims: 0, value: 0 }));
    
    data.forEach(item => {
      const likelihood = item.prediction?.fraudLikelihood ?? 0;
      const binIndex = Math.min(Math.floor(likelihood * 10), 9);
      bins[binIndex].claims += 1;
      bins[binIndex].value += Number(item.total_claim_amount || 0);
    });

    return bins.map((bin, index) => ({
      name: `${index * 10}-${(index + 1) * 10}%`,
      claims: bin.claims,
      value: bin.value,
    }));
  }, [data]);

  const chartConfig = {
    claims: {
      label: "Claims",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Distribution</CardTitle>
        <CardDescription>
          Distribution of claims by fraud likelihood score.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              allowDecimals={false}
            />
            <Tooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name, item) => (
                    <div className="flex flex-col">
                       <span>{value} claims</span>
                       <span className="text-xs text-muted-foreground">{item.payload.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                    </div>
                  )}
                />
              }
            />
            <Bar dataKey="claims" fill="var(--color-claims)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
