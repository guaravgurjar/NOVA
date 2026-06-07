import { useState } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';

export function Login() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const clerkAppearance = {
    variables: {
      colorPrimary: '#c5a880', // Nova Gold
      colorBackground: '#0d0f1a', // Nova Darker
      colorText: '#ffffff',
      colorInputBackground: '#121522',
      colorInputText: '#ffffff',
      colorTextSecondary: '#a1a1aa',
      colorTextOnPrimaryBackground: '#0d0f1a',
    },
    elements: {
      card: 'bg-transparent border-none text-white shadow-none w-full max-w-md mx-auto p-0',
      header: 'hidden', // Hide Clerk's header to use our own tab design
      footer: 'text-white/40',
      socialButtonsBlockButton: 'bg-white hover:bg-neutral-100 text-nova-darker border-none font-semibold transition-all py-3 px-4 rounded-xl',
      formButtonPrimary: 'bg-nova-gold text-nova-darker hover:bg-[#d9bc92] font-semibold py-3.5 transition-all shadow-lg shadow-nova-gold/15 rounded-xl border-none cursor-pointer',
      footerActionText: 'text-white/40',
      footerActionLink: 'text-nova-gold hover:text-white transition-colors',
      formFieldLabel: 'text-white/60 text-[10px] uppercase tracking-wider mb-1.5 font-medium',
      formFieldInput: 'bg-[#121522] border border-white/10 text-white focus:border-nova-gold rounded-xl py-3 px-4 text-xs transition-all',
      dividerLine: 'bg-white/10',
      dividerText: 'text-[9px] uppercase tracking-widest text-white/30',
      footerPagesLink: 'hidden', // Hide default Clerk links for a cleaner look
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 bg-nova-darker text-white min-h-[85vh] relative">
      <div className="absolute inset-0 bg-[radial-gradient(#c5a880_0.6px,transparent_0.6px)] [background-size:20px_20px] opacity-5 pointer-events-none"></div>
      
      <div className="w-full max-w-md glass-dark p-8 md:p-10 rounded-2xl border border-white/10 shadow-2xl relative z-10 animate-fade-in flex flex-col">
        {/* Brand Logo Header */}
        <div className="flex justify-center mb-6">
          <img src="/images/logo.png" alt="NOVA Jewellery" className="h-9 w-auto object-contain" />
        </div>

        {/* Tab Headers */}
        <div className="flex border-b border-white/10 mb-8">
          <button 
            onClick={() => setActiveTab('login')}
            className={`flex-1 pb-3 text-xs md:text-sm font-semibold uppercase tracking-widest transition-all duration-300 border-b-2 ${
              activeTab === 'login' 
                ? 'border-nova-gold text-nova-gold font-bold' 
                : 'border-transparent text-white/40 hover:text-white/80'
            } cursor-pointer`}
          >
            Sign In
          </button>
          <button 
            onClick={() => setActiveTab('register')}
            className={`flex-1 pb-3 text-xs md:text-sm font-semibold uppercase tracking-widest transition-all duration-300 border-b-2 ${
              activeTab === 'register' 
                ? 'border-nova-gold text-nova-gold font-bold' 
                : 'border-transparent text-white/40 hover:text-white/80'
            } cursor-pointer`}
          >
            Create Account
          </button>
        </div>

        {activeTab === 'login' ? (
          <SignIn 
            fallbackRedirectUrl="/profile" 
            appearance={clerkAppearance}
            routing="virtual"
          />
        ) : (
          <SignUp 
            fallbackRedirectUrl="/profile" 
            appearance={clerkAppearance}
            routing="virtual"
          />
        )}
      </div>
    </div>
  );
}
