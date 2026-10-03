"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Category } from "@/types";
import { categoryApi } from "@/lib/api";
import {
  Camera,
  Aperture,
  Zap,
  Compass,
  Tv,
  Mic,
  Layers,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Search,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const cats = await categoryApi.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const getCategoryTheme = (slug: string) => {
    switch (slug) {
      case "cameras-cinema":
        return {
          icon: <Camera className="w-6 h-6" />,
          gradient: "from-blue-600 via-indigo-600 to-slate-900",
          accentBg: "bg-blue-50 text-blue-700 border-blue-200/60",
          highlight: "Popular for Indie Cinema & Commercials",
          tags: ["Sony FX3", "RED Komodo", "Canon C70", "Blackmagic 6K"],
          sampleImg: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
        };
      case "lenses-optics":
        return {
          icon: <Aperture className="w-6 h-6" />,
          gradient: "from-cyan-600 via-teal-600 to-slate-900",
          accentBg: "bg-cyan-50 text-cyan-700 border-cyan-200/60",
          highlight: "Cine Zooms, Anamorphics & Primes",
          tags: ["Sony GM 24-70mm", "Cooke Anamorphic", "Sigma Cine Art"],
          sampleImg: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80",
        };
      case "lighting-studio":
        return {
          icon: <Zap className="w-6 h-6" />,
          gradient: "from-amber-500 via-orange-600 to-slate-900",
          accentBg: "bg-amber-50 text-amber-800 border-amber-200/60",
          highlight: "High Output COB LEDs & Softboxes",
          tags: ["Aputure 600d Pro", "Nanlite Pavotube", "Amaran 200x"],
          sampleImg: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80",
        };
      case "drones-aerial":
        return {
          icon: <Compass className="w-6 h-6" />,
          gradient: "from-sky-500 via-blue-600 to-indigo-900",
          accentBg: "bg-sky-50 text-sky-700 border-sky-200/60",
          highlight: "Licensed Drone Flight Packages",
          tags: ["DJI Inspire 3", "Mavic 3 Cine", "DJI Avata FPV"],
          sampleImg: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80",
        };
      case "gimbals-rigs":
        return {
          icon: <Tv className="w-6 h-6" />,
          gradient: "from-purple-600 via-violet-600 to-slate-900",
          accentBg: "bg-purple-50 text-purple-700 border-purple-200/60",
          highlight: "3-Axis Stabilizers & Car Mounts",
          tags: ["DJI RS 3 Pro", "Easyrig Vario 5", "Tilta Hydra Alien"],
          sampleImg: "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&w=600&q=80",
        };
      case "audio-mics":
        return {
          icon: <Mic className="w-6 h-6" />,
          gradient: "from-emerald-600 via-teal-700 to-slate-900",
          accentBg: "bg-emerald-50 text-emerald-800 border-emerald-200/60",
          highlight: "Broadcast Audio & Field Recorders",
          tags: ["Sennheiser MKH416", "DJI Mic 2", "Zoom F6 32-Bit"],
          sampleImg: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80",
        };
      default:
        return {
          icon: <Layers className="w-6 h-6" />,
          gradient: "from-slate-700 via-slate-800 to-slate-950",
          accentBg: "bg-slate-50 text-slate-700 border-slate-200/60",
          highlight: "Studio & Production Essentials",
          tags: ["C-Stands", "V-Mount Batteries", "Wireless Transmitters"],
          sampleImg: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
        };
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Banner Section */}
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 border border-slate-200/80 shadow-[0_15px_40px_-15px_rgba(15,23,42,0.06)] mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Production Equipment Catalog</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
              Gear Categories
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-3 leading-relaxed">
              Explore specialized camera kits, cinema lenses, lighting setups, motorized gimbals, and broadcast audio equipment categorized for every creative production.
            </p>
          </div>

          {/* Quick Search & Filter in Categories */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Find category..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full text-xs font-medium pl-9 pr-4 py-3 rounded-full border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary transition-all"
              />
            </div>
            <Link
              href="/gears"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <span>View All Classifieds</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Live Category Trust Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">All categories checked & sensor-calibrated</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
            <span className="font-semibold">Zero deposit options on verified gear listings</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-600">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="font-semibold">Same-day pickup available in Dhaka studio hubs</span>
          </div>
        </div>
      </div>

      {/* Grid of Categories */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm animate-pulse space-y-4"
            >
              <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
              <div className="h-5 bg-slate-200 rounded w-1/2" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-9 bg-slate-200 rounded-xl" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => {
            const theme = getCategoryTheme(cat.slug);
            const itemCount = (cat as any)._count?.gearItems ?? 0;

            return (
              <div
                key={cat.id}
                className="group relative bg-white rounded-[2.2rem] p-6 border border-slate-200/80 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.05)] hover:shadow-[0_20px_50px_-15px_rgba(15,23,42,0.12)] hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Header Row with Icon and Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.gradient} p-0.5 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}
                    >
                      <div className="w-full h-full rounded-[14px] bg-white/10 backdrop-blur-xs flex items-center justify-center">
                        {theme.icon}
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-black border border-slate-200/70">
                        {itemCount} {itemCount === 1 ? "Item" : "Items"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold mt-1">
                        Active Listings
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1.5 line-clamp-2 leading-relaxed">
                    {cat.description || "Browse top-tier cinematic equipment and verified classified ads in this category."}
                  </p>

                  {/* Highlight pill */}
                  <div className={`mt-3 inline-block px-3 py-1 rounded-full text-[11px] font-bold border ${theme.accentBg}`}>
                    {theme.highlight}
                  </div>

                  {/* Sample popular items in category */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Popular Gear:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {theme.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-lg bg-slate-100/90 text-slate-700 text-[11px] font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    href={`/gears?category=${cat.id}`}
                    className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 group-hover:bg-primary text-white text-xs font-black shadow-sm transition-all active:scale-95"
                  >
                    <span>Browse {cat.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom CTA Banner */}
      <div className="mt-14 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-[2.5rem] p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-amber-400 text-xs font-black uppercase tracking-wider">
              Are you a Camera Owner or Studio?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
              List Your Gear Under Any Category & Earn Daily
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-2">
              Turn your idle cinema cameras, cine lenses, and lighting equipment into recurring income with 100% verified renter ID validation and insurance protection.
            </p>
          </div>
          <Link
            href="/dashboard?tab=post-gear"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/25 transition-all shrink-0 active:scale-95"
          >
            <span>+ Post Gear / Classified Ad</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
}
