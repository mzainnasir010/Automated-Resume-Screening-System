import { StepIndicator } from "./StepIndicator";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="flex w-[260px] shrink-0 flex-col border-r border-border p-4">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-sm font-bold text-white">
            S
          </div>
          <span className="text-sm font-semibold">
            Screen<span className="text-accent">AI</span>
          </span>
        </div>

        <div className="mt-6 px-2 text-xs font-medium uppercase tracking-wide text-muted">
          Workflow
        </div>
        <div className="mt-2">
          <StepIndicator />
        </div>

        <div className="mt-auto flex items-center gap-2 rounded-lg border border-border p-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-hover text-xs font-medium">
            MZ
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">Muhammad Zain</p>
            <p className="truncate text-xs text-muted">Screening Tool</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl px-8 py-10">{children}</div>
      </main>
    </div>
  );
}