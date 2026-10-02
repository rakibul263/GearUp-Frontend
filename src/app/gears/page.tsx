"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Category, GearItem } from "@/types";
import { categoryApi, gearApi } from "@/lib/api";
import { GearCard } from "@/components/gear/gear-card";
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  Layers,
  Sparkles,
  ArrowUpDown,
} from "lucide-react";

function GearsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL query params
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "all";
  const initialBrand = searchParams.get("brand") || "all";

  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [gears, setGears] = useState<GearItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Load Categories once
  useEffect(() => {
    categoryApi.getCategories().then(setCategories).catch(console.error);
  }, []);

  // Fetch gears when filters change
  useEffect(() => {
    async function fetchGears() {
      try {
        setLoading(true);
        const queryParams: any = {
          page,
          limit: 12,
        };
        if (search.trim()) queryParams.search = search.trim();
        if (selectedCategory !== "all") {
          const matchedCat = categories.find(
            (c) => c.id === selectedCategory || c.slug === selectedCategory
          );
          queryParams.categoryId = matchedCat ? matchedCat.id : selectedCategory;
        }
        if (selectedBrand !== "all") queryParams.brand = selectedBrand;
        if (onlyAvailable) queryParams.isAvailable = true;

        const res = await gearApi.getGears(queryParams);
        
        let items = res.data;
        if (sortBy === "price-asc") {
          items = [...items].sort((a, b) => Number(a.pricePerDay) - Number(b.pricePerDay));
        } else if (sortBy === "price-desc") {
          items = [...items].sort((a, b) => Number(b.pricePerDay) - Number(a.pricePerDay));
        }

        setGears(items);
        setTotalPages(res.meta.totalPages || 1);
        setTotalCount(res.meta.total || items.length);
      } catch (err) {
        console.error("Error fetching gears:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchGears();
  }, [search, selectedCategory, selectedBrand, onlyAvailable, sortBy, page]);

  // Unique brands list
  const brands = ["all", "Sony", "Canon", "DJI", "Aputure", "Sennheiser", "Rode", "Trek"];

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedBrand("all");
    setOnlyAvailable(false);
    setSortBy("featured");
    setPage(1);
    router.push("/gears");
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Banner Header */}
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 border border-slate-200/80 shadow-[0_15px_40px_-15px_rgba(15,23,42,0.06)] mb-8">
        <div className="max-w-2xl">
          <span className="text-xs font-bold text-primary tracking-wider uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            Full Classified Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Browse All Gear & Equipment
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Explore verified cinema kits, audio setups, optics, and flight gear available for on-demand booking.
          </p>
        </div>

        {/* Filter Controls Row */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by keyword..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs font-medium pl-9 pr-8 py-2.5 rounded-full border border-slate-200/90 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs font-semibold px-4 py-2.5 rounded-full border border-slate-200/90 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary text-slate-700 transition-all"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Dropdown */}
          <div>
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs font-semibold px-4 py-2.5 rounded-full border border-slate-200/90 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary text-slate-700 transition-all"
            >
              <option value="all">All Brands</option>
              {brands.filter((b) => b !== "all").map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full text-xs font-semibold px-4 py-2.5 rounded-full border border-slate-200/90 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary text-slate-700 transition-all"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* Quick filter pills */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyAvailable(!onlyAvailable)}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                onlyAvailable
                  ? "bg-emerald-600 text-white font-semibold shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {onlyAvailable ? "✓ Ready for Pickup Only" : "Show In-Stock Only"}
            </button>

            {(search || selectedCategory !== "all" || selectedBrand !== "all" || onlyAvailable) && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-1.5 rounded-full text-red-600 hover:bg-red-50 font-medium transition-colors"
              >
                Reset All Filters
              </button>
            )}
          </div>

          <div className="text-slate-400 font-medium">
            Found <span className="text-slate-900 font-bold">{totalCount}</span> items
          </div>
        </div>

      </div>

      {/* Grid of Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm animate-pulse space-y-3">
              <div className="w-full aspect-[4/3] bg-slate-200 rounded-[1.6rem]" />
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-5 bg-slate-200 rounded w-3/4" />
              <div className="h-8 bg-slate-200 rounded-full w-full" />
            </div>
          ))}
        </div>
      ) : gears.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gears.map((gear) => (
              <GearCard key={gear.id} gear={gear} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-3">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-2.5 rounded-full bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-bold text-slate-700 px-4 py-2 rounded-full bg-white border border-slate-200">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-2.5 rounded-full bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-[2.5rem] p-16 text-center border border-slate-200 max-w-lg mx-auto shadow-sm">
          <Camera className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800">No Gear Listings Found</h3>
          <p className="text-xs text-slate-500 mt-2 mb-6 max-w-sm mx-auto">
            Try adjusting your search keywords, clear active category filters, or explore other equipment.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all"
          >
            Clear All Filters
          </button>
        </div>
      )}

    </div>
  );
}

export default function GearsPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      }
    >
      <GearsContent />
    </Suspense>
  );
}
