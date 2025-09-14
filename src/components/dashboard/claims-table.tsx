"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronUp,
  ChevronDown,
  AlertCircle,
  ShieldCheck,
  CircleDashed,
} from "lucide-react";

import type { ClaimWithPrediction, RiskCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

type SortKey = keyof ClaimWithPrediction | 'fraudLikelihood';
type SortDirection = "asc" | "desc";

const getRiskCategory = (likelihood: number): RiskCategory => {
  if (likelihood > 0.9) return "Critical";
  if (likelihood > 0.7) return "High";
  if (likelihood > 0.4) return "Medium";
  return "Low";
};

const getRecommendation = (category: RiskCategory) => {
    switch(category) {
        case 'Critical':
        case 'High': return "Manual Review";
        case 'Medium': return "Monitor";
        case 'Low': return "Auto-Approve";
    }
}

const RiskBadge = ({ category }: { category: RiskCategory }) => {
  const variants: Record<RiskCategory, "destructive" | "secondary" | "default" | "outline"> = {
    Critical: "destructive",
    High: "destructive",
    Medium: "secondary",
    Low: "outline",
  };
  const colors = {
      Critical: 'bg-red-500',
      High: 'bg-orange-500',
      Medium: 'bg-yellow-500',
      Low: 'bg-green-500'
  }
  return (
    <Badge variant={variants[category]} className="capitalize">
      <span className={`w-2 h-2 rounded-full mr-2 ${colors[category]}`}></span>
      {category}
    </Badge>
  );
};

export function ClaimsTable({
  data,
  onRowClick,
}: {
  data: ClaimWithPrediction[];
  onRowClick: (claim: ClaimWithPrediction) => void;
}) {
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: SortDirection;
  } | null>({ key: "fraudLikelihood", direction: "desc" });
  const [filter, setFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskCategory | "all">("all");

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (filter) {
      sortableData = sortableData.filter(item =>
        item.id.toLowerCase().includes(filter.toLowerCase())
      );
    }
    if (riskFilter !== 'all') {
        sortableData = sortableData.filter(item => getRiskCategory(item.prediction?.fraudLikelihood ?? 0) === riskFilter);
    }

    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        let aValue, bValue;
        if (sortConfig.key === 'fraudLikelihood') {
            aValue = a.prediction?.fraudLikelihood ?? 0;
            bValue = b.prediction?.fraudLikelihood ?? 0;
        } else {
            aValue = a[sortConfig.key as keyof ClaimWithPrediction];
            bValue = b[sortConfig.key as keyof ClaimWithPrediction];
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig, filter, riskFilter]);

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };
  
  const SortableHeader = ({ sortKey, children, className }: { sortKey: SortKey, children: React.ReactNode, className?: string }) => (
    <TableHead onClick={() => requestSort(sortKey)} className={cn("cursor-pointer", className)}>
      <div className="flex items-center gap-2">
        {children}
        {sortConfig?.key === sortKey ? (
          sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
        ) : null}
      </div>
    </TableHead>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Input 
          placeholder="Filter by Claim ID..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="w-full sm:max-w-sm"
        />
        <Select value={riskFilter} onValueChange={(value) => setRiskFilter(value as any)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by risk" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risks</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader sortKey="id">Claim ID</SortableHeader>
              <SortableHeader sortKey="total_claim_amount" className="hidden md:table-cell">Claim Amount</SortableHeader>
              <SortableHeader sortKey="fraudLikelihood">Fraud Likelihood</SortableHeader>
              <TableHead className="hidden sm:table-cell">Risk Level</TableHead>
              <TableHead className="hidden lg:table-cell">Recommendation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length > 0 ? (
              sortedData.map((item) => {
                const likelihood = item.prediction?.fraudLikelihood ?? 0;
                const category = getRiskCategory(likelihood);
                const recommendation = getRecommendation(category);
                return (
                  <TableRow
                    key={item.id}
                    onClick={() => onRowClick(item)}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {Number(item.total_claim_amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="font-mono w-12">{`${(likelihood * 100).toFixed(1)}%`}</span>
                        <div className="w-full h-2 bg-muted rounded-full ml-2 hidden sm:block">
                            <div className="h-2 rounded-full bg-primary" style={{width: `${likelihood * 100}%`}}></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <RiskBadge category={category} />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                        <span className="flex items-center gap-2">
                            {recommendation === 'Auto-Approve' && <ShieldCheck className="w-4 h-4 text-green-600" />}
                            {recommendation === 'Monitor' && <CircleDashed className="w-4 h-4 text-yellow-600" />}
                            {recommendation === 'Manual Review' && <AlertCircle className="w-4 h-4 text-red-600" />}
                            {recommendation}
                        </span>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No claims found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
