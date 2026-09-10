// client/components/landing/Testimonials.tsx
"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  { name: "Ayesha Khan", role: "Talent Lead, Lahore", quote: "We went from three days of manual screening to under an hour, and the skill breakdown made it easy to justify every shortlist decision." },
  { name: "Ali Raza", role: "Engineering Manager, Lahore", quote: "The semantic matching actually understands resumes. It surfaced candidates our keyword filters used to miss entirely." },
  { name: "Fatima Tariq", role: "HR Op, Islamabad", quote: "Ranking is consistent every time we re-run it, which finally made our shortlist process defensible to stakeholders." },
];

export function Testimonials() {
  return (
    <section className="w-full px-6 sm:px-8 lg:px-12 py-24">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-xl text-center"
      >
        <h2 className="text-2xl font-semibold sm:text-3xl">What hiring teams say</h2>
        <p className="mt-3 text-sm text-muted sm:text-base">Demo testimonials illustrating the intended use case.</p>
      </motion.div>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" }}
            className="flex flex-col rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-accent/50 hover:shadow-md"
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