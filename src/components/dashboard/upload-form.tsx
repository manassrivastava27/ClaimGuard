"use client";

import React from "react";
import { useDropzone } from "react-dropzone";
import { ArrowDownDoc as ArrowDownDocIcon } from "@/components/icons/arrow-down-doc";
import { FileText, Download, Lock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { sampleClaimsCSV } from "@/lib/claims-data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";


type UploadFormProps = {
  onUpload: (file: File) => void;
  onSampleData: () => void;
};

export function UploadForm({ onUpload, onSampleData }: UploadFormProps) {
  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0]);
      }
    },
    [onUpload]
  );
  
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: { "text/csv": [".csv"] },
    multiple: false,
  });

  const handleDownloadTemplate = () => {
    const blob = new Blob([sampleClaimsCSV], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.href) {
        URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", "claim_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div {...getRootProps({
        className: 'w-full h-full flex flex-col items-center justify-center p-4',
    })}>
        <input {...getInputProps()} />
       
       <div className="w-full max-w-2xl mx-auto space-y-8">
            <Card className="text-center shadow-lg">
                <CardHeader className="p-8">
                <CardTitle className="text-xl md:text-2xl font-bold">Start a New Analysis</CardTitle>
                <CardDescription>
                    Upload a CSV file of insurance claims to begin.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 px-8 pb-8">
                <div
                    onClick={open}
                     className={cn(
                        'p-8 md:p-12 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
                        isDragActive
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50 hover:bg-accent'
                    )}
                >
                    <div className="flex flex-col items-center justify-center space-y-4">
                    <ArrowDownDocIcon className="w-12 h-12 md:w-14 md:h-14 text-muted-foreground" />
                    <div className="text-center">
                        <p className="font-semibold text-foreground">
                        {isDragActive
                            ? 'Drop your file to begin'
                            : 'Drag & drop a CSV file here, or click to select'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Max 50MB or 100,000 rows</p>
                    </div>
                    </div>
                </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <TooltipProvider>
                        <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="w-4 h-4 cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-left">
                            <h4 className="font-semibold text-foreground mb-2">Required Columns:</h4>
                            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs list-disc list-inside">
                                <li>claim_id</li>
                                <li>policy_id</li>
                                <li>incident_date</li>
                                <li>incident_type</li>
                                <li>driver_rating</li>
                                <li>total_claim_amount</li>
                            </ul>
                        </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <span>Hover for required columns</span>
                    </div>
                

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-4 text-center">
                    <Lock className="w-3 h-3 shrink-0" />
                    <span>Your data is confidential. All uploads are encrypted and processed securely.</span>
                </div>

                </CardContent>
            </Card>
            <Card className="w-full text-center shadow-lg">
                <CardHeader className="p-8">
                    <CardTitle className="text-lg md:text-xl">Not sure where to start?</CardTitle>
                    <CardDescription>
                    Explore an interactive demo with our sample data or download a template.
                </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button onClick={onSampleData} size="lg">
                            <FileText className="mr-2 h-4 w-4" />
                            Use Sample Data
                        </Button>
                        <Button onClick={handleDownloadTemplate} variant="outline" size="lg">
                            <Download className="mr-2 h-4 w-4" />
                            Download Template
                        </Button>
                    </div>
                </CardContent>
            </Card>
       </div>
    </div>
  );
}
