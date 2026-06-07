import { User, ShoppingBag, MapPin, LogOut, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
                <div className="text-center py-16 text-white/40">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-white/20" />
                  <p className="text-sm">No saved addresses found.</p>
                  <button onClick={() => addToast('Address feature coming soon!')} className="text-nova-gold hover:underline text-xs mt-2 inline-block">Add Address</button>
                </div>
              )}

           </div>
        </div>

      </div>
    </div>
  );
}
