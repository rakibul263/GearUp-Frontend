import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { ShieldCheck, Heart, Sparkles, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 mt-20 pt-16 pb-12 border-t border-slate-200/60 bg-white/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="full" size="lg" />
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              The premier marketplace for peer-to-peer and studio equipment rentals.
              Rent professional cinema cameras, drones, lighting, and audio equipment with guaranteed verified security.
            </p>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-600 pt-2">
              <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Providers</span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100">
                <Sparkles className="w-3.5 h-3.5" />
                <span>100% Insured Bookings</span>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 tracking-wide uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link href="/gears" className="hover:text-blue-600 transition-colors">
                  All Classified Ads
                </Link>
              </li>
              <li>
                <Link href="/gears?brand=Sony" className="hover:text-blue-600 transition-colors">
                  Sony Alpha Gear
                </Link>
              </li>
              <li>
                <Link href="/gears?brand=DJI" className="hover:text-blue-600 transition-colors">
                  DJI Drones & Gimbals
                </Link>
              </li>
              <li>
                <Link href="/gears?brand=Canon" className="hover:text-blue-600 transition-colors">
                  Canon Cinema Kits
                </Link>
              </li>
              <li>
                <Link href="/gears" className="hover:text-blue-600 transition-colors">
                  Latest Listings
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 tracking-wide uppercase mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link href="/gears?category=cameras-cinema" className="hover:text-blue-600 transition-colors">
                  Cameras & Cinema
                </Link>
              </li>
              <li>
                <Link href="/gears?category=lenses-optics" className="hover:text-blue-600 transition-colors">
                  Lenses & Optics
                </Link>
              </li>
              <li>
                <Link href="/gears?category=drones-aerial" className="hover:text-blue-600 transition-colors">
                  Drones & Aerial
                </Link>
              </li>
              <li>
                <Link href="/gears?category=lighting-studio" className="hover:text-blue-600 transition-colors">
                  Lighting & Studio
                </Link>
              </li>
              <li>
                <Link href="/gears?category=audio-mics" className="hover:text-blue-600 transition-colors">
                  Audio & Microphones
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Portal */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 tracking-wide uppercase mb-4">
              Account & Post
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link href="/dashboard?tab=post-gear" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  + Post New Gear / Ad
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-blue-600 transition-colors">
                  My Active Rentals
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-blue-600 transition-colors">
                  Customer Sign In
                </Link>
              </li>
              <li>
                <Link href="/register?role=PROVIDER" className="hover:text-blue-600 transition-colors">
                  Become a Provider
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-blue-600 transition-colors">
                  Provider Studio Portal
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} GearUp Classifieds Inc. All rights reserved.</p>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <Link href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">Trust & Safety</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
