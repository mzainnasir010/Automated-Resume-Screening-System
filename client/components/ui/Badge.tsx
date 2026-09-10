import { HTMLAttributes } from "react";
import { clsx } from "clsx";

type Tone = "matched" | "missing" | "neutral";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const tones: Record<Tone, string> = {
  matched: "bg-success/10 text-success border-success/20",
  missing: "bg-warning/10 text-warning border-warning/20",
  neutral: "bg-surface-hover text-muted border-border",
};

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}