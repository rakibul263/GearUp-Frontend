"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { loginSchema } from "@/lib/validations";
import { Logo } from "@/components/ui/logo";
import { toast } from "sonner";
import {
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  Home,
} from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // Zod Client-Side Validation
    const validationResult = loginSchema.safeParse({ email, password });
    if (!validationResult.success) {
      const formattedErrors: Record<string, string> = {};
      for (const issue of validationResult.error.issues) {
        if (issue.path[0]) {
          formattedErrors[issue.path[0] as string] = issue.message;
        }
      }
      setFieldErrors(formattedErrors);
      return;
    }

    try {
      setLoading(true);
      await login({ email, password });
      toast.success("Welcome back to GearUp!");
      router.push(redirectUrl);
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Password123!");
    setFieldErrors({});
    toast.info(`Filled demo credentials for ${demoEmail}`);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:py-12">
      
      {/* Top Bar with Back to Home Navigation */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-950 transition-all px-3.5 py-2 rounded-full bg-white/80 hover:bg-white border border-slate-200/80 shadow-xs active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-8 sm:p-10 border border-slate-200/80 shadow-[0_25px_70px_-15px_rgba(15,23,42,0.08)]">
        
        {/* Brand Logo Header */}
        <div className="text-center mb-7 flex flex-col items-center">
          <Logo variant="compact" size="lg" className="mb-3.5 hover:scale-105 transition-transform" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Sign In to GearUp
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 max-w-xs leading-relaxed">
            Welcome back! Enter your details to access your account, bookings, and listings.
          </p>
        </div>

        {/* Demo Fast Fill Buttons */}
        <div className="mb-6 p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/70 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              1-Click Demo Logins
            </span>
            <span className="text-primary font-semibold lowercase text-[10px]">pass: Password123!</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillDemoAccount("customer@gearup.com")}
              className="group py-2.5 px-3 rounded-xl bg-white border border-slate-200/90 text-slate-700 font-semibold hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all text-left shadow-xs flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-slate-900 group-hover:text-primary transition-colors flex items-center gap-1">
                  <span>👤</span> Customer
                </div>
                <div className="text-[10px] text-slate-400 truncate font-normal mt-0.5">customer@gearup.com</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("provider@gearup.com")}
              className="group py-2.5 px-3 rounded-xl bg-white border border-slate-200/90 text-slate-700 font-semibold hover:border-amber-400/50 hover:bg-amber-50/50 hover:text-amber-700 transition-all text-left shadow-xs flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors flex items-center gap-1">
                  <span>🏢</span> Provider
                </div>
                <div className="text-[10px] text-slate-400 truncate font-normal mt-0.5">provider@gearup.com</div>
              </div>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Email Address <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="relative group">
              <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
                }}
                className={`w-full text-xs font-medium pl-10 pr-4 py-3 rounded-xl border transition-all ${
                  fieldErrors.email
                    ? "border-red-400 focus:ring-4 focus:ring-red-100 bg-red-50/20"
                    : "border-slate-200/90 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/15"
                } focus:outline-none`}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1.5 font-medium animate-in fade-in duration-150">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{fieldErrors.email}</span>
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Password <span className="text-red-500">*</span>
              </label>
              <Link href="#" className="text-[11px] text-primary hover:underline font-semibold">
                Forgot password?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: "" });
                }}
                className={`w-full text-xs font-medium pl-10 pr-10 py-3 rounded-xl border transition-all ${
                  fieldErrors.password
                    ? "border-red-400 focus:ring-4 focus:ring-red-100 bg-red-50/20"
                    : "border-slate-200/90 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/15"
                } focus:outline-none`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1.5 font-medium animate-in fade-in duration-150">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{fieldErrors.password}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-6 rounded-full font-bold text-xs bg-slate-900 hover:bg-slate-950 text-white transition-all shadow-md hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          Don't have an account yet?{" "}
          <Link href="/register" className="font-bold text-primary hover:underline">
            Create account
          </Link>
        </div>

      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs font-semibold text-slate-500">Loading sign in...</div>}>
      <LoginContent />
    </Suspense>
  );
}
