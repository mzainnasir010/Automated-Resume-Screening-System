"use client";

import { useState } from "react";

interface ScoreBreakdown {
  baseScore: number;
  skillOverlap: number;
  matchedCount: number;
  totalSkills: number;
}

interface ScoreMeterProps {
  score: number;
  breakdown: ScoreBreakdown;
}

function band(score: number) {
  if (score >= 80) return { text: "text-success", bar: "bg-success" };
  if (score >= 50) return { text: "text-warning", bar: "bg-warning" };
  return { text: "text-danger", bar: "bg-danger" };
}

export function ScoreMeter({ score, breakdown }: ScoreMeterProps) {
  const [open, setOpen] = useState(false);
  const colors = band(score);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="flex items-center gap-2">
        <span className={`text-lg font-semibold tabular-nums ${colors.text}`}>
          {Math.round(score)}%
        </span>
      </div>
      <div className="mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-surface-hover">
        <div
          className={`h-full rounded-full ${colors.bar} transition-all`}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>

      {open && (
        <div className="absolute right-0 top-full z-10 mt-2 w-56 rounded-lg border border-border bg-surface p-3 text-xs shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-muted">Semantic similarity</span>
            <span className="tabular-nums font-medium">{Math.round(breakdown.baseScore)}%</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-muted">Skill overlap</span>
            <span className="tabular-nums font-medium">
              {breakdown.matchedCount}/{breakdown.totalSkills} skills
            </span>
          </div>
          <div className="mt-2 border-t border-border pt-2 text-muted">
            Final score blends both, weighted 60/40
          </div>
        </div>
      )}
    </div>
  );
}