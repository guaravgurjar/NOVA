import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  FormEvent,
  ReactNode,
} from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  ChevronRight,
  ArrowLeft,
  RefreshCw,
  Gem,
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

/* ─── Country codes ───────────────────────────────────────────── */
const COUNTRY_CODES = [
  { code: '+91', label: '🇮🇳 +91', name: 'India' },
  { code: '+1', label: '🇺🇸 +1', name: 'USA/Canada' },
  { code: '+44', label: '🇬🇧 +44', name: 'UK' },
  { code: '+61', label: '🇦🇺 +61', name: 'Australia' },
  { code: '+971', label: '🇦🇪 +971', name: 'UAE' },
  { code: '+65', label: '🇸🇬 +65', name: 'Singapore' },
];

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30;

/* ─── Context ─────────────────────────────────────────────────── */
type LoginModalContextType = {
  openLoginModal: (message?: string) => void;
  closeLoginModal: () => void;
};

const LoginModalContext = createContext<LoginModalContextType | undefined>(undefined);

export function useLoginModal() {
  const ctx = useContext(LoginModalContext);
  if (!ctx) throw new Error('useLoginModal must be used within LoginModalProvider');
  return ctx;
}

/* ─── Provider ────────────────────────────────────────────────── */
export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [promptMessage, setPromptMessage] = useState('');

  const openLoginModal = useCallback((message = '') => {
    setPromptMessage(message);
    setIsOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => setIsOpen(false), []);

  return (
    <LoginModalContext.Provider value={{ openLoginModal, closeLoginModal }}>
      {children}
      {isOpen && (
        <LoginModal
          promptMessage={promptMessage}
          onClose={closeLoginModal}
        />
      )}
    </LoginModalContext.Provider>
  );
}

