// client/components/ui/CandidateCard.tsx
"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { clsx } from "clsx";

import { CandidateRecord } from "@/lib/types";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { ScoreRing } from "./ScoreRing";

const MAX_VISIBLE_TAGS = 4;

export function CandidateCard({ candidate }: { candidate: CandidateRecord }) {
  const [expanded, setExpanded] = useState(false);
  const failed = candidate.extraction_status !== "ok";

  const matchedVisible = candidate.skills_matched.slice(0, MAX_VISIBLE_TAGS);
  const matchedOverflow = candidate.skills_matched.length - matchedVisible.length;
  const missingVisible = candidate.skills_missing.slice(0, MAX_VISIBLE_TAGS);
  const missingOverflow = candidate.skills_missing.length - missingVisible.length;

  return (
    <Card className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="text-xs font-medium text-muted">#{candidate.rank}</span>
          <p className="mt-1 truncate text-sm font-semibold">{candidate.name}</p>
          {candidate.name_source === "filename" ? (
            <p className="truncate text-xs text-muted">Name not detected, showing filename</p>
          ) : (
            <p className="truncate text-xs text-muted">{candidate.source_file}</p>
          )}
        </div>
        {failed ? (
          <AlertTriangle className="h-5 w-5 shrink-0 text-danger" />
        ) : (
          <ScoreRing score={candidate.match_score} />
        )}
      </div>

      {failed ? (
        <div className="mt-4 rounded-lg bg-danger/10 px-3 py-2 text-xs font-medium text-danger">
          Extraction failed, this resume could not be read
        </div>
      ) : (
        <>
          <p className={clsx("mt-4 text-sm text-muted", !expanded && "line-clamp-2")}>{candidate.summary}</p>
          {candidate.summary.length > 90 && (
            <button onClick={() => setExpanded((v) => !v)} className="mt-1 self-start text-xs font-medium text-accent">
              {expanded ? "Show less" : "Show more"}
            </button>
          )}

          <div className="mt-4 flex flex-1 flex-col justify-end gap-2">
            <div className="flex flex-wrap gap-1.5">
              {matchedVisible.map((skill) => (
                <Badge key={skill} tone="matched">{skill}</Badge>
              ))}
              {matchedOverflow > 0 && <Badge tone="neutral">+{matchedOverflow} more</Badge>}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {missingVisible.map((skill) => (
                <Badge key={skill} tone="missing">{skill}</Badge>
              ))}
              {missingOverflow > 0 && <Badge tone="neutral">+{missingOverflow} more</Badge>}
            </div>
          </div>
        </>
      )}
    </Card>
  );
}