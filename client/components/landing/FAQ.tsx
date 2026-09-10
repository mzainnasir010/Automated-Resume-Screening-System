// client/components/landing/FAQ.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  { q: "What file formats are supported for resumes?", a: "PDF only for now. Each file is parsed and cleaned before it's scored." },
  { q: "How is the match score calculated?", a: "Score = 60% semantic similarity between the resume and job description embeddings, plus 40% skill overlap between required skills and skills detected in the resume." },
  { q: "What counts as a strong match?", a: "80% and above is a strong match, 50 to 79% is a partial match, and below 50% is a weak match. These bands drive the color coding across the app." },
  { q: "What happens if a resume can't be parsed?", a: "It's flagged as an extraction failure in the results instead of being silently dropped, so nothing disappears from the batch." },
  { q: "Is there a limit on how many resumes I can screen at once?", a: "No hard limit, the pipeline is built to process a full batch of resumes against a single job description in one pass." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="border-y border-border bg-surface/40 py-24">
      <div className="w-full px-6 sm:px-8 lg:px-12">
        <div className="text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">Frequently asked questions</h2>
        </div>

        <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-surface">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="px-5">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium"
                >
                  {item.q}
                  <ChevronDown className={`h-4 w-4 shrink-0 text-muted transition-transform ${isOpen ? "rotate-180 text-accent" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-4 text-sm text-muted">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}