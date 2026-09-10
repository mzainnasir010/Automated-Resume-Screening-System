// FILE: client/components/ui/ScoreRing.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";
import { clsx } from "clsx";

interface ScoreBreakdown {
  baseScore: number;
  skillOverlap: number;
  matchedCount: number;
  totalSkills: number;
}

interface ScoreRingProps {
  score: number;
  size?: number;
  breakdown?: ScoreBreakdown;
}

function band(score: number) {
  if (score >= 80) return { color: "var(--color-success)", label: "Strong Match" };
  if (score >= 50) return { color: "var(--color-warning)", label: "Partial Match" };
  return { color: "var(--color-danger)", label: "Weak Match" };
}

export function ScoreRing({ score, size = 56, breakdown }: ScoreRingProps) {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pinned) return;
    const handleClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setPinned(false);
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [pinned]);

  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(score, 100) / 100) * circumference;
  const tier = band(score);
  const open = breakdown && (hovered || pinned);

  return (
    <div ref={wrapRef} className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <button
        type="button"
        disabled={!breakdown}
        onClick={(e) => {
          e.stopPropagation();
          if (breakdown) setPinned((v) => !v);
        }}
        aria-expanded={open}
        aria-label={breakdown ? `${tier.label}, ${Math.round(score)} percent, view scoring breakdown` : undefined}
        className={clsx(
          "relative flex items-center justify-center rounded-full",
          breakdown && "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        )}
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--color-border)" strokeWidth={strokeWidth} />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={tier.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </svg>
        <span className="absolute text-sm font-semibold tabular-nums" style={{ color: tier.color }}>
          {Math.round(score)}%
        </span>
      </button>

      <AnimatePresence>
        {open && breakdown && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-20 mt-2 w-64 rounded-xl border border-border bg-surface p-4 text-left shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Info className="h-3.5 w-3.5 text-muted" />
              <p className="text-xs font-semibold" style={{ color: tier.color }}>{tier.label}</p>
            </div>

            <div className="mt-3 space-y-2.5">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Semantic similarity</span>
                  <span className="font-medium tabular-nums">{Math.round(breakdown.baseScore)}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-hover">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${breakdown.baseScore}%` }} />
                </div>
                <p className="mt-0.5 text-[11px] text-muted">60% weight, resume vs job embedding</p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Skill overlap</span>
                  <span className="font-medium tabular-nums">{breakdown.matchedCount}/{breakdown.totalSkills} skills</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-hover">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${breakdown.skillOverlap}%` }} />
                </div>
                <p className="mt-0.5 text-[11px] text-muted">40% weight, required skills found</p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5 text-xs">
              <span className="text-muted">Final score</span>
              <span className="font-semibold tabular-nums" style={{ color: tier.color }}>{Math.round(score)}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}