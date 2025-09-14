"use client";

import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ClaimWithPrediction } from "@/lib/types";
import { getRiskFactorsExplanation } from "@/app/actions";

type ClaimDetailSheetProps = {
  claim: ClaimWithPrediction | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="grid grid-cols-2 gap-2 py-2 border-b">
    <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
    <dd className="text-sm text-right">{value}</dd>
  </div>
);

export function ClaimDetailSheet({ claim, isOpen, onOpenChange }: ClaimDetailSheetProps) {
  const [explanation, setExplanation] = useState("");
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  useEffect(() => {
    if (claim) {
      setLoadingExplanation(true);
      const claimSummary = `Claim ID ${claim.id} has a total claim amount of ${claim.total_claim_amount}. Incident Type: ${claim.incident_type}. Driver rating is ${claim.driver_rating}.`;
      getRiskFactorsExplanation(claimSummary).then((result) => {
        if (result.success && result.data) {
          setExplanation(result.data);
        } else {
          setExplanation("Could not generate a detailed explanation for this claim.");
        }
        setLoadingExplanation(false);
      });
    }
  }, [claim]);
  
  const likelihood = claim?.prediction?.fraudLikelihood ?? 0;
  
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0">
        <ScrollArea className="h-full">
            <div className="p-6">
                <SheetHeader>
                    <SheetTitle className="text-2xl">Claim Details</SheetTitle>
                    <SheetDescription>ID: {claim?.id}</SheetDescription>
                </SheetHeader>
                <div className="my-6">
                    <div className="text-center mb-4">
                        <p className="text-sm text-muted-foreground">Fraud Likelihood</p>
                        <p className="text-5xl font-bold text-primary">{(likelihood * 100).toFixed(1)}%</p>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full">
                        <div className="h-3 rounded-full bg-primary" style={{width: `${likelihood * 100}%`}}></div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">Key Risk Factors</h4>
                        <div className="flex flex-wrap gap-2">
                        {claim?.prediction?.riskFactors.map((factor) => (
                            <Badge key={factor} variant="secondary">{factor}</Badge>
                        ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">AI-Generated Explanation</h4>
                         {loadingExplanation ? (
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-4/5" />
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-md">
                                {explanation}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="font-semibold mb-2">Claim Data</h4>
                    <div className="flow-root">
                        <dl className="-my-2 divide-y divide-border">
                            {claim && Object.entries(claim)
                                .filter(([key]) => key !== 'prediction')
                                .map(([key, value]) => (
                                    <DetailItem key={key} label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} value={String(value)} />
                                ))}
                        </dl>
                    </div>
                </div>
            </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
