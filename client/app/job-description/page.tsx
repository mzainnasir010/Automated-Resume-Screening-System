"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { AppShell } from "@/components/ui/AppShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useScreening } from "@/lib/store";
import { submitJobDescription } from "@/lib/api";

const MIN_CHARS = 100;

export default function JobDescriptionPage() {
  const router = useRouter();
  const { jobDescription, setJobDescription } = useScreening();
  const [text, setText] = useState(jobDescription?.raw_text ?? "");
  const [loading, setLoading] = useState(false);

  const handleExtract = async () => {
    setLoading(true);
    try {
      const result = await submitJobDescription(text);
      setJobDescription(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <h1 className="text-xl font-semibold">Job Description</h1>
      <p className="mt-1 text-sm text-muted">Paste the full job description, we extract the required skills.</p>

      <div className="mt-6 rounded-xl border border-border bg-surface p-4">
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} placeholder="Paste the job description here" className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted" />
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-surface-hover">
            <div className="h-full bg-accent transition-all" style={{ width: `${Math.min((text.length / MIN_CHARS) * 100, 100)}%` }} />
          </div>
          <span className="text-xs tabular-nums text-muted">{text.length} / {MIN_CHARS}</span>
        </div>
      </div>

      {jobDescription && (
        <div className="mt-6 rounded-xl border border-border bg-surface p-4">
          <p className="mb-3 text-sm font-medium">Required skills detected</p>
          <div className="flex flex-wrap gap-1.5">
            {jobDescription.required_skills.map((skill) => (
              <Badge key={skill} tone="matched">{skill}</Badge>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
        <Button variant="secondary" onClick={() => router.push("/upload")}>Back</Button>
        <div className="flex items-center gap-3">
          <Button variant="secondary" disabled={text.length < MIN_CHARS || loading} onClick={handleExtract}>
            <Sparkles className="h-4 w-4" />
            {loading ? "Extracting..." : "Extract Skills"}
          </Button>
          <Button disabled={!jobDescription} onClick={() => router.push("/results")}>Continue</Button>
        </div>
      </div>
    </AppShell>
  );
}