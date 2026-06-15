"use client";

import React, { useEffect, useState, useTransition } from "react";
import { 
  getDashboardData, 
  syncMetalRatesAction 
} from "@/app/actions";
import { 
  DollarSign, 
  Clock, 
  AlertTriangle, 
  RefreshCw, 
  TrendingUp, 
  ChevronRight,
  PackageCheck
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalRevenue: number;
  pendingOrders: number;
  lowStockAlerts: number;
}

interface MetalRate {
  id: string;
  metalName: string;
  pricePerGramUSD: number;
  pricePerGramINR: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  buyerName: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [rates, setRates] = useState<MetalRate[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    const res = await getDashboardData();
    if (res.success) {
      setStats(res.stats || null);
      setRates(res.rates || []);
      setRecentOrders(res.recentOrders || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSyncRates = () => {
    startTransition(async () => {
      const res = await syncMetalRatesAction();
      if (res.success && res.rates) {
        // Map sync response into the state
        setRates(prev => 
          prev.map(r => {
            const match = res.rates?.find((updated: any) => updated.id === r.id);
            return match ? {
              ...r,
              pricePerGramUSD: match.pricePerGramUSD,
              pricePerGramINR: match.pricePerGramINR
            } : r;
          })
        );
        // Refresh dashboard stats because prices of items might have shifted (causing revenue modifications if they were dynamic, though orders lock in prices)
        const dataRes = await getDashboardData();
        if (dataRes.success) {
          setStats(dataRes.stats || null);
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse-slow">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center py-2">
          <div className="h-8 w-48 bg-zinc-800 rounded-lg"></div>
          <div className="h-10 w-36 bg-zinc-800 rounded-lg"></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-zinc-900 border border-zinc-800 rounded-xl"></div>
          ))}
        </div>

        {/* Double Column Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-zinc-900 border border-zinc-800 rounded-xl"></div>
          <div className="h-96 bg-zinc-900 border border-zinc-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Upper Brand Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2 border-b border-gold/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Real-time shop performance and jewelry pricing mechanics.
          </p>
        </div>
        
        <button
          onClick={handleSyncRates}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gold/30 bg-gold/5 text-gold hover:bg-gold/15 transition-all text-sm font-medium focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 transition-transform duration-500 group-hover:rotate-185 ${isPending ? "animate-spin" : ""}`} />
          {isPending ? "Syncing Rates..." : "Sync Market Rates"}
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue */}
        <div className="glass-panel p-6 rounded-xl border border-gold/15 shadow-lg relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 text-gold/5 pointer-events-none transition-transform duration-300 group-hover:scale-110">
            <DollarSign className="w-32 h-32" />
          </div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Total Sales Value</p>
              <h3 className="text-3xl font-bold tracking-tight mt-2 text-foreground">
                ₹{(stats?.totalRevenue || 0).toLocaleString("en-IN")}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/25 flex items-center justify-center text-gold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-4 font-mono">
            Total transactional sales volume.
          </p>
        </div>

        {/* Pending Orders */}
        <div className="glass-panel p-6 rounded-xl border border-gold/15 shadow-lg relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 text-gold/5 pointer-events-none transition-transform duration-300 group-hover:scale-110">
            <Clock className="w-32 h-32" />
          </div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Pending Orders</p>
              <h3 className="text-3xl font-bold tracking-tight mt-2 text-foreground">
                {stats?.pendingOrders || 0}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center text-yellow-500">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-4 font-mono">
            Awaiting packaging, sizing, or tracking.
          </p>
        </div>

        {/* Low Stock Alerts */}
        <div className="glass-panel p-6 rounded-xl border border-gold/15 shadow-lg relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 text-gold/5 pointer-events-none transition-transform duration-300 group-hover:scale-110">
            <AlertTriangle className="w-32 h-32" />
          </div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Low Stock Warnings</p>
              <h3 className="text-3xl font-bold tracking-tight mt-2 text-foreground">
                {stats?.lowStockAlerts || 0}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-4 font-mono">
            Variants with stock level &lt; 5 units.
          </p>
        </div>
      </div>

      {/* Main Grid: Live Rates + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Log (Left Column) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-gold/15 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
                <p className="text-xs text-zinc-400">Log of the most recent transactional sales.</p>
              </div>
              <Link
                href="/orders"
                className="text-gold hover:text-gold-light text-xs font-medium flex items-center gap-1 group transition-colors"
              >
                View All Orders 
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gold/10 text-zinc-400 text-xs uppercase font-mono">
                    <th className="pb-3 font-semibold">Order</th>
                    <th className="pb-3 font-semibold">Buyer</th>
                    <th className="pb-3 font-semibold">Value</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-zinc-500">
                        No orders recorded yet.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-zinc-800/10 transition-colors">
                        <td className="py-4 font-mono font-medium text-gold">{order.orderNumber}</td>
                        <td className="py-4 text-zinc-300">{order.buyerName}</td>
                        <td className="py-4 font-semibold">₹{order.totalPrice.toLocaleString("en-IN")}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === "PENDING"
                              ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                              : order.status === "SHIPPED"
                              ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                              : order.status === "DELIVERED"
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                              : "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              order.status === "PENDING"
                                ? "bg-yellow-500"
                                : order.status === "SHIPPED"
                                ? "bg-blue-500"
                                : order.status === "DELIVERED"
                                ? "bg-emerald-500"
                                : "bg-zinc-500"
                            }`} />
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 text-right text-zinc-500 text-xs">
                          {new Date(order.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="border-t border-gold/10 pt-4 mt-6 flex justify-between items-center text-xs text-zinc-500 font-mono">
            <span>Fallback database active</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Operational</span>
            </div>
          </div>
        </div>

        {/* Live Market Rates Widget (Right Column) */}
        <div className="glass-panel p-6 rounded-xl border border-gold/15 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-gold" />
                  Live Market Rates
                </h2>
                <p className="text-xs text-zinc-400">Metal price index per gram in real-time.</p>
              </div>
              <span className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] text-emerald-500 font-semibold font-mono uppercase">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Live
              </span>
            </div>

            <div className="space-y-4">
              {rates.map((rate) => {
                const isGold = rate.id.includes("GOLD");
                return (
                  <div 
                    key={rate.id} 
                    className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800/40 hover:border-gold/10 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        isGold 
                          ? "bg-gold/10 border border-gold/30 text-gold"
                          : "bg-zinc-800 border border-zinc-700 text-zinc-300"
                      }`}>
                        {isGold ? "Au" : "Ag"}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">{rate.metalName}</h4>
                        <p className="text-[10px] text-zinc-500 font-mono">Spot index/g</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-foreground">
                        ₹{rate.pricePerGramINR.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs text-zinc-500 font-mono">
                        ${rate.pricePerGramUSD.toFixed(2)} USD
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gold/5 border border-gold/15 p-3.5 rounded-lg text-xs text-zinc-400 mt-6 font-mono leading-relaxed">
            <p className="font-semibold text-gold mb-1">Pricing Integration Formula:</p>
            <code className="text-zinc-300 text-[11px] block bg-black/40 p-2 rounded border border-zinc-800 overflow-x-auto whitespace-pre">
              (Weight * Rate) + Gem + Markup
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
