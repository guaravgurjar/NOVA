import { useState, FormEvent, useRef, useEffect, useCallback } from 'react';
import { Lock, Mail, User, Phone, ChevronRight, ArrowLeft, RefreshCw } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePageSEO } from '../lib/usePageSEO';

// Common country codes
const COUNTRY_CODES = [
  { code: '+91', label: '🇮🇳 +91', name: 'India' },
  { code: '+1',  label: '🇺🇸 +1',  name: 'USA/Canada' },
  { code: '+44', label: '🇬🇧 +44', name: 'UK' },
  { code: '+61', label: '🇦🇺 +61', name: 'Australia' },
  { code: '+971', label: '🇦🇪 +971', name: 'UAE' },
  { code: '+65', label: '🇸🇬 +65', name: 'Singapore' },
  { code: '+60', label: '🇲🇾 +60', name: 'Malaysia' },
  { code: '+27', label: '🇿🇦 +27', name: 'South Africa' },
];

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30; // seconds

export function Login() {
  usePageSEO({ title: 'Login / Register', description: 'Sign in or create a NOVA Jewellery account. Access your wishlist, order history, and exclusive offers.', noIndex: true });
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Email Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Registration State
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  // Phone Login States
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { addToast } = useToast();
  const navigate = useNavigate();
  const { loginWithGmail, loginWithEmail, loginWithPhone, signUpWithEmail } = useAuth();

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    };
  }, []);

  const startResendCooldown = useCallback(() => {
    setResendCooldown(RESEND_COOLDOWN);
    if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    cooldownTimerRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleEmailLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
      addToast('Logged in successfully!');
      navigate('/profile');
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const buildFullPhone = () => `${countryCode}${phoneNumber.trim()}`;

  const handleSendOtp = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!phoneNumber.trim()) {
      addToast('Please enter a valid mobile number.');
      return;
    }
    const fullPhone = buildFullPhone();

    setIsLoading(true);
    try {
      const confirmResult = await loginWithPhone(fullPhone, 'recaptcha-container');
      setConfirmationResult(confirmResult);
      setOtpSent(true);
      setOtpDigits(Array(OTP_LENGTH).fill(''));
      startResendCooldown();
      addToast('Verification code sent successfully!');
      // Auto-focus first OTP box
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'Failed to send OTP. Please check your phone number.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isLoading) return;
    await handleSendOtp();
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    // Handle paste of full OTP
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, OTP_LENGTH).split('');
      const next = [...Array(OTP_LENGTH).fill('')];
      digits.forEach((d, i) => { next[i] = d; });
      setOtpDigits(next);
      const focusIndex = Math.min(digits.length, OTP_LENGTH - 1);
      otpInputRefs.current[focusIndex]?.focus();
      return;
    }

    const digit = value.replace(/\D/g, '');
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);

    // Move focus forward
    if (digit && index < OTP_LENGTH - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otpDigits[index]) {
        const next = [...otpDigits];
        next[index] = '';
        setOtpDigits(next);
      } else if (index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpCode = otpDigits.join('');
    if (otpCode.length !== OTP_LENGTH) {
      addToast('Please enter the complete 6-digit code.');
      return;
    }

    setIsLoading(true);
    try {
      await confirmationResult.confirm(otpCode);
      addToast('Authenticated with mobile successfully!');
      navigate('/profile');
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'Invalid verification code. Please try again.');
      // Clear OTP fields on failure
      setOtpDigits(Array(OTP_LENGTH).fill(''));
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!regFirstName || !regLastName || !regEmail || !regPassword) {
      addToast('Please fill in all required fields');
      return;
    }
    setIsLoading(true);
    try {
      await signUpWithEmail(regEmail, regPassword, regFirstName, regLastName, regPhone);
      addToast('Account registered and logged in successfully!');
      navigate('/profile');
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGmail();
      addToast('Authenticated with Google successfully!');
      navigate('/profile');
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'Google authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const otpCode = otpDigits.join('');
  const isOtpComplete = otpCode.length === OTP_LENGTH;

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 bg-sky-100 text-white min-h-[85vh] relative">
      {/* Hidden reCAPTCHA anchor — must be in the DOM before OTP send */}
      <div id="recaptcha-container" className="hidden"></div>

      <div className="w-full max-w-md glass-dark p-8 md:p-10 rounded-2xl border border-white/10 shadow-2xl relative z-10 animate-fade-in flex flex-col">
        {/* Brand Logo Header */}
        <div className="flex justify-center mb-6">
          <img src="/images/logo.png" alt="NOVA Jewellery" className="h-9 w-auto object-contain" />
        </div>

        {/* Tab Headers */}
        <div className="flex border-b border-white/10 mb-8">
          <button
            onClick={() => setActiveTab('login')}
            disabled={isLoading}
            className={`flex-1 pb-3 text-xs md:text-sm font-semibold uppercase tracking-widest transition-all duration-300 border-b-2 cursor-pointer ${activeTab === 'login'
              ? 'border-nova-gold text-nova-gold font-bold'
              : 'border-transparent text-white/40 hover:text-white/80'
              }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('register')}
            disabled={isLoading}
            className={`flex-1 pb-3 text-xs md:text-sm font-semibold uppercase tracking-widest transition-all duration-300 border-b-2 cursor-pointer ${activeTab === 'register'
              ? 'border-nova-gold text-nova-gold font-bold'
              : 'border-transparent text-white/40 hover:text-white/80'
              }`}
          >
            Create Account
          </button>
        </div>

        {activeTab === 'login' ? (
          <div>
            {/* Google Sign In Button */}
            <div className="mb-6">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3.5 bg-white text-nova-darker rounded-xl text-xs font-semibold uppercase tracking-widest hover:bg-neutral-100 hover:shadow-lg transition-all border border-white/10 active:scale-98 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign In with Google</span>
              </button>
              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-white/10"></div>
                <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] px-4">or use credentials</span>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>

              {/* Login Method Toggle */}
              <div className="flex justify-center gap-6 mb-6 text-[10px] uppercase tracking-wider font-semibold">
                <button
                  type="button"
                  onClick={() => { setLoginMethod('email'); setOtpSent(false); }}
                  className={`pb-1 cursor-pointer transition-colors ${loginMethod === 'email' ? 'text-nova-gold border-b-2 border-nova-gold font-bold' : 'text-white/40 hover:text-white/70'}`}
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginMethod('phone'); setOtpSent(false); }}
                  className={`pb-1 cursor-pointer transition-colors ${loginMethod === 'phone' ? 'text-nova-gold border-b-2 border-nova-gold font-bold' : 'text-white/40 hover:text-white/70'}`}
                >
                  Mobile OTP
                </button>
              </div>
            </div>

            {/* EMAIL LOGIN FLOW */}
            {loginMethod === 'email' && (
              <form onSubmit={handleEmailLogin} className="flex flex-col gap-4 animate-fade-in">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 block mb-1.5 font-medium">Email Address</label>
                  <div className="flex items-center bg-[#121522] border border-white/10 rounded-xl focus-within:border-nova-gold/60 transition-colors px-4 py-3">
                    <Mail className="w-4 h-4 text-white/30 mr-3" />
                    <input
                      type="email"
                      placeholder="Enter Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      required
                      className="bg-transparent border-none focus:outline-none text-xs text-white placeholder-white/20 w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 block mb-1.5 font-medium">Password</label>
                  <div className="flex items-center bg-[#121522] border border-white/10 rounded-xl focus-within:border-nova-gold/60 transition-colors px-4 py-3">
                    <Lock className="w-4 h-4 text-white/30 mr-3" />
                    <input
                      type="password"
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      required
                      className="bg-transparent border-none focus:outline-none text-xs text-white placeholder-white/20 w-full"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-premium w-full bg-nova-gold text-nova-darker py-3.5 rounded-xl text-xs font-semibold uppercase tracking-widest hover:bg-nova-gold-light hover:shadow-lg hover:shadow-nova-gold/20 transition-all mt-3 cursor-pointer disabled:opacity-55"
                >
                  {isLoading ? 'Verifying...' : 'Verify & Sign In'}
                </button>
              </form>
            )}

            {/* PHONE / OTP LOGIN FLOW */}
            {loginMethod === 'phone' && (
              <div className="animate-fade-in">
                {!otpSent ? (
                  /* ── Step 1: Enter phone number ── */
                  <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 block mb-1.5 font-medium">Mobile Number</label>
                      <div className="flex gap-2">
                        {/* Country Code Selector */}
                        <div className="relative">
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            disabled={isLoading}
                            className="appearance-none bg-[#121522] border border-white/10 rounded-xl focus:border-nova-gold/60 focus:outline-none text-xs text-white px-3 py-3 pr-7 h-full cursor-pointer transition-colors"
                            style={{ minWidth: '90px' }}
                          >
                            {COUNTRY_CODES.map(c => (
                              <option key={c.code} value={c.code} style={{ background: '#121522' }}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                          <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 rotate-90 pointer-events-none" />
                        </div>
                        {/* Phone Input */}
                        <div className="flex-1 flex items-center bg-[#121522] border border-white/10 rounded-xl focus-within:border-nova-gold/60 transition-colors px-4 py-3">
                          <Phone className="w-4 h-4 text-white/30 mr-3 shrink-0" />
                          <input
                            type="tel"
                            placeholder="Phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                            disabled={isLoading}
                            required
                            maxLength={15}
                            className="bg-transparent border-none focus:outline-none text-xs text-white placeholder-white/20 w-full"
                          />
                        </div>
                      </div>
                      <p className="text-[9px] text-white/40 mt-1.5">
                        Enter your number without the country code — we'll add it automatically.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || !phoneNumber.trim()}
                      className="btn-premium w-full bg-nova-gold text-nova-darker py-3.5 rounded-xl text-xs font-semibold uppercase tracking-widest hover:bg-nova-gold-light hover:shadow-lg hover:shadow-nova-gold/20 transition-all mt-1 cursor-pointer disabled:opacity-55"
                    >
                      {isLoading ? 'Sending OTP...' : 'Send Verification Code'}
                    </button>
                  </form>
                ) : (
                  /* ── Step 2: Enter OTP ── */
                  <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">

                    {/* Back button */}
                    <button
                      type="button"
                      onClick={() => { setOtpSent(false); setOtpDigits(Array(OTP_LENGTH).fill('')); }}
                      className="flex items-center gap-1.5 text-[10px] text-white/40 hover:text-white/70 transition-colors w-fit cursor-pointer"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Change number
                    </button>

                    {/* Sent-to indicator */}
                    <div className="text-center">
                      <p className="text-[11px] text-white/50">Code sent to</p>
                      <p className="text-sm font-semibold text-white mt-0.5 tracking-wider">
                        {countryCode} {phoneNumber}
                      </p>
                    </div>

                    {/* 6-Box OTP Input */}
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 block mb-3 font-medium text-center">
                        Enter Verification Code
                      </label>
                      <div className="flex justify-center gap-2.5">
                        {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                          <input
                            key={i}
                            ref={(el) => { otpInputRefs.current[i] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={6} /* allow paste */
                            value={otpDigits[i]}
                            onChange={(e) => handleOtpDigitChange(i, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                            onFocus={(e) => e.target.select()}
                            disabled={isLoading}
                            className={`w-10 h-12 text-center text-lg font-bold rounded-xl border transition-all duration-200 bg-[#121522] text-white focus:outline-none
                              ${otpDigits[i]
                                ? 'border-nova-gold text-nova-gold shadow-[0_0_10px_rgba(212,175,55,0.25)]'
                                : 'border-white/15 focus:border-nova-gold/60'
                              }`}
                          />
                        ))}
                      </div>

                      {/* Progress dots */}
                      <div className="flex justify-center gap-1.5 mt-3">
                        {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${otpDigits[i] ? 'bg-nova-gold scale-110' : 'bg-white/15'}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Resend OTP */}
                    <div className="flex justify-center items-center gap-2">
                      {resendCooldown > 0 ? (
                        <span className="text-[11px] text-white/40">
                          Resend in <span className="text-white/60 font-semibold tabular-nums">{resendCooldown}s</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={isLoading}
                          className="flex items-center gap-1.5 text-[11px] text-nova-gold hover:text-nova-gold-light font-semibold transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Resend Code
                        </button>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || !isOtpComplete}
                      className="btn-premium w-full bg-nova-gold text-nova-darker py-3.5 rounded-xl text-xs font-semibold uppercase tracking-widest hover:bg-nova-gold-light hover:shadow-lg hover:shadow-nova-gold/20 transition-all cursor-pointer disabled:opacity-55"
                    >
                      {isLoading ? 'Verifying...' : 'Verify & Sign In'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        ) : (
          // REGISTRATION FLOW
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4 animate-fade-in">
            <span className="text-nova-gold text-[9px] tracking-[0.25em] font-semibold uppercase block mb-1 text-center">New Member Benefits</span>
            <p className="text-white/60 text-[11px] mb-4 font-light text-center">
              Register now for priority collection releases and complimentary insured delivery.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 block mb-1.5 font-medium">First Name</label>
                <input
                  type="text"
                  required
                  disabled={isLoading}
                  placeholder="First Name"
                  value={regFirstName}
                  onChange={(e) => setRegFirstName(e.target.value)}
                  className="w-full bg-[#121522] border border-white/10 focus:border-nova-gold rounded-xl py-3 px-4 text-xs text-white focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 block mb-1.5 font-medium">Last Name</label>
                <input
                  type="text"
                  required
                  disabled={isLoading}
                  placeholder="Last Name"
                  value={regLastName}
                  onChange={(e) => setRegLastName(e.target.value)}
                  className="w-full bg-[#121522] border border-white/10 focus:border-nova-gold rounded-xl py-3 px-4 text-xs text-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 block mb-1.5 font-medium">Email Address</label>
              <input
                type="email"
                required
                disabled={isLoading}
                placeholder="Enter Email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full bg-[#121522] border border-white/10 focus:border-nova-gold rounded-xl py-3 px-4 text-xs text-white focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 block mb-1.5 font-medium">Mobile (Optional)</label>
              <input
                type="tel"
                disabled={isLoading}
                placeholder="10-digit Number"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-[#121522] border border-white/10 focus:border-nova-gold rounded-xl py-3 px-4 text-xs text-white focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 block mb-1.5 font-medium">Password</label>
              <input
                type="password"
                required
                disabled={isLoading}
                placeholder="Enter Password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full bg-[#121522] border border-white/10 focus:border-nova-gold rounded-xl py-3 px-4 text-xs text-white focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-premium w-full bg-nova-gold text-nova-darker py-3.5 rounded-xl text-xs font-semibold uppercase tracking-widest hover:bg-nova-gold-light hover:shadow-lg hover:shadow-nova-gold/20 transition-all mt-2 cursor-pointer disabled:opacity-55"
            >
              {isLoading ? 'Creating...' : 'Sign Up & Login'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
