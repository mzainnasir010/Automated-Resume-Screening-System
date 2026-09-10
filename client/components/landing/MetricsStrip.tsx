// client/components/landing/MetricsStrip.tsx
"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1.4, bounce: 0 });

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => {
    return spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = `${Math.round(v).toLocaleString()}${suffix}`;
    });
  }, [spring, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

const STATS = [
  { label: "Resumes screened", value: 12400, suffix: "+" },
  { label: "Avg. time saved per hire", value: 6, suffix: " hrs" },
  { label: "Matching accuracy", value: 94, suffix: "%" },
  { label: "Skills in taxonomy", value: 850, suffix: "+" },
];

export function MetricsStrip() {
  return (
    <section className="relative border-y border-border bg-surface/60 py-12 backdrop-blur">
      <div className="w-full grid grid-cols-2 gap-8 px-6 sm:grid-cols-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="text-center"
          >
            <p className="text-3xl font-semibold tabular-nums text-accent sm:text-4xl">
              <Counter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-1 text-xs text-muted sm:text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}