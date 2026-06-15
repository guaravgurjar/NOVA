import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NOVA | Luxury Jewelry Admin",
  description: "Dynamic pricing engine and jewelry administration panel for NOVA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col md:flex-row bg-[#06080d] text-[#f1f5f9]">
        <Sidebar />
        <div className="flex-1 flex flex-col md:pl-64 min-h-screen">
          <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
