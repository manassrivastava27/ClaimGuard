

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { readString } from "react-papaparse";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutGrid,
  Loader,
  AlertTriangle,
  ShieldCheck,
  CircleCheck,
  Combine,
  ShieldAlert,
  History,
  FileText,
  Eye,
  Trash2,
} from "lucide-react";
import { ArrowDownDoc as ArrowDownDocIcon } from "@/components/icons/arrow-down-doc";

import { UploadForm } from "./upload-form";
import { SummaryCard } from "./summary-card";
import { ClaimsTable } from "./claims-table";
import { RiskOverviewChart } from "./risk-overview-chart";
import { ClaimDetailSheet } from "./claim-detail-sheet";
import { RiskFactorsCard } from "./risk-factors-card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { sampleClaimsCSV } from "@/lib/claims-data";
import { getFraudPredictions } from "@/app/actions";
import type { Claim, FraudPrediction, ClaimWithPrediction, Analysis } from "@/lib/types";
import { cn } from "@/lib/utils";

type View = "initial" | "loading" | "error" | "dashboard" | "upload";
type LoadingStep = "uploading" | "analyzing" | "predicting" | "done";


const LoadingStepItem = ({ status, icon, title, description }: { status: "active" | "pending" | "complete", icon: React.ElementType, title: string, description: string }) => (
    <div className="flex items-start gap-4">
        <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full",
            status === 'active' && 'bg-primary text-primary-foreground animate-pulse',
            status === 'pending' && 'bg-muted text-muted-foreground',
            status === 'complete' && 'bg-green-500 text-primary-foreground'
        )}>
            {status === 'complete' ? <CircleCheck className="w-5 h-5" /> : status === 'active' ? <Loader className="w-5 h-5 animate-spin" /> : React.createElement(icon, { className: "w-5 h-5" })}
        </div>
        <div>
            <h3 className={cn("font-semibold", status === 'pending' && 'text-muted-foreground')}>{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    </div>
)

const RecentAnalysisCard = ({ analysis, onViewReport, onDelete }: { analysis: Analysis, onViewReport: () => void, onDelete: () => void }) => {
    const totalClaims = analysis.claims.length;
    const highRiskClaims = analysis.predictions.filter(p => p.fraudLikelihood >= 0.75).length;
    
    return (
        <Card>
            <CardHeader className="pb-4 flex-row items-start justify-between">
                <div>
                    <CardTitle className="text-base font-medium">{analysis.fileName}</CardTitle>
                    <CardDescription>{new Date(analysis.date).toLocaleString()}</CardDescription>
                </div>
                 <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onDelete}>
                    <Trash2 className="w-4 h-4 text-destructive"/>
                </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                        <p className="text-muted-foreground">Total Claims</p>
                        <p className="font-semibold">{totalClaims}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-muted-foreground">High-Risk</p>
                        <p className="font-semibold">{highRiskClaims}</p>
                    </div>
                </div>
                 <div className="flex flex-col gap-2">
                    <p className={cn(
                        "text-sm font-semibold",
                        analysis.status === 'Completed' && 'text-green-600',
                        analysis.status === 'Processing' && 'text-yellow-600',
                        analysis.status === 'Failed' && 'text-red-600',
                    )}>Status: {analysis.status}</p>
                    <Button 
                        variant="outline"
                        size="sm"
                        onClick={onViewReport}
                        disabled={analysis.status !== 'Completed'}
                        className="w-full"
                    >
                        View Report
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};


