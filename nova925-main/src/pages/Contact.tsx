import { useState, useEffect, FormEvent } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, Loader2, CheckCircle, Clock } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useToast } from '../contexts/ToastContext';

export function Contact() {
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderNumber: '',
    subject: 'General Inquiry',
    message: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone || 'N/A',
      order_number: formData.orderNumber || 'N/A',
      subject: formData.subject,
      message: formData.message,
      to_name: 'NOVA Jewellery Support'
    };

    try {
      if (serviceId && templateId && publicKey) {
        // Send email using EmailJS SDK
        await emailjs.send(serviceId, templateId, templateParams, publicKey);
        addToast('Inquiry sent successfully!');
      } else {
        // Fallback for development if EmailJS env variables are missing
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate delay
        console.group('%c💎 NOVA JEWELLERY - INQUIRY SUBMITTED (DEMO MODE) 💎', 'color: #c5a880; font-weight: bold; font-size: 12px;');
        console.log('%cName:   ', 'color: #888;', templateParams.from_name);
        console.log('%cEmail:  ', 'color: #888;', templateParams.from_email);
        console.log('%cPhone:  ', 'color: #888;', templateParams.phone);
        console.log('%cOrder:  ', 'color: #888;', templateParams.order_number);
        console.log('%cSubject:', 'color: #888;', templateParams.subject);
        console.log('%cMessage:', 'color: #888;', templateParams.message);
        console.groupEnd();
        addToast('Demo: Inquiry logged to browser console successfully.');
      }
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('EmailJS Error:', error);
      addToast(error?.text || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      orderNumber: '',
      subject: 'General Inquiry',
      message: ''
    });
    setIsSubmitted(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-nova-darker text-white font-sans">
      {/* Page Header Banner */}
      <div className="relative w-full h-[220px] bg-gradient-to-r from-nova-darker via-nova-dark to-nova-darker flex items-center overflow-hidden border-b border-nova-gold/10">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="container mx-auto px-6 md:px-12 max-w-6xl relative z-10">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-nova-gold font-semibold mb-2">ASSISTANCE</span>
          <h1 className="text-3xl md:text-4xl font-serif tracking-wider mb-2">Submit an Inquiry</h1>
          <p className="text-white/60 max-w-xl text-xs md:text-sm font-light">
            Have questions about our custom jewelry, shipping, or returns? Drop us a message, and our styling concierge will assist you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-16 max-w-6xl flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Side: Contact Information */}
          <div className="lg:col-span-5 space-y-8 lg:pr-8">
            <div>
              <span className="text-[9px] uppercase tracking-[0.25em] text-nova-gold font-bold mb-1.5 block">HEADQUARTERS</span>
              <h2 className="text-xl md:text-2xl font-serif tracking-wide text-white mb-4">Utkarsh Jewellers</h2>
              <p className="text-white/60 text-xs md:text-sm font-light leading-relaxed">
                As a family-owned legacy boutique since 1995, we specialize in high-end 925 sterling silver craftsmanship and luxury customer support.
              </p>
            </div>

            <div className="space-y-5.5 pt-4 border-t border-white/5">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-nova-gold/5 border border-nova-gold/15 flex items-center justify-center text-nova-gold shrink-0 mt-0.5">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-1">Boutique Address</h3>
                  <p className="text-white/80 text-xs md:text-sm font-light leading-relaxed">
                    Ground Floor, Galla Mandi, Kurawali
                  </p>
                  <p className="text-white/85 text-xs md:text-sm font-light leading-relaxed">
                    Mainpuri, Uttar Pradesh - 205265
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-nova-gold/5 border border-nova-gold/15 flex items-center justify-center text-nova-gold shrink-0 mt-0.5">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-1">Phone Helpline</h3>
                  <a href="tel:+919027368625" className="text-white hover:text-nova-gold text-xs md:text-sm font-light transition-colors">
                    +91 9027368625
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-nova-gold/5 border border-nova-gold/15 flex items-center justify-center text-nova-gold shrink-0 mt-0.5">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-1">Email Inquiry</h3>
                  <a href="mailto:contact@novajewels.info" className="text-white hover:text-nova-gold text-xs md:text-sm font-light transition-colors">
                    contact@novajewels.info
                  </a>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-nova-gold/5 border border-nova-gold/15 flex items-center justify-center text-nova-gold shrink-0 mt-0.5">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-1">Hours of Operations</h3>
                  <p className="text-white/80 text-xs md:text-sm font-light">
                    Monday – Saturday: 10:30 AM – 7:30 PM (IST)
                  </p>
                  <p className="text-white/40 text-[10px] font-light mt-0.5">
                    Closed on Sundays & National Holidays
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form Card */}
          <div className="lg:col-span-7">
            {isSubmitted ? (
              /* Success Animation Screen */
              <div className="bg-white/[0.01] border border-white/5 p-8 md:p-12 rounded-3xl text-center space-y-6 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/35 mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <div className="space-y-2.5">
                  <h2 className="text-2xl font-serif tracking-wide text-white">Inquiry Received</h2>
                  <p className="text-white/60 text-xs md:text-sm font-light max-w-md mx-auto leading-relaxed">
                    Thank you for contacting NOVA. Your inquiry has been registered. Our concierge service will review details and reply to <strong className="text-white">{formData.email}</strong> within 24 business hours.
                  </p>
                </div>
                <button
                  onClick={resetForm}
                  className="bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-white/80 hover:text-white px-6 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer inline-block"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              /* The Form */
              <form 
                onSubmit={handleSubmit}
                className="bg-white/[0.01] border border-white/5 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl backdrop-blur-md"
              >
                <div className="border-b border-white/5 pb-4 mb-2">
                  <h2 className="text-lg font-serif tracking-wide text-white">Send a Message</h2>
                  <p className="text-white/40 text-[11px] font-light mt-1">Fields marked with an asterisk (*) are required</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="e.g. Aarav Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-[#121522] border border-white/10 text-white placeholder-white/20 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-nova-gold focus:border-nova-gold transition-all text-xs md:text-sm font-light"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="e.g. aarav@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-[#121522] border border-white/10 text-white placeholder-white/20 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-nova-gold focus:border-nova-gold transition-all text-xs md:text-sm font-light"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="e.g. +91 99999 99999"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-[#121522] border border-white/10 text-white placeholder-white/20 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-nova-gold focus:border-nova-gold transition-all text-xs md:text-sm font-light"
                    />
                  </div>

                  {/* Order Number */}
                  <div className="space-y-1.5">
                    <label htmlFor="orderNumber" className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                      Order Number (Optional)
                    </label>
                    <input
                      type="text"
                      id="orderNumber"
                      name="orderNumber"
                      placeholder="e.g. #NV-92582"
                      value={formData.orderNumber}
                      onChange={handleChange}
                      className="w-full bg-[#121522] border border-white/10 text-white placeholder-white/20 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-nova-gold focus:border-nova-gold transition-all text-xs md:text-sm font-light"
                    />
                  </div>
                </div>

                {/* Subject Selection */}
                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                    Inquiry Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-[#121522] border border-white/10 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-nova-gold focus:border-nova-gold transition-all text-xs md:text-sm font-light cursor-pointer appearance-none"
                  >
                    <option value="General Inquiry">General Boutique Inquiry</option>
                    <option value="Custom Jewelry Orders">Custom Jewelry Orders & Engraving</option>
                    <option value="Order Status & Delivery">Order Status & Delivery timelines</option>
                    <option value="Returns & Warranty">Returns, Re-plating, and Warranty claims</option>
                    <option value="Bulk Purchases">Bulk / Corporate Gifting Purchases</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Describe your request in detail..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-[#121522] border border-white/10 text-white placeholder-white/20 rounded-xl py-3.5 px-4 focus:outline-none focus:ring-1 focus:ring-nova-gold focus:border-nova-gold transition-all text-xs md:text-sm font-light resize-none leading-relaxed"
                  ></textarea>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-tr from-nova-gold-dark to-nova-gold hover:scale-[1.01] active:scale-[0.99] text-nova-darker font-bold uppercase tracking-widest text-xs md:text-sm py-4.5 px-6 rounded-2xl shadow-xl shadow-nova-gold/10 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
