
"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getRiskFactorsExplanation } from "@/app/actions";
import { Skeleton } from "@/components/ui/skeleton";
import type { Claim, ClaimWithPrediction } from "@/lib/types";

export function RiskFactorsCard({ claims, selectedClaim }: { claims: Claim[]; selectedClaim: ClaimWithPrediction | null; }) {
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let summary = "";
    if (selectedClaim) {
        summary = `Claim ID ${selectedClaim.id} has a total claim amount of ${selectedClaim.total_claim_amount}. Incident Type: ${selectedClaim.incident_type}. Driver rating is ${selectedClaim.driver_rating}. The predicted fraud likelihood is ${selectedClaim.prediction?.fraudLikelihood}. Key risk factors identified are: ${selectedClaim.prediction?.riskFactors.join(', ')}.`;
    } else if (claims.length > 0) {
      summary = `Analyzed ${claims.length} claims. The total value of claims is ${claims.reduce((acc, c) => acc + Number(c.total_claim_amount || 0), 0).toLocaleString()}. Claim amounts range from ${Math.min(...claims.map(c => Number(c.total_claim_amount)))} to ${Math.max(...claims.map(c => Number(c.total_claim_amount)))}.`;
    }

    if(summary) {
        getRiskFactorsExplanation(summary).then((result) => {
            if (result.success && result.data) {
                setExplanation(result.data);
            } else {
                setExplanation("Could not retrieve risk factor analysis.");
            }
            setLoading(false);
        });
    } else {
        setLoading(false);
        setExplanation("Select a claim to see a detailed explanation or upload a dataset to see a summary.");
    }
  }, [claims, selectedClaim]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Key Risk Factors</CardTitle>
        <CardDescription>
          {selectedClaim 
            ? `AI-powered explanation for Claim ID: ${selectedClaim.id}`
            : "AI-powered summary of common fraud indicators in this dataset."
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
             <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {explanation}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
