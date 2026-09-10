"use client";

import { useState } from "react";
import { AlertTriangle, ChevronDown, FileText } from "lucide-react";
import { clsx } from "clsx";

import { CandidateRecord } from "@/lib/types";
import { Card } from "./Card";
import { ScoreMeter } from "./ScoreMeter";

const MAX_VISIBLE_TAGS = 4;

export function CandidateCard({
  candidate,
}: {
  candidate: CandidateRecord;
}) {
  const [expanded, setExpanded] = useState(false);

  const failed = candidate.extraction_status !== "ok";

  const matchedVisible = candidate.skills_matched.slice(
    0,
    MAX_VISIBLE_TAGS
  );
  const matchedOverflow =
    candidate.skills_matched.length - matchedVisible.length;

  const missingVisible = candidate.skills_missing.slice(
    0,
    MAX_VISIBLE_TAGS
  );
  const missingOverflow =
    candidate.skills_missing.length - missingVisible.length;

  const totalSkills =
    candidate.skills_matched.length + candidate.skills_missing.length;

  const matchPercentage =
    totalSkills > 0
      ? Math.round(
          (candidate.skills_matched.length / totalSkills) * 100
        )
      : 0;

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 p-5 pb-4">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex rounded-md bg-surface-hover px-2 py-1 text-[11px] font-semibold tracking-wide text-muted">
              #{candidate.rank}
            </span>

            {!failed && (
              <span className="text-[11px] font-medium text-muted">
                Candidate
              </span>
            )}
          </div>

          <h3 className="truncate text-base font-semibold tracking-tight">
            {candidate.name}
          </h3>

          <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-muted">
            <FileText className="h-3.5 w-3.5 shrink-0" />

            <span className="truncate">
              {candidate.name_source === "filename"
                ? "Name not detected, showing filename"
                : candidate.source_file}
            </span>
          </div>
        </div>

        {failed ? (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger/10">
            <AlertTriangle className="h-4.5 w-4.5 text-danger" />
          </div>
        ) : (
          <ScoreMeter
            score={candidate.match_score}
            breakdown={{
              baseScore: candidate.similarity_raw * 100,
              skillOverlap:
                totalSkills > 0
                  ? (candidate.skills_matched.length / totalSkills) * 100
                  : 0,
              matchedCount: candidate.skills_matched.length,
              totalSkills,
            }}
          />
        )}
      </div>

      {/* Divider */}
      <div className="mx-5 border-t border-border" />

      {failed ? (
        <div className="m-5 rounded-lg bg-danger/10 px-4 py-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />

            <div>
              <p className="text-xs font-semibold text-danger">
                Resume extraction failed
              </p>

              <p className="mt-0.5 text-xs leading-relaxed text-muted">
                This resume could not be read and was excluded from scoring.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="px-5 pt-4">
            <p
              className={clsx(
                "text-sm leading-6 text-muted",
                !expanded && "line-clamp-2"
              )}
            >
              {candidate.summary}
            </p>

            {candidate.summary.length > 90 && (
              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-accent transition-colors hover:text-accent-hover"
              >
                {expanded ? "Show less" : "Show more"}

                <ChevronDown
                  className={clsx(
                    "h-3.5 w-3.5 transition-transform",
                    expanded && "rotate-180"
                  )}
                />
              </button>
            )}
          </div>

          {/* Skills */}
          <div className="mt-auto px-5 pb-5 pt-5">
            <div className="space-y-4">
              {/* Matched */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">
                      Matched skills
                    </span>

                    <span className="rounded-full bg-success px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {candidate.skills_matched.length}
                    </span>
                  </div>

                  <span className="text-[11px] font-medium text-muted">
                    {matchPercentage}% overlap
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {matchedVisible.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded-md bg-success px-2.5 py-1 text-[11px] font-semibold text-white"
                    >
                      {skill}
                    </span>
                  ))}

                  {matchedOverflow > 0 && (
                    <span className="inline-flex items-center rounded-md bg-surface-hover px-2.5 py-1 text-[11px] font-semibold text-muted">
                      +{matchedOverflow}
                    </span>
                  )}

                  {candidate.skills_matched.length === 0 && (
                    <span className="text-xs text-muted">
                      No matching skills
                    </span>
                  )}
                </div>
              </div>

              {/* Missing */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xs font-semibold">
                    Missing skills
                  </span>

                  <span className="rounded-full bg-danger px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {candidate.skills_missing.length}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {missingVisible.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded-md bg-danger px-2.5 py-1 text-[11px] font-semibold text-white"
                    >
                      {skill}
                    </span>
                  ))}

                  {missingOverflow > 0 && (
                    <span className="inline-flex items-center rounded-md bg-surface-hover px-2.5 py-1 text-[11px] font-semibold text-muted">
                      +{missingOverflow}
                    </span>
                  )}

                  {candidate.skills_missing.length === 0 && (
                    <span className="text-xs text-muted">
                      No missing skills
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}