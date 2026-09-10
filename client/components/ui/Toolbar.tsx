"use client";

import { Search } from "lucide-react";

interface ToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  sort: "score" | "name";
  onSortChange: (v: "score" | "name") => void;
  minScore: number;
  onMinScoreChange: (v: number) => void;
}

export function Toolbar({ search, onSearchChange, sort, onSortChange, minScore, onMinScoreChange }: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface p-3">
      <div className="flex min-w-[200px] flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
        <Search className="h-4 w-4 text-muted" />
        <input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search by name" className="w-full bg-transparent text-sm outline-none placeholder:text-muted" />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-muted">Min score</label>
        <input type="range" min={0} max={100} value={minScore} onChange={(e) => onMinScoreChange(Number(e.target.value))} className="accent-[var(--color-accent)]" />
        <span className="w-9 text-xs tabular-nums text-muted">{minScore}%</span>
      </div>

      <select value={sort} onChange={(e) => onSortChange(e.target.value as "score" | "name")} className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none">
        <option value="score">Highest score</option>
        <option value="name">Name, A to Z</option>
      </select>
    </div>
  );
}