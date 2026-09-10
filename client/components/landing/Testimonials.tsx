// client/components/landing/Testimonials.tsx
"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  { name: "Sara Ahmed", role: "Talent Lead, Northbridge Labs", quote: "We went from three days of manual screening to under an hour, and the skill breakdown made it easy to justify every shortlist decision." },
  { name: "Daniel Cho", role: "Engineering Manager, Fintrace", quote: "The semantic matching actually understands resumes. It surfaced candidates our keyword filters used to miss entirely." },
  { name: "Priya Menon", role: "HR Ops, Vertexa", quote: "Ranking is consistent every time we re-run it, which finally made our shortlist process defensible to stakeholders." },
];

export function Testimonials() {
  return (
    <section className="w-full px-6 sm:px-8 lg:px-12 py-24">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-2xl font-semibold sm:text-3xl">What hiring teams say</h2>
        <p className="mt-3 text-sm text-muted sm:text-base">Demo testimonials illustrating the intended use case.</p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            className="flex flex-col rounded-2xl border border-border bg-surface p-6"
          >
            <Quote className="h-5 w-5 text-accent" />
            <p className="mt-4 flex-1 text-sm text-foreground/90">{t.quote}</p>
            <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                {t.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="text-xs font-medium">{t.name}</p>
                <p className="text-xs text-muted">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}