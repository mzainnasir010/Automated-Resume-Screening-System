// FILE: client/app/job-description/page.tsx
"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Upload } from "lucide-react";
import { AppShell } from "@/components/ui/AppShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useScreening } from "@/lib/store";
import { submitJobDescription, submitJobDescriptionFile } from "@/lib/api";

const MIN_CHARS = 100;

export default function JobDescriptionPage() {
  const router = useRouter();
  const { jobDescription, setJobDescription } = useScreening();
  const [text, setText] = useState(jobDescription?.raw_text ?? "");
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExtract = async () => {
    setLoading(true);
    try {
      const result = await submitJobDescription(text);
      setJobDescription(result);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setFileError(null);
    setLoading(true);
    try {
      const result = await submitJobDescriptionFile(file);
      setText(result.raw_text);
      setJobDescription(result);
    } catch (err) {
      setFileError(err instanceof Error ? err.message : "Could not process this file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <h1 className="text-xl font-semibold">Job Description</h1>
      <p className="mt-1 text-sm text-muted">Paste the full job description, or upload it as a PDF or text file, we extract the required skills.</p>

      <div className="mt-6 rounded-xl border border-border bg-surface p-4">
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} placeholder="Paste the job description here" className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted" />
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-surface-hover">
            <motion.div className="h-full bg-accent" animate={{ width: `${Math.min((text.length / MIN_CHARS) * 100, 100)}%` }} transition={{ duration: 0.2 }} />
          </div>
          <span className="text-xs tabular-nums text-muted">{text.length} / {MIN_CHARS}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <input ref={fileInputRef} type="file" accept=".pdf,.txt,application/pdf,text/plain" className="hidden" onChange={handleFileSelected} />
        <Button variant="secondary" disabled={loading} onClick={() => fileInputRef.current?.click()}>
          <Upload className="h-4 w-4" />
          Upload PDF or .txt instead
        </Button>
        {fileError && <span className="text-xs text-danger">{fileError}</span>}
      </div>

      <AnimatePresence>
        {jobDescription ? (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-6 overflow-hidden rounded-xl border border-border bg-surface p-4"
          >
            <p className="mb-3 text-sm font-medium">Required skills detected</p>
            <div className="flex flex-wrap gap-1.5">
              {jobDescription.required_skills.map((skill) => <Badge key={skill} tone="matched">{skill}</Badge>)}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-6 rounded-xl border border-border border-dashed bg-surface/50 p-6 text-center text-sm text-muted"
          >
            <p><strong className="text-foreground">How it works:</strong> Paste the job description above and click &quot;Extract Skills&quot;.</p>
            <p className="mt-2">Our AI will analyse the text to identify the core technical skills, tools, and competencies required for the role. These will be used to score and rank your uploaded resumes.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
        <Button variant="secondary" onClick={() => router.push("/upload")}>Back</Button>
        <div className="flex items-center gap-3">
          {!jobDescription ? (
            <>
              <span className="hidden text-xs text-muted sm:inline-block">Extract skills to continue</span>
              <Button disabled={text.length < MIN_CHARS || loading} onClick={handleExtract}>
                <Sparkles className="h-4 w-4" />
                {loading ? "Extracting..." : "Extract Skills"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" disabled={text.length < MIN_CHARS || loading} onClick={handleExtract}>
                <Sparkles className="h-4 w-4" />
                {loading ? "Extracting..." : "Re-Extract"}
              </Button>
              <Button onClick={() => router.push("/results")}>Continue</Button>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}