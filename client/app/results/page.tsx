// FILE: client/app/results/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RotateCcw, SearchX, FilePlus2, Loader2 } from "lucide-react";
import { AppShell } from "@/components/ui/AppShell";
import { CandidateCard } from "@/components/ui/CandidateCard";
import { Toolbar } from "@/components/ui/Toolbar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useScreening } from "@/lib/store";
import { getRankedResults } from "@/lib/api";
import { resetSession } from "@/lib/api";

const gridVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const cardVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

export default function ResultsPage() {
  const router = useRouter();
  const { results, setResults, reset, files, jobDescription } = useScreening();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"score" | "name">("score");
  const [minScore, setMinScore] = useState(0);

  const isMissingData = files.length === 0 || !jobDescription;

  useEffect(() => {
    if (isMissingData) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    getRankedResults().then((data) => {
      if (active) {
        setResults(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMissingData]);

  const filtered = useMemo(() => {
    return results
      .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
      .filter((c) => c.match_score >= minScore)
      .sort((a, b) => (sort === "score" ? b.match_score - a.match_score : a.name.localeCompare(b.name)));
  }, [results, search, sort, minScore]);

  const avgScore = results.length ? (results.reduce((sum, c) => sum + c.match_score, 0) / results.length).toFixed(1) : "0.0";
  const strongMatches = results.filter((c) => c.match_score >= 80).length;
  const partialMatches = results.filter((c) => c.match_score >= 50 && c.match_score < 80).length;

  const handleNewScreening = () => {
    reset();
    resetSession();
    router.push("/upload");
  };

  if (isMissingData) {
    return (
      <AppShell>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Ranked Results</h1>
            <p className="mt-1 text-sm text-muted">Waiting for data</p>
          </div>
        </div>

        <motion.div initial="hidden" animate="visible" variants={gridVariants} className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 opacity-50 pointer-events-none">
          {[
            { label: "Total Candidates", value: "0" },
            { label: "Avg Match Score", value: "0.0%" },
            { label: "Strong Matches", value: "0" },
            { label: "Partial Matches", value: "0" },
          ].map((stat) => (
            <motion.div key={stat.label} variants={cardVariants}>
              <Card className="flex h-20 flex-col justify-center px-4">
                <p className="text-lg font-semibold tabular-nums">{stat.value}</p>
                <p className="text-xs text-muted">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 flex flex-col items-center justify-center rounded-xl border border-border border-dashed bg-surface/30 py-20 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent mb-4">
            <FilePlus2 className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold">No data to analyse</h2>
          <p className="mt-2 max-w-sm text-sm text-muted">
            You need to upload candidate resumes and provide a job description before we can generate the ranked results.
          </p>
          <Button className="mt-6" onClick={() => router.push("/upload")}>
            Upload Resumes
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Ranked Results</h1>
          <p className="mt-1 text-sm text-muted">
            {loading ? "Scoring candidates" : `${results.length} candidates scored, showing ${filtered.length}`}
          </p>
        </div>
        <Button variant="secondary" onClick={handleNewScreening}>
          <RotateCcw className="h-4 w-4" />
          New Screening
        </Button>
      </div>

      <motion.div initial="hidden" animate="visible" variants={gridVariants} className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Candidates", value: results.length },
          { label: "Avg Match Score", value: `${avgScore}%` },
          { label: "Strong Matches", value: strongMatches },
          { label: "Partial Matches", value: partialMatches },
        ].map((stat) => (
          <motion.div key={stat.label} variants={cardVariants}>
            <Card className="flex h-20 flex-col justify-center px-4">
              <p className="text-lg font-semibold tabular-nums">{stat.value}</p>
              <p className="text-xs text-muted">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-4">
        <Toolbar search={search} onSearchChange={setSearch} sort={sort} onSortChange={setSort} minScore={minScore} onMinScoreChange={setMinScore} />
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="flex flex-col gap-6 mt-2">
            <div className="flex justify-center">
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground shadow-sm"
              >
                <Loader2 className="h-4 w-4 animate-spin text-accent" />
                <span>Calculating results... Please don't switch tabs</span>
              </motion.div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: Math.min(12, Math.max(1, files.length)) }).map((_, i) => <Card key={i} className="h-52 animate-pulse" />)}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={SearchX} title="No candidates match your filters" description="Try lowering the minimum score or clearing your search." />
        ) : (
          <motion.div initial="hidden" animate="visible" variants={gridVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((candidate) => (
              <motion.div key={candidate.candidate_id} variants={cardVariants} layout>
                <CandidateCard candidate={candidate} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}