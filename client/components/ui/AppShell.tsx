// FILE: client/components/ui/AppShell.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { StepIndicator } from "./StepIndicator";
import { ThemeToggle } from "./ThemeToggle";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground lg:flex">
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur lg:hidden">
        <div className="flex w-1/3 justify-start">
          <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 -ml-2 text-muted hover:bg-surface-hover" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
        <div className="flex w-1/3 justify-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent text-xs font-bold text-white">C</div>
            <span className="text-sm font-semibold font-logo tracking-tight">Candid<span className="text-accent">ex</span></span>
          </Link>
        </div>
        <div className="flex w-1/3 justify-end">
          <ThemeToggle />
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-border bg-background p-4 lg:hidden"
            >
              <div className="flex items-center justify-between px-2 py-3">
                <Link href="/" className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-sm font-bold text-white">C</div>
                  <span className="text-sm font-semibold font-logo tracking-tight">Candid<span className="text-accent">ex</span></span>
                </Link>
                <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1.5 text-muted hover:bg-surface-hover" aria-label="Close menu">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-6 px-2 text-xs font-medium uppercase tracking-wide text-muted">Workflow</div>
              <div className="mt-2" onClick={() => setMobileOpen(false)}>
                <StepIndicator />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col border-r border-border p-4 lg:flex">
        <div className="flex items-center justify-between px-2 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-sm font-bold text-white">C</div>
            <span className="text-sm font-semibold font-logo tracking-tight">Candid<span className="text-accent">ex</span></span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="mt-6 px-2 text-xs font-medium uppercase tracking-wide text-muted">Workflow</div>
        <div className="mt-2">
          <StepIndicator />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto w-full">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">{children}</div>
      </main>
    </div>
  );
}