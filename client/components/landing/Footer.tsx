import Link from "next/link";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.03c3.15-.38 6.5-1.4 6.5-7.17A5.25 5.25 0 0 0 19 3.5a5.1 5.1 0 0 0-.2-3.5 5.08 5.08 0 0 0-3.5 1.5 13.5 13.5 0 0 0-7 0 5.08 5.08 0 0 0-3.5-1.5 5.1 5.1 0 0 0-.2 3.5 5.25 5.25 0 0 0-2 4.33c0 5.75 3.34 6.78 6.5 7.17A4.8 4.8 0 0 0 8 18v4"></path>
  </svg>
);

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/30 pt-16 pb-8">
      <div className="w-full px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5 xl:col-span-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-sm font-bold text-white">C</div>
              <span className="text-lg font-semibold font-logo tracking-tight">Candid<span className="text-accent">ex</span></span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              AI-powered resume screening and candidate ranking. Built for modern hiring teams to surface the best talent in seconds without bias.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7 xl:col-span-8 lg:pl-8 xl:pl-16">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Product</h3>
              <ul className="mt-5 space-y-3 text-sm text-muted">
                <li><a href="#features" className="hover:text-accent transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-accent transition-colors">How it works</a></li>
                <li><a href="#faq" className="hover:text-accent transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Resources</h3>
              <ul className="mt-5 space-y-3 text-sm text-muted">
                <li><a href="https://github.com/mzainnasir010/Automated-Resume-Screening-System" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">Repository</a></li>
                <li><a href="https://github.com/mzainnasir010/Automated-Resume-Screening-System/issues" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">Report an issue</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Legal</h3>
              <ul className="mt-5 space-y-3 text-sm text-muted">
                <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Candidex. Built as a standalone project.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/mzainnasir010/Automated-Resume-Screening-System" target="_blank" rel="noreferrer" className="text-muted hover:text-foreground transition-colors" aria-label="GitHub">
              <GithubIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}