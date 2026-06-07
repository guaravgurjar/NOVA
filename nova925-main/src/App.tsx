/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Wishlist } from './pages/Wishlist';
import { Shop } from './pages/Shop';
import { Cart } from './pages/Cart';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { ChatBot } from './components/ChatBot';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { ClerkProvider } from '@clerk/clerk-react';
import { ShieldAlert } from 'lucide-react';

const PUBLISHABLE_KEY = (import.meta as any).env.VITE_CLERK_PUBLISHABLE_KEY;

export default function App() {
  // Gracefully handle missing Clerk key with a premium setup wizard screen
  if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY === 'pk_test_placeholder' || PUBLISHABLE_KEY === '') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#c5a880_0.6px,transparent_0.6px)] [background-size:20px_20px] opacity-5 pointer-events-none"></div>
        <div className="max-w-md w-full bg-[#0d0f1a] border border-nova-gold/20 p-8 rounded-2xl shadow-2xl relative z-10 flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 rounded-full bg-nova-gold/10 border border-nova-gold/20 flex items-center justify-center text-nova-gold">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-serif tracking-wider text-white mb-2">Clerk Setup Required</h1>
            <p className="text-xs text-white/60 leading-relaxed">
              To enable secure user accounts and checkout features, please configure your Clerk Publishable Key.
            </p>
          </div>
          <div className="w-full bg-[#121522] border border-white/5 p-4 rounded-xl text-left flex flex-col gap-3">
            <span className="text-[10px] uppercase tracking-wider text-nova-gold font-semibold">Instructions:</span>
            <ol className="text-[11px] text-white/55 list-decimal list-inside flex flex-col gap-2 leading-relaxed">
              <li>Open the <a href="https://dashboard.clerk.com/" target="_blank" rel="noreferrer" className="text-nova-gold hover:underline font-medium">Clerk Dashboard</a></li>
              <li>Copy your <b>Publishable Key</b></li>
              <li>Paste it into your <code>.env</code> file:</li>
            </ol>
            <pre className="text-[10px] bg-black/40 p-2.5 rounded-lg border border-white/5 text-white/70 overflow-x-auto select-all font-mono">
              VITE_CLERK_PUBLISHABLE_KEY="your_publishable_key"
            </pre>
          </div>
          <p className="text-[10px] text-white/30">
            Save the file and the application will reload automatically.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <div className="flex flex-col min-h-screen font-sans bg-white text-[#111]">
              <Header />
              <main className="flex-1 flex flex-col">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/category/:id" element={<Shop />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/login" element={<Login />} />
                </Routes>
              </main>
              <Footer />
              <ChatBot />
            </div>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ClerkProvider>
  );
}
