import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center text-foreground">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-base font-bold text-white">S</div>
      <h1 className="mt-6 text-2xl font-semibold">
        Screen<span className="text-accent">AI</span>
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted">
        Upload a batch of resumes, paste a job description, and get a ranked shortlist with matched and missing skills for every candidate.
      </p>
      <Link href="/upload" className="mt-8 inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-hover">
        Start Screening <ArrowRight className="h-4 w-4" />
      </Link>
    </main>
  );
}