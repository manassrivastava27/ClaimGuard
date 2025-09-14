'use server';
/**
 * @fileOverview An AI agent that identifies and explains the key risk factors contributing to potential fraud in insurance claims.
 *
 * - identifyKeyRiskFactors - A function that processes claim data to identify and explain risk factors.
 * - IdentifyKeyRiskFactorsInput - The input type for the identifyKeyRiskFactors function.
 * - IdentifyKeyRiskFactorsOutput - The return type for the identifyKeyRiskFactors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyKeyRiskFactorsInputSchema = z.object({
  claimDataSummary: z
    .string()
    .describe('A summary of the insurance claim data, including relevant details about the claimant, the incident, and any related factors.'),
  modelParameters: z
    .string()
    .describe('The parameters of the fraud detection model, providing insights into the model’s decision-making process.'),
});
export type IdentifyKeyRiskFactorsInput = z.infer<typeof IdentifyKeyRiskFactorsInputSchema>;

const IdentifyKeyRiskFactorsOutputSchema = z.object({
  riskFactorsExplanation: z
    .string()
    .describe('A plain language explanation of the key risk factors contributing to potential fraud, derived from the claim data and model parameters.'),
});
export type IdentifyKeyRiskFactorsOutput = z.infer<typeof IdentifyKeyRiskFactorsOutputSchema>;

export async function identifyKeyRiskFactors(input: IdentifyKeyRiskFactorsInput): Promise<IdentifyKeyRiskFactorsOutput> {
  return identifyKeyRiskFactorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyKeyRiskFactorsPrompt',
  input: {schema: IdentifyKeyRiskFactorsInputSchema},
  output: {schema: IdentifyKeyRiskFactorsOutputSchema},
  prompt: `Analyze the insurance claim summary and model parameters to identify key fraud risk factors. Provide a concise, plain-language explanation.

Claim Data Summary: {{{claimDataSummary}}}
Model Parameters: {{{modelParameters}}}

Explanation of Risk Factors:`,
});

const identifyKeyRiskFactorsFlow = ai.defineFlow(
  {
    name: 'identifyKeyRiskFactorsFlow',
    inputSchema: IdentifyKeyRiskFactorsInputSchema,
    outputSchema: IdentifyKeyRiskFactorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
