"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <>
      {!isAuthPage && <Header />}
      <main className={`flex-1 relative z-10 flex flex-col ${!isAuthPage ? "pt-20 sm:pt-24" : ""}`}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </>
  );
}
