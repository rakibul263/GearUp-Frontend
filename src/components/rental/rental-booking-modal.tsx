"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GearItem } from "@/types";
import { useAuth } from "@/context/auth-context";
import { rentalApi } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { createRentalSchema } from "@/lib/validations";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import {
  X,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
} from "lucide-react";

interface RentalBookingModalProps {
  gear: GearItem;
  isOpen: boolean;
  onClose: () => void;
}

export function RentalBookingModal({
  gear,
  isOpen,
  onClose,
}: RentalBookingModalProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // Tomorrow as default start, +2 days as default end
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultStart = tomorrow.toISOString().split("T")[0];

  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 3);
  const defaultEnd = dayAfter.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState("");
  const [successOrder, setSuccessOrder] = useState<any | null>(null);

  if (!isOpen) return null;

  // Calculate rental days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const pricePerDay = Number(gear.pricePerDay);
  const subtotal = pricePerDay * quantity * diffDays;
  const serviceFee = Math.round(subtotal * 0.05); // 5% marketplace fee
  const total = subtotal + serviceFee;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setDateError("");

    if (!isAuthenticated) {
      toast.error("Please sign in as a customer to book equipment.");
      router.push(`/login?redirect=/gears/${gear.id}`);
      return;
    }

    if (user?.role !== "CUSTOMER") {
      toast.error("You are logged in as a " + user?.role + ". Please use a Customer account to rent gear.");
      return;
    }

    // Zod validation
    const validationResult = createRentalSchema.safeParse({
      startDate,
      endDate,
      quantity,
      gearItemId: gear.id,
    });

    if (!validationResult.success) {
      const issue = validationResult.error.issues[0];
      const msg = issue?.message || "Invalid rental duration";
      setDateError(msg);
      toast.error(msg);
      return;
    }

    try {
      setLoading(true);
      // Backend expects ISO strings or Date format for startDate and endDate
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
      setSuccessOrder(order);

      // Trigger Confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      toast.success("Rental reserved successfully! Booking ID: " + order.id.slice(0, 8));
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to book gear. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!successOrder ? (
          <div>
            {/* Header */}
            <div className="mb-6">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                Instant Reservation
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-2 tracking-tight">
                Book Equipment Hire
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Select your rental duration to verify availability with verified provider.
              </p>
            </div>

            {/* Gear Summary Strip */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50/90 border border-slate-200/80 mb-5">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                <Image
                  src={gear.imageUrl || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80"}
                  alt={gear.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-slate-900 truncate">{gear.name}</h4>
                <p className="text-xs text-slate-500">{gear.brand || "Professional Gear"}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-black text-primary">{formatPrice(gear.pricePerDay)}/day</span>
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                    {gear.stock} units ready
                  </span>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleBooking} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
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

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Quantity Required (Max: {gear.stock})
                </label>
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

              {/* Price Calculation Summary */}
              <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/70 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>{formatPrice(pricePerDay)} × {quantity} unit × {diffDays} {diffDays === 1 ? "day" : "days"}</span>
                  <span className="font-semibold text-slate-800">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Service & Equipment Protection Fee (5%)</span>
                  <span className="font-semibold text-slate-800">{formatPrice(serviceFee)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                  <span>Estimated Total</span>
                  <span className="text-primary font-black text-base">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Security info */}
              <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-primary/5 p-2.5 rounded-xl border border-primary/15">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <span>No charges until provider confirms availability. Free cancellation up to 24h prior.</span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-6 rounded-full font-bold text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Confirm & Send Rental Request</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Booking Success Screen */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Booking Placed!
            </h3>
            <p className="text-sm text-slate-600 max-w-xs mx-auto mb-6">
              Your rental request for <span className="font-semibold text-slate-800">{gear.name}</span> has been dispatched to the provider.
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 text-xs text-left mb-6 space-y-1.5 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-mono font-semibold text-slate-800">{successOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  {successOrder.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Due:</span>
                <span className="font-bold text-slate-900">{formatPrice(successOrder.totalAmount)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  onClose();
                  router.push("/dashboard");
                }}
                className="w-full py-3 rounded-full text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
              >
                View in My Rentals Dashboard
              </button>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
