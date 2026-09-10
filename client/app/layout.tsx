// client/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Outfit, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ScreeningProvider } from "@/lib/store";
import { ThemeProvider } from "@/lib/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "Candidex - AI-Powered Resume Screening",
  description: "AI powered resume screening and candidate ranking dashboard",
};

const THEME_INIT_SCRIPT = `
(function() {
  try {
    var stored = localStorage.getItem('candidex-theme');
    var theme = stored && stored !== 'system'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
      </head>
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider>
          <ScreeningProvider>{children}</ScreeningProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}