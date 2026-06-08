import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Wishlist } from './pages/Wishlist';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { ChatBot } from './components/ChatBot';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { ShippingPolicy } from './pages/ShippingPolicy';
import { ReturnPolicy } from './pages/ReturnPolicy';
import { JewelleryKit } from './pages/JewelleryKit';
import { WarrantyDetails } from './pages/WarrantyDetails';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { FAQ } from './pages/FAQ';
import { CookiePolicy } from './pages/CookiePolicy';
import { CookieBanner } from './components/CookieBanner';
import { Contact } from './pages/Contact';
import { About } from './pages/About';

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen font-sans bg-white text-[#111]">
            <Header />
            <main className="flex-1 flex flex-col">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/category/:id" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/shipping" element={<ShippingPolicy />} />
                <Route path="/return" element={<ReturnPolicy />} />
                <Route path="/kit" element={<JewelleryKit />} />
                <Route path="/warranty" element={<WarrantyDetails />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/cookies" element={<CookiePolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </main>
            <Footer />
            <ChatBot />
            <CookieBanner />
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}
