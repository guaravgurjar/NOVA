import { User, ShoppingBag, MapPin, LogOut, ShieldCheck } from 'lucide-react';
import { useState, useEffect, FormEvent } from 'react';
import { useToast } from '../contexts/ToastContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDocs, collection, setDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

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

  // Load addresses from Firestore or localStorage on mount/user change
  useEffect(() => {
    if (!user) return;
    
    const loadAddresses = async () => {
      const isFirebaseActive = auth && db && (auth as any).name !== 'mockAuth' && auth.currentUser;
      
      if (isFirebaseActive) {
        try {
          const uid = auth.currentUser.uid;
          const addrColl = collection(db, 'users', uid, 'addresses');
          const snap = await getDocs(addrColl);
          const list: DeliveryAddress[] = [];
          snap.forEach((doc) => {
            list.push(doc.data() as DeliveryAddress);
          });
          
          if (list.length > 0) {
            // Sort so default is first
            list.sort((a, b) => (a.isDefault ? -1 : 1));
            setAddresses(list);
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
            // Sync fallback to Firestore
            for (const addr of initialList) {
              await setDoc(doc(db, 'users', uid, 'addresses', addr.id), addr);
            }
          }
        } catch (err) {
          console.error("Failed to load addresses from Firestore", err);
          const stored = localStorage.getItem(`nova_addresses_${user.email}`);
          if (stored) setAddresses(JSON.parse(stored));
        }
      } else {
        // Local Storage Fallback
        const stored = localStorage.getItem(`nova_addresses_${user.email}`);
        if (stored) {
          try {
            setAddresses(JSON.parse(stored));
          } catch (e) {
            console.error("Failed to parse addresses", e);
          }
        } else {
          const initialAddresses: DeliveryAddress[] = [
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
          setAddresses(initialAddresses);
          localStorage.setItem(`nova_addresses_${user.email}`, JSON.stringify(initialAddresses));
        }
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

  const handleAddressSubmit = async (e: FormEvent) => {
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

    // Cloud Sync
    const isFirebaseActive = auth && db && (auth as any).name !== 'mockAuth' && auth.currentUser;
    if (isFirebaseActive) {
      try {
        const uid = auth.currentUser.uid;
        if (addressForm.isDefault || updatedAddresses.length === 1) {
          for (const addr of updatedAddresses) {
            await setDoc(doc(db, 'users', uid, 'addresses', addr.id), { ...addr, isDefault: addr.id === activeId });
          }
        } else {
          const targetAddr = updatedAddresses.find(a => a.id === activeId);
          if (targetAddr) {
            await setDoc(doc(db, 'users', uid, 'addresses', activeId), targetAddr);
          }
        }
        addToast(isNew ? 'Address saved to cloud!' : 'Address updated in cloud!');
      } catch (err) {
        console.error("Firestore save failed", err);
        addToast('Saved locally. Cloud sync failed.');
      }
    } else {
      addToast(isNew ? 'Address added successfully!' : 'Address updated successfully!');
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
    
    const isFirebaseActive = auth && db && (auth as any).name !== 'mockAuth' && auth.currentUser;
    if (isFirebaseActive) {
      try {
        const uid = auth.currentUser.uid;
        await deleteDoc(doc(db, 'users', uid, 'addresses', id));
        if (toDelete?.isDefault && updatedAddresses.length > 0) {
          for (const addr of updatedAddresses) {
            await setDoc(doc(db, 'users', uid, 'addresses', addr.id), addr);
          }
        }
        addToast('Address deleted from cloud.');
      } catch (err) {
        console.error("Firestore delete failed", err);
        addToast('Deleted locally. Cloud sync failed.');
      }
    } else {
      addToast('Address removed successfully.');
    }

    saveAddressesToStorage(updatedAddresses);
  };

  const handleSetDefaultAddress = async (id: string) => {
    const updated = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));

    const isFirebaseActive = auth && db && (auth as any).name !== 'mockAuth' && auth.currentUser;
    if (isFirebaseActive) {
      try {
        const uid = auth.currentUser.uid;
        for (const addr of updated) {
          await setDoc(doc(db, 'users', uid, 'addresses', addr.id), addr);
        }
        addToast('Default address updated in cloud.');
      } catch (err) {
        console.error("Firestore default update failed", err);
        addToast('Updated locally. Cloud sync failed.');
      }
    } else {
      addToast('Default delivery address updated.');
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

  // Protected Route Logic: Redirect to login if user logs out or is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setDob(user.dob || "");
      setGender(user.gender || null);
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    updateProfile({
      firstName,
      lastName,
      email,
      dob,
      gender
    });
    addToast('Profile saved successfully!');
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
        <div className="flex-1 p-8 md:p-16 flex flex-col items-center justify-center">
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

                   <div>
                     <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 block mb-2 font-medium">Date of Birth</label>
                     <input 
                       type="date" 
                       value={dob}
                       onChange={(e) => setDob(e.target.value)}
                       className="w-full bg-[#121522] border border-white/10 focus:border-nova-gold rounded-xl py-3 px-5 text-sm text-white focus:outline-none transition-colors" 
                     />
                   </div>
                     
                   <button 
                     type="submit"
                     className="btn-premium bg-nova-gold text-nova-darker rounded-xl py-3.5 px-10 text-xs font-semibold uppercase tracking-widest hover:bg-nova-gold-light hover:shadow-lg hover:shadow-nova-gold/20 transition-all shadow-lg mx-auto mt-4"
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
                                  ? 'bg-nova-gold/[0.03] border-nova-gold/35 shadow-md shadow-nova-gold/5' 
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
