import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Phone, Mail } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  items: FAQItem[];
}

export function FAQ() {
  const [activeTab, setActiveTab] = useState('delivery');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories: FAQCategory[] = [
    {
      id: 'delivery',
      title: 'Purchase and Delivery',
      items: [
        {
          question: 'When can I expect my order to be delivered?',
          answer: 'Orders are typically processed and shipped within 24-48 hours. Once shipped, standard delivery takes 4-7 business days across India. You will receive tracking details via WhatsApp, email, and SMS as soon as the package leaves our warehouse.'
        },
        {
          question: "I haven't yet got my product delivered. The number provided by the delivery partner is not reachable. How shall I contact them?",
          answer: 'If you are unable to reach the courier partner or delivery executive, please reach out to our Customer Support team at contact@novajewels.info. We will coordinate directly with the logistics partner to resolve the delivery issue as a priority.'
        },
        {
          question: 'Can the delivery address be changed after placing the order?',
          answer: 'Address changes can be made within 12 hours of placing the order, provided the order has not been dispatched yet. Please email us at contact@novajewels.info or contact support to request a change.'
        },
        {
          question: 'Can I change the address after the order is dispatched?',
          answer: 'Once the order is dispatched from our warehouse, we cannot change the delivery address directly. However, we can attempt to instruct the delivery partner to re-route or hold the shipment, which may extend the delivery timeline.'
        },
        {
          question: 'Do you ship to the UK/USA?',
          answer: 'Currently, we only ship within India. We do not support international shipping or international returns at this time.'
        },
        {
          question: 'Is speedy delivery available at NOVA?',
          answer: 'We offer free standard shipping. Depending on your pin code, express shipping may be available at checkout for a nominal fee, which delivers in 2-3 business days.'
        },
        {
          question: 'Can I get a faster delivery if I pay for it?',
          answer: 'Yes, you can choose the Express Shipping option at checkout for faster processing and priority delivery within major cities and towns.'
        },
        {
          question: 'Can you call me on my number while delivering?',
          answer: 'Yes, the delivery executive will call your registered contact number prior to attempting delivery. Please ensure you answer calls from our logistics partners.'
        },
        {
          question: 'I am currently out of the station. Is it possible to receive the order when I come back?',
          answer: 'The courier partner will attempt delivery up to three times. If you are out of station, you can request them to hold the parcel for a maximum of 48 hours or coordinate a reschedule. If uncollected, it will be returned to our warehouse.'
        }
      ]
    },
    {
      id: 'coupons',
      title: 'Coupon Codes and Discounts',
      items: [
        {
          question: 'How do I apply a coupon code?',
          answer: 'You can apply coupon codes at checkout. Enter your code in the "Apply Coupon" section in the cart or checkout page and click "Apply" to see your discount updated.'
        },
        {
          question: 'My coupon code is not working. What should I do?',
          answer: 'Please check the terms and conditions of the coupon code, including validity dates, minimum purchase value, and category exclusions. Note that coupon codes cannot be combined with other offers. If it still fails, contact support.'
        },
        {
          question: 'Can I get a discount on my first purchase?',
          answer: 'Yes! We offer a special sign-up discount of 5% off on your first order. Use code FIRST5 at checkout.'
        },
        {
          question: 'Are there any bulk discounts available?',
          answer: 'Yes, for bulk purchases or corporate gifting, please reach out directly to contact@novajewels.info for customized quotes and special rates.'
        }
      ]
    },
    {
      id: 'quality',
      title: 'Product Quality',
      items: [
        {
          question: 'Is NOVA jewellery made of real silver?',
          answer: 'Yes, all our jewelry pieces are hand-crafted in authentic 925 sterling silver. Every item is stamped with the "925" mark and comes with a certificate of authenticity.'
        },
        {
          question: 'Does the silver tarnish? How do I prevent it?',
          answer: 'Silver naturally tarnishes when exposed to air and moisture. However, our jewelry is plated with premium Rhodium to prevent tarnishing. To maintain its shine, store it in the anti-tarnish pouch provided in our Care Kit and wipe it gently with the polishing cloth.'
        },
        {
          question: 'Is the jewellery nickel-free and hypoallergenic?',
          answer: 'Yes, all NOVA jewelry is 100% lead-free, nickel-free, and hypoallergenic, making it safe and comfortable for sensitive skin.'
        },
        {
          question: 'What should I do if a stone falls out?',
          answer: 'While we ensure sturdy settings, stone fallouts are not covered under our plating warranty. However, you can contact our support team and we will assist you with repairs at a nominal cost.'
        }
      ]
    },
    {
      id: 'purchase',
      title: 'Purchase Related',
      items: [
        {
          question: 'Can I pay online when the parcel arrives as COD?',
          answer: 'Yes, many of our delivery partners support digital payments (UPI, GPay, PhonePe, or cards) at the time of Cash on Delivery. You can request the delivery executive for a QR code link during delivery.'
        },
        {
          question: 'I have not placed the order, but received a notification. What is this?',
          answer: 'If you received an order confirmation or SMS but did not place an order, please contact us immediately. It could be due to a typographical error in the phone number or email entered by another customer, or account security.'
        },
        {
          question: 'I never called to cancel my order but it was cancelled. Why?',
          answer: 'Orders may be cancelled by our system due to pin code non-serviceability, failed payment verifications, or if the item went out of stock. If you wish to purchase the product, please contact support to place a new order.'
        },
        {
          question: 'Can I modify my order after it has been confirmed?',
          answer: 'Once an order is confirmed, we process it quickly to ensure prompt delivery. Therefore, modifications to items or quantities are not possible. You may cancel the order before delivery and place a new one.'
        }
      ]
    },
    {
      id: 'returns',
      title: 'Returns Related',
      items: [
        {
          question: 'What is your return policy?',
          answer: 'We offer a 15-day return policy on all unused and unworn items. Refunds are processed after a quality check at our warehouse. Made-to-order products, coins, and nose pins are excluded from returns.'
        },
        {
          question: 'How do I return the product?',
          answer: 'You can initiate a return directly from the orders section on our website/app, or reach out to support. We will schedule a reverse pick-up. If your pin code is non-serviceable for reverse pickup, you will need to self-ship via India Post and we will reimburse up to ₹70.'
        },
        {
          question: 'My order is not yet shipped, I would like to cancel my order.',
          answer: 'You can cancel your order anytime before it is delivered. Go to "My Orders" on our website and click "Cancel Order," or contact customer support for instant cancellation.'
        },
        {
          question: 'How do I cancel my order when it has already been shipped?',
          answer: 'If the order is already shipped, you can refuse the delivery when the courier partner attempts it. Once the package is returned to our warehouse, any prepaid amount will be refunded.'
        },
        {
          question: 'I received an empty box or missing items in my order. What should I do?',
          answer: 'Please report missing or empty parcels within 48 hours of delivery. A clear 360° unboxing video showing the unopened box from all angles is mandatory to process empty box claims.'
        }
      ]
    }
  ];

  const currentCategory = categories.find(c => c.id === activeTab) || categories[0];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setOpenIndex(null);
  };

  const toggleAccordion = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="flex flex-col min-h-screen bg-nova-darker text-white font-sans">
      {/* Page Header Banner */}
      <div className="relative w-full h-[200px] bg-gradient-to-r from-nova-darker via-nova-dark to-nova-darker flex items-center overflow-hidden border-b border-nova-gold/10">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="container mx-auto px-6 md:px-12 max-w-5xl relative z-10">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-nova-gold font-semibold mb-2">CUSTOMER SERVICES</span>
          <h1 className="text-3xl md:text-4xl font-serif tracking-wider mb-2">Frequently Asked Questions (FAQ)</h1>
          <p className="text-white/60 max-w-xl text-xs md:text-sm font-light">
            Find quick answers to delivery questions, return terms, and order handling.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-16 max-w-5xl flex-1">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2.5 md:gap-3.5 mb-10 pb-4 border-b border-white/5 justify-start md:justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleTabChange(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all duration-300 font-semibold border ${
                activeTab === cat.id
                  ? 'bg-nova-gold text-nova-darker border-nova-gold font-bold shadow-lg shadow-nova-gold/15'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border-white/5'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Accordion Questions List */}
        <div className="space-y-4 max-w-4xl mx-auto mb-16">
          {currentCategory.items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx} 
                className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-300"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-medium tracking-wide text-white hover:text-nova-gold transition-colors"
                >
                  <span className="pr-4">{item.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-nova-gold shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />
                  )}
                </button>
                
                {/* Smooth open/close collapse panel */}
                <div 
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[300px] border-t border-white/5 opacity-100 p-5' : 'max-h-0 opacity-0 overflow-hidden'
                  } bg-nova-darker/35 text-xs text-white/60 font-light leading-relaxed`}
                >
                  {item.answer}
                </div>
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Contact CTA */}
        <div className="max-w-xl mx-auto text-center border-t border-white/5 pt-12">
          <HelpCircle className="w-8 h-8 text-nova-gold mx-auto mb-4" />
          <h3 className="font-serif text-lg text-white mb-2">Still Have Questions?</h3>
          <p className="text-xs text-white/50 font-light mb-6">
            If you cannot find the answer to your question, feel free to contact our Customer Support team directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:contact@novajewels.info" 
              className="inline-flex items-center gap-2 justify-center border border-nova-gold/40 text-nova-gold hover:bg-nova-gold hover:text-nova-darker hover:border-nova-gold px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300"
            >
              <Mail className="w-4 h-4" />
              <span>Email Support</span>
            </a>
            <a 
              href="tel:+919027368625" 
              className="inline-flex items-center gap-2 justify-center border border-white/20 text-white hover:border-nova-gold hover:text-nova-gold px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300"
            >
              <Phone className="w-4 h-4" />
              <span>Call +91 9027368625</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
