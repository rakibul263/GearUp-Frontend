import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  variant?: "full" | "compact" | "icon";
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", variant = "full", size = "md" }: LogoProps) {
  const iconDimensions =
    size === "sm" ? "w-8 h-8" : size === "lg" ? "w-12 h-12" : "w-10 h-10";
  const textSize =
    size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl";

  const LogoIcon = (
    <div
      className={`relative ${iconDimensions} rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 p-0.5 shadow-md shadow-blue-500/25 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300`}
    >
      {/* SVG Camera Aperture & Arrow Gear Mark */}
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full p-1.5"
      >
        {/* Outer Circular Rim */}
        <circle
          cx="20"
          cy="20"
          r="16"
          stroke="rgba(255, 255, 255, 0.25)"
          strokeWidth="1.5"
          strokeDasharray="4 2"
        />

        {/* Shutter Blade 1 (Top Left) */}
        <path
          d="M13 10L27 10L20 22Z"
          fill="url(#gearUpGrad1)"
          opacity="0.9"
        />

        {/* Shutter Blade 2 (Right Wing) */}
        <path
          d="M27 10L31 24L18 25Z"
          fill="url(#gearUpGrad2)"
          opacity="0.95"
        />

        {/* Shutter Blade 3 (Bottom Gear Notch) */}
        <path
          d="M30 25L17 31L16 18Z"
          fill="url(#gearUpGrad3)"
          opacity="0.9"
        />

        {/* Ascending Arrow / 'Up' Mark Blade */}
        <path
          d="M16 30L9 17L22 17Z"
          fill="#38bdf8"
          opacity="0.85"
        />

        {/* Center Optical Aperture Dot */}
        <circle cx="20" cy="20" r="3.5" fill="#f59e0b" />
        <circle cx="20" cy="20" r="1.5" fill="#ffffff" />

        {/* Gradients */}
        <defs>
          <linearGradient id="gearUpGrad1" x1="13" y1="10" x2="27" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60a5fa" />
            <stop offset="1" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="gearUpGrad2" x1="27" y1="10" x2="18" y2="25" gradientUnits="userSpaceOnUse">
            <stop stopColor="#93c5fd" />
            <stop offset="1" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="gearUpGrad3" x1="30" y1="25" x2="16" y2="18" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38bdf8" />
            <stop offset="1" stopColor="#1e40af" />
          </linearGradient>
        </defs>
      </svg>

      {/* Subtle shine highlight */}
      <div className="absolute top-1 left-2 w-3 h-1 bg-white/40 rounded-full blur-[0.5px]" />
    </div>
  );

  if (variant === "icon") {
    return LogoIcon;
  }

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group ${className}`}>
      {LogoIcon}
      <span
        className={`${textSize} font-black tracking-tight flex items-center select-none`}
      >
        <span className="text-slate-950 group-hover:text-black transition-colors font-extrabold tracking-tight">
          Gear
        </span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 ml-0.5 font-black drop-shadow-xs">
          Up
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 ml-1 mb-2 shadow-[0_0_8px_rgba(245,158,11,0.7)] group-hover:scale-125 transition-transform" />
      </span>
    </Link>
  );
}
