"use server";

import { fraudLikelihoodPrediction } from "@/ai/flows/fraud-likelihood-prediction";
import { identifyKeyRiskFactors } from "@/ai/flows/identify-key-risk-factors";

export async function getFraudPredictions(csvData: string) {
  try {
    const result = await fraudLikelihoodPrediction({ claimData: csvData });
    return { success: true, data: result.fraudPredictions };
  } catch (error) {
    console.error("Error in getFraudPredictions:", error);
    return { success: false, error: "Failed to get fraud predictions." };
  }
}

export async function getRiskFactorsExplanation(
  claimDataSummary: string
) {
  try {
    const result = await identifyKeyRiskFactors({
      claimDataSummary,
      modelParameters: "Using a classification model focusing on claim history, amount, and incident consistency.",
    });
    return { success: true, data: result.riskFactorsExplanation };
  } catch (error) {
    console.error("Error in getRiskFactorsExplanation:", error);
    return { success: false, error: "Failed to get risk factor explanation." };
  }
}
