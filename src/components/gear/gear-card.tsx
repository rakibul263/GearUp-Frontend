"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GearItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Star, ShieldCheck, Sparkles, Calendar, ArrowUpRight } from "lucide-react";
import { RentalBookingModal } from "@/components/rental/rental-booking-modal";

interface GearCardProps {
  gear: GearItem;
  featuredBadge?: string;
  onBookNow?: () => void;
}

export function GearCard({ gear, featuredBadge }: GearCardProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Derive badge color and text
  const badgeText =
    featuredBadge ||
    (Number(gear.pricePerDay) > 70
      ? "Pro Cinema"
      : gear.stock < 4
      ? "Hot Deal"
      : "Verified");

  const badgeStyle =
    badgeText === "Hot Deal"
      ? "bg-rose-50 text-rose-600 border-rose-200/80"
      : badgeText === "Pro Cinema"
      ? "bg-purple-50 text-purple-600 border-purple-200/80"
      : "bg-blue-50 text-blue-600 border-blue-200/80";

  const rating = gear.ratingSummary?.averageRating || 4.9;
  const reviewsCount = gear.ratingSummary?.reviewCount || 16;

  return (
    <>
      <div className="group relative bg-white rounded-[2rem] p-3.5 border border-slate-100 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.06)] hover:shadow-[0_20px_45px_-12px_rgba(37,99,235,0.12)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between">
        
        {/* Top Image Container */}
        <div className="relative w-full aspect-[4/3] rounded-[1.6rem] overflow-hidden bg-slate-100 mb-3.5">
          {/* Top Floating Badge (Photo style) */}
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`text-[11px] font-semibold tracking-wide px-3 py-1 rounded-full border shadow-sm backdrop-blur-md ${badgeStyle}`}
            >
              {badgeText}
            </span>
          </div>

          {/* Product Image */}
          <Link href={`/gears/${gear.id}`} className="block w-full h-full">
            <Image
              src={
                gear.imageUrl ||
                "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80"
              }
              alt={gear.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </Link>

          {/* Bottom Right Price Pill (Photo style: amber pill) */}
          <div className="absolute bottom-3 right-3 z-10">
            <div className="bg-amber-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1 border border-amber-300">
              <span>{formatPrice(gear.pricePerDay)}</span>
              <span className="text-[10px] font-medium opacity-80">/day</span>
            </div>
          </div>
        </div>

        {/* Content Info */}
        <div className="px-1.5 pb-1 flex-1 flex flex-col justify-between">
          <div>
            {/* Provider / Brand dot header */}
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5 font-medium truncate text-slate-500">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                {gear.brand || gear.provider?.name || "GearUp Verified"}
              </span>
              <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 font-medium">
                {gear.stock} in stock
              </span>
            </div>

            {/* Gear Name */}
            <Link href={`/gears/${gear.id}`} className="group-hover:text-blue-600 transition-colors">
              <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1 mb-1">
                {gear.name}
              </h3>
            </Link>

            {/* Category / Specs Snippet */}
            <p className="text-xs text-slate-500 line-clamp-1 mb-3">
              {gear.description || "High-end production equipment available for daily hire."}
            </p>
          </div>

          {/* Rating & Action Row */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-auto">
            {/* Rating */}
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-800">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>{rating}</span>
              <span className="text-slate-400 font-normal text-[11px]">({reviewsCount})</span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900 hover:bg-blue-600 text-white transition-all shadow-sm active:scale-95 flex items-center gap-1"
              >
                <Calendar className="w-3 h-3" />
                Rent
              </button>
              <Link
                href={`/gears/${gear.id}`}
                className="p-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                title="View full specs"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* Booking Modal */}
      {isBookingOpen && (
        <RentalBookingModal
          gear={gear}
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
        />
      )}
    </>
  );
}
