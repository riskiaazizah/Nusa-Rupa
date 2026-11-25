"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthLayout({ children }) {
  const pathname = usePathname();
  const isRegister = pathname === "/register";
  const isForgot = pathname.startsWith("/forgot-password");

  const badgeText = isRegister
    ? "Join the Movement"
    : isForgot
    ? "Account Recovery"
    : "Conservation & Art";

  const quoteHeadline = isRegister
    ? "Stand with the forest, wildlife, and people."
    : isForgot
    ? "Reconnect with your creative contributions."
    : "When nature loses its voice, let art speak.";

  const quoteSub = isRegister
    ? "Create your account to showcase artwork, join conservation challenges, and amplify environmental impact."
    : isForgot
    ? "Securely update your credentials to access your artwork gallery and submissions."
    : "A digital sanctuary dedicated to the peatlands, wildlife, and frontline communities living under the smoke.";

  return (
    <main className="relative min-h-screen flex items-center justify-center p-3 sm:p-6 lg:p-10 overflow-hidden bg-[#eef5ee]">
      {/* Organic ambient background elements matching mockup */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#c8e6c9]/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#a5d6a7]/40 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-forest/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 left-1/3 w-72 h-72 rounded-full bg-[#81c784]/20 blur-2xl pointer-events-none" />

      {/* Main Centered 2-Column Split Card */}
      <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[28px] sm:rounded-3xl border border-line/60 bg-white shadow-2xl flex flex-col md:flex-row">
        {/* Left Column: Visual Banner with Orangutan Image */}
        <div className="relative md:w-1/2 min-h-[300px] sm:min-h-[380px] md:min-h-[640px] flex flex-col justify-between p-6 sm:p-10 text-white overflow-hidden">
          {/* Background Orangutan Photo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/auth/orangutan.jpg"
            alt="Orangutan in the Indonesian rainforest"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
          />

          {/* Editorial Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/30 pointer-events-none" />
          <div className="absolute inset-0 bg-forest/25 mix-blend-multiply pointer-events-none" />

          {/* Top Header: Logo */}
          <div className="relative z-10 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 group transition-transform hover:scale-105"
              aria-label="TIGA Homepage"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo/tiga-logo-white.svg"
                alt="TIGA"
                className="h-8 w-auto"
              />
            </Link>

            <span className="text-[11px] font-semibold uppercase tracking-widest text-white/80 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
              Art for Earth
            </span>
          </div>

          {/* Middle/Bottom: Inspiring Copy & Floating Pill Badges */}
          <div className="relative z-10 mt-auto pt-8 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1 text-xs font-semibold tracking-wider uppercase text-white border border-white/25">
              <span className="h-2 w-2 rounded-full bg-[#8fe3ae]" />
              <span>{badgeText}</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight text-white drop-shadow-sm">
              {quoteHeadline}
            </h2>

            <p className="text-xs sm:text-sm text-white/90 font-light leading-relaxed max-w-md">
              {quoteSub}
            </p>

            {/* Three Pillars Highlight Badge (matching mockup floating icons) */}
            <div className="pt-2 flex items-center gap-3 text-[11px] font-medium text-white/90">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-2.5 py-1 border border-white/10">
                <span className="h-2 w-2 rounded-full bg-[#1f6b45]" /> Forest
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-2.5 py-1 border border-white/10">
                <span className="h-2 w-2 rounded-full bg-[#2f3fa8]" /> Animals
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-2.5 py-1 border border-white/10">
                <span className="h-2 w-2 rounded-full bg-[#d92e1c]" /> People
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Form Container */}
        <div className="md:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="w-full max-w-md mx-auto">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
