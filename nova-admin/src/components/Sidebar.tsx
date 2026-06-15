"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Sparkles, 
  ShoppingBag, 
  Menu, 
  X, 
  ShieldAlert, 
  Coins,
  LogOut
} from "lucide-react";
import { logoutAdminAction } from "@/app/actions";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Products", href: "/products", icon: ShoppingBag },
    { name: "Orders", href: "/orders", icon: Coins },
  ];

  const handleLogout = () => {
    startTransition(async () => {
      const res = await logoutAdminAction();
      if (res.success) {
        router.push("/login");
        router.refresh();
      }
    });
  };

  // If path is login, do not render the sidebar
  if (pathname === "/login") return null;

  return (
    <>
      {/* Mobile Top Navbar */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 glass-panel border-b border-gold/15 sticky top-0 z-50 bg-[#06080d]/90">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border border-gold flex items-center justify-center bg-gold/10">
            <span className="text-gold font-bold text-sm">N</span>
          </div>
          <span className="text-foreground font-semibold tracking-wider font-sans text-lg">
            NOVA <span className="text-gold text-xs font-normal">ADMIN</span>
          </span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 text-gold hover:text-gold-light focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-45 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div 
            className="w-64 h-full bg-[#06080d] border-r border-gold/15 p-6 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border border-gold flex items-center justify-center bg-gold/10">
                  <span className="text-gold font-bold text-base">N</span>
                </div>
                <div>
                  <h1 className="text-foreground font-bold tracking-wider text-base">NOVA</h1>
                  <p className="text-gold text-xs uppercase tracking-widest font-mono">E-Commerce Admin</p>
                </div>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                        isActive
                          ? "bg-gold/15 border-l-2 border-gold text-gold-light font-medium shadow-md shadow-gold/5"
                          : "text-zinc-400 hover:text-foreground hover:bg-zinc-800/20"
                      }`}
                    >
                      <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-gold" : "text-zinc-400 group-hover:text-gold"}`} />
                      <span className="text-sm">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-gold/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-300">Nova Staff</p>
                  <p className="text-[10px] text-zinc-500 font-mono">admin@nova925.com</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                disabled={isPending}
                className="text-zinc-500 hover:text-rose-400 p-1.5 transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-[#06080d] border-r border-gold/15 py-8 px-6 justify-between z-40">
        <div className="space-y-12">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full border border-gold flex items-center justify-center bg-gold/10 gold-glow">
              <span className="text-gold font-bold text-lg">N</span>
            </div>
            <div>
              <h1 className="text-foreground font-bold tracking-widest text-lg font-sans">NOVA</h1>
              <p className="text-gold text-[10px] uppercase tracking-widest font-mono">E-Commerce Admin</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-gold/15 border-l-2 border-gold text-gold-light font-medium shadow-md shadow-gold/5"
                      : "text-zinc-400 hover:text-foreground hover:bg-zinc-800/20"
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-gold" : "text-zinc-400 group-hover:text-gold"}`} />
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile section at the bottom */}
        <div className="glass-panel p-4 rounded-xl border border-gold/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-gold/20 shrink-0">
              <ShieldAlert className="w-5 h-5 text-gold" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-zinc-200 truncate">Nova Staff</p>
              <p className="text-[10px] text-zinc-500 font-mono truncate">admin@nova925.com</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            disabled={isPending}
            className="text-zinc-500 hover:text-rose-400 p-2 transition-colors cursor-pointer shrink-0 animate-pulse-slow"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
}
