import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, MemoryRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { CartProvider } from './contexts/CartContext';
import { ProductsProvider } from './contexts/ProductsContext';
import { RouteSEOObserver } from './components/RouteSEOObserver';

// Route Code-Splitting with React.lazy
const Wishlist = lazy(() => import('./pages/Wishlist').then(m => ({ default: m.Wishlist })));
const Shop = lazy(() => import('./pages/Shop').then(m => ({ default: m.Shop })));
const ProductDetail = lazy(() => import('./pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const Cart = lazy(() => import('./pages/Cart').then(m => ({ default: m.Cart })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy').then(m => ({ default: m.ShippingPolicy })));
const ReturnPolicy = lazy(() => import('./pages/ReturnPolicy').then(m => ({ default: m.ReturnPolicy })));
const JewelleryKit = lazy(() => import('./pages/JewelleryKit').then(m => ({ default: m.JewelleryKit })));
const WarrantyDetails = lazy(() => import('./pages/WarrantyDetails').then(m => ({ default: m.WarrantyDetails })));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy').then(m => ({ default: m.CookiePolicy })));
const TermsOfService = lazy(() => import('./pages/TermsOfService').then(m => ({ default: m.TermsOfService })));
const FAQ = lazy(() => import('./pages/FAQ').then(m => ({ default: m.FAQ })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const GiftsForHim = lazy(() => import('./pages/GiftsForHim').then(m => ({ default: m.GiftsForHim })));
const GiftsForHer = lazy(() => import('./pages/GiftsForHer').then(m => ({ default: m.GiftsForHer })));
const AstroCollection = lazy(() => import('./pages/Astro-collection').then(m => ({ default: m.AstroCollection })));
const Kids = lazy(() => import('./pages/Kids').then(m => ({ default: m.Kids })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

// Non-Critical Widgets Deferred
const ChatBot = lazy(() => import('./components/ChatBot').then(m => ({ default: m.ChatBot })));
const CookieBanner = lazy(() => import('./components/CookieBanner').then(m => ({ default: m.CookieBanner })));

// Minimal Loading Fallback
function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-2 border-nova-gold border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export function AppContent() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-white text-[#111]">
      <RouteSEOObserver />
      <Header />
      <main className="flex-1 flex flex-col">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/category/:id" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
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
            <Route path="/gifts-for-him" element={<GiftsForHim />} />
            <Route path="/gifts-for-her" element={<GiftsForHer />} />
            <Route path="/kids" element={<Kids />} />
            <Route path="/Astro-collection" element={<AstroCollection />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <Suspense fallback={null}>
        <ChatBot />
        <CookieBanner />
      </Suspense>
    </div>
  );
}

export function AppServer({ url }: { url: string }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <ProductsProvider>
          <WishlistProvider>
            <CartProvider>
              <MemoryRouter initialEntries={[url]}>
                <AppContent />
              </MemoryRouter>
            </CartProvider>
          </WishlistProvider>
        </ProductsProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ProductsProvider>
          <WishlistProvider>
            <CartProvider>
              <Router>
                <AppContent />
              </Router>
            </CartProvider>
          </WishlistProvider>
        </ProductsProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
