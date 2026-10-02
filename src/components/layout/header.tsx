"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Logo } from "@/components/ui/logo";
import {
  PlusCircle,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Search,
  ChevronDown,
} from "lucide-react";

function HeaderContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll for elevated navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const focusParam = searchParams?.get("focus");

  // Precise Active Link Determination - 100% bug free, never dual selects
  const isLinkActive = (href: string) => {
    if (href === "/") {
      return (
        pathname === "/" &&
        !searchParams?.get("category") &&
        !searchParams?.get("search")
      );
    }
    if (href === "/gears") {
      // ONLY active if on /gears and NOT on /categories
      return (
        pathname === "/gears" ||
        (pathname.startsWith("/gears/") && !pathname.startsWith("/gears/categories"))
      );
    }
    if (href === "/categories") {
      // ONLY active if on /categories
      return pathname.startsWith("/categories");
    }
    if (href === "/dashboard") {
      return pathname.startsWith("/dashboard");
    }
    return pathname === href;
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Gear", href: "/gears" },
    { name: "Categories", href: "/categories" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-3 sm:px-6 lg:px-8 pt-3.5 pb-2 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <div
          className={`backdrop-blur-2xl transition-all duration-300 rounded-full px-5 py-2.5 sm:py-3 flex items-center justify-between border ${
            scrolled
              ? "bg-white/95 border-slate-300/80 shadow-[0_16px_50px_-12px_rgba(15,23,42,0.12)]"
              : "bg-white/85 border-slate-200/80 shadow-[0_10px_35px_-10px_rgba(15,23,42,0.06)]"
          }`}
        >
          {/* Brand Logo - clean with only GearUp */}
          <Logo variant="full" size="md" />

          {/* Desktop Nav Links Pill Container */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100/90 rounded-full border border-slate-200/80 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)]">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-200 flex items-center gap-1.5 relative ${
                    active
                      ? "bg-slate-950 text-white shadow-sm shadow-slate-950/30"
                      : "text-slate-600 hover:text-slate-950 hover:bg-white/90"
                  }`}
                >
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.9)] shrink-0 animate-pulse" />
                  )}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/gears"
              className="flex items-center gap-2 px-3.5 py-1.5 text-slate-500 hover:text-slate-950 bg-slate-100/80 hover:bg-white rounded-full border border-slate-200/80 hover:border-slate-300 transition-all text-xs font-semibold shadow-2xs"
              title="Explore all classifieds"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden xl:inline text-[11px] text-slate-500">Quick search...</span>
              <kbd className="hidden xl:inline text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 font-mono shadow-2xs">⌘K</kbd>
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/80 hover:bg-slate-200/70 text-slate-800 text-xs font-bold transition-colors border border-slate-200/60"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-indigo-600 text-white flex items-center justify-center text-[11px] font-black shadow-xs">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="max-w-[100px] truncate">{user?.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Signed in as</p>
                      <p className="text-xs font-bold text-slate-900 truncate mt-0.5">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                        {user?.role}
                      </span>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard & Rentals
                    </Link>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors rounded-full hover:bg-slate-100/70"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-full shadow-sm shadow-primary/25 transition-all hover:shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Post Ad / List Item Button (Matching Reference Photo) */}
            <Link
              href="/dashboard?tab=post-gear"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-amber-400 rounded-full shadow-md shadow-amber-400/25 hover:shadow-lg hover:shadow-amber-400/35 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>Post Gear</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-3xl p-5 shadow-2xl flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 text-sm font-bold rounded-2xl transition-all flex items-center justify-between ${
                    active
                      ? "bg-slate-950 text-white shadow-md shadow-slate-950/20"
                      : "text-slate-800 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  <span>{link.name}</span>
                  {active && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                  )}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 bg-slate-50 rounded-2xl">
                    <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                    <p className="text-[11px] text-slate-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-2xl text-left transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-4 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-4 py-2.5 rounded-full bg-primary text-white text-xs font-bold shadow-sm shadow-primary/25 hover:bg-primary/90 transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
              <Link
                href="/dashboard?tab=post-gear"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center mt-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 text-xs font-black shadow-md shadow-amber-400/25 active:scale-95 transition-all"
              >
                + Post Gear / Classified Ad
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export function Header() {
  return (
    <Suspense
      fallback={
        <header className="fixed top-0 left-0 right-0 z-50 w-full px-3 sm:px-6 lg:px-8 pt-3.5 pb-2">
          <div className="max-w-7xl mx-auto h-14 rounded-full bg-white/80 backdrop-blur-xl border border-slate-200/70" />
        </header>
      }
    >
      <HeaderContent />
    </Suspense>
  );
}
