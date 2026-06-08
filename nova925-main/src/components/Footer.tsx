import { Phone, Mail, Facebook, Instagram, Shield, Award, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-nova-dark to-nova-darker text-white pt-20 pb-10 px-6 md:px-12 mt-auto border-t border-nova-gold/10 relative">
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-nova-gold/40 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto">
        
        {/* Core Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* ADVANTAGES */}
          <div>
            <h3 className="text-sm font-semibold tracking-[0.25em] mb-6 font-serif text-nova-gold uppercase">Advantages</h3>
            <ul className="space-y-4 text-xs font-light tracking-wider text-white/70">
              <li><Link to="/shipping" className="hover:text-nova-gold transition-colors duration-300">Shipping & Handling</Link></li>
              <li><Link to="/return" className="hover:text-nova-gold transition-colors duration-300">Return Policy</Link></li>
              <li><Link to="/kit" className="hover:text-nova-gold transition-colors duration-300">Jewellery Care Kit</Link></li>
              <li><Link to="/warranty" className="hover:text-nova-gold transition-colors duration-300">Warranty details</Link></li>
            </ul>
          </div>

          {/* CUSTOMER SERVICES */}
          <div>
            <h3 className="text-sm font-semibold tracking-[0.25em] mb-6 font-serif text-nova-gold uppercase">Customer Care</h3>
            <ul className="space-y-4 text-xs font-light tracking-wider text-white/70">
              <li><Link to="/contact" className="hover:text-nova-gold transition-colors duration-300">Submit an Inquiry</Link></li>
              <li><Link to="/faq" className="hover:text-nova-gold transition-colors duration-300">Frequently Asked Questions</Link></li>
              <li><Link to="/track" className="hover:text-nova-gold transition-colors duration-300">Track Order Status</Link></li>
              <li><Link to="/terms" className="hover:text-nova-gold transition-colors duration-300">Terms of Service</Link></li>
            </ul>
          </div>

          {/* ABOUT US */}
          <div>
            <h3 className="text-sm font-semibold tracking-[0.25em] mb-6 font-serif text-nova-gold uppercase">Our Brand</h3>
            <ul className="space-y-4 text-xs font-light tracking-wider text-white/70">
              <li><Link to="/about" className="hover:text-nova-gold transition-colors duration-300">Our Story & Craftsmanship</Link></li>
              <li><Link to="/heritage" className="hover:text-nova-gold transition-colors duration-300">Utkarsh Heritage Since 1995</Link></li>
              <li><Link to="/materials" className="hover:text-nova-gold transition-colors duration-300">925 Purity Guarantee</Link></li>
            </ul>
          </div>

          {/* CONTACT US */}
          <div>
            <h3 className="text-sm font-semibold tracking-[0.25em] mb-6 font-serif text-nova-gold uppercase">Contact Details</h3>
            <div className="space-y-3.5 text-xs font-light leading-relaxed tracking-wider text-white/70">
              <p className="font-semibold text-white">Utkarsh Jewellers</p>
              <p>Ground Floor, Kurawali</p>
              <p>Mainpuri, Uttar Pradesh - 205265</p>
              <p className="pt-2">
                <span className="text-white/40 font-semibold block text-[10px] uppercase tracking-wider">Phone</span>
                <a href="tel:+919027368625" className="hover:text-nova-gold transition-colors text-white font-medium">+91 9027368625</a>
              </p>
              <p>
                <span className="text-white/40 font-semibold block text-[10px] uppercase tracking-wider">Email</span>
                <a href="mailto:contact@novajewels.info" className="hover:text-nova-gold transition-colors text-white font-medium">contact@novajewels.info</a>
              </p>
              
              <div className="flex space-x-4 pt-4 text-nova-gold/75">
                <a href="tel:+919027368625" aria-label="Phone" className="p-2 bg-white/5 hover:bg-nova-gold hover:text-nova-darker rounded-lg transition-all duration-300 border border-white/5">
                  <Phone className="w-4 h-4" />
                </a>
                <a href="mailto:contact@novajewels.info" aria-label="Mail" className="p-2 bg-white/5 hover:bg-nova-gold hover:text-nova-darker rounded-lg transition-all duration-300 border border-white/5">
                  <Mail className="w-4 h-4" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2 bg-white/5 hover:bg-nova-gold hover:text-nova-darker rounded-lg transition-all duration-300 border border-white/5">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 bg-white/5 hover:bg-nova-gold hover:text-nova-darker rounded-lg transition-all duration-300 border border-white/5">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom Strip */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] tracking-widest text-white/40 uppercase">
          <p>© {new Date().getFullYear()} NOVA Jewellery. Powered by Utkarsh Jewellers Group.</p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="hover:text-nova-gold transition-colors">Privacy Policy</Link>
            <Link to="/cookies" className="hover:text-nova-gold transition-colors">Cookie Policy</Link>
            <Link to="/terms" className="hover:text-nova-gold transition-colors">Terms & Conditions</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
