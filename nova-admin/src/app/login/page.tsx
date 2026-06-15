"use client";

import React, { useState, useTransition } from "react";
import { loginAdminAction } from "@/app/actions";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertTriangle, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    startTransition(async () => {
      const res = await loginAdminAction(email, password);
      if (res.success) {
        // Redirect to dashboard
        router.push("/");
        router.refresh();
      } else {
        setError(res.error || "Invalid credentials.");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#06080d] px-4 font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-gold/15 shadow-2xl relative overflow-hidden">
        
        {/* Decorative Top Accent */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />

        {/* Branding */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center bg-gold/10 gold-glow mb-4">
            <ShieldCheck className="w-6 h-6 text-gold" />
          </div>
          <h2 className="text-2xl font-bold tracking-widest text-foreground font-sans">
            NOVA <span className="text-gold text-xs font-normal uppercase tracking-widest block mt-1">Security Portal</span>
          </h2>
          <p className="text-zinc-500 text-xs mt-2 max-w-xs leading-relaxed">
            Restricted access portal for authorized administrative staff only.
          </p>
        </div>

        {/* Error Callout */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-500 flex items-start gap-3 text-xs leading-relaxed">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Access Denied:</span>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
              Staff Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@nova925.com"
                required
                className="w-full bg-[#0b0e17] border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-gold/50 text-foreground"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
              Security Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#0b0e17] border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-gold/50 text-foreground"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 bg-gold hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed text-[#06080d] font-bold text-sm py-3 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-gold/5"
          >
            {isPending ? (
              <span className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              "Sign In to Console"
            )}
          </button>
        </form>

        {/* Footer Info */}
        <div className="mt-8 border-t border-zinc-900 pt-4 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
          <span>SECURE ENDPOINT</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>SSL Active</span>
          </div>
        </div>

      </div>
    </div>
  );
}
