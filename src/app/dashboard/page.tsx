"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Category, GearItem, RentalOrder } from "@/types";
import { categoryApi, gearApi, rentalApi } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { formatPrice, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Calendar,
  Package,
  PlusCircle,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ShieldCheck,
  User,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Tag,
  Camera,
  Sparkles,
} from "lucide-react";

import { createGearSchema } from "@/lib/validations";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();

  const initialTab = searchParams.get("tab") || "my-rentals";
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Data states
  const [myRentals, setMyRentals] = useState<RentalOrder[]>([]);
  const [providerRentals, setProviderRentals] = useState<RentalOrder[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // New Gear Form State
  const [newGearName, setNewGearName] = useState("");
  const [newGearBrand, setNewGearBrand] = useState("");
  const [newGearCategory, setNewGearCategory] = useState("");
  const [newGearPrice, setNewGearPrice] = useState("");
  const [newGearStock, setNewGearStock] = useState("1");
  const [newGearImage, setNewGearImage] = useState("");
  const [newGearDesc, setNewGearDesc] = useState("");
  const [gearErrors, setGearErrors] = useState<Record<string, string>>({});
  const [submittingGear, setSubmittingGear] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  // Load Rentals and Categories
  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadDashboardData() {
      try {
        setLoading(true);
        const cats = await categoryApi.getCategories();
        setCategories(cats);
        if (cats.length > 0 && !newGearCategory) {
          setNewGearCategory(cats[0].id);
        }

        // Load customer rentals
        try {
          const custRentals = await rentalApi.getMyRentals();
          setMyRentals(custRentals);
        } catch (e) {
          console.warn("Could not load customer rentals", e);
        }

        // If provider or admin, load provider rentals
        if (user?.role === "PROVIDER" || user?.role === "ADMIN") {
          try {
            const provRentals = await rentalApi.getProviderRentals();
            setProviderRentals(provRentals);
          } catch (e) {
            console.warn("Could not load provider rentals", e);
          }
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [isAuthenticated, user?.role]);

  // Handle Cancel Rental
  const handleCancelRental = async (rentalId: string) => {
    if (!confirm("Are you sure you want to cancel this rental booking?")) return;
    try {
      await rentalApi.cancelRental(rentalId);
      toast.success("Rental cancelled successfully.");
      setMyRentals((prev) =>
        prev.map((r) => (r.id === rentalId ? { ...r, status: "CANCELED" } : r))
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel rental.");
    }
  };

  // Handle Provider Status Update
  const handleUpdateStatus = async (
    rentalId: string,
    nextStatus: "CONFIRMED" | "PICKED_UP" | "RETURNED"
  ) => {
    try {
      await rentalApi.updateProviderRentalStatus(rentalId, nextStatus);
      toast.success(`Booking status changed to ${nextStatus}!`);
      setProviderRentals((prev) =>
        prev.map((r) => (r.id === rentalId ? { ...r, status: nextStatus } : r))
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update booking status.");
    }
  };

  // Handle Create New Gear Item
  const handlePostGear = async (e: React.FormEvent) => {
    e.preventDefault();
    setGearErrors({});

    if (!user || user.role !== "PROVIDER") {
      toast.error("Only registered Providers can post new classified gear. Switch or register as Provider.");
      return;
    }

    // Zod Validation
    const validationResult = createGearSchema.safeParse({
      name: newGearName,
      brand: newGearBrand,
      categoryId: newGearCategory,
      pricePerDay: Number(newGearPrice),
      stock: Number(newGearStock),
      imageUrl: newGearImage.trim() ? newGearImage.trim() : undefined,
      description: newGearDesc,
    });

    if (!validationResult.success) {
      const formattedErrors: Record<string, string> = {};
      for (const issue of validationResult.error.issues) {
        if (issue.path[0]) {
          formattedErrors[issue.path[0] as string] = issue.message;
        }
      }
      setGearErrors(formattedErrors);
      toast.error("Please correct the form fields highlighted below.");
      return;
    }

    try {
      setSubmittingGear(true);
      const slug =
        newGearName.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
        "-" +
        Math.floor(Math.random() * 10000);

      await gearApi.createGear({
        name: newGearName,
        slug,
        brand: newGearBrand || "Professional",
        categoryId: newGearCategory,
        pricePerDay: Number(newGearPrice),
        stock: Number(newGearStock),
        imageUrl:
          newGearImage ||
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
        description: newGearDesc,
        isAvailable: true,
      });

      toast.success("Gear listed successfully in the public catalog!");
      // Reset form
      setNewGearName("");
      setNewGearBrand("");
      setNewGearPrice("");
      setNewGearDesc("");
      setNewGearImage("");
      setActiveTab("my-rentals");
    } catch (err: any) {
      toast.error(err.message || "Failed to post gear.");
    } finally {
      setSubmittingGear(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-semibold text-slate-500">Loading your GearUp account...</p>
      </div>
    );
  }

  // Status badge styling helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PLACED":
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold">Placed</span>;
      case "CONFIRMED":
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold">Confirmed</span>;
      case "PAID":
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">Paid</span>;
      case "PICKED_UP":
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full text-xs font-bold">Picked Up</span>;
      case "RETURNED":
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-xs font-bold">Returned</span>;
      case "CANCELED":
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full text-xs font-bold">Canceled</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Profile Strip */}
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-slate-200/80 shadow-[0_15px_40px_-15px_rgba(15,23,42,0.06)] mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-2xl font-black shadow-md shadow-blue-500/25">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {user?.name}
              </h1>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email} • Active Member</p>
          </div>
        </div>

        {/* Quick summary chips */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">My Bookings</span>
            <p className="text-lg font-black text-slate-900">{myRentals.length}</p>
          </div>
          {user?.role === "PROVIDER" && (
            <div className="px-4 py-2 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Client Requests</span>
              <p className="text-lg font-black text-blue-600">{providerRentals.length}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200/80 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("my-rentals")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === "my-rentals"
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
              : "bg-white text-slate-600 hover:bg-slate-100/80 border border-slate-200/80"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>My Hires & Rentals ({myRentals.length})</span>
        </button>

        {(user?.role === "PROVIDER" || user?.role === "ADMIN") && (
          <button
            onClick={() => setActiveTab("provider-requests")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === "provider-requests"
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                : "bg-white text-slate-600 hover:bg-slate-100/80 border border-slate-200/80"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Studio Orders ({providerRentals.length})</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab("post-gear")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === "post-gear"
              ? "bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 shadow-md shadow-amber-400/25"
              : "bg-white text-slate-600 hover:bg-slate-100/80 border border-slate-200/80"
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Gear / Classified Ad</span>
        </button>
      </div>

      {/* TAB 1: MY RENTALS (Customer) */}
      {activeTab === "my-rentals" && (
        <div className="space-y-4">
          {myRentals.length > 0 ? (
            myRentals.map((rental) => (
              <div
                key={rental.id}
                className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Gear Info */}
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                    <Image
                      src={
                        rental.rentalItems[0]?.gearItem?.imageUrl ||
                        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80"
                      }
                      alt="Gear Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusBadge(rental.status)}
                      <span className="text-xs text-slate-400 font-mono">
                        #{rental.id.slice(0, 8)}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900">
                      {rental.rentalItems[0]?.gearItem?.name || "Equipment Rental"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Dates: <span className="font-semibold text-slate-700">{formatDate(rental.startTime)} → {formatDate(rental.endTime)}</span>
                    </p>
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Amount</span>
                    <p className="text-xl font-black text-slate-900">{formatPrice(rental.totalAmount)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {rental.status === "PLACED" && (
                      <button
                        onClick={() => handleCancelRental(rental.id)}
                        className="px-4 py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
                      >
                        Cancel Booking
                      </button>
                    )}
                    <Link
                      href={`/gears/${rental.rentalItems[0]?.gearItemId}`}
                      className="p-2.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                      title="View Gear Item"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-[2.5rem] p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">No Active Bookings</h3>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                You haven't reserved any gear yet. Discover cinema cameras, lighting kits, and optics now!
              </p>
              <Link
                href="/gears"
                className="px-6 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20"
              >
                Browse Classified Ads
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PROVIDER RENTAL REQUESTS */}
      {activeTab === "provider-requests" && (
        <div className="space-y-4">
          {providerRentals.length > 0 ? (
            providerRentals.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.04)] space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(order.status)}
                    <span className="text-xs font-mono text-slate-400">Ref: #{order.id}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Booked by: <span className="font-bold text-slate-800">{order.customer?.name}</span> ({order.customer?.email})
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-base text-slate-900">
                      {order.rentalItems[0]?.gearItem?.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Schedule: {formatDate(order.startTime)} to {formatDate(order.endTime)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Payout</span>
                      <p className="text-lg font-black text-emerald-600">{formatPrice(order.totalAmount)}</p>
                    </div>

                    {/* Status Action Buttons for Provider */}
                    {order.status === "PLACED" && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "CONFIRMED")}
                        className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20"
                      >
                        Confirm Booking
                      </button>
                    )}
                    {order.status === "PAID" && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "PICKED_UP")}
                        className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                      >
                        Mark Picked Up
                      </button>
                    )}
                    {order.status === "PICKED_UP" && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "RETURNED")}
                        className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                      >
                        Mark Returned
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-[2.5rem] p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">No Orders Received Yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your listings will appear here when clients submit rental orders.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: POST NEW GEAR / CLASSIFIED AD */}
      {activeTab === "post-gear" && (
        <div className="bg-white rounded-[2.8rem] p-6 sm:p-10 border border-slate-200/90 shadow-[0_25px_65px_-15px_rgba(15,23,42,0.07)] max-w-2xl mx-auto">
          
          {/* Header */}
          <div className="mb-7 pb-6 border-b border-slate-100">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold tracking-wide uppercase mb-2">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Verified Creator Listing</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Post Equipment for Hire
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-md leading-relaxed">
              List your cinema cameras, lenses, drones, or studio lighting to start accepting bookings from verified creators.
            </p>
          </div>

          <form onSubmit={handlePostGear} className="space-y-6">
            
            {/* SECTION 1: BASIC INFO */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px]">1</span>
                <span>Equipment Details</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Gear Title / Model Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sony FX3 Cinema Line Camera Kit"
                  value={newGearName}
                  onChange={(e) => {
                    setNewGearName(e.target.value);
                    if (gearErrors.name) setGearErrors({ ...gearErrors, name: "" });
                  }}
                  className={`w-full text-xs font-medium px-4 py-3 rounded-xl border transition-all ${
                    gearErrors.name
                      ? "border-red-400 focus:ring-4 focus:ring-red-100 bg-red-50/20"
                      : "border-slate-200/90 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/15"
                  } focus:outline-none`}
                />
                {gearErrors.name && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1.5 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{gearErrors.name}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Brand / Manufacturer <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sony, Canon, DJI, RED"
                    value={newGearBrand}
                    onChange={(e) => {
                      setNewGearBrand(e.target.value);
                      if (gearErrors.brand) setGearErrors({ ...gearErrors, brand: "" });
                    }}
                    className={`w-full text-xs font-medium px-4 py-3 rounded-xl border transition-all ${
                      gearErrors.brand
                        ? "border-red-400 focus:ring-4 focus:ring-red-100 bg-red-50/20"
                        : "border-slate-200/90 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/15"
                    } focus:outline-none`}
                  />
                  {gearErrors.brand && (
                    <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1.5 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{gearErrors.brand}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newGearCategory}
                    onChange={(e) => {
                      setNewGearCategory(e.target.value);
                      if (gearErrors.categoryId) setGearErrors({ ...gearErrors, categoryId: "" });
                    }}
                    className={`w-full text-xs font-bold px-4 py-3 rounded-xl border transition-all ${
                      gearErrors.categoryId
                        ? "border-red-400 focus:ring-4 focus:ring-red-100 bg-red-50/20"
                        : "border-slate-200/90 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/15"
                    } focus:outline-none text-slate-800`}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {gearErrors.categoryId && (
                    <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1.5 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{gearErrors.categoryId}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 2: PRICING & STOCK */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px]">2</span>
                <span>Pricing & Stock Availability</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Daily Hire Rate (USD $) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      placeholder="e.g. 85"
                      value={newGearPrice}
                      onChange={(e) => {
                        setNewGearPrice(e.target.value);
                        if (gearErrors.pricePerDay) setGearErrors({ ...gearErrors, pricePerDay: "" });
                      }}
                      className={`w-full text-xs font-medium pl-8 pr-4 py-3 rounded-xl border transition-all ${
                        gearErrors.pricePerDay
                          ? "border-red-400 focus:ring-4 focus:ring-red-100 bg-red-50/20"
                          : "border-slate-200/90 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/15"
                      } focus:outline-none`}
                    />
                  </div>
                  {gearErrors.pricePerDay && (
                    <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1.5 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{gearErrors.pricePerDay}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Units Available in Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newGearStock}
                    onChange={(e) => {
                      setNewGearStock(e.target.value);
                      if (gearErrors.stock) setGearErrors({ ...gearErrors, stock: "" });
                    }}
                    className={`w-full text-xs font-medium px-4 py-3 rounded-xl border transition-all ${
                      gearErrors.stock
                        ? "border-red-400 focus:ring-4 focus:ring-red-100 bg-red-50/20"
                        : "border-slate-200/90 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/15"
                    } focus:outline-none`}
                  />
                  {gearErrors.stock && (
                    <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1.5 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{gearErrors.stock}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 3: MEDIA & INCLUSIONS */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px]">3</span>
                <span>Media & Inclusions</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  High-Res Image URL (Direct Link / Unsplash)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newGearImage}
                  onChange={(e) => {
                    setNewGearImage(e.target.value);
                    if (gearErrors.imageUrl) setGearErrors({ ...gearErrors, imageUrl: "" });
                  }}
                  className={`w-full text-xs font-medium px-4 py-3 rounded-xl border transition-all ${
                    gearErrors.imageUrl
                      ? "border-red-400 focus:ring-4 focus:ring-red-100 bg-red-50/20"
                      : "border-slate-200/90 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/15"
                  } focus:outline-none`}
                />
                {gearErrors.imageUrl && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1.5 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{gearErrors.imageUrl}</span>
                  </p>
                )}
                {newGearImage.startsWith("http") && (
                  <div className="mt-2.5 flex items-center gap-3.5 p-2.5 bg-slate-50/80 rounded-2xl border border-slate-200/70">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                      <img src={newGearImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Valid Media URL
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">Cover photo loaded successfully</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Description & Package Inclusions <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="List all included accessories (batteries, dual charger, fast SD cards, cage, case, cables)..."
                  value={newGearDesc}
                  onChange={(e) => {
                    setNewGearDesc(e.target.value);
                    if (gearErrors.description) setGearErrors({ ...gearErrors, description: "" });
                  }}
                  className={`w-full text-xs font-medium p-3.5 rounded-xl border transition-all ${
                    gearErrors.description
                      ? "border-red-400 focus:ring-4 focus:ring-red-100 bg-red-50/20"
                      : "border-slate-200/90 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/15"
                  } focus:outline-none`}
                />
                {gearErrors.description && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1.5 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{gearErrors.description}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submittingGear}
              className="w-full py-3.5 px-6 rounded-full font-bold text-xs bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 transition-all shadow-lg shadow-amber-400/25 hover:shadow-xl active:scale-[0.99] flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {submittingGear ? (
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 text-slate-950" />
                  <span>Publish Classified Ad Live</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
