"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, SearchX } from "lucide-react";
import { AppShell } from "@/components/ui/AppShell";
import { CandidateCard } from "@/components/ui/CandidateCard";
import { Toolbar } from "@/components/ui/Toolbar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useScreening } from "@/lib/store";
import { getRankedResults } from "@/lib/api";

export default function ResultsPage() {
  const router = useRouter();
  const { results, setResults, reset } = useScreening();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"score" | "name">("score");
  const [minScore, setMinScore] = useState(0);

  useEffect(() => {
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
  }, []);

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
    router.push("/upload");
  };

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

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Candidates", value: results.length },
          { label: "Avg Match Score", value: `${avgScore}%` },
          { label: "Strong Matches", value: strongMatches },
          { label: "Partial Matches", value: partialMatches },
        ].map((stat) => (
          <Card key={stat.label} className="flex h-20 flex-col justify-center px-4">
            <p className="text-lg font-semibold tabular-nums">{stat.value}</p>
            <p className="text-xs text-muted">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-4">
        <Toolbar search={search} onSearchChange={setSearch} sort={sort} onSortChange={setSort} minScore={minScore} onMinScoreChange={setMinScore} />
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-52 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={SearchX} title="No candidates match your filters" description="Try lowering the minimum score or clearing your search." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((candidate) => (
              <CandidateCard key={candidate.candidate_id} candidate={candidate} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}