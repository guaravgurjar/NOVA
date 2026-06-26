import { useState, FormEvent } from 'react';
import { Lock, Mail, User, Phone, ChevronRight } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Email Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Registration State
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  
  // Phone Login States
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const { addToast } = useToast();
  const navigate = useNavigate();
  const { loginWithGmail, loginWithEmail, loginWithPhone, signUpWithEmail } = useAuth();

  const handleEmailLogin = async (e: FormEvent) => {
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

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      addToast('Please enter a valid mobile number.');
      return;
    }

    let formattedPhone = phoneNumber.trim();
    if (!formattedPhone.startsWith('+')) {
      if (formattedPhone.length === 10) {
        formattedPhone = `+91${formattedPhone}`;
      } else {
        addToast('Please enter a valid country code prefix (e.g. +91 99999 99999).');
        return;
      }
    }

    setIsLoading(true);
    try {
      const confirmResult = await loginWithPhone(formattedPhone, 'recaptcha-container');
      setConfirmationResult(confirmResult);
      setOtpSent(true);
      addToast('Verification code (OTP) sent successfully!');
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'Failed to send OTP code. Please check your phone number.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!otpCode) {
      addToast('Please enter the 6-digit verification code.');
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
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
            disabled={isLoading}
            className={`flex-1 pb-3 text-xs md:text-sm font-semibold uppercase tracking-widest transition-all duration-300 border-b-2 cursor-pointer ${
              activeTab === 'login' 
                ? 'border-nova-gold text-nova-gold font-bold' 
                : 'border-transparent text-white/40 hover:text-white/80'
            }`}
          >
            Sign In
          </button>
          <button 
            onClick={() => setActiveTab('register')}
            disabled={isLoading}
            className={`flex-1 pb-3 text-xs md:text-sm font-semibold uppercase tracking-widest transition-all duration-300 border-b-2 cursor-pointer ${
              activeTab === 'register' 
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
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Sign In with Google</span>
              </button>
              <div className="flex items-center my-6">
                <div className="flex-1 h-[1px] bg-white/10"></div>
                <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] px-4">or use credentials</span>
                <div className="flex-1 h-[1px] bg-white/10"></div>
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
                  onClick={() => { setLoginMethod('phone'); }}
                  className={`pb-1 cursor-pointer transition-colors ${loginMethod === 'phone' ? 'text-nova-gold border-b-2 border-nova-gold font-bold' : 'text-white/40 hover:text-white/70'}`}
                >
                  Mobile Number
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

            {/* PHONE LOGIN FLOW */}
            {loginMethod === 'phone' && (
              <div className="animate-fade-in">
                {!otpSent ? (
                  /* Form to enter mobile number and send OTP */
                  <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 block mb-1.5 font-medium">Mobile Number</label>
                      <div className="flex items-center bg-[#121522] border border-white/10 rounded-xl focus-within:border-nova-gold/60 transition-colors px-4 py-3">
                        <Phone className="w-4 h-4 text-white/30 mr-3" />
                        <input 
                          type="tel" 
                          placeholder="e.g. 99999 99999 (or with +91)"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          disabled={isLoading}
                          required
                          className="bg-transparent border-none focus:outline-none text-xs text-white placeholder-white/20 w-full"
                        />
                      </div>
                      <p className="text-[9px] text-white/40 mt-1">For Indian numbers, you can omit the +91 prefix.</p>
                    </div>

                    <div id="recaptcha-container" className="my-2"></div>

                    <button 
                      type="submit"
                      disabled={isLoading || !phoneNumber.trim()}
                      className="btn-premium w-full bg-nova-gold text-nova-darker py-3.5 rounded-xl text-xs font-semibold uppercase tracking-widest hover:bg-nova-gold-light hover:shadow-lg hover:shadow-nova-gold/20 transition-all mt-1 cursor-pointer disabled:opacity-55"
                    >
                      {isLoading ? 'Sending OTP...' : 'Send Verification OTP'}
                    </button>
                  </form>
                ) : (
                  /* Form to enter OTP and verify */
                  <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 block mb-1.5 font-medium">Enter 6-Digit OTP *</label>
                      <div className="flex items-center bg-[#121522] border border-white/10 rounded-xl focus-within:border-nova-gold/60 transition-colors px-4 py-3">
                        <Lock className="w-4 h-4 text-white/30 mr-3" />
                        <input 
                          type="text" 
                          maxLength={6}
                          placeholder="Enter Code"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                          disabled={isLoading}
                          required
                          className="bg-transparent border-none focus:outline-none text-xs text-white placeholder-white/20 w-full tracking-[0.5em] text-center font-bold"
                        />
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] text-white/50 font-light">Sent to {phoneNumber}</span>
                        <button 
                          type="button" 
                          onClick={() => { setOtpSent(false); setOtpCode(''); }}
                          className="text-[10px] text-nova-gold hover:underline font-semibold cursor-pointer"
                        >
                          Change Number
                        </button>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={isLoading || otpCode.length !== 6}
                      className="btn-premium w-full bg-nova-gold text-nova-darker py-3.5 rounded-xl text-xs font-semibold uppercase tracking-widest hover:bg-nova-gold-light hover:shadow-lg hover:shadow-nova-gold/20 transition-all mt-2 cursor-pointer disabled:opacity-55"
                    >
                      {isLoading ? 'Verifying OTP...' : 'Verify OTP & Log In'}
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
                onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ""))}
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