/* ─── Modal Component ─────────────────────────────────────────── */
function LoginModal({
  promptMessage,
  onClose,
}: {
  promptMessage: string;
  onClose: () => void;
}) {
  const { loginWithGmail, loginWithEmail, loginWithPhone, signUpWithEmail } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');

  // Email login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Phone OTP
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmResult] = useState<any>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Cleanup cooldown timer on unmount
  useEffect(() => () => { if (cooldownRef.current) clearInterval(cooldownRef.current); }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const startCooldown = useCallback(() => {
    setResendCooldown(RESEND_COOLDOWN);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { if (cooldownRef.current) clearInterval(cooldownRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, []);

  /* ── Handlers ── */
  const handleGmail = async () => {
    setIsLoading(true);
    try {
      await loginWithGmail();
      addToast('Signed in with Google!');
      onClose();
    } catch (err: any) {
      addToast(err.message || 'Google sign-in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) { addToast('Please fill in all fields'); return; }
    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
      addToast('Logged in successfully!');
      onClose();
    } catch (err: any) {
      addToast(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!phoneNumber.trim()) { addToast('Please enter a valid mobile number.'); return; }
    const fullPhone = `${countryCode}${phoneNumber.trim()}`;
    setIsLoading(true);
    try {
      const result = await loginWithPhone(fullPhone, 'modal-recaptcha-container');
      setConfirmResult(result);
      setOtpSent(true);
      setOtpDigits(Array(OTP_LENGTH).fill(''));
      startCooldown();
      addToast('Verification code sent!');
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      addToast(err.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, OTP_LENGTH).split('');
      const next = [...Array(OTP_LENGTH).fill('')];
      digits.forEach((d, i) => { next[i] = d; });
      setOtpDigits(next);
      otpRefs.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus();
      return;
    }
    const digit = value.replace(/\D/g, '');
    const next = [...otpDigits]; next[index] = digit;
    setOtpDigits(next);
    if (digit && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otpDigits[index]) { const n = [...otpDigits]; n[index] = ''; setOtpDigits(n); }
      else if (index > 0) otpRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) otpRefs.current[index - 1]?.focus();
    else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus();
  };

  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpCode = otpDigits.join('');
    if (otpCode.length !== OTP_LENGTH) { addToast('Please enter the complete 6-digit code.'); return; }
    setIsLoading(true);
    try {
      await confirmationResult.confirm(otpCode);
      addToast('Authenticated successfully!');
      onClose();
    } catch (err: any) {
      addToast(err.message || 'Invalid code. Please try again.');
      setOtpDigits(Array(OTP_LENGTH).fill(''));
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!regFirstName || !regLastName || !regEmail || !regPassword) {
      addToast('Please fill in all required fields'); return;
    }
    setIsLoading(true);
    try {
      await signUpWithEmail(regEmail, regPassword, regFirstName, regLastName, regPhone);
      addToast(`Welcome to NOVA, ${regFirstName}!`);
      onClose();
    } catch (err: any) {
      addToast(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls =
    'w-full bg-[#0a0c14] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-nova-gold/60 transition-colors';

  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center p-4"
      style={{ animation: 'fadeIn 0.2s ease' }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-md bg-[#0f1220] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{ animation: 'slideUp 0.25s ease' }}
        role="dialog"
        aria-modal="true"
        aria-label="Sign in to continue"
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2.5 mb-1">
            <Gem className="w-5 h-5 text-nova-gold" />
            <span className="text-nova-gold font-serif tracking-[0.2em] text-sm uppercase">NOVA</span>
          </div>
          <h2 className="text-xl font-serif font-light text-white">
            {activeTab === 'login' ? 'Sign in to continue' : 'Create an account'}
          </h2>
          {promptMessage && (
            <p className="text-white/50 text-xs mt-1">{promptMessage}</p>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* Tabs */}
          <div className="flex bg-white/5 rounded-xl p-1 gap-1">
            {(['login', 'register'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer ${activeTab === tab
                    ? 'bg-nova-gold text-nova-darker shadow'
                    : 'text-white/50 hover:text-white'
                  }`}
              >
                {tab === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {/* ═══════════ LOGIN TAB ═══════════ */}
          {activeTab === 'login' && (
            <div className="space-y-4">
              {/* Google */}
              <button
                onClick={handleGmail}
                disabled={isLoading}
                id="modal-google-signin-btn"
                className="w-full flex items-center justify-center gap-3 bg-white text-zinc-900 font-semibold py-2.5 rounded-xl text-sm hover:bg-zinc-100 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
                  <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z" />
                  <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z" />
                  <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-white/30 text-[10px] uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Method toggle */}
              <div className="flex bg-white/5 rounded-lg p-0.5 gap-0.5">
                {(['email', 'phone'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => { setLoginMethod(m); setOtpSent(false); }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${loginMethod === m ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
                      }`}
                  >
                    {m === 'email' ? <Mail className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
                    {m}
                  </button>
                ))}
              </div>

              {/* Email login form */}
              {loginMethod === 'email' && (
                <form onSubmit={handleEmailLogin} className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="Email address" required autoComplete="email"
                      className={`${inputCls} pl-10`} id="modal-email-input"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="password" value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Password" required autoComplete="current-password"
                      className={`${inputCls} pl-10`} id="modal-password-input"
                    />
                  </div>
                  <button
                    type="submit" disabled={isLoading} id="modal-email-login-btn"
                    className="w-full bg-nova-gold text-nova-darker font-bold py-3 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-nova-gold-light transition-all cursor-pointer disabled:opacity-60"
                  >
                    {isLoading
                      ? <span className="w-4 h-4 border-2 border-nova-darker border-t-transparent rounded-full animate-spin" />
                      : <><ChevronRight className="w-4 h-4" /><span>Sign In</span></>}
                  </button>
                </form>
              )}

              {/* Phone OTP */}
              {loginMethod === 'phone' && (
                <>
                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-3">
                      <div className="flex gap-2">
                        <select
                          value={countryCode} onChange={e => setCountryCode(e.target.value)}
                          className="bg-[#0a0c14] border border-white/10 rounded-lg px-2 py-2.5 text-xs text-white focus:outline-none focus:border-nova-gold/60"
                        >
                          {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                        </select>
                        <div className="relative flex-1">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                          <input
                            type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                            placeholder="Mobile number" required
                            className={`${inputCls} pl-10`} id="modal-phone-input"
                          />
                        </div>
                      </div>
                      <div id="modal-recaptcha-container" />
                      <button
                        type="submit" disabled={isLoading} id="modal-send-otp-btn"
                        className="w-full bg-nova-gold text-nova-darker font-bold py-3 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-nova-gold-light transition-all cursor-pointer disabled:opacity-60"
                      >
                        {isLoading
                          ? <span className="w-4 h-4 border-2 border-nova-darker border-t-transparent rounded-full animate-spin" />
                          : <><ChevronRight className="w-4 h-4" /><span>Send OTP</span></>}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <p className="text-white/60 text-xs text-center">
                        Code sent to <span className="text-white font-medium">{countryCode} {phoneNumber}</span>
                      </p>
                      <div className="flex gap-2 justify-center">
                        {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                          <input
                            key={i} ref={el => { otpRefs.current[i] = el; }}
                            type="text" inputMode="numeric" maxLength={OTP_LENGTH}
                            value={otpDigits[i]}
                            onChange={e => handleOtpChange(i, e.target.value)}
                            onKeyDown={e => handleOtpKeyDown(i, e)}
                            className="w-10 h-12 bg-[#0a0c14] border border-white/10 rounded-lg text-center text-white text-lg font-bold focus:outline-none focus:border-nova-gold/60 transition-colors"
                          />
                        ))}
                      </div>
                      <button
                        type="submit" disabled={isLoading} id="modal-verify-otp-btn"
                        className="w-full bg-nova-gold text-nova-darker font-bold py-3 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-nova-gold-light transition-all cursor-pointer disabled:opacity-60"
                      >
                        {isLoading
                          ? <span className="w-4 h-4 border-2 border-nova-darker border-t-transparent rounded-full animate-spin" />
                          : <><ChevronRight className="w-4 h-4" /><span>Verify & Sign In</span></>}
                      </button>
                      <div className="text-center space-y-2">
                        <button
                          type="button"
                          onClick={() => { setOtpSent(false); setPhoneNumber(''); setOtpDigits(Array(OTP_LENGTH).fill('')); }}
                          className="text-white/40 hover:text-white text-xs flex items-center gap-1 mx-auto cursor-pointer"
                        >
                          <ArrowLeft className="w-3 h-3" /> Change number
                        </button>
                        {resendCooldown > 0 ? (
                          <p className="text-white/30 text-xs">Resend in {resendCooldown}s</p>
                        ) : (
                          <button
                            type="button" onClick={() => handleSendOtp()} disabled={isLoading}
                            className="text-nova-gold/70 hover:text-nova-gold text-xs flex items-center gap-1 mx-auto cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3" /> Resend code
                          </button>
                        )}
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          )}

          {/* ═══════════ REGISTER TAB ═══════════ */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text" value={regFirstName} onChange={e => setRegFirstName(e.target.value)}
                    placeholder="First name" required className={`${inputCls} pl-10`} id="modal-reg-firstname"
                  />
                </div>
                <input
                  type="text" value={regLastName} onChange={e => setRegLastName(e.target.value)}
                  placeholder="Last name" required className={inputCls} id="modal-reg-lastname"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)}
                  placeholder="Email address" required autoComplete="email"
                  className={`${inputCls} pl-10`} id="modal-reg-email"
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="tel" value={regPhone} onChange={e => setRegPhone(e.target.value)}
                  placeholder="Phone number (optional)"
                  className={`${inputCls} pl-10`} id="modal-reg-phone"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)}
                  placeholder="Create password" required autoComplete="new-password" minLength={6}
                  className={`${inputCls} pl-10`} id="modal-reg-password"
                />
              </div>
              <button
                type="submit" disabled={isLoading} id="modal-register-btn"
                className="w-full bg-nova-gold text-nova-darker font-bold py-3 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-nova-gold-light transition-all cursor-pointer disabled:opacity-60 mt-1"
              >
                {isLoading
                  ? <span className="w-4 h-4 border-2 border-nova-darker border-t-transparent rounded-full animate-spin" />
                  : <><Gem className="w-4 h-4" /><span>Create Account</span></>}
              </button>
            </form>
          )}

          <p className="text-center text-[10px] text-white/25 leading-relaxed pb-1">
            By continuing, you agree to NOVA's Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
}
