// client/components/landing/Navbar.tsx
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur">
      <div className="flex h-16 w-full items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-sm font-bold text-white">
            S
          </div>
          <span className="text-sm font-semibold">
            Screen<span className="text-accent">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted sm:flex">
          <a href="#how-it-works" className="transition-colors hover:text-foreground">How it works</a>
          <a href="#features" className="transition-colors hover:text-foreground">Features</a>
          <a href="#faq" className="transition-colors hover:text-foreground">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/upload"
            className="hidden h-9 items-center gap-1.5 rounded-lg bg-accent px-4 text-xs font-medium text-white transition-colors hover:bg-accent-hover sm:inline-flex"
          >
            Start Screening <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}