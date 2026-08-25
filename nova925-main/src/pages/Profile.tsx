import { User, ShoppingBag, MapPin, LogOut, ShieldCheck, Gift, Bell, Plus, Trash2, Cake, Heart, Sparkles, CalendarHeart } from 'lucide-react';
import { useState, useEffect, FormEvent } from 'react';
import { useToast } from '../contexts/ToastContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { SpecialOccasion, NotificationPrefs } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';
import { usePageSEO } from '../lib/usePageSEO';

interface DeliveryAddress {
  id: string;
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault: boolean;
}

export function Profile() {
  usePageSEO({ title: 'My Profile', noIndex: true });
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'address'>('profile');
  
  // Dynamic Profile Form States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<'male' | 'female' | 'others' | null>(null);

  // Enhanced Profile Fields for CRM / Notifications
  const [anniversary, setAnniversary] = useState("");
  const [zodiacSign, setZodiacSign] = useState("");
  const [occasions, setOccasions] = useState<SpecialOccasion[]>([]);
  const [notifications, setNotifications] = useState<NotificationPrefs>({
    birthday: true,
    anniversary: true,
    offers: true,
    productSuggestions: true
  });

  // Address Management States
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    id: '',
    fullName: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    pinCode: '',
    isDefault: false
  });

  const [isLocating, setIsLocating] = useState(false);
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);

  const fetchAddressByGeolocation = () => {
    if (!navigator.geolocation) {
      addToast('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    addToast('Retrieving your location...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            {
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'NOVA-Sterling-Silver-Boutique'
              }
            }
          );
          if (!response.ok) throw new Error('Geocoding service error');
          const data = await response.json();
          
          if (data && data.address) {
            const addr = data.address;
            const street = [
              addr.road || addr.suburb || '',
              addr.neighbourhood || addr.neighbourhood_level2 || '',
              addr.subdivision || ''
            ].filter(Boolean).join(', ');

            const city = addr.city || addr.town || addr.village || addr.county || addr.state_district || '';
            const state = addr.state || '';
            const pinCode = addr.postcode || '';

            setAddressForm(prev => ({
              ...prev,
              streetAddress: street || prev.streetAddress,
              city: city || prev.city,
              state: state || prev.state,
              pinCode: pinCode || prev.pinCode
            }));
            
            addToast('Location details auto-filled!');
          } else {
            addToast('Could not resolve address details for this location.');
          }
        } catch (error) {
          console.error("Reverse geocoding failed", error);
          addToast('Failed to resolve address from geocoding service.');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation failed", error);
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          addToast('Location access denied by user.');
        } else {
          addToast('Failed to retrieve your current location.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const fetchAddressByPincode = async (pincode: string) => {
    const cleanPin = pincode.trim().replace(/\s/g, '');
    if (cleanPin.length !== 6 || isNaN(Number(cleanPin))) {
      return;
    }

    setIsFetchingPincode(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
      if (!response.ok) throw new Error('Postal API error');
      const data = await response.json();

      if (data && data[0] && data[0].Status === 'Success') {
        const postOffice = data[0].PostOffice[0];
        const district = postOffice.District;
        const state = postOffice.State;
        
        setAddressForm(prev => ({
          ...prev,
          city: district,
          state: state
        }));
        addToast(`Pincode verified! Auto-filled ${district}, ${state}`);
      } else {
        addToast('Invalid Pincode or no data found.');
      }
    } catch (error) {
      console.error("Pincode fetch failed", error);
    } finally {
      setIsFetchingPincode(false);
    }
  };

  // Helper to get the userId for API calls
  const getUserId = (): string => {
    if (auth && (auth as any).name !== 'mockAuth' && auth.currentUser) {
      return auth.currentUser.uid;
    }
    return user?.email || 'local-user';
  };

  // Load addresses from MongoDB API or localStorage on mount/user change
  useEffect(() => {
    if (!user) return;
    
    const loadAddresses = async () => {
      const userId = getUserId();
      
      try {
        const res = await fetch(`/api/addresses/${encodeURIComponent(userId)}`);
        const data = await res.json();
        
        if (data.success && data.addresses && data.addresses.length > 0) {
          // Map MongoDB documents to DeliveryAddress (strip MongoDB _id)
          const list: DeliveryAddress[] = data.addresses.map((a: any) => ({
            id: a.id,
            fullName: a.fullName,
            phone: a.phone,
            streetAddress: a.streetAddress,
            city: a.city,
            state: a.state,
            pinCode: a.pinCode,
            isDefault: a.isDefault
          }));
          list.sort((a, b) => (a.isDefault ? -1 : 1));
          setAddresses(list);
          localStorage.setItem(`nova_addresses_${user.email}`, JSON.stringify(list));
        } else {
          // Load local storage fallback or initial default
          const localStored = localStorage.getItem(`nova_addresses_${user.email}`);
          let initialList: DeliveryAddress[] = [];
          if (localStored) {
            initialList = JSON.parse(localStored);
          } else {
            initialList = [
              {
                id: 'addr-default',
                fullName: `${user.firstName || 'Guest'} ${user.lastName || ''}`.trim(),
                phone: user.phoneNumber || '+91 9027368625',
                streetAddress: 'Ground Floor, Kurawali',
                city: 'Mainpuri',
                state: 'Uttar Pradesh',
                pinCode: '205265',
                isDefault: true
              }
            ];
          }
          setAddresses(initialList);
          // Sync fallback to MongoDB
          for (const addr of initialList) {
            await fetch(`/api/addresses/${encodeURIComponent(userId)}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(addr)
            });
          }
        }
      } catch (err) {
        console.error("Failed to load addresses from server", err);
        const stored = localStorage.getItem(`nova_addresses_${user.email}`);
        if (stored) setAddresses(JSON.parse(stored));
      }
    };

    loadAddresses();
  }, [user]);

  // Helper to save addresses to state and localStorage
  const saveAddressesToStorage = (newAddresses: DeliveryAddress[]) => {
    setAddresses(newAddresses);
    if (user) {
      localStorage.setItem(`nova_addresses_${user.email}`, JSON.stringify(newAddresses));
    }
  };

  const handleAddressSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!addressForm.fullName || !addressForm.phone || !addressForm.streetAddress || !addressForm.city || !addressForm.state || !addressForm.pinCode) {
      addToast('Please fill out all address fields.');
      return;
    }

    let updatedAddresses = [...addresses];
    let activeId = addressForm.id;
    let isNew = false;

    if (addressForm.id) {
      // Edit mode
      updatedAddresses = updatedAddresses.map(addr => {
        if (addr.id === addressForm.id) {
          return { ...addressForm } as DeliveryAddress;
        }
        return addr;
      });
    } else {
      // Add mode
      isNew = true;
      activeId = `addr-${Date.now()}`;
      const newAddr: DeliveryAddress = {
        ...addressForm,
        id: activeId,
      };
      updatedAddresses.push(newAddr);
    }

    // Set default triggers
    if (addressForm.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === activeId
      }));
    } else if (updatedAddresses.length === 1) {
      updatedAddresses[0].isDefault = true;
    }

    // Cloud Sync via MongoDB API
    const userId = getUserId();
    try {
      if (addressForm.isDefault || updatedAddresses.length === 1) {
        for (const addr of updatedAddresses) {
          await fetch(`/api/addresses/${encodeURIComponent(userId)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...addr, isDefault: addr.id === activeId })
          });
        }
      } else {
        const targetAddr = updatedAddresses.find(a => a.id === activeId);
        if (targetAddr) {
          await fetch(`/api/addresses/${encodeURIComponent(userId)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(targetAddr)
          });
        }
      }
      addToast(isNew ? 'Address saved!' : 'Address updated!');
    } catch (err) {
      console.error("Address save failed", err);
      addToast('Saved locally. Cloud sync failed.');
    }

    saveAddressesToStorage(updatedAddresses);
    setIsEditingAddress(false);
    resetAddressForm();
  };

  const handleDeleteAddress = async (id: string) => {
    const toDelete = addresses.find(a => a.id === id);
    let updatedAddresses = addresses.filter(addr => addr.id !== id);
    
    if (toDelete?.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }
    
    const userId = getUserId();
    try {
      await fetch(`/api/addresses/${encodeURIComponent(userId)}/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      if (toDelete?.isDefault && updatedAddresses.length > 0) {
        for (const addr of updatedAddresses) {
          await fetch(`/api/addresses/${encodeURIComponent(userId)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(addr)
          });
        }
      }
      addToast('Address deleted.');
    } catch (err) {
      console.error("Address delete failed", err);
      addToast('Deleted locally. Cloud sync failed.');
    }

    saveAddressesToStorage(updatedAddresses);
  };

  const handleSetDefaultAddress = async (id: string) => {
    const updated = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));

    const userId = getUserId();
    try {
      for (const addr of updated) {
        await fetch(`/api/addresses/${encodeURIComponent(userId)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(addr)
        });
      }
      addToast('Default address updated.');
    } catch (err) {
      console.error("Default address update failed", err);
      addToast('Updated locally. Cloud sync failed.');
    }

    saveAddressesToStorage(updated);
  };

  const resetAddressForm = () => {
    setAddressForm({
      id: '',
      fullName: '',
      phone: '',
      streetAddress: '',
      city: '',
      state: '',
      pinCode: '',
      isDefault: false
    });
  };

  const startEditAddress = (addr: DeliveryAddress) => {
    setAddressForm({ ...addr });
    setIsEditingAddress(true);
  };

  const startAddAddress = () => {
    resetAddressForm();
    setIsEditingAddress(true);
  };

  // Sync user profile data to form state when user changes
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setDob(user.dob || "");
      setGender(user.gender || null);
      setAnniversary(user.anniversary || "");
      setZodiacSign(user.zodiacSign || "");
      setOccasions(user.occasions || []);
      setNotifications(user.notifications || { birthday: true, anniversary: true, offers: true, productSuggestions: true });
    }
  }, [user]);

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProfile({
      firstName,
      lastName,
      email,
      dob,
      gender,
      anniversary,
      zodiacSign,
      occasions,
      notifications
    });
    addToast('Profile saved successfully!');
  };

  // Occasion helpers
  const addOccasion = () => {
    setOccasions(prev => [
      ...prev,
      { id: `occ-${Date.now()}`, type: 'custom', label: '', date: '' }
    ]);
  };

  const updateOccasion = (id: string, field: keyof SpecialOccasion, value: string) => {
    setOccasions(prev =>
      prev.map(occ =>
        occ.id === id ? { ...occ, [field]: value } : occ
      )
    );
  };

  const removeOccasion = (id: string) => {
    setOccasions(prev => prev.filter(occ => occ.id !== id));
  };

  const toggleNotification = (key: keyof NotificationPrefs) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Auto-detect zodiac from DOB
  const getZodiacFromDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';
    return '';
  };

  const handleSignOut = () => {
    logout();
    addToast('Logged out successfully');
    navigate('/login');
  };

  const getInitials = (u: any) => {
    if (!u) return '';
    if (u.authMethod === 'phone') return 'PH';
    const first = u.firstName ? u.firstName.charAt(0) : '';
    const last = u.lastName ? u.lastName.charAt(0) : '';
    return (first + last).toUpperCase() || 'U';
  };

  return (
    <div className="flex flex-col min-h-screen bg-nova-darker text-white">
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Luxury Sidebar */}
        <div className="bg-nova-dark w-full md:w-72 p-8 text-white flex flex-col gap-6 border-r border-white/5 md:min-h-screen">
           <div className="flex items-center gap-3 pb-6 border-b border-white/5 mb-4">
              <div className="w-12 h-12 rounded-full bg-nova-gold/15 border border-nova-gold/30 flex items-center justify-center text-nova-gold font-bold">
                 {getInitials(user)}
              </div>
              <div>
                 <h2 className="text-sm font-semibold tracking-wider">
                   {user.authMethod === 'phone' && user.firstName === 'Guest' ? `Guest (+91...${user.phoneNumber?.slice(-4)})` : `${user.firstName} ${user.lastName}`}
                 </h2>
                 <p className="text-[10px] text-white/40 uppercase tracking-widest">
                   {user.authMethod === 'gmail' ? 'Google Collector' : user.authMethod === 'phone' ? 'Mobile Collector' : 'Signature Member'}
                 </p>
              </div>
           </div>

           <button 
             onClick={() => setActiveTab('profile')}
             className={`flex items-center gap-4 py-2 px-3 rounded-lg text-sm tracking-wide transition-all ${
               activeTab === 'profile' 
                 ? 'bg-nova-gold/10 text-nova-gold font-medium border-l-2 border-nova-gold pl-2.5' 
                 : 'text-white/60 hover:text-white hover:bg-white/5'
             }`}
           >
             <User className="w-4 h-4" /> Account Details
           </button>
           <button 
             onClick={() => setActiveTab('orders')}
             className={`flex items-center gap-4 py-2 px-3 rounded-lg text-sm tracking-wide transition-all ${
               activeTab === 'orders' 
                 ? 'bg-nova-gold/10 text-nova-gold font-medium border-l-2 border-nova-gold pl-2.5' 
                 : 'text-white/60 hover:text-white hover:bg-white/5'
             }`}
           >
             <ShoppingBag className="w-4 h-4" /> Order History
           </button>
           <button 
             onClick={() => setActiveTab('address')}
             className={`flex items-center gap-4 py-2 px-3 rounded-lg text-sm tracking-wide transition-all ${
               activeTab === 'address' 
                 ? 'bg-nova-gold/10 text-nova-gold font-medium border-l-2 border-nova-gold pl-2.5' 
                 : 'text-white/60 hover:text-white hover:bg-white/5'
             }`}
           >
             <MapPin className="w-4 h-4" /> Saved Addresses
           </button>
           
           <button 
             onClick={handleSignOut}
             className="flex items-center gap-4 py-2 px-3 rounded-lg text-sm tracking-wide text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-all mt-auto md:mt-8 text-left"
           >
             <LogOut className="w-4 h-4" /> Sign Out
           </button>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 p-8 md:p-16 flex flex-col items-center overflow-y-auto">
           <div className="w-full max-w-xl glass-dark p-8 md:p-10 rounded-2xl border border-white/10 shadow-2xl relative">
              
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <h3 className="text-xl font-serif tracking-wide text-white">
                  {activeTab === 'profile' ? "Personal Profile" : activeTab === 'orders' ? "My Orders" : "Saved Addresses"}
                </h3>
                <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-nova-gold bg-nova-gold/10 border border-nova-gold/20 px-2 py-0.5 rounded">
                  <ShieldCheck className="w-3 h-3" /> verified
                </span>
              </div>
              
              {activeTab === 'profile' && (
                <form onSubmit={handleSave} className="flex flex-col gap-5">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                       <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 block mb-2 font-medium">First Name</label>
                       <input 
                         type="text" 
                         value={firstName}
                         onChange={(e) => setFirstName(e.target.value)}
                         placeholder="First Name" 
                         className="w-full bg-[#121522] border border-white/10 focus:border-nova-gold rounded-xl py-3 px-5 text-sm text-white focus:outline-none transition-colors" 
                       />
                     </div>
                     <div>
                       <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 block mb-2 font-medium">Last Name</label>
                       <input 
                         type="text" 
                         value={lastName}
                         onChange={(e) => setLastName(e.target.value)}
                         placeholder="Last Name" 
                         className="w-full bg-[#121522] border border-white/10 focus:border-nova-gold rounded-xl py-3 px-5 text-sm text-white focus:outline-none transition-colors" 
                       />
                     </div>
                   </div>

                   <div>
                     <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 block mb-2 font-medium">Email Address</label>
                     <input 
                       type="email" 
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       placeholder="Email" 
                       disabled={user.authMethod === 'gmail'}
                       className="w-full bg-[#121522] border border-white/10 focus:border-nova-gold rounded-xl py-3 px-5 text-sm text-white focus:outline-none transition-colors disabled:opacity-55 disabled:cursor-not-allowed" 
                     />
                   </div>

                   <div>
                     <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 block mb-2 font-medium">Mobile Number</label>
                     <div className="w-full bg-[#121522]/50 border border-white/5 rounded-xl py-3 px-5 text-sm font-semibold text-white/40 select-none tracking-widest">
                        {user.phoneNumber ? `+91 ${user.phoneNumber}` : "+91 *******00 (Not Set)"}
                     </div>
                   </div>
                   
                   <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 block mb-2 font-medium">Gender</label>
                      <div className="flex gap-3">
                         <button 
                           type="button" 
                           onClick={() => setGender('male')}
                           className={`flex-1 border py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                             gender === 'male' 
                               ? 'bg-nova-gold text-nova-darker border-nova-gold font-bold shadow-md shadow-nova-gold/10' 
                               : 'bg-transparent border-white/10 text-white/60 hover:text-white hover:border-white/20'
                           }`}
                         >
                           Male
                         </button>
                         <button 
                           type="button" 
                           onClick={() => setGender('female')}
                           className={`flex-1 border py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                             gender === 'female' 
                               ? 'bg-nova-gold text-nova-darker border-nova-gold font-bold shadow-md shadow-nova-gold/10' 
                               : 'bg-transparent border-white/10 text-white/60 hover:text-white hover:border-white/20'
                           }`}
                         >
                           Female
                         </button>
                         <button 
                           type="button" 
                           onClick={() => setGender('others')}
                           className={`flex-1 border py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                             gender === 'others' 
                               ? 'bg-nova-gold text-nova-darker border-nova-gold font-bold shadow-md shadow-nova-gold/10' 
                               : 'bg-transparent border-white/10 text-white/60 hover:text-white hover:border-white/20'
                           }`}
                         >
                           Others
                         </button>
                      </div>
                   </div>

                   {/* ─── Special Dates Section ──────────────────────────── */}
                   <div className="pt-4 mt-2 border-t border-white/5">
                     <div className="flex items-center gap-2 mb-5">
                       <CalendarHeart className="w-4 h-4 text-nova-gold" />
                       <span className="text-[10px] uppercase tracking-[0.25em] text-nova-gold font-semibold">Special Dates & Occasions</span>
                     </div>

                     {/* Birthday */}
                     <div className="mb-5">
                       <label className="text-sm font-medium text-white/80 block mb-1">When do you celebrate your birthday?</label>
                       <p className="text-[10px] text-nova-gold/60 mb-2 font-light">We'll remember to send you a small surprise 🎁</p>
                       <input 
                         type="date" 
                         value={dob}
                         onChange={(e) => {
                           setDob(e.target.value);
                           const detected = getZodiacFromDate(e.target.value);
                           if (detected) setZodiacSign(detected);
                         }}
                         className="w-full bg-[#121522] border border-white/10 focus:border-nova-gold rounded-xl py-3 px-5 text-sm text-white focus:outline-none transition-colors" 
                       />
                       {zodiacSign && (
                         <div className="flex items-center gap-2 mt-2 bg-nova-gold/5 border border-nova-gold/15 rounded-lg px-3 py-2">
                           <Sparkles className="w-3.5 h-3.5 text-nova-gold" />
                           <span className="text-[11px] text-white/70">Your zodiac sign: <span className="text-nova-gold font-semibold">{zodiacSign}</span></span>
                         </div>
                       )}
                     </div>

                     {/* Anniversary */}
                     <div className="mb-5">
                       <label className="text-sm font-medium text-white/80 block mb-1">When do you celebrate your anniversary?</label>
                       <p className="text-[10px] text-nova-gold/60 mb-2 font-light">Don't worry, we won't disturb your celebration! Just want to send a cute surprise 💕</p>
                       <input 
                         type="date" 
                         value={anniversary}
                         onChange={(e) => setAnniversary(e.target.value)}
                         className="w-full bg-[#121522] border border-white/10 focus:border-nova-gold rounded-xl py-3 px-5 text-sm text-white focus:outline-none transition-colors" 
                       />
                     </div>

                     {/* Special Occasions */}
                     <div className="mb-5">
                       <div className="flex items-center justify-between mb-2">
                         <div>
                           <label className="text-sm font-medium text-white/80 block">Other special occasions</label>
                           <p className="text-[10px] text-white/40 mt-0.5 font-light">Tell us about occasions you don't want to forget!</p>
                         </div>
                         <button
                           type="button"
                           onClick={addOccasion}
                           className="flex items-center gap-1.5 bg-nova-gold/10 hover:bg-nova-gold/20 border border-nova-gold/25 text-nova-gold text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer"
                         >
                           <Plus className="w-3 h-3" /> Add
                         </button>
                       </div>

                       {occasions.length === 0 && (
                         <div className="text-center py-6 bg-[#121522]/40 rounded-xl border border-white/5">
                           <Gift className="w-6 h-6 mx-auto mb-2 text-white/15" />
                           <p className="text-[11px] text-white/30 font-light">No special occasions added yet</p>
                         </div>
                       )}

                       <div className="flex flex-col gap-3 mt-2">
                         {occasions.map((occ) => (
                           <div key={occ.id} className="bg-[#121522]/60 border border-white/5 rounded-xl p-3 flex flex-col gap-2.5 group hover:border-white/10 transition-colors">
                             <div className="flex items-center gap-3">
                               {/* Occasion Type */}
                               <select
                                 value={occ.type}
                                 onChange={(e) => {
                                   const val = e.target.value as SpecialOccasion['type'];
                                   updateOccasion(occ.id, 'type', val);
                                   // Auto-fill label for known types
                                   if (val === 'birthday_partner') updateOccasion(occ.id, 'label', "Partner's Birthday");
                                   if (val === 'anniversary') updateOccasion(occ.id, 'label', 'Wedding Anniversary');
                                   if (val === 'parents_anniversary') updateOccasion(occ.id, 'label', "Parents' Anniversary");
                                 }}
                                 className="flex-1 bg-[#0d1019] border border-white/10 focus:border-nova-gold rounded-lg py-2 px-3 text-xs text-white focus:outline-none transition-colors appearance-none cursor-pointer"
                               >
                                 <option value="custom">Custom Occasion</option>
                                 <option value="birthday_partner">Partner's Birthday</option>
                                 <option value="anniversary">Wedding Anniversary</option>
                                 <option value="parents_anniversary">Parents' Anniversary</option>
                               </select>
                               {/* Delete */}
                               <button
                                 type="button"
                                 onClick={() => removeOccasion(occ.id)}
                                 className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/5 hover:bg-red-500/15 border border-red-500/10 text-red-400/60 hover:text-red-400 transition-all cursor-pointer"
                               >
                                 <Trash2 className="w-3 h-3" />
                               </button>
                             </div>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                               <input
                                 type="text"
                                 placeholder="Occasion label"
                                 value={occ.label}
                                 onChange={(e) => updateOccasion(occ.id, 'label', e.target.value)}
                                 className="bg-[#0d1019] border border-white/10 focus:border-nova-gold rounded-lg py-2 px-3 text-xs text-white focus:outline-none transition-colors"
                               />
                               <input
                                 type="date"
                                 value={occ.date}
                                 onChange={(e) => updateOccasion(occ.id, 'date', e.target.value)}
                                 className="bg-[#0d1019] border border-white/10 focus:border-nova-gold rounded-lg py-2 px-3 text-xs text-white focus:outline-none transition-colors"
                               />
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>

                   {/* ─── Notification Preferences ────────────────────────── */}
                   <div className="pt-4 mt-2 border-t border-white/5">
                     <div className="flex items-center gap-2 mb-4">
                       <Bell className="w-4 h-4 text-nova-gold" />
                       <span className="text-[10px] uppercase tracking-[0.25em] text-nova-gold font-semibold">Notification Preferences</span>
                     </div>
                     <p className="text-[10px] text-white/40 mb-4 font-light">Choose how you'd like us to stay in touch with you</p>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                       {[
                         { key: 'birthday' as const, icon: Cake, label: 'Birthday Wishes', desc: 'Special surprise on your birthday' },
                         { key: 'anniversary' as const, icon: Heart, label: 'Anniversary Reminders', desc: 'Celebrate your special day' },
                         { key: 'offers' as const, icon: Gift, label: 'Offers & Deals', desc: 'Exclusive discounts & drops' },
                         { key: 'productSuggestions' as const, icon: Sparkles, label: 'Product Suggestions', desc: 'Curated picks just for you' },
                       ].map(({ key, icon: Icon, label, desc }) => (
                         <button
                           key={key}
                           type="button"
                           onClick={() => toggleNotification(key)}
                           className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                             notifications[key]
                               ? 'bg-nova-gold/8 border-nova-gold/30 shadow-sm shadow-nova-gold/5'
                               : 'bg-[#121522]/40 border-white/5 hover:border-white/10'
                           }`}
                         >
                           <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                             notifications[key] ? 'bg-nova-gold/15 text-nova-gold' : 'bg-white/5 text-white/25'
                           }`}>
                             <Icon className="w-4 h-4" />
                           </div>
                           <div className="flex-1 min-w-0">
                             <span className={`text-xs font-semibold block ${notifications[key] ? 'text-white' : 'text-white/50'}`}>{label}</span>
                             <span className="text-[10px] text-white/35 font-light block mt-0.5">{desc}</span>
                           </div>
                           <div className={`w-9 h-5 rounded-full flex items-center transition-all duration-300 flex-shrink-0 mt-1 ${
                             notifications[key] ? 'bg-nova-gold justify-end' : 'bg-white/10 justify-start'
                           }`}>
                             <div className={`w-3.5 h-3.5 rounded-full mx-0.5 transition-all ${
                               notifications[key] ? 'bg-nova-darker' : 'bg-white/30'
                             }`} />
                           </div>
                         </button>
                       ))}
                     </div>
                   </div>
                     
                   <button 
                     type="submit"
                     className="btn-premium bg-nova-gold text-nova-darker rounded-xl py-3.5 px-10 text-xs font-semibold uppercase tracking-widest hover:bg-nova-gold-light hover:shadow-lg hover:shadow-nova-gold/20 transition-all shadow-lg mx-auto mt-6"
                   >
                     Save Changes
                   </button>
                </form>
              )}

              {activeTab === 'orders' && (
                <div className="text-center py-16 text-white/40">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-white/20" />
                  <p className="text-sm">You haven't placed any orders yet.</p>
                  <Link to="/shop" className="text-nova-gold hover:underline text-xs mt-2 inline-block">Start Shopping</Link>
                </div>
              )}

              {activeTab === 'address' && (
                <div>
                  {isEditingAddress ? (
                    /* Add / Edit Address Form */
                    <form onSubmit={handleAddressSubmit} className="flex flex-col gap-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                        <h4 className="text-sm font-semibold tracking-wide text-white/80">
                          {addressForm.id ? "Edit Delivery Address" : "Add New Delivery Address"}
                        </h4>
                        <button
                          type="button"
                          onClick={fetchAddressByGeolocation}
                          disabled={isLocating}
                          className="text-[10px] text-nova-gold hover:text-nova-gold-light transition-colors flex items-center gap-1 font-semibold uppercase tracking-wider cursor-pointer disabled:opacity-55"
                        >
                          {isLocating ? "Locating..." : "📍 Use Current Location"}
                        </button>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 block mb-1.5 font-medium">Recipient Full Name *</label>
                        <input 
                          type="text" 
                          required
                          value={addressForm.fullName}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, fullName: e.target.value }))}
                          placeholder="e.g. Aarav Sharma" 
                          className="w-full bg-[#121522] border border-white/10 focus:border-nova-gold rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none transition-colors" 
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 block mb-1.5 font-medium">Contact Phone *</label>
                          <input 
                            type="tel" 
                            required
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="e.g. +91 99999 99999" 
                            className="w-full bg-[#121522] border border-white/10 focus:border-nova-gold rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none transition-colors" 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 block mb-1.5 font-medium">
                            Pin Code * {isFetchingPincode && <span className="text-nova-gold text-[9px] lowercase animate-pulse ml-1">(fetching...)</span>}
                          </label>
                          <input 
                            type="text" 
                            required
                            maxLength={6}
                            value={addressForm.pinCode}
                            onChange={(e) => {
                              const val = e.target.value;
                              setAddressForm(prev => ({ ...prev, pinCode: val }));
                              if (val.length === 6) {
                                fetchAddressByPincode(val);
                              }
                            }}
                            placeholder="e.g. 205265" 
                            className="w-full bg-[#121522] border border-white/10 focus:border-nova-gold rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none transition-colors" 
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 block mb-1.5 font-medium">Street Address *</label>
                        <input 
                          type="text" 
                          required
                          value={addressForm.streetAddress}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, streetAddress: e.target.value }))}
                          placeholder="Flat/House No., Apartment, Street name" 
                          className="w-full bg-[#121522] border border-white/10 focus:border-nova-gold rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none transition-colors" 
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 block mb-1.5 font-medium">City / Town *</label>
                          <input 
                            type="text" 
                            required
                            value={addressForm.city}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                            placeholder="e.g. Mainpuri" 
                            className="w-full bg-[#121522] border border-white/10 focus:border-nova-gold rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none transition-colors" 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 block mb-1.5 font-medium">State *</label>
                          <input 
                            type="text" 
                            required
                            value={addressForm.state}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                            placeholder="e.g. Uttar Pradesh" 
                            className="w-full bg-[#121522] border border-white/10 focus:border-nova-gold rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none transition-colors" 
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 my-2 select-none cursor-pointer" onClick={() => setAddressForm(prev => ({ ...prev, isDefault: !prev.isDefault }))}>
                        <input 
                          type="checkbox" 
                          checked={addressForm.isDefault}
                          onChange={() => {}} // handled by click
                          className="rounded border-white/20 bg-[#121522] text-nova-gold focus:ring-0 cursor-pointer w-4 h-4 accent-nova-gold" 
                        />
                        <span className="text-xs text-white/70">Set as default delivery address</span>
                      </div>

                      <div className="flex gap-4 mt-2">
                        <button 
                          type="submit"
                          className="flex-1 bg-nova-gold text-nova-darker rounded-xl py-3 text-xs font-semibold uppercase tracking-wider hover:bg-nova-gold-light transition-colors cursor-pointer"
                        >
                          Save Address
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setIsEditingAddress(false)}
                          className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl py-3 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Address List View */
                    <div className="space-y-6">
                      <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <span className="text-xs text-white/40 tracking-wider font-light">Manage delivery points</span>
                        <button 
                          onClick={startAddAddress} 
                          className="bg-nova-gold/10 hover:bg-nova-gold/20 border border-nova-gold/30 text-nova-gold text-[10px] font-semibold uppercase tracking-widest px-4 py-2 rounded-lg transition-all active:scale-95 cursor-pointer"
                        >
                          + Add New Address
                        </button>
                      </div>

                      {addresses.length === 0 ? (
                        <div className="text-center py-12 text-white/40">
                          <MapPin className="w-12 h-12 mx-auto mb-4 text-white/20" />
                          <p className="text-sm">No saved addresses found.</p>
                          <button 
                            onClick={startAddAddress} 
                            className="text-nova-gold hover:underline text-xs mt-2 inline-block font-medium cursor-pointer"
                          >
                            Add your first address
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {addresses.map((addr) => (
                            <div 
                              key={addr.id} 
                              className={`p-5 rounded-xl border transition-all ${
                                addr.isDefault 
                                  ? 'bg-nova-gold/3 border-nova-gold/35 shadow-md shadow-nova-gold/5' 
                                  : 'bg-[#181c2b]/30 border-white/5 hover:border-white/10'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-semibold tracking-wide text-white">{addr.fullName}</h4>
                                  {addr.isDefault && (
                                    <span className="text-[8px] uppercase tracking-wider bg-nova-gold text-nova-darker font-bold px-2 py-0.5 rounded shadow">
                                      Default
                                    </span>
                                  )}
                                </div>
                              </div>
                              <p className="text-xs text-white/70 font-light leading-relaxed mb-1.5">{addr.streetAddress}</p>
                              <p className="text-xs text-white/70 font-light leading-relaxed mb-3">
                                {addr.city}, {addr.state} - <span className="font-semibold">{addr.pinCode}</span>
                              </p>
                              <p className="text-[10px] text-white/50 tracking-wider mb-4">
                                <span className="uppercase text-[9px] font-semibold block text-white/30 mb-0.5">Phone</span>
                                {addr.phone}
                              </p>
                              
                              <div className="flex gap-4 border-t border-white/5 pt-3 text-[10px] font-semibold uppercase tracking-wider">
                                <button 
                                  onClick={() => startEditAddress(addr)} 
                                  className="text-white/60 hover:text-nova-gold transition-colors cursor-pointer"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDeleteAddress(addr.id)} 
                                  className="text-white/40 hover:text-red-400 transition-colors cursor-pointer"
                                >
                                  Delete
                                </button>
                                {!addr.isDefault && (
                                  <button 
                                    onClick={() => handleSetDefaultAddress(addr.id)} 
                                    className="text-nova-gold/70 hover:text-nova-gold transition-colors ml-auto cursor-pointer"
                                  >
                                    Set as Default
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

           </div>
        </div>

      </div>
    </div>
  );
}
