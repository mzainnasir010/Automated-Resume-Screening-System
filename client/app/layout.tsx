import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ScreeningProvider } from "@/lib/store";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "ScreenAI, Resume Screening & Candidate Ranking",
  description: "AI powered resume screening and candidate ranking dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} dark`}>
      <body className="min-h-screen font-sans antialiased">
        <ScreeningProvider>{children}</ScreeningProvider>
      </body>
    </html>
  );
}