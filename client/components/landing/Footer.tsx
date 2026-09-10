// client/components/landing/Footer.tsx
export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="w-full px-6 sm:px-8 lg:px-12 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="text-sm font-semibold">
            Screen<span className="text-accent">AI</span>
          </p>
          <p className="mt-1 text-xs text-muted">AI-powered resume screening and candidate ranking.</p>
        </div>

        <div className="flex items-center gap-4">
          <a href="https://github.com/mzainnasir010/Automated-Resume-Screening-System" target="_blank" rel="noreferrer" className="text-muted transition-colors hover:text-accent" aria-label="GitHub">
            GitHub
          </a>
          <a href="#" className="text-muted transition-colors hover:text-accent" aria-label="LinkedIn">
            LinkedIn
          </a>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-muted">© {new Date().getFullYear()} ScreenAI. Built as a standalone project.</p>
    </footer>
  );
}