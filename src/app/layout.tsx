import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "emmas - Free File Tools for Images & Documents",
  description: "Free online tools to convert images and documents. Fast, simple, and unlimited file processing.",
  keywords: ["file tools", "image converter", "document converter", "free file converter", "emmas"],
  authors: [{ name: "emmas Team" }],
  openGraph: {
    title: "emmas - Free File Tools",
    description: "Free online tools for image and document processing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "emmas - Free File Tools",
    description: "Free online tools for image and document processing",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://emmas.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
