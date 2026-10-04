import type { Metadata } from "next";
import "./globals.css";
import { LenisProvider } from "@/components/lenis-provider";
import { AuthProvider } from "@/context/auth-context";
import { AppShell } from "@/components/layout/app-shell";
import { AmbientBackground } from "@/components/layout/ambient-background";
import { Toaster } from "sonner";
import { Roboto_Slab, Noto_Sans } from "next/font/google";
import { cn } from "@/lib/utils";

const notoSansHeading = Noto_Sans({subsets:['latin'],variable:'--font-heading'});

const robotoSlab = Roboto_Slab({subsets:['latin'],variable:'--font-serif'});

export const metadata: Metadata = {
  title: "GearUp — Premium Gear Rental & Classified Ads",
  description:
    "Discover, rent, and list high-end cinema cameras, drones, audio rigs, and outdoor equipment directly from trusted creators.",
  keywords: [
    "gear rental",
    "camera rental",
    "classified ads",
    "cinema gear",
    "drone rental",
    "audio gear",
    "gearup",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={cn("lenis", "font-sans", notoSansHeading.variable)}>
      <body className="antialiased min-h-screen flex flex-col bg-[#f1f5f9] text-slate-800 selection:bg-primary/20 selection:text-primary">
        <LenisProvider>
          <AuthProvider>
            <AmbientBackground />
            <AppShell>
              {children}
            </AppShell>
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
