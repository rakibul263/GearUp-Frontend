"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { GearItem, Review } from "@/types";
import { gearApi, rentalApi, reviewApi } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { formatPrice } from "@/lib/utils";
import { createRentalSchema, createReviewSchema } from "@/lib/validations";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import {
  Star,
  ShieldCheck,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Share2,
  Heart,
  User,
  Info,
  Package,
  Layers,
  Building,
  Send,
  Camera,
} from "lucide-react";

export default function GearDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const gearId = params?.id as string;

  const [gear, setGear] = useState<GearItem | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);

  // Booking Form State
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultStart = tomorrow.toISOString().split("T")[0];

  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 3);
  const defaultEnd = dayAfter.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [quantity, setQuantity] = useState(1);

  // Add Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    async function loadGearAndReviews() {
      if (!gearId) return;
      try {
        setLoading(true);
        const [gearData, revsData] = await Promise.all([
          gearApi.getGearById(gearId),
          reviewApi.getGearReviews(gearId),
        ]);
        setGear(gearData);
        setReviews(revsData);
      } catch (err) {
        console.error("Error loading gear:", err);
      } finally {
        setLoading(false);
      }
    }
    loadGearAndReviews();
  }, [gearId]);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-500">Loading equipment details...</p>
      </div>
    );
  }

  if (!gear) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl p-10 border border-slate-200">
          <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-800">Gear Not Found</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6">
            The gear item you are looking for may have been delisted or relocated.
          </p>
          <Link
            href="/gears"
            className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold"
          >
            Back to All Listings
          </Link>
        </div>
      </div>
    );
  }

  // Calculate pricing
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const pricePerDay = Number(gear.pricePerDay);
  const subtotal = pricePerDay * quantity * diffDays;
  const serviceFee = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + serviceFee;

  // Handle Instant Booking
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please sign in as a customer to reserve this gear.");
      router.push(`/login?redirect=/gears/${gear.id}`);
      return;
    }

    if (user?.role !== "CUSTOMER") {
      toast.error("Only Customer accounts can book gear rentals.");
      return;
    }

    const valResult = createRentalSchema.safeParse({
      startDate,
      endDate,
      quantity,
      gearItemId: gear.id,
    });

    if (!valResult.success) {
      toast.error(valResult.error.issues[0]?.message || "Invalid booking duration");
      return;
    }

    try {
      setBookingLoading(true);
      const payload = {
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        items: [
          {
            gearItemId: gear.id,
            quantity: Number(quantity),
          },
        ],
      };

      const order = await rentalApi.createRental(payload);
      setOrderSuccess(order);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      toast.success("Rental successfully booked! Confirmation sent.");
    } catch (err: any) {
      toast.error(err.message || "Failed to book rental order.");
    } finally {
      setBookingLoading(false);
    }
  };

  // Handle Review Submission
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please sign in to submit a review.");
      return;
    }

    const reviewVal = createReviewSchema.safeParse({
      gearItemId: gear.id,
      rating: reviewRating,
      comment: reviewComment,
    });

    if (!reviewVal.success) {
      toast.error(reviewVal.error.issues[0]?.message || "Invalid review comment");
      return;
    }

    try {
      setReviewSubmitting(true);
      const newReview = await reviewApi.createReview({
        gearItemId: gear.id,
        rating: reviewRating,
        comment: reviewComment,
      });

      setReviews([newReview, ...reviews]);
      setReviewComment("");
      toast.success("Thank you! Review posted successfully.");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/gears"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Classifieds</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: gear.name, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
              }
            }}
            className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Media & Specs */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Photo Card (Styled like reference photo) */}
          <div className="relative aspect-[4/3] rounded-[2.8rem] overflow-hidden bg-white shadow-xl border border-slate-100 group">
            <Image
              src={
                gear.imageUrl ||
                "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80"
              }
              alt={gear.name}
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Top Badge */}
            <div className="absolute top-5 left-5">
              <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold shadow-md border border-white/60">
                {gear.brand || "Professional Equipment"}
              </span>
            </div>

            {/* Bottom-right price chip */}
            <div className="absolute bottom-5 right-5">
              <div className="bg-amber-400 text-slate-900 px-4 py-1.5 rounded-full font-black text-sm shadow-lg border border-amber-300 flex items-center gap-1">
                <span>{formatPrice(gear.pricePerDay)}</span>
                <span className="text-xs font-semibold opacity-85">/ day</span>
              </div>
            </div>
          </div>

          {/* Description & Overview */}
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 shadow-[0_10px_35px_-10px_rgba(15,23,42,0.05)] space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                {gear.category?.name || "Equipment"}
              </span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                {gear.stock} units available
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {gear.name}
            </h1>

            <p className="text-slate-600 text-sm leading-relaxed">
              {gear.description ||
                "Fully inspected, industry-standard equipment maintained to exact manufacturer tolerances. Suitable for demanding commercial, documentary, and creative film projects."}
            </p>

            {/* Specifications Grid */}
            {gear.specifications && Object.keys(gear.specifications).length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  Key Specifications
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(gear.specifications).map(([key, val]) => (
                    <div
                      key={key}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100"
                    >
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate">
                        {key.replace(/([A-Z])/g, " $1")}
                      </p>
                      <p className="text-xs font-bold text-slate-800 mt-0.5 truncate">
                        {String(val)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Provider Card */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-900">
                      {gear.provider?.name || "Verified Studio Partner"}
                    </h4>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-xs text-slate-500">Verified Equipment Provider</p>
                </div>
              </div>
              <div className="text-xs text-slate-400 font-medium text-right">
                <span>Member since 2026</span>
              </div>
            </div>

          </div>

          {/* Customer Reviews Section */}
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 shadow-[0_10px_35px_-10px_rgba(15,23,42,0.05)] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Reviews & Ratings</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real feedback from verified filmmakers and creators.
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span className="text-sm font-bold text-amber-900">
                  {gear.ratingSummary?.averageRating || 4.9}
                </span>
                <span className="text-xs text-amber-700">
                  ({reviews.length || gear.ratingSummary?.reviewCount || 16})
                </span>
              </div>
            </div>

            {/* Post Review Form */}
            {isAuthenticated ? (
              <form onSubmit={handleReviewSubmit} className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">Leave an Equipment Review</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-500 font-medium">Your Rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-0.5 hover:scale-125 transition-transform"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= reviewRating
                                ? "text-amber-500 fill-amber-400"
                                : "text-slate-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <textarea
                  rows={2}
                  placeholder="Share details about gear condition, optical performance, or handover experience..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                  className="w-full text-xs p-3.5 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all outline-none"
                />
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="px-5 py-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-sm shadow-primary/25 flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Verified Review</span>
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50/80 text-xs text-slate-600 border border-slate-200/70 flex items-center justify-between">
                <span>Rented this equipment? Share your feedback for fellow creators.</span>
                <Link href="/login" className="font-bold text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-3 pt-2">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl border border-slate-100 bg-white space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">
                          {rev.user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <span className="text-xs font-bold text-slate-800">{rev.user?.name || "Verified Creator"}</span>
                      </div>
                      <div className="flex items-center text-amber-500 text-xs">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">
                  No written reviews yet. Be the first to review!
                </p>
              )}
            </div>

          </div>

        </div>

        {/* Right Column: Sticky Booking Widget */}
        <div className="lg:col-span-5 sticky top-24">
          
          <div className="bg-white rounded-[2.8rem] p-6 sm:p-8 border border-slate-200/90 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.08)]">
            
            {!orderSuccess ? (
              <form onSubmit={handleBooking} className="space-y-5">
                
                {/* Price Display */}
                <div className="flex items-baseline justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-medium text-slate-400">Daily Hire Rate</span>
                    <div className="text-3xl font-black text-slate-900 mt-0.5">
                      {formatPrice(gear.pricePerDay)}
                      <span className="text-xs font-normal text-slate-500"> / 24 hours</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    Available Now
                  </span>
                </div>

                {/* Dates */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Pickup Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Return Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      min={startDate}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Units Needed
                    </label>
                    <span className="text-xs text-slate-400 font-medium">Available: {gear.stock}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={gear.stock}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(gear.stock, Number(e.target.value))))}
                        className="w-12 text-xs font-bold py-2 text-center border-none outline-none focus:ring-0"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(gear.stock, quantity + 1))}
                        className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-slate-500">
                      Duration: <span className="font-bold text-slate-800">{diffDays} {diffDays === 1 ? "day" : "days"}</span>
                    </span>
                  </div>
                </div>

                {/* Dynamic Price Breakdown */}
                <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/70 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>{formatPrice(pricePerDay)} × {quantity} unit × {diffDays} {diffDays === 1 ? "day" : "days"}</span>
                    <span className="font-semibold text-slate-800">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Security & Platform Fee (5%)</span>
                    <span className="font-semibold text-slate-800">{formatPrice(serviceFee)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                    <span>Total Amount</span>
                    <span className="text-primary font-black text-xl">{formatPrice(totalAmount)}</span>
                  </div>
                </div>

                {/* Security Note */}
                <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-primary/5 p-3 rounded-xl border border-primary/15">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                  <span>Instant reservation. Confirmation and pickup location provided immediately after provider accepts.</span>
                </div>

                {/* Book Action */}
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full py-3.5 px-6 rounded-full font-bold text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
                >
                  {bookingLoading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>Instant Reserve This Gear</span>
                    </>
                  )}
                </button>

              </form>
            ) : (
              /* Success Card */
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Booking Confirmed!</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Your rental order has been placed successfully in the database.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 text-xs text-left space-y-2 border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Order Ref:</span>
                    <span className="font-mono font-bold text-slate-800">{orderSuccess.id.slice(0, 12)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duration:</span>
                    <span className="font-semibold text-slate-800">{startDate} to {endDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total:</span>
                    <span className="font-bold text-blue-600">{formatPrice(orderSuccess.totalAmount)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="w-full py-3 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                  >
                    Go to Customer Dashboard
                  </button>
                  <button
                    onClick={() => setOrderSuccess(null)}
                    className="w-full py-2.5 rounded-full text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Make Another Booking
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
