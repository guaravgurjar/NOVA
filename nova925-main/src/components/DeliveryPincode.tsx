import { useState, useEffect, useRef, FormEvent } from 'react';
import { MapPin, X, Truck, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface PostOffice {
  Name: string;
  District: string;
  State: string;
  Country: string;
  Pincode: string;
}

interface PincodeResponse {
  Message: string;
  Status: string;
  PostOffice: PostOffice[] | null;
}

export function DeliveryPincode() {
  const [isOpen, setIsOpen] = useState(false);
  const [pincode, setPincode] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load saved pincode from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('nova_delivery_pincode');
    const savedLocation = localStorage.getItem('nova_delivery_location');
    const savedDistrict = localStorage.getItem('nova_delivery_district');
    const savedState = localStorage.getItem('nova_delivery_state');
    if (saved) {
      setPincode(saved);
      setInputValue(saved);
    }
    if (savedLocation) setLocation(savedLocation);
    if (savedDistrict) setDistrict(savedDistrict);
    if (savedState) setState(savedState);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Auto-focus the input when opening
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  function getEstimatedDelivery(stateName: string): string {
    const now = new Date();
    // Metro states get faster delivery
    const metroStates = ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Gujarat'];
    const daysToAdd = metroStates.some(s => stateName.includes(s)) ? 3 : 5;
    const minDate = new Date(now);
    minDate.setDate(minDate.getDate() + daysToAdd);
    const maxDate = new Date(now);
    maxDate.setDate(maxDate.getDate() + daysToAdd + 2);

    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const minStr = minDate.toLocaleDateString('en-IN', options);
    const maxStr = maxDate.toLocaleDateString('en-IN', options);
    return `${minStr} – ${maxStr}`;
  }

  async function handleCheckPincode(e: FormEvent) {
    e.preventDefault();
    const trimmed = inputValue.trim();

    if (!/^\d{6}$/.test(trimmed)) {
      setError('Please enter a valid 6-digit pincode');
      return;
    }

    setLoading(true);
    setError('');
    setLocation('');
    setDistrict('');
    setState('');
    setEstimatedDelivery('');

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${trimmed}`);
      const data: PincodeResponse[] = await res.json();

      if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length) {
        const po = data[0].PostOffice[0];
        const locName = po.Name;
        const distName = po.District;
        const stateName = po.State;

        setPincode(trimmed);
        setLocation(locName);
        setDistrict(distName);
        setState(stateName);
        const est = getEstimatedDelivery(stateName);
        setEstimatedDelivery(est);

        // Persist to localStorage
        localStorage.setItem('nova_delivery_pincode', trimmed);
        localStorage.setItem('nova_delivery_location', locName);
        localStorage.setItem('nova_delivery_district', distName);
        localStorage.setItem('nova_delivery_state', stateName);
      } else {
        setError('Pincode not found. Please enter a valid Indian pincode.');
      }
    } catch {
      setError('Unable to verify pincode. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div ref={dropdownRef} className="relative hidden md:block">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer group flex items-center gap-2 text-sm border border-nova-dark/30 rounded-lg px-3 py-2 hover:border-nova-gold/60 transition-all duration-300"
        aria-label="Update Delivery Pincode"
        aria-expanded={isOpen}
      >
        <MapPin className="w-4 h-4 text-nova-gold shrink-0" />
        <div className="flex flex-col items-start leading-tight">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            {pincode ? 'Deliver to' : 'Where to Deliver?'}
          </span>
          <span className="font-bold text-slate-900 text-xs">
            {pincode ? (
              <>
                {location || 'Location'}{' '}
                <span className="text-nova-gold font-extrabold">{pincode}</span>
              </>
            ) : (
              <span className="underline group-hover:no-underline">Update Pincode</span>
            )}
          </span>
        </div>
        <svg
          aria-hidden="true"
          focusable="false"
          className={`w-3 h-3 text-current transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5.5 7.5L10 12l4.5-4.5" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 animate-fade-in overflow-hidden"
          role="dialog"
          aria-label="Enter delivery pincode"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-nova-gold/15 flex items-center justify-center">
                <Truck className="w-3.5 h-3.5 text-nova-gold" />
              </div>
              <span className="font-bold text-sm text-slate-800">Check Delivery</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="cursor-pointer w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleCheckPincode} className="p-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={inputValue}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setInputValue(val);
                    if (error) setError('');
                  }}
                  placeholder="Enter 6-digit pincode"
                  className="w-full text-sm border border-slate-300 rounded-lg py-2.5 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-nova-gold/40 focus:border-nova-gold transition-all duration-200 placeholder:text-slate-400"
                  aria-label="Delivery Pincode"
                />
                {inputValue && (
                  <button
                    type="button"
                    onClick={() => { setInputValue(''); setError(''); }}
                    className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                    aria-label="Clear input"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || inputValue.length < 6}
                className="cursor-pointer px-5 py-2.5 bg-nova-gold text-white text-sm font-semibold rounded-lg hover:bg-nova-gold-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1.5 shrink-0 shadow-sm hover:shadow-md"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Check'
                )}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-3 flex items-start gap-2 text-red-600 text-xs bg-red-50 rounded-lg px-3 py-2 animate-fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Result */}
            {pincode && location && !error && (
              <div className="mt-3 space-y-2 animate-fade-in">
                {/* Location */}
                <div className="flex items-start gap-2 bg-emerald-50 rounded-lg px-3 py-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-semibold text-emerald-800">
                      Delivery available to {location}
                    </p>
                    <p className="text-emerald-600 mt-0.5">
                      {district}, {state} – {pincode}
                    </p>
                  </div>
                </div>

                {/* Estimated Delivery */}
                {estimatedDelivery && (
                  <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2.5">
                    <Truck className="w-4 h-4 text-blue-500 shrink-0" />
                    <div className="text-xs">
                      <span className="text-blue-600">Estimated Delivery: </span>
                      <span className="font-bold text-blue-800">{estimatedDelivery}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Footer hint */}
          <div className="px-4 pb-3">
            <p className="text-[10px] text-slate-400 text-center">
              Free shipping on all orders • Pan India delivery
            </p>
          </div>
        </div>
      )}
    </div>
  );
}