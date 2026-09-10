import { HTMLAttributes } from "react";
import { clsx } from "clsx";

type Tone = "matched" | "missing" | "neutral";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const tones: Record<Tone, string> = {
  matched: "bg-success text-white",
  missing: "bg-warning text-white",
  neutral: "bg-surface-hover text-muted",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-semibold",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}