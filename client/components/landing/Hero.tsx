// FILE: client/components/landing/Hero.tsx
"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";

const Hero3D = dynamic(() => import("./Hero3D").then((m) => m.Hero3D), { ssr: false });

export function Hero() {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-6 pt-10 pb-16 text-center">
      <div className="pointer-events-none absolute inset-0">
        <Hero3D />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/70 to-background" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex max-w-2xl flex-col items-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1 text-xs font-medium text-muted backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Semantic matching, not keyword matching
        </span>

        <h1 className="mt-6 font-logo text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
          Candid<span className="text-accent">ex</span>
        </h1>

        <p className="mt-4 text-lg font-medium text-foreground/90 sm:text-xl">
          AI-Powered Resume Screening & Candidate Ranking System
        </p>

        <p className="mt-4 max-w-xl text-sm text-muted sm:text-base">
          Upload a batch of resumes, paste a job description, and get a ranked shortlist with matched and missing
          skills for every candidate, powered by sentence embeddings, not keyword search.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/upload"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-6 text-sm font-medium text-white shadow-lg shadow-accent/20 transition-colors hover:bg-accent-hover"
          >
            Start Screening <ArrowRight className="h-4 w-4" />
          </Link>

          <a
            href="#how-it-works"
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-surface/80 px-6 text-sm font-medium text-foreground backdrop-blur transition-colors hover:bg-surface-hover"
          >
            <PlayCircle className="h-4 w-4" /> See how it works
          </a>
        </div>
      </motion.div>
    </section>
  );
}