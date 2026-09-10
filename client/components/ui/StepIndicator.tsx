"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import { clsx } from "clsx";

const steps = [
  { href: "/upload", label: "Upload Resumes" },
  { href: "/job-description", label: "Job Description" },
  { href: "/results", label: "View Results" },
];

export function StepIndicator() {
  const pathname = usePathname();
  const currentIndex = steps.findIndex((s) => s.href === pathname);

  return (
    <nav className="space-y-1">
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isDone = index < currentIndex;
        return (
          <Link
            key={step.href}
            href={step.href}
            className={clsx(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive ? "bg-accent/10 font-medium text-accent" : "text-muted hover:bg-surface-hover hover:text-foreground"
            )}
          >
            <span
              className={clsx(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs",
                isDone
                  ? "bg-success text-white"
                  : isActive
                  ? "bg-accent text-white"
                  : "border border-border bg-surface-hover text-muted"
              )}
            >
              {isDone ? <Check className="h-3 w-3" /> : index + 1}
            </span>
            {step.label}
          </Link>
        );
      })}
    </nav>
  );
}