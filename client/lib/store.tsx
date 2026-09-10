"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { UploadedFile, JobDescriptionResult, CandidateRecord } from "./types";

interface ScreeningState {
  files: UploadedFile[];
  setFiles: (files: UploadedFile[]) => void;
  jobDescription: JobDescriptionResult | null;
  setJobDescription: (jd: JobDescriptionResult | null) => void;
  results: CandidateRecord[];
  setResults: (r: CandidateRecord[]) => void;
  reset: () => void;
}

const ScreeningContext = createContext<ScreeningState | undefined>(undefined);

export function ScreeningProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [jobDescription, setJobDescription] = useState<JobDescriptionResult | null>(null);
  const [results, setResults] = useState<CandidateRecord[]>([]);

  const reset = () => {
    setFiles([]);
    setJobDescription(null);
    setResults([]);
  };

  return (
    <ScreeningContext.Provider
      value={{ files, setFiles, jobDescription, setJobDescription, results, setResults, reset }}
    >
      {children}
    </ScreeningContext.Provider>
  );
}

export function useScreening() {
  const ctx = useContext(ScreeningContext);
  if (!ctx) throw new Error("useScreening must be used within ScreeningProvider");
  return ctx;
}