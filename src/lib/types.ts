export type Claim = {
  [key: string]: string | number;
  id: string;
};

export type FraudPrediction = {
  claimId: string;
  fraudLikelihood: number;
  riskFactors: string[];
};

export type ClaimWithPrediction = Claim & {
  prediction?: FraudPrediction;
};

export type RiskCategory = 'Low' | 'Medium' | 'High' | 'Critical';

export type Analysis = {
    id: string;
    fileName: string;
    date: string;
    status: 'Processing' | 'Completed' | 'Failed';
    claims: Claim[];
    predictions: FraudPrediction[];
    isSample: boolean;
};
