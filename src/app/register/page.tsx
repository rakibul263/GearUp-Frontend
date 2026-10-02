"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { registerSchema } from "@/lib/validations";
import { Logo } from "@/components/ui/logo";
import { toast } from "sonner";
import {
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  Building2,
  UserCircle,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Home,
} from "lucide-react";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get("role") as "CUSTOMER" | "PROVIDER") || "CUSTOMER";

  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "PROVIDER">(defaultRole);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // Zod Client-Side Validation
    const validationResult = registerSchema.safeParse({
      name,
      email,
      password,
      phone: phone.trim() ? phone.trim() : undefined,
      role,
    });

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
      await register({
        name,
        email,
        password,
        phone: phone || undefined,
        role,
      });
      toast.success("Account created successfully! Welcome to GearUp.");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:py-12">
      
      {/* Top Bar with Back to Home Navigation */}
      <div className="w-full max-w-lg mb-4 flex items-center justify-between">
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

      {/* Main Registration Card */}
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-8 sm:p-10 border border-slate-200/80 shadow-[0_25px_70px_-15px_rgba(15,23,42,0.08)]">
        
        {/* Brand Logo Header */}
        <div className="text-center mb-6 flex flex-col items-center">
          <Logo variant="compact" size="lg" className="mb-3.5 hover:scale-105 transition-transform" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Create an Account
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
            Join GearUp to rent professional cinema equipment or list your gear for verified creators.
          </p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRole("CUSTOMER")}
            className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all relative ${
              role === "CUSTOMER"
                ? "bg-slate-950 text-white border-slate-950 shadow-md"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <UserCircle className={`w-5 h-5 shrink-0 mt-0.5 ${role === "CUSTOMER" ? "text-cyan-400" : "text-slate-400"}`} />
            <div>
              <div className="flex items-center gap-1.5">
                <p className={`text-xs font-bold ${role === "CUSTOMER" ? "text-white" : "text-slate-900"}`}>Rent Gear</p>
                {role === "CUSTOMER" && <CheckCircle className="w-3.5 h-3.5 text-cyan-400 inline" />}
              </div>
              <p className={`text-[11px] mt-0.5 leading-snug ${role === "CUSTOMER" ? "text-slate-300" : "text-slate-500"}`}>
                Hire kits for shoots
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRole("PROVIDER")}
            className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all relative ${
              role === "PROVIDER"
                ? "bg-slate-950 text-white border-slate-950 shadow-md"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Building2 className={`w-5 h-5 shrink-0 mt-0.5 ${role === "PROVIDER" ? "text-amber-400" : "text-slate-400"}`} />
            <div>
              <div className="flex items-center gap-1.5">
                <p className={`text-xs font-bold ${role === "PROVIDER" ? "text-white" : "text-slate-900"}`}>List Gear</p>
                {role === "PROVIDER" && <CheckCircle className="w-3.5 h-3.5 text-amber-400 inline" />}
              </div>
              <p className={`text-[11px] mt-0.5 leading-snug ${role === "PROVIDER" ? "text-slate-300" : "text-slate-500"}`}>
                Earn passive income
              </p>
            </div>
          </button>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <User className="w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rahim Chowdhury"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: "" });
                }}
                className={`w-full text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl border transition-all ${
                  fieldErrors.name
                    ? "border-red-400 focus:ring-4 focus:ring-red-100 bg-red-50/20"
                    : "border-slate-200/90 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/15"
                } focus:outline-none`}
              />
            </div>
            {fieldErrors.name && (
              <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1.5 font-medium animate-in fade-in duration-150">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{fieldErrors.name}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
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
                className={`w-full text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl border transition-all ${
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: "" });
                  }}
                  className={`w-full text-xs font-medium pl-10 pr-10 py-2.5 rounded-xl border transition-all ${
                    fieldErrors.password
                      ? "border-red-400 focus:ring-4 focus:ring-red-100 bg-red-50/20"
                      : "border-slate-200/90 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/15"
                  } focus:outline-none`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1.5 font-medium animate-in fade-in duration-150">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{fieldErrors.password}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Phone Number (Optional)
              </label>
              <div className="relative group">
                <Phone className="w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="+8801..."
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: "" });
                  }}
                  className={`w-full text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl border transition-all ${
                    fieldErrors.phone
                      ? "border-red-400 focus:ring-4 focus:ring-red-100 bg-red-50/20"
                      : "border-slate-200/90 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/15"
                  } focus:outline-none`}
                />
              </div>
              {fieldErrors.phone && (
                <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1.5 font-medium animate-in fade-in duration-150">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{fieldErrors.phone}</span>
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3.5 px-6 rounded-full font-bold text-xs bg-slate-900 hover:bg-slate-950 text-white transition-all shadow-md hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          Already registered?{" "}
          <Link href="/login" className="font-bold text-primary hover:underline">
            Log in here
          </Link>
        </div>

      </div>

    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs font-semibold text-slate-500">Loading signup...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
