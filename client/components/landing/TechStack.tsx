// client/components/landing/TechStack.tsx
"use client";

import { motion } from "framer-motion";

const STACK = [
  { name: "Next.js", role: "Frontend framework" },
  { name: "React", role: "UI library" },
  { name: "Tailwind CSS", role: "Styling" },
  { name: "Framer Motion", role: "Animation" },
  { name: "FastAPI", role: "Backend API" },
  { name: "PyMuPDF", role: "PDF text extraction" },
  { name: "spaCy", role: "Name & entity recognition" },
  { name: "sentence-transformers", role: "Resume/JD embeddings" },
  { name: "scikit-learn", role: "Cosine similarity" },
  { name: "RapidFuzz", role: "Skill matching" },
];

export function TechStack() {
  return (
    <section className="w-full px-6 sm:px-8 lg:px-12 py-24">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-2xl font-semibold sm:text-3xl">Under the hood</h2>
        <p className="mt-3 text-sm text-muted sm:text-base">The real stack powering extraction, matching, and ranking.</p>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {STACK.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: (i % 5) * 0.05 }}
            className="flex flex-col items-center gap-1 rounded-xl border border-border bg-surface px-3 py-5 text-center transition-colors hover:border-accent/40"
          >
            <p className="text-sm font-semibold">{t.name}</p>
            <p className="text-[11px] text-muted">{t.role}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}