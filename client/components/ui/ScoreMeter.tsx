"use client";

import { useState } from "react";
import { Info } from "lucide-react";

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
  if (score >= 80) {
    return {
      text: "text-success",
      bg: "bg-success",
      label: "Strong match",
    };
  }

  if (score >= 50) {
    return {
      text: "text-warning",
      bg: "bg-warning",
      label: "Moderate match",
    };
  }

  return {
    text: "text-danger",
    bg: "bg-danger",
    label: "Weak match",
  };
}

export function ScoreMeter({
  score,
  breakdown,
}: ScoreMeterProps) {
  const [open, setOpen] = useState(false);
  const colors = band(score);

  return (
    <div
      className="relative shrink-0"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="flex items-center gap-2 text-left"
        aria-label="View score breakdown"
      >
        <div className="text-right">
          <div
            className={`text-xl font-bold leading-none tracking-tight tabular-nums ${colors.text}`}
          >
            {Math.round(score)}%
          </div>

          <div className="mt-1 text-[10px] font-medium text-muted">
            {colors.label}
          </div>
        </div>

        <Info className="h-3.5 w-3.5 text-muted" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-60 rounded-lg border border-border bg-surface p-3.5 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold">
              Match breakdown
            </span>

            <span
              className={`text-xs font-bold tabular-nums ${colors.text}`}
            >
              {Math.round(score)}%
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">
                Semantic similarity
              </span>

              <span className="font-semibold tabular-nums">
                {Math.round(breakdown.baseScore)}%
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">
                Skill overlap
              </span>

              <span className="font-semibold tabular-nums">
                {breakdown.matchedCount}/{breakdown.totalSkills}
              </span>
            </div>
          </div>

          <div className="mt-3 border-t border-border pt-3 text-[11px] leading-relaxed text-muted">
            Final score combines semantic similarity and skill
            overlap using a 60/40 weighting.
          </div>
        </div>
      )}
    </div>
  );
}