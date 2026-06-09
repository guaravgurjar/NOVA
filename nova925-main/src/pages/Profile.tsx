import { User, ShoppingBag, MapPin, LogOut, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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

  // Load addresses from localStorage on mount/user change
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`nova_addresses_${user.email}`);
      if (stored) {
        try {
          setAddresses(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse addresses", e);
        }
      } else {
        // Provide a default pre-filled address to simulate account data
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
  }, [user]);

  // Helper to save addresses to state and localStorage
  const saveAddressesToStorage = (newAddresses: DeliveryAddress[]) => {
    setAddresses(newAddresses);
    if (user) {
      localStorage.setItem(`nova_addresses_${user.email}`, JSON.stringify(newAddresses));
    }
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!addressForm.fullName || !addressForm.phone || !addressForm.streetAddress || !addressForm.city || !addressForm.state || !addressForm.pinCode) {
      addToast('Please fill out all address fields.');
      return;
    }

    let updatedAddresses = [...addresses];

    if (addressForm.id) {
      // Edit mode
      updatedAddresses = updatedAddresses.map(addr => {
        if (addr.id === addressForm.id) {
          return { ...addressForm } as DeliveryAddress;
        }
        return addr;
      });
      addToast('Address updated successfully!');
    } else {
      // Add mode
      const newAddr: DeliveryAddress = {
        ...addressForm,
        id: `addr-${Date.now()}`,
      };
      updatedAddresses.push(newAddr);
      addToast('Address added successfully!');
    }

    // If set as default, unset other defaults
    if (addressForm.isDefault) {
      const activeId = addressForm.id || updatedAddresses[updatedAddresses.length - 1].id;
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === activeId
      }));
    } else if (updatedAddresses.length === 1) {
      // Force first address to be default
      updatedAddresses[0].isDefault = true;
    }

    saveAddressesToStorage(updatedAddresses);
    setIsEditingAddress(false);
    resetAddressForm();
  };

  const handleDeleteAddress = (id: string) => {
    const toDelete = addresses.find(a => a.id === id);
    let updatedAddresses = addresses.filter(addr => addr.id !== id);
    
    if (toDelete?.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }
    
    saveAddressesToStorage(updatedAddresses);
    addToast('Address removed successfully.');
  };

  const handleSetDefaultAddress = (id: string) => {
    const updated = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    saveAddressesToStorage(updated);
    addToast('Default delivery address updated.');
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

  const handleSave = (e: React.FormEvent) => {
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
                      <div className="border-b border-white/5 pb-2 mb-2">
                        <h4 className="text-sm font-semibold tracking-wide text-white/80">
                          {addressForm.id ? "Edit Delivery Address" : "Add New Delivery Address"}
                        </h4>
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
                          <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 block mb-1.5 font-medium">Pin Code *</label>
                          <input 
                            type="text" 
                            required
                            value={addressForm.pinCode}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, pinCode: e.target.value }))}
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
