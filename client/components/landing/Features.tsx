// client/components/landing/Features.tsx
"use client";

import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Brain, ListChecks, Gauge, GitCompareArrows } from "lucide-react";

const FEATURES = [
  { icon: Brain, title: "Semantic matching", description: "Uses sentence embeddings, not keyword search, so a resume that says 'built REST APIs' still matches a job asking for 'backend development'." },
  { icon: ListChecks, title: "Skill-level breakdown", description: "See exactly which required skills each candidate has and which are missing, extracted directly from resume text." },
  { icon: Gauge, title: "Weighted scoring", description: "Every score blends 60% semantic similarity with 40% skill overlap, so a strong resume can't hide behind buzzwords alone." },
  { icon: GitCompareArrows, title: "Deterministic ranking", description: "Candidates are sorted by score with name as a documented tie-break, so results are reproducible every run." },
  { icon: ShieldCheck, title: "Resilient extraction", description: "Handles messy PDFs gracefully, falling back from name detection to filename, and flags files it couldn't read instead of failing silently." },
  { icon: Sparkles, title: "Built for batches", description: "Screen dozens of resumes against one job description in a single pass, no manual comparison spreadsheets." },
];

export function Features() {
  return (
    <section id="features" className="border-y border-border bg-surface/40 py-24">
      <div className="w-full px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">Built for how hiring actually works</h2>
          <p className="mt-3 text-sm text-muted sm:text-base">Every score is explainable, not a black box.</p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}