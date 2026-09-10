// client/components/landing/HowItWorks.tsx
"use client";

import { motion } from "framer-motion";
import { UploadCloud, FileSearch, ListOrdered } from "lucide-react";

const STEPS = [
  {
    icon: UploadCloud,
    title: "Upload resumes",
    description:
      "Drop in a batch of PDF resumes. Each one is parsed, cleaned, and the candidate's name and skills are extracted automatically.",
  },
  {
    icon: FileSearch,
    title: "Paste the job description",
    description:
      "Paste or upload the role's requirements. We pull out the required skills and generate a semantic embedding of the role.",
  },
  {
    icon: ListOrdered,
    title: "Get a ranked shortlist",
    description:
      "Every resume is scored against the job description using 60% semantic similarity and 40% skill overlap, then ranked highest first.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full px-6 sm:px-8 lg:px-12 py-24">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-2xl font-semibold sm:text-3xl">How it works</h2>
        <p className="mt-3 text-sm text-muted sm:text-base">Three steps from a folder of PDFs to a ranked shortlist.</p>
      </div>

      <div className="mt-14 grid gap-8 sm:grid-cols-3">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className="relative rounded-2xl border border-border bg-surface p-6"
          >
            <span className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
              {i + 1}
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <step.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-muted">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}