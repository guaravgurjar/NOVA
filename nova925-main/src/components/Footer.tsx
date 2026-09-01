import { Shield, Award, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-100 text-nova-dark pt-12 md:pt-20 pb-8 md:pb-10 px-4 md:px-12 mt-auto border-t border-nova-gold/10 relative" role="contentinfo">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-nova-gold/40 to-transparent"></div>

      <div className="max-w-7xl mx-auto">

        {/* Core Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">

          {/* ADVANTAGES */}
          <div>
            <h3 className="text-sm font-semibold tracking-[0.25em] mb-6 font-serif text-nova-dark">ADVANTAGES</h3>
            <ul className="space-y-4 text-xs font-light tracking-wider text-black">
              <li><Link to="/shipping" className="hover:text-black transition-colors duration-300">Shipping & Handling</Link></li>
              <li><Link to="/return" className="hover:text-black transition-colors duration-300">Return Policy</Link></li>
              <li><Link to="/kit" className="hover:text-black transition-colors duration-300">Jewellery Care Kit</Link></li>
              <li><Link to="/warranty" className="hover:text-black transition-colors duration-300">Warranty details</Link></li>
            </ul>
          </div>

          {/* CUSTOMER SERVICES */}
          <div>
            <h3 className="text-sm font-semibold tracking-[0.25em] mb-6 font-serif text-nova-dark uppercase">Customer Care</h3>
            <ul className="space-y-4 text-xs font-light tracking-wider text-black">
              <li><Link to="/contact" className="hover:text-nova-gold transition-colors duration-300">Submit an Inquiry</Link></li>
              <li><Link to="/faq" className="hover:text-nova-gold transition-colors duration-300">Frequently Asked Questions</Link></li>
              <li><a href="https://support.novajewels.info" target="_blank" rel="noopener noreferrer" className="hover:text-nova-gold transition-colors duration-300">Raise a Ticket</a></li>
              <li><Link to="/track" className="hover:text-nova-gold transition-colors duration-300">Track Order Status</Link></li>
              <li><Link to="/terms" className="hover:text-nova-gold transition-colors duration-300">Terms of Service</Link></li>
            </ul>
          </div>

          {/* ABOUT US */}
          <div>
            <h3 className="text-sm font-semibold tracking-[0.25em] mb-6 font-serif text-nova-dark uppercase">Our Brand</h3>
            <ul className="space-y-4 text-xs font-light tracking-wider text-black">
              <li><Link to="/about" className="hover:text-nova-gold transition-colors duration-300">Our Story & Craftsmanship</Link></li>
              <li><Link to="/heritage" className="hover:text-nova-gold transition-colors duration-300">Utkarsh Heritage Since 1995</Link></li>
              <li><Link to="/materials" className="hover:text-nova-gold transition-colors duration-300">925 Purity Guarantee</Link></li>
            </ul>
          </div>

          {/* CONTACT US */}
          <address className="not-italic">
            <h3 className="text-sm font-semibold tracking-[0.25em] mb-4 md:mb-6 font-serif text-nova-dark uppercase">Contact Details</h3>
            <div className="space-y-3.5 text-xs font-light leading-relaxed tracking-wider text-black">
              <p className="font-semibold text-black">Utkarsh Jewellers</p>
              <p>Ground Floor, Kurawali</p>
              <p>Mainpuri, Uttar Pradesh - 205265</p>
              <p className="pt-2">
                <span className="text-black font-semibold block text-[10px] uppercase tracking-wider">Phone</span>
                <a href="tel:+919027368625" className="hover:text-nova-gold transition-colors text-black font-medium">+91 9027368625</a>
              </p>
              <p>
                <span className="text-black font-semibold block text-[10px] uppercase tracking-wider">Email</span>
                <a href="mailto:contact@novajewels.info" className="hover:text-nova-gold transition-colors text-black font-medium">contact@novajewels.info</a>
              </p>

              <div className="flex items-center space-x-3 pt-4">
                <a href="tel:+919027368625" aria-label="Phone" className="hover:opacity-80 transition-all duration-300">
                  <img src="/images/icons/phone.png" alt="Phone" className="w-8 h-8 object-contain" />
                </a>
                <a href="mailto:contact@novajewels.info" aria-label="Mail" className="hover:opacity-80 transition-all duration-300">
                  <img src="/images/icons/mail.png" alt="Email" className="w-8 h-8 object-contain" />
                </a>
                <a href="https://www.facebook.com/share/1EiDdUeFD4/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:opacity-80 transition-all duration-300">
                  <img src="/images/icons/facebook.png" alt="Facebook" className="w-8 h-8 object-contain" />
                </a>
                <a href="https://www.instagram.com/novasterlingsilver?igsh=MXNuZDZiNmU0azFzMw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:opacity-80 transition-all duration-300">
                  <img src="/images/icons/insta.png" alt="Instagram" className="w-8 h-8 object-contain" />
                </a>
                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="hover:opacity-80 transition-all duration-300">
                  <img src="/images/icons/pintrest.png" alt="Pinterest" className="w-8 h-8 object-contain" />
                </a>
              </div>
            </div>
          </address>

        </div>

        <div className="border-t border-gray-300 pt-6 md:pt-8 flex flex-col items-center gap-3 md:gap-4 text-[9px] md:text-[10px] tracking-widest text-nova-dark  uppercase">
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-3">
            <p>© {new Date().getFullYear()} NOVA Jewellery. Powered by Utkarsh Jewellers Group.</p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="hover:text-nova-gold transition-colors">Privacy Policy</Link>
              <Link to="/cookies" className="hover:text-nova-gold transition-colors">Cookie Policy</Link>
              <Link to="/terms" className="hover:text-nova-gold transition-colors">Terms & Conditions</Link>
            </div>
          </div>
          <p className="text-nova-dark  normal-case tracking-wider text-[9px]">
            Designed & Developed by{' '}
            <a href="https://www.linkedin.com/in/guaravgurjar" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-nova-gold transition-colors font-medium">
              Gaurav Gurjar
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}