export function Dashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isDemo = searchParams.get('demo') === 'true';

  const [view, setView] = useState<View>(isDemo ? "loading" : "initial");
  const [loadingStep, setLoadingStep] = useState<LoadingStep>("uploading");
  const [claims, setClaims] = useState<Claim[]>([]);
  const [predictions, setPredictions] = useState<FraudPrediction[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<ClaimWithPrediction | null>(null);
  const [error, setError] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [analysisToDelete, setAnalysisToDelete] = useState<string | null>(null);


  useEffect(() => {
    if (isDemo) {
        handleUseSampleData(true);
        // Clean up URL
        router.replace('/dashboard', undefined);
    }
  }, [isDemo, router]);
  
  useEffect(() => {
    try {
      const savedAnalyses = localStorage.getItem("claimGuardAnalyses");
      if (savedAnalyses) {
        setAnalyses(JSON.parse(savedAnalyses));
      }
    } catch (e) {
      console.error("Failed to parse analyses from localStorage", e);
    }
  }, []);

  const saveAnalyses = (analysesToSave: Analysis[]) => {
      try {
        setAnalyses(analysesToSave);
        localStorage.setItem("claimGuardAnalyses", JSON.stringify(analysesToSave));
      } catch (e) {
        console.error("Failed to save analyses to localStorage", e);
      }
  }

  const saveAnalysis = (analysis: Analysis) => {
    const updatedAnalyses = [analysis, ...analyses.filter(a => a.id !== analysis.id)].slice(0, 5);
    saveAnalyses(updatedAnalyses);
  };
  
  const deleteAnalysis = (analysisId: string) => {
    const updatedAnalyses = analyses.filter(a => a.id !== analysisId);
    saveAnalyses(updatedAnalyses);
    setAnalysisToDelete(null);
  };

  const handleDataParsed = (results: any, file: File, isSample = false) => {
    if (results.errors.length > 0) {
      setError("Error parsing CSV file. Please check the format.");
      setView("error");
      return;
    }
    const parsedClaims = results.data.map((item: any) => ({
      ...item,
      id: item.claim_id || crypto.randomUUID(),
    }));
    setClaims(parsedClaims);
    setFileName(file.name);
    processFile(isSample ? sampleClaimsCSV : results.data, file.name, isSample, parsedClaims);
  };
  
  const processFile = async (data: string | object[], fileName: string, isSample: boolean, parsedClaims: Claim[]) => {
    setView("loading");
    setLoadingStep("uploading");
    setError("");

    const analysisId = crypto.randomUUID();
    const newAnalysis: Analysis = {
        id: analysisId,
        fileName: fileName,
        date: new Date().toISOString(),
        status: "Processing",
        claims: parsedClaims,
        predictions: [],
        isSample,
    };
    if (!isSample) saveAnalysis(newAnalysis);

    const fileText = typeof data === 'string' ? data : JSON.stringify(data);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoadingStep("analyzing");
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoadingStep("predicting");

    const result = await getFraudPredictions(fileText);
    if (result.success && result.data) {
      setPredictions(result.data);
      setLoadingStep("done");
      
      const finalAnalysis: Analysis = { ...newAnalysis, status: "Completed", claims: parsedClaims, predictions: result.data };
      if (!isSample) saveAnalysis(finalAnalysis);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setView("dashboard");
    } else {
      setError(result.error || "An unknown error occurred.");
      const finalAnalysis: Analysis = { ...newAnalysis, status: "Failed" };
      if (!isSample) saveAnalysis(finalAnalysis);
      setView("error");
    }
  };

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      if (text) {
        readString(text, {
          header: true,
          skipEmptyLines: true,
          worker: true,
          complete: (results) => handleDataParsed(results, file),
        });
      }
    };
    reader.readAsText(file);
  };

  const handleUseSampleData = (isDemo = false) => {
    const fakeFile = { name: isDemo ? "Demo Analysis" : "sample_data.csv" } as File;
    readString(sampleClaimsCSV, {
      header: true,
      skipEmptyLines: true,
      worker: true,
      complete: (results) => {
        const parsedClaims = results.data.map((item: any) => ({
            ...item,
            id: item.claim_id || crypto.randomUUID(),
        }));
        setClaims(parsedClaims);
        setFileName(fakeFile.name);
        processFile(sampleClaimsCSV, fakeFile.name, true, parsedClaims);
      },
    });
  };

  const loadAnalysis = (analysis: Analysis) => {
    setClaims(analysis.claims);
    setPredictions(analysis.predictions);
    setFileName(analysis.fileName);
    setView("dashboard");
  }

  const resetToDashboard = () => {
    setView("initial");
    setClaims([]);
    setPredictions([]);
    setError("");
    setFileName("");
  };
  
  const startNewAnalysis = () => {
    setView("upload");
  }

  const claimsWithPredictions: ClaimWithPrediction[] = useMemo(() => {
    if (!claims.length || !predictions.length) return [];
    return claims.map((claim) => {
      const prediction = predictions.find(p => p.claimId === claim.id);
      return { ...claim, prediction };
    });
  }, [claims, predictions]);

  const summaryStats = useMemo(() => {
    if (claimsWithPredictions.length === 0) return null;
    const totalClaims = claimsWithPredictions.length;
    const highRiskClaims = claimsWithPredictions.filter(c => (c.prediction?.fraudLikelihood ?? 0) >= 0.75).length;
    const totalClaimAmount = claimsWithPredictions.reduce((acc, c) => acc + Number(c.total_claim_amount || 0), 0);
    const potentialFraudAmount = claimsWithPredictions
      .filter(c => (c.prediction?.fraudLikelihood ?? 0) >= 0.75)
      .reduce((acc, c) => acc + Number(c.total_claim_amount || 0), 0);

    return { totalClaims, highRiskClaims, totalClaimAmount, potentialFraudAmount };
  }, [claimsWithPredictions]);

  const allTimeStats = useMemo(() => {
      const completedAnalyses = analyses.filter(a => a.status === 'Completed' && !a.isSample);
      if (completedAnalyses.length === 0) return null;

      const totalClaims = completedAnalyses.reduce((sum, a) => sum + a.claims.length, 0);
      const totalFraudulent = completedAnalyses.reduce((sum, a) => sum + a.predictions.filter(p => p.fraudLikelihood > 0.75).length, 0);
      const totalValue = completedAnalyses.reduce((sum, a) => sum + a.claims.reduce((s, c) => s + Number(c.total_claim_amount || 0), 0), 0);
      
      const allRiskFactors = completedAnalyses.flatMap(a => a.predictions.flatMap(p => p.riskFactors));
      const riskFactorCounts = allRiskFactors.reduce((acc, factor) => {
          acc[factor] = (acc[factor] || 0) + 1;
          return acc;
      }, {} as Record<string, number>);
      
      const commonIndicators = Object.entries(riskFactorCounts).sort(([,a],[,b]) => b - a).slice(0,3).map(([factor]) => factor);

      return { totalClaims, totalFraudulent, totalValue, commonIndicators };
  }, [analyses]);

  const nonSampleAnalyses = analyses.filter(a => !a.isSample);
  
  if (view === "loading" || view === "error") {
      return (
          <div className="flex h-screen items-center justify-center p-4">
              {view === "loading" && (
                  <div className="w-full max-w-md">
                      <h2 className="text-2xl font-semibold mb-2 text-center">Analyzing Claims...</h2>
                      <p className="text-muted-foreground max-w-md text-center mb-8">
                      Our AI is processing the dataset. This may take a moment.
                      </p>
                      <div className="space-y-8">
                          <LoadingStepItem
                              status={loadingStep === "uploading" ? "active" : "complete"}
                              icon={ArrowDownDocIcon}
                              title="Data Uploaded"
                              description="Your dataset has been securely uploaded."
                          />
                          <LoadingStepItem
                              status={loadingStep === "analyzing" ? "active" : loadingStep === "uploading" ? "pending" : "complete"}
                              icon={Combine}
                              title="Automated Analysis"
                              description="Checking data quality and running initial analysis."
                          />
                           <LoadingStepItem
                              status={loadingStep === "predicting" ? "active" : loadingStep === "done" ? "complete" : "pending"}
                              icon={ShieldAlert}
                              title="Fraud Prediction"
                              description="Our AI is scoring each claim for fraud likelihood."
                          />
                      </div>
                  </div>
              )}
               {view === "error" && (
                <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
                  <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
                  <h2 className="text-2xl font-semibold mb-2">Analysis Failed</h2>
                  <p className="text-destructive-foreground bg-destructive/80 p-4 rounded-md mb-4">{error}</p>
                  <Button onClick={resetToDashboard}>Try Again</Button>
                </div>
              )}
          </div>
      );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader>
            <Link href="/" className="flex items-center gap-2">
              <Logo className="size-8 text-primary" />
              <h1 className="text-xl font-semibold">ClaimGuard</h1>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                 <SidebarMenuButton onClick={resetToDashboard} isActive={view === 'initial'}>
                  <LayoutGrid />
                  <span>My Analyses</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton onClick={startNewAnalysis} isActive={view === 'upload'}>
                  <ArrowDownDocIcon />
                  <span>New Upload</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          <main className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col">
             <header className="flex items-center justify-between md:hidden mb-4">
              <div className="flex items-center gap-2">
                <Logo className="size-8 text-primary" />
                <h1 className="text-xl font-semibold">ClaimGuard</h1>
              </div>
              <SidebarTrigger />
            </header>

            {isDemo && view === 'dashboard' && (
              <Alert className="mb-6 border-primary bg-primary/10 text-primary-foreground">
                  <Eye className="h-4 w-4 !text-primary" />
                  <AlertTitle className="font-semibold !text-primary">You are viewing a Demo</AlertTitle>
                  <AlertDescription className="!text-primary/90">
                    This is a sample analysis. See what ClaimGuard can find in your own data.
                    <Button asChild size="sm" className="ml-4">
                      <Link href="/dashboard">Get Started for Free</Link>
                    </Button>
                  </AlertDescription>
              </Alert>
            )}
            
            {view === "initial" && (
                <div className="space-y-8">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">My Analyses</h1>
                            <p className="text-muted-foreground">An overview of your insurance claim analyses.</p>
                        </div>
                        <Button onClick={startNewAnalysis}><FileText className="mr-2" /> Start New Analysis</Button>
                    </div>

                    {allTimeStats && (
                         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <SummaryCard title="Total Claims Analyzed" value={allTimeStats.totalClaims.toLocaleString()} icon={FileText} />
                            <SummaryCard title="Fraudulent Claims Detected" value={allTimeStats.totalFraudulent.toLocaleString()} icon={ShieldAlert} color="text-destructive"/>
                            <SummaryCard title="Total Value Analyzed" value={allTimeStats.totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} icon={ShieldCheck} />
                            <Card className="lg:col-span-1">
                               <CardHeader className="pb-2">
                                   <CardTitle className="text-sm font-medium">Common Indicators</CardTitle>
                               </CardHeader>
                               <CardContent>
                                    {allTimeStats.commonIndicators.length > 0 ? (
                                        <ul className="text-sm space-y-1 text-muted-foreground">
                                          {allTimeStats.commonIndicators.map(indicator => <li key={indicator}>{indicator}</li>)}
                                        </ul>
                                    ) : <p className="text-sm text-muted-foreground">Not enough data.</p>}
                               </CardContent>
                            </Card>
                        </div>
                    )}

                    {nonSampleAnalyses.length > 0 ? (
                        <div>
                            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                <History className="w-6 h-6" />
                                Recent Analyses
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {nonSampleAnalyses.map(analysis => (
                                <RecentAnalysisCard 
                                    key={analysis.id}
                                    analysis={analysis} 
                                    onViewReport={() => loadAnalysis(analysis)} 
                                    onDelete={() => setAnalysisToDelete(analysis.id)}
                                />
                            ))}
                            </div>
                        </div>
                    ) : (
                         <div className="flex-1 flex flex-col items-center justify-center text-center py-16 border-2 border-dashed rounded-lg">
                            <ArrowDownDocIcon className="w-16 h-16 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-bold">Ready to Uncover Insights?</h3>
                            <p className="text-muted-foreground mb-6 max-w-md">
                                Start by uploading your first claim dataset or explore a sample report to see ClaimGuard in action.
                            </p>
                             <div className="flex gap-4">
                                <Button onClick={startNewAnalysis} size="lg">
                                    <FileText className="mr-2" /> Start New Analysis
                                </Button>
                                <Button onClick={() => handleUseSampleData(true)} variant="outline" size="lg">
                                    <Eye className="mr-2" /> Explore a Sample Report
                                </Button>
                             </div>
                        </div>
                    )}
                </div>
            )}
            {view === "upload" && (
                <div className="flex-1 flex items-center justify-center">
                    <UploadForm onUpload={handleUpload} onSampleData={() => handleUseSampleData(false)} />
                </div>
            )}
            {view === "dashboard" && summaryStats && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analysis Report</h1>
                    <p className="text-muted-foreground">Results for <span className="font-medium text-foreground">{fileName}</span></p>
                  </div>
                   <Button onClick={startNewAnalysis} variant="outline"><ArrowDownDocIcon className="mr-2" /> New Analysis</Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <SummaryCard title="Total Claims" value={summaryStats.totalClaims} icon={FileText} />
                  <SummaryCard title="High-Risk Claims" value={summaryStats.highRiskClaims} icon={AlertTriangle} color="text-destructive" />
                  <SummaryCard title="Total Claim Value" value={summaryStats.totalClaimAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} icon={ShieldCheck} />
                  <SummaryCard title="Potential Fraud Value" value={summaryStats.potentialFraudAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} icon={AlertTriangle} color="text-destructive" />
                </div>
                <div className="grid gap-6 lg:grid-cols-5">
                    <div className="lg:col-span-3">
                        <RiskOverviewChart data={claimsWithPredictions} />
                    </div>
                    <div className="lg:col-span-2">
                         <RiskFactorsCard claims={claims} selectedClaim={selectedClaim} />
                    </div>
                </div>
                <div>
                  <ClaimsTable data={claimsWithPredictions} onRowClick={setSelectedClaim} />
                </div>
              </div>
            )}
          </main>
        </SidebarInset>
      </div>
      <ClaimDetailSheet
        claim={selectedClaim}
        isOpen={!!selectedClaim}
        onOpenChange={(open) => !open && setSelectedClaim(null)}
      />
      <AlertDialog open={!!analysisToDelete} onOpenChange={(open) => !open && setAnalysisToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the analysis
                for "{analyses.find(a => a.id === analysisToDelete)?.fileName}".
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => analysisToDelete && deleteAnalysis(analysisToDelete)}>
                Delete
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </SidebarProvider>
  );
}

    