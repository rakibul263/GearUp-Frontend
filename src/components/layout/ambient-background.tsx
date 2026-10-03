"use client";

import React from "react";

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 1. Base Rich Studio Surface */}
      <div className="absolute inset-0 bg-[#f1f5fa]" />

      {/* 2. Multi-Chromatic Radiant Ambient Light Blooms */}
      {/* Top Center: Royal Cobalt & Ultramarine Aurora */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[650px] rounded-full blur-[110px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(37, 99, 235, 0.18) 0%, rgba(99, 102, 241, 0.12) 35%, rgba(56, 189, 248, 0.05) 60%, transparent 80%)",
        }}
      />

      {/* Top Right: Warm Golden Sensor Flare */}
      <div
        className="absolute -top-20 right-0 w-[700px] h-[550px] rounded-full blur-[100px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(245, 158, 11, 0.13) 0%, rgba(251, 191, 36, 0.06) 40%, transparent 75%)",
        }}
      />

      {/* Left Center: Electric Cyan Studio Rim Glow */}
      <div
        className="absolute top-1/3 -left-32 w-[650px] h-[550px] rounded-full blur-[100px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(6, 182, 212, 0.11) 0%, rgba(14, 165, 233, 0.04) 45%, transparent 70%)",
        }}
      />

      {/* Lower Right: Deep Violet Nebula Bloom */}
      <div
        className="absolute top-2/3 right-10 w-[750px] h-[600px] rounded-full blur-[120px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(139, 92, 246, 0.09) 0%, rgba(99, 102, 241, 0.04) 50%, transparent 75%)",
        }}
      />

      {/* Bottom Center: Deep Sapphire Horizon */}
      <div
        className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full blur-[120px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(30, 64, 175, 0.08) 0%, rgba(59, 130, 246, 0.03) 50%, transparent 75%)",
        }}
      />

      {/* 3. Unique Architectural Blueprint Grid with Intersection Crosshairs */}
      <svg
        className="absolute inset-0 w-full h-full opacity-60"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Base Fine 40px Grid */}
          <pattern
            id="aesthetic-grid-fine"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(100, 116, 139, 0.065)"
              strokeWidth="0.8"
            />
            <circle cx="20" cy="20" r="0.75" fill="rgba(148, 163, 184, 0.25)" />
          </pattern>

          {/* Major 160px Intersection Crosshairs */}
          <pattern
            id="aesthetic-grid-major"
            width="160"
            height="160"
            patternUnits="userSpaceOnUse"
          >
            {/* Crosshair at corner */}
            <path
              d="M 0 6 L 0 -6 M -6 0 L 6 0"
              stroke="rgba(79, 70, 229, 0.35)"
              strokeWidth="1.2"
            />
            {/* Center tick */}
            <circle cx="80" cy="80" r="1.5" fill="rgba(56, 189, 248, 0.35)" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#aesthetic-grid-fine)" />
        <rect width="100%" height="100%" fill="url(#aesthetic-grid-major)" />
      </svg>

      {/* 4. Cinematic Viewfinder Corner Frame Brackets */}
      <div className="absolute inset-4 sm:inset-8 border border-transparent pointer-events-none opacity-40">
        {/* Top-Left Bracket */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-slate-400/40 rounded-tl-sm" />
        {/* Top-Right Bracket */}
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-slate-400/40 rounded-tr-sm" />
        {/* Bottom-Left Bracket */}
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-slate-400/40 rounded-bl-sm" />
        {/* Bottom-Right Bracket */}
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-slate-400/40 rounded-br-sm" />
      </div>

      {/* 5. Smooth Radial Content Softener (ensures ultra-clear card readability) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, transparent 35%, rgba(241, 245, 250, 0.4) 75%, rgba(235, 240, 247, 0.7) 100%)",
        }}
      />
    </div>
  );
}
