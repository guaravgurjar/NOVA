import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Phone, RefreshCw, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const COUNTRY_CODES = [
  { code: '+91', label: '🇮🇳 +91' },
  { code: '+1', label: '🇺🇸 +1' },
  { code: '+44', label: '🇬🇧 +44' },
  { code: '+61', label: '🇦🇺 +61' },
  { code: '+971', label: '🇦🇪 +971' },
  { code: '+65', label: '🇸🇬 +65' },
];

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30;

const fieldClass =
  'w-full bg-white border border-neutral-300 rounded-xl py-3 pl-11 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors';

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  );
}

export function AuthScreen({
  onClose,
  onSuccess,
  promptMessage = '',
  recaptchaId = 'recaptcha-container',
}: {
  onClose?: () => void;
  onSuccess: () => void;
  promptMessage?: string;
  recaptchaId?: string;
}) {
  const { loginWithGmail, loginWithEmail, loginWithPhone, signUpWithEmail } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
  }, []);

  const startResendCooldown = useCallback(() => {
    setResendCooldown(RESEND_COOLDOWN);
    if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    cooldownTimerRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const finish = (message: string) => {
    addToast(message);
    onSuccess();
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGmail();
      finish('Signed in with Google!');
    } catch (err: any) {
      addToast(err.message || 'Google sign-in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
      finish('Logged in successfully!');
    } catch (err: any) {
      addToast(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!phoneNumber.trim()) {
      addToast('Please enter a valid mobile number.');
      return;
    }
    setIsLoading(true);
    try {
      const confirmResult = await loginWithPhone(`${countryCode}${phoneNumber.trim()}`, recaptchaId);
      setConfirmationResult(confirmResult);
      setOtpSent(true);
      setOtpDigits(Array(OTP_LENGTH).fill(''));
      startResendCooldown();
      addToast('Verification code sent!');
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      addToast(err.message || 'Failed to send OTP. Please check your phone number.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, OTP_LENGTH).split('');
      const next = Array(OTP_LENGTH).fill('');
      digits.forEach((d, i) => { next[i] = d; });
      setOtpDigits(next);
      otpInputRefs.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus();
      return;
    }
    const digit = value.replace(/\D/g, '');
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    if (digit && index < OTP_LENGTH - 1) otpInputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otpDigits[index]) {
        const next = [...otpDigits];
        next[index] = '';
        setOtpDigits(next);
      } else if (index > 0) otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) otpInputRefs.current[index - 1]?.focus();
    else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) otpInputRefs.current[index + 1]?.focus();
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
      finish('Authenticated successfully!');
    } catch (err: any) {
      addToast(err.message || 'Invalid verification code. Please try again.');
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
      finish(`Welcome to NOVA, ${regFirstName}!`);
    } catch (err: any) {
      addToast(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const panel = (
    <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2 md:min-h-[680px] max-h-[94vh]">
      <div className="relative hidden md:block min-h-[680px]">
        <img
          src="/images/auth/signin-panel.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-left"
        />
      </div>

      <div className="relative overflow-y-auto px-5 sm:px-10 py-8 sm:py-10">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full text-neutral-500 hover:bg-neutral-100 flex items-center justify-center cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex justify-center mb-6">
          <img src="/images/banners/logo_new.webp" alt="NOVA" className="h-12 sm:h-14 w-auto object-contain" />
        </div>

        <h1 className="text-[1.65rem] font-semibold text-neutral-900 tracking-tight text-center">
          {activeTab === 'login' ? 'Sign in to continue' : 'Create an account'}
        </h1>
        <p className="text-sm text-neutral-500 text-center mt-1.5 mb-6">
          {activeTab === 'login'
            ? (promptMessage || 'Please sign in to place your order.')
            : 'Join NOVA to save pieces and check out faster.'}
        </p>

        <div className="grid grid-cols-2 rounded-xl overflow-hidden bg-neutral-100 p-1 mb-5">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`py-2.5 rounded-lg text-xs font-semibold tracking-[0.16em] cursor-pointer ${activeTab === 'login' ? 'bg-neutral-900 text-white' : 'text-neutral-500'}`}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`py-2.5 rounded-lg text-xs font-semibold tracking-[0.16em] cursor-pointer ${activeTab === 'register' ? 'bg-neutral-900 text-white' : 'text-neutral-500'}`}
          >
            REGISTER
          </button>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2.5 border border-neutral-300 rounded-xl py-3 text-sm font-medium text-neutral-800 hover:bg-neutral-50 cursor-pointer disabled:opacity-60"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-neutral-200" />
          <span className="text-[11px] tracking-[0.2em] text-neutral-400">OR</span>
          <div className="flex-1 h-px bg-neutral-200" />
        </div>

        {activeTab === 'login' ? (
          <>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => { setLoginMethod('email'); setOtpSent(false); }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-semibold tracking-[0.14em] cursor-pointer ${loginMethod === 'email' ? 'bg-neutral-100 border-neutral-300 text-neutral-900' : 'bg-white border-neutral-200 text-neutral-500'}`}
              >
                <Mail className="w-3.5 h-3.5" /> EMAIL
              </button>
              <button
                type="button"
                onClick={() => { setLoginMethod('phone'); setOtpSent(false); }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-semibold tracking-[0.14em] cursor-pointer ${loginMethod === 'phone' ? 'bg-neutral-100 border-neutral-300 text-neutral-900' : 'bg-white border-neutral-200 text-neutral-500'}`}
              >
                <Phone className="w-3.5 h-3.5" /> PHONE
              </button>
            </div>

            {loginMethod === 'email' ? (
              <form onSubmit={handleEmailLogin} className="flex flex-col gap-3">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" autoComplete="email" className={fieldClass} />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" autoComplete="current-password" className={`${fieldClass} pr-11`} />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 cursor-pointer" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button type="submit" disabled={isLoading} className="mt-1 w-full bg-neutral-900 text-white py-3.5 rounded-xl text-xs font-semibold tracking-[0.18em] hover:bg-black cursor-pointer disabled:opacity-60">
                  {isLoading ? 'SIGNING IN…' : 'SIGN IN  →'}
                </button>
              </form>
            ) : !otpSent ? (
              <form onSubmit={handleSendOtp} className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="border border-neutral-300 rounded-xl px-2 text-sm bg-white">
                    {COUNTRY_CODES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
                  </select>
                  <div className="relative flex-1">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input type="tel" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))} placeholder="Mobile number" className={fieldClass} />
                  </div>
                </div>
                <div id={recaptchaId} />
                <button type="submit" disabled={isLoading} className="w-full bg-neutral-900 text-white py-3.5 rounded-xl text-xs font-semibold tracking-[0.18em] cursor-pointer disabled:opacity-60">
                  {isLoading ? 'SENDING…' : 'SEND OTP  →'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                <p className="text-center text-sm text-neutral-500">Code sent to <span className="text-neutral-900 font-medium">{countryCode} {phoneNumber}</span></p>
                <div className="flex justify-center gap-2">
                  {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpInputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otpDigits[i]}
                      onChange={(e) => handleOtpDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-10 h-12 text-center text-lg font-semibold border border-neutral-300 rounded-xl focus:outline-none focus:border-neutral-900"
                    />
                  ))}
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-neutral-900 text-white py-3.5 rounded-xl text-xs font-semibold tracking-[0.18em] cursor-pointer disabled:opacity-60">
                  {isLoading ? 'VERIFYING…' : 'VERIFY & SIGN IN  →'}
                </button>
                <div className="flex items-center justify-center gap-4 text-xs text-neutral-500">
                  <button type="button" onClick={() => { setOtpSent(false); setOtpDigits(Array(OTP_LENGTH).fill('')); }} className="inline-flex items-center gap-1 cursor-pointer">
                    <ArrowLeft className="w-3 h-3" /> Change number
                  </button>
                  {resendCooldown > 0 ? (
                    <span>Resend in {resendCooldown}s</span>
                  ) : (
                    <button type="button" onClick={() => handleSendOtp()} className="inline-flex items-center gap-1 cursor-pointer">
                      <RefreshCw className="w-3 h-3" /> Resend code
                    </button>
                  )}
                </div>
              </form>
            )}
          </>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <input required value={regFirstName} onChange={(e) => setRegFirstName(e.target.value)} placeholder="First name" className="w-full border border-neutral-300 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-neutral-900" />
              <input required value={regLastName} onChange={(e) => setRegLastName(e.target.value)} placeholder="Last name" className="w-full border border-neutral-300 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-neutral-900" />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="Email address" autoComplete="email" className={fieldClass} />
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))} placeholder="Phone number (optional)" className={fieldClass} />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input type={showRegPassword ? 'text' : 'password'} required minLength={6} value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="Password" autoComplete="new-password" className={`${fieldClass} pr-11`} />
              <button type="button" onClick={() => setShowRegPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 cursor-pointer" aria-label={showRegPassword ? 'Hide password' : 'Show password'}>
                {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button type="submit" disabled={isLoading} className="mt-1 w-full bg-neutral-900 text-white py-3.5 rounded-xl text-xs font-semibold tracking-[0.18em] hover:bg-black cursor-pointer disabled:opacity-60">
              {isLoading ? 'CREATING…' : 'REGISTER  →'}
            </button>
          </form>
        )}

        <p className="text-center text-[11px] text-neutral-400 mt-6 leading-relaxed">
          By continuing, you agree to NOVA&apos;s{' '}
          <Link to="/terms" className="underline" onClick={onClose}>Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" className="underline" onClick={onClose}>Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );

  if (onClose) {
    return (
      <div className="fixed inset-0 z-[220] flex items-center justify-center p-3 sm:p-6 bg-black/55">
        <button type="button" className="absolute inset-0 cursor-default" aria-label="Close sign in" onClick={onClose} />
        <div className="relative z-10 w-full flex justify-center" role="dialog" aria-modal="true" aria-label="Sign in to continue">
          {panel}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center py-8 px-4 bg-neutral-100 min-h-[85vh]">
      {panel}
    </div>
  );
}
