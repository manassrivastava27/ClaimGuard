'use server';

/**
 * @fileOverview Predicts the likelihood of fraud for insurance claims.
 *
 * - fraudLikelihoodPrediction - Predicts fraud likelihood for insurance claims.
 * - FraudLikelihoodPredictionInput - The input type for fraudLikelihoodPrediction.
 * - FraudLikelihoodPredictionOutput - The return type for fraudLikelihoodPrediction.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FraudLikelihoodPredictionInputSchema = z.object({
  claimData: z
    .string()
    .describe('Insurance claim data in CSV format.'),
});
export type FraudLikelihoodPredictionInput = z.infer<typeof FraudLikelihoodPredictionInputSchema>;

const FraudLikelihoodPredictionOutputSchema = z.object({
  fraudPredictions: z.array(
    z.object({
      claimId: z.string().describe('The ID of the claim.'),
      fraudLikelihood: z
        .number()
        .describe('The predicted likelihood of fraud for the claim (0-1).'),
      riskFactors: z.array(z.string()).describe('Key risk factors influencing the prediction.'),
    })
  ).describe('Predictions for each claim in the input data.'),
});
export type FraudLikelihoodPredictionOutput = z.infer<typeof FraudLikelihoodPredictionOutputSchema>;

export async function fraudLikelihoodPrediction(input: FraudLikelihoodPredictionInput): Promise<FraudLikelihoodPredictionOutput> {
  return fraudLikelihoodPredictionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fraudLikelihoodPredictionPrompt',
  input: {schema: FraudLikelihoodPredictionInputSchema},
  output: {schema: FraudLikelihoodPredictionOutputSchema},
  prompt: `You are an expert in insurance fraud detection. Analyze the provided insurance claim data and predict the likelihood of fraud for each claim. Also extract key risk factors for each claim.

Claim Data (CSV):
{{{claimData}}}

Output the fraud predictions in JSON format. Include the claim ID, fraud likelihood (a number between 0 and 1), and a list of key risk factors that influence the prediction.

Example Output Format:
{
  "fraudPredictions": [
    {
      "claimId": "123",
      "fraudLikelihood": 0.85,
      "riskFactors": ["Inconsistent claim history", "High claim amount compared to policy"]
    },
    {
      "claimId": "456",
      "fraudLikelihood": 0.20,
      "riskFactors": ["Consistent claim history", "Low claim amount"]
    }
  ]
}
`,
});

const fraudLikelihoodPredictionFlow = ai.defineFlow(
  {
    name: 'fraudLikelihoodPredictionFlow',
    inputSchema: FraudLikelihoodPredictionInputSchema,
    outputSchema: FraudLikelihoodPredictionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
