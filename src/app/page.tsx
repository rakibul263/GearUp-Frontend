"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Category, GearItem } from "@/types";
import { categoryApi, gearApi } from "@/lib/api";
import { GearCard } from "@/components/gear/gear-card";
import { formatPrice } from "@/lib/utils";
import {
  Search,
  SlidersHorizontal,
  Camera,
  Film,
  Aperture,
  Tv,
  Compass,
  Mic,
  Zap,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Star,
  CheckCircle,
  Clock,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  MapPin,
  Flame,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredGears, setFeaturedGears] = useState<GearItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [cats, gearsRes] = await Promise.all([
          categoryApi.getCategories(),
          gearApi.getGears({ limit: 8 }),
        ]);
        setCategories(cats);
        setFeaturedGears(gearsRes.data);
      } catch (err) {
        console.error("Failed to load home data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter gears based on selected category pill
  const filteredGears =
    selectedCategory === "all"
      ? featuredGears
      : featuredGears.filter(
          (g) =>
            g.category?.slug === selectedCategory ||
            g.categoryId === selectedCategory ||
            g.category?.id === selectedCategory
        );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchQuery.trim()) query.set("search", searchQuery.trim());
    if (selectedCategory !== "all") query.set("category", selectedCategory);
    router.push(`/gears?${query.toString()}`);
  };

  // Category Icon helper
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case "cameras-cinema":
        return <Camera className="w-4 h-4" />;
      case "lenses-optics":
        return <Aperture className="w-4 h-4" />;
      case "lighting-studio":
        return <Zap className="w-4 h-4" />;
      case "drones-aerial":
        return <Compass className="w-4 h-4" />;
      case "gimbals-rigs":
        return <Tv className="w-4 h-4" />;
      case "audio-mics":
        return <Mic className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative z-10 w-full min-h-screen pt-4 sm:pt-6 pb-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* ================= HERO CONTAINER ================= */}
      <section className="relative w-full rounded-[3rem] bg-white/95 backdrop-blur-3xl border border-slate-200/80 shadow-[0_30px_90px_-20px_rgba(15,23,42,0.09)] p-6 sm:p-10 lg:p-14 overflow-hidden mb-12">
        
        {/* Dynamic ambient backdrop light blooms */}
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-bl from-blue-500/12 via-indigo-500/8 to-transparent rounded-full blur-3xl pointer-events-none -mr-24 -mt-24" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-amber-400/8 to-transparent rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-400/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Search & Quick Pills */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Top Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-amber-500/10 border border-blue-500/20 text-slate-900 text-xs font-black tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span className="tracking-wider uppercase text-[11px]">Official Cinema & Creator Classifieds</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.06]">
              Rent Pro Gear. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 drop-shadow-xs">
                Shoot Masterpieces.
              </span>
            </h1>

            <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-lg">
              On-demand verified cinema cameras, anamorphic optics, Aputure lighting & DJI drones. 
              Peer-to-peer equipment rental with zero deposit options and fast Dhaka studio handover.
            </p>

            {/* Unified Compound Search & Discovery Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white rounded-2xl sm:rounded-full p-2 border border-slate-200/90 shadow-[0_15px_40px_-10px_rgba(15,23,42,0.1)] flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-xl focus-within:ring-4 focus-within:ring-blue-500/15 focus-within:border-blue-500 transition-all"
            >
              {/* Category Selector inside search */}
              <div className="flex items-center gap-1.5 pl-3.5 pr-2 py-1 border-b sm:border-b-0 sm:border-r border-slate-100 shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer pr-1"
                >
                  <option value="all">All Equipment</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug || c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Keyword Input */}
              <div className="flex-1 flex items-center gap-2 px-2">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search Sony FX3, DJI RS 3, Canon RF..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="px-6 py-3 rounded-xl sm:rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black tracking-wide transition-all shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40 active:scale-95 flex items-center justify-center gap-2 shrink-0"
              >
                <span>Find Gear</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick Popular Keywords */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
              <span className="font-extrabold text-slate-400 text-[11px] uppercase tracking-wider">Trending:</span>
              {[
                { label: "Sony FX3", q: "Sony" },
                { label: "DJI RS 3 Pro", q: "DJI" },
                { label: "Aputure 600d", q: "Aputure" },
                { label: "Canon C70", q: "Canon" },
                { label: "Sennheiser MKH", q: "Sennheiser" },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setSearchQuery(item.q);
                    router.push(`/gears?search=${item.q}`);
                  }}
                  className="px-3 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-slate-200/70 text-slate-700 text-[11px] font-semibold transition-all active:scale-95"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Live Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-[11px] leading-tight">100% Tested</p>
                  <p className="text-[10px] text-slate-400 font-medium">Cleaned Sensors</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-[11px] leading-tight">Zero Deposit</p>
                  <p className="text-[10px] text-slate-400 font-medium">For Verified IDs</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-[11px] leading-tight">Fast Handover</p>
                  <p className="text-[10px] text-slate-400 font-medium">Same-Day Pickup</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-6 relative">
            
            {/* The Main Showcase Frame */}
            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-slate-950 shadow-2xl border-4 border-white group">
              <Image
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=85"
                alt="Cinema Gear Showcase"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              
              {/* Soft overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

              {/* Top Floating Glass Badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <span className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-slate-950 text-xs font-black shadow-lg flex items-center gap-1.5 border border-white/60">
                  <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  Top Rated Classified
                </span>
                <span className="px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md text-emerald-400 text-[11px] font-bold shadow-lg flex items-center gap-1.5 border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Ready for Today
                </span>
              </div>

              {/* Bottom Card Overlay Info */}
              <div className="absolute bottom-4 inset-x-4 p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/60 shadow-2xl flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1">
                    <span>Sony Cine Master Kit</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-slate-400 font-normal">FX3 + GM 24-70mm</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-slate-900 truncate">
                    Sony FX3 Cinema Line Kit
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center text-amber-500 text-xs font-extrabold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                      4.98 (42 verified rentals)
                    </div>
                  </div>
                </div>

                {/* Right Amber Price Badge */}
                <div className="text-right shrink-0">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Day Rate</div>
                  <div className="text-xl font-black text-slate-950">
                    $45<span className="text-xs font-medium text-slate-500">/day</span>
                  </div>
                  <Link
                    href="/gears"
                    className="inline-flex items-center gap-1 mt-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black shadow-md shadow-amber-400/25 transition-all active:scale-95"
                  >
                    <span>View Ad</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

            </div>

            {/* Overlapping Bottom-Left Guarantee Floating Card */}
            <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-xl rounded-2xl p-3 shadow-xl border border-slate-200/90 hidden sm:flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Certified Dhaka Studio Hub</p>
                <p className="text-[10px] text-slate-400">Full Sensor Calibration Included</p>
              </div>
            </div>

            {/* Overlapping Top-Right Coverage Card */}
            <div className="absolute -top-3 -right-3 bg-white/95 backdrop-blur-xl rounded-2xl px-3 py-2 shadow-xl border border-slate-200/90 hidden sm:flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-[11px] font-bold text-slate-800">$50K Gear Shield</span>
            </div>

          </div>

        </div>

        {/* Live Marketplace Statistics Banner */}
        <div className="mt-12 pt-8 border-t border-slate-200/70 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div className="p-3 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <p className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">10,000+</p>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Verified Gear Items</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <p className="text-2xl sm:text-3xl font-black text-blue-600 tracking-tight">100%</p>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Insured Replacement</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <p className="text-2xl sm:text-3xl font-black text-amber-500 tracking-tight">4.98 / 5</p>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Creator Trust Rating</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <p className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">15 Mins</p>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Studio Handover</p>
          </div>
        </div>

      </section>


      {/* ================= SECONDARY TOOLBAR & CATEGORY NAV (Matching photo) ================= */}
      <section className="mb-10">
        
        {/* Upper toolbar tabs matching photo */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 px-2">
          
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="px-3 py-1.5 rounded-full bg-amber-100/70 text-amber-900 border border-amber-200/50 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Classifieds
            </span>
            <Link 
              href="/gears" 
              className="px-3 py-1.5 rounded-full hover:bg-slate-200/60 text-slate-600 transition-colors"
            >
              All Gear Items ▾
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard?tab=post-gear"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Post Classified Ad</span>
            </Link>
            <Link
              href="/gears"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span>Filter View</span>
            </Link>
          </div>

        </div>

        {/* Horizontal Category Icons Bar (Matching reference photo row) */}
        <div className="bg-white/90 backdrop-blur-md rounded-[2.2rem] p-3 border border-slate-200/70 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.05)] overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            
            {/* All Category Pill */}
            <button
              onClick={() => setSelectedCategory("all")}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                selectedCategory === "all"
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>All Equipment</span>
            </button>

            {/* Dynamic Category Pills */}
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.slug || selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {getCategoryIcon(cat.slug)}
                  <span>{cat.name}</span>
                </button>
              );
            })}

          </div>
        </div>

      </section>


      {/* ================= FEATURED LISTADS GRID (Matching reference photo) ================= */}
      <section className="mb-16">
        
        {/* Section Heading matching screenshot */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-xs font-bold tracking-widest text-blue-600 uppercase mb-2">
            Your Browse Feed
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Featured ListAds
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-2">
            Showing top rated classified gear available for daily or weekly rental.
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm animate-pulse space-y-3">
                <div className="w-full aspect-[4/3] bg-slate-200 rounded-[1.6rem]" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-5 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-8 bg-slate-200 rounded-full w-full" />
              </div>
            ))}
          </div>
        ) : filteredGears.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGears.map((gear, idx) => (
              <GearCard
                key={gear.id}
                gear={gear}
                featuredBadge={
                  idx === 0
                    ? "Popular"
                    : idx === 1
                    ? "Hot Deal"
                    : idx === 2
                    ? "Cinema Grade"
                    : undefined
                }
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto">
            <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No Gear in this Category</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Be the first to list an ad under this category!
            </p>
            <Link
              href="/dashboard?tab=post-gear"
              className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-xs font-semibold inline-block"
            >
              Post Classified Ad
            </Link>
          </div>
        )}

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            href="/gears"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-slate-900 hover:text-white text-slate-900 border border-slate-300/80 font-bold text-sm shadow-sm transition-all duration-300 active:scale-95 group"
          >
            <span>Explore All Classified Listings</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </section>


      {/* ================= HOW IT WORKS / VALUE PROPOSITION ================= */}
      <section className="mb-16">
        <div className="rounded-[2.8rem] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
          
          <div className="relative z-10 max-w-2xl mb-12">
            <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
              Simple & Transparent
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">
              How GearUp Rental Works
            </h2>
            <p className="text-slate-300 text-sm mt-3">
              We connect creators with high-end production equipment through an automated and verified workflow.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-lg shadow-blue-500/30">
                01
              </div>
              <h4 className="text-lg font-bold mb-2">Find & Reserve</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Browse our verified inventory of cinema cameras, lenses, drones, and lighting. Pick your shoot dates.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg mb-4 shadow-lg shadow-amber-400/30">
                02
              </div>
              <h4 className="text-lg font-bold mb-2">Provider Confirms</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                The equipment owner or studio inspects the order, confirms stock availability, and sets pickup logistics.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-lg shadow-emerald-500/30">
                03
              </div>
              <h4 className="text-lg font-bold mb-2">Create & Return</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pickup your gear, shoot your masterpiece with full equipment protection, and return it safely.
              </p>
            </div>

          </div>

          <div className="relative z-10 mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold">Have unused studio gear?</p>
                <p className="text-xs text-slate-400">List it on GearUp and earn passive rental income.</p>
              </div>
            </div>

            <Link
              href="/dashboard?tab=post-gear"
              className="px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors shadow-md"
            >
              List Your Gear Free
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
