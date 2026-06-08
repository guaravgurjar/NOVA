import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-nova-darker text-white font-sans">
      {/* Page Header Banner */}
      <div className="relative w-full h-[200px] bg-gradient-to-r from-nova-darker via-nova-dark to-nova-darker flex items-center overflow-hidden border-b border-nova-gold/10">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="container mx-auto px-6 md:px-12 max-w-5xl relative z-10">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-nova-gold font-semibold mb-2">LEGAL</span>
          <h1 className="text-3xl md:text-4xl font-serif tracking-wider mb-2">Terms of Service</h1>
          <p className="text-white/60 max-w-xl text-xs md:text-sm font-light">
            Read our rules, guidelines, and general store terms before using our site.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-16 max-w-4xl flex-1 text-white/70 text-sm font-light leading-relaxed">
        <div className="space-y-8">
          
          {/* Overview */}
          <div>
            <h2 className="text-lg font-serif tracking-wide text-white mb-3 uppercase text-nova-gold">Overview</h2>
            <p className="mb-4">
              This website is operated by “NOVA”, offering premium silver jewellery by NOVA.
            </p>
            <p className="mb-4">
              By accessing our website or purchasing from us, you agree to use our services in accordance with the terms, conditions, and policies outlined here (“Terms of Service”). These Terms apply to all users, including browsers, customers, and merchants.
            </p>
            <p className="mb-4">
              Please read these Terms carefully before using our website. If you do not agree, you may not access or use our services.
            </p>
            <p>
              We may update or modify these Terms from time to time. Continued use of the website after any changes indicates your acceptance of those updates.
            </p>
          </div>

          {/* Section 1 */}
          <div className="border-t border-white/5 pt-8">
            <h3 className="text-base font-serif font-medium text-white mb-3">Section 1 – Online Store Terms</h3>
            <p className="mb-3">
              By using our services, you confirm that you are of legal age in your place of residence, or have given consent for any minor dependents to use this site. You agree not to use our products or services for any illegal or unauthorized purposes, and to comply with all applicable laws, including copyright regulations.
            </p>
            <p className="mb-3">
              You must not transmit any viruses, worms, or any harmful or destructive code.
            </p>
            <p>
              Any violation of these Terms may result in the immediate termination of your access to our services.
            </p>
          </div>

          {/* Section 2 */}
          <div className="border-t border-white/5 pt-8">
            <h3 className="text-base font-serif font-medium text-white mb-3">Section 2 – General Conditions</h3>
            <p className="mb-3">
              We reserve the right to refuse service to anyone at any time for any reason.
            </p>
            <p className="mb-3">
              Your content (excluding credit card details) may be transferred across networks and adjusted to meet technical requirements. Please note that all payment information is securely encrypted during transmission.
            </p>
            <p className="mb-3">
              You agree not to copy, reproduce, sell, or misuse any part of our services without our written permission.
            </p>
            <p className="text-xs text-white/45 italic">
              Section headings are for convenience only and do not affect the meaning of these Terms.
            </p>
          </div>

          {/* Section 3 */}
          <div className="border-t border-white/5 pt-8">
            <h3 className="text-base font-serif font-medium text-white mb-3">Section 3 – Accuracy, Completeness and Timeliness of Information</h3>
            <p className="mb-3">
              We do not guarantee that the information on our website is always accurate, complete, or up to date. The content is provided for general information only and should not be solely relied upon for making decisions without consulting more reliable sources. Any reliance on such information is at your own risk.
            </p>
            <p>
              The site may also include historical information, which is provided for reference and may not be current. We reserve the right to update or modify content at any time, but we are not obligated to do so. It is your responsibility to stay informed about any changes.
            </p>
          </div>

          {/* Section 4 */}
          <div className="border-t border-white/5 pt-8">
            <h3 className="text-base font-serif font-medium text-white mb-3">Section 4 – Modifications to Services and Prices</h3>
            <p>
              Product prices may change at any time without prior notice. We also reserve the right to modify or discontinue any part of our services without notice. We will not be liable for any such changes, suspensions, or discontinuation of the service.
            </p>
          </div>

          {/* Section 5 */}
          <div className="border-t border-white/5 pt-8">
            <h3 className="text-base font-serif font-medium text-white mb-3">Section 5 – Products or Services</h3>
            <p className="mb-3">
              Some products or services may be available exclusively online and may be offered in limited quantities, subject to our <Link to="/return" className="text-nova-gold hover:underline">Return Policy</Link>.
            </p>
            <p className="mb-3">
              We strive to display product colors and images as accurately as possible; however, we cannot guarantee that your device will reflect the exact colors.
            </p>
            <p className="mb-3">
              We reserve the right to limit or restrict sales by person, location, or quantity on a case-by-case basis, and to modify product descriptions, pricing, or discontinue products at any time without notice.
            </p>
            <p>
              We do not guarantee that the quality of our products, services, or information will meet your expectations, or that all errors will be corrected.
            </p>
          </div>

          {/* Section 6 */}
          <div className="border-t border-white/5 pt-8">
            <h3 className="text-base font-serif font-medium text-white mb-3">Section 6 – Accuracy of Billing and Account Information</h3>
            <p className="mb-3">
              We reserve the right to refuse or cancel any order at our discretion, including limiting quantities per person, household, or order. If any changes or cancellations are made, we will attempt to notify you using the contact details provided at the time of purchase.
            </p>
            <p className="mb-3">
              We may also restrict orders that appear to be placed by dealers, resellers, or distributors.
            </p>
            <p>
              You agree to provide accurate, complete, and up-to-date billing and account information, and to update your details as needed so we can process your orders and communicate with you effectively. For more details, please refer to our <Link to="/return" className="text-nova-gold hover:underline">Return Policy</Link>.
            </p>
          </div>

          {/* Section 7 */}
          <div className="border-t border-white/5 pt-8">
            <h3 className="text-base font-serif font-medium text-white mb-3">Section 7 – Optional Tools</h3>
            <p className="mb-3">
              We may provide access to third-party tools that we do not control or monitor. These tools are offered “as is” and “as available,” without any warranties or guarantees.
            </p>
            <p>
              Your use of such tools is entirely at your own risk, and we recommend reviewing the terms of the respective third-party providers before using them. Any new features, tools, or services introduced in the future will also be governed by these Terms of Service.
            </p>
          </div>

          {/* Section 8 */}
          <div className="border-t border-white/5 pt-8">
            <h3 className="text-base font-serif font-medium text-white mb-3">Section 8 – Third-Party Links</h3>
            <p className="mb-3">
              Some content, products, or services on our website may include materials from third parties. Any third-party links may take you to websites that are not affiliated with us, and we are not responsible for their content, accuracy, or practices.
            </p>
            <p>
              Please review the third party’s policies carefully before making any transaction. For any concerns related to third-party products or services, please contact the third party directly.
            </p>
          </div>

          {/* Section 9 */}
          <div className="border-t border-white/5 pt-8">
            <h3 className="text-base font-serif font-medium text-white mb-3">Section 9 – User Comments, Feedback and Other Submissions</h3>
            <p className="mb-3">
              If you share comments, feedback, or any submissions with us—whether requested or not—you agree that we may use, edit, publish, or distribute them without restriction or obligation to compensate or respond. We may monitor or remove content that we find unlawful, offensive, or in violation of these Terms.
            </p>
            <p>
              You agree that your submissions will not infringe on any third-party rights or contain harmful, misleading, or inappropriate content. You are solely responsible for the accuracy and nature of what you share, and we do not assume liability for any user-submitted content.
            </p>
          </div>

          {/* Section 10 */}
          <div className="border-t border-white/5 pt-8">
            <h3 className="text-base font-serif font-medium text-white mb-3">Section 10 – Personal Information</h3>
            <p>
              Your submission of personal information through our store is governed by our <Link to="/privacy" className="text-nova-gold hover:underline">Privacy Policy</Link>. Please refer to our Privacy Policy for more details.
            </p>
          </div>

          {/* Section 11 */}
          <div className="border-t border-white/5 pt-8">
            <h3 className="text-base font-serif font-medium text-white mb-3">Section 11 – Errors, Inaccuracies and Omissions</h3>
            <p className="mb-3">
              Occasionally, there may be typographical errors, inaccuracies, or omissions on our website related to product details, pricing, offers, shipping, or availability. We reserve the right to correct such errors, update information, or cancel orders at any time without prior notice—even after an order has been placed.
            </p>
            <p>
              We are not obligated to update or clarify information unless required by law, and any update dates should not be assumed to reflect all changes.
            </p>
          </div>

          {/* Section 12 */}
          <div className="border-t border-white/5 pt-8">
            <h3 className="text-base font-serif font-medium text-white mb-3">Section 12 – Prohibited Uses</h3>
            <p className="mb-3">
              You are prohibited from using our website or its content for any unlawful, harmful, or abusive purposes. This includes violating laws, infringing intellectual property rights, sharing false information, transmitting harmful code, misusing personal data, or engaging in activities such as harassment, discrimination, spam, or fraud.
            </p>
            <p>
              Any misuse of the website or violation of these terms may result in immediate termination of your access to our services.
            </p>
          </div>

          {/* Section 13 */}
          <div className="border-t border-white/5 pt-8">
            <h3 className="text-base font-serif font-medium text-white mb-3">Section 13 – Disclaimer of Warranties; Limitation of Liability</h3>
            <p className="mb-3">
              We do not guarantee that our services will always be uninterrupted, secure, or error-free. Any warranties applicable to products will be clearly mentioned on the respective product pages.
            </p>
            <p className="mb-3">
              Your use of our services is at your own risk, and all products and services are provided “as is” and “as available,” without any guarantees of accuracy or reliability. We may modify, suspend, or discontinue services at any time without prior notice.
            </p>
            <p>
              To the fullest extent permitted by law, we shall not be liable for any direct or indirect damages, losses, or claims arising from your use of our services or products.
            </p>
          </div>

          {/* Section 14 */}
          <div className="border-t border-white/5 pt-8">
            <h3 className="text-base font-serif font-medium text-white mb-3">Section 14 – Indemnification</h3>
            <p>
              You agree to indemnify and hold NOVA Jewellery and its affiliates, partners, employees, and service providers harmless from any claims, damages, or expenses (including legal fees) arising from your violation of these Terms or any applicable laws, or infringement of any third-party rights.
            </p>
          </div>

          {/* Section 15 */}
          <div className="border-t border-white/5 pt-8">
            <h3 className="text-base font-serif font-medium text-white mb-3">Section 15 – Severability</h3>
            <p>
              If any provision of these Terms is found to be unlawful or unenforceable, it will be limited or removed as required by law, without affecting the validity of the remaining provisions.
            </p>
          </div>

          {/* Section 16 */}
          <div className="border-t border-white/5 pt-8">
            <h3 className="text-base font-serif font-medium text-white mb-3">Section 16 – Termination</h3>
            <p className="mb-3">
              These Terms of Service remain in effect unless terminated by either you or us. You may terminate them at any time by discontinuing the use of our services or notifying us accordingly.
            </p>
            <p>
              We reserve the right to suspend or terminate your access to our services at any time, without notice, if we believe there has been a violation of these Terms. Any obligations or liabilities incurred prior to termination will continue to remain in effect.
            </p>
          </div>

          {/* Section 17 */}
          <div className="border-t border-white/5 pt-8">
            <h3 className="text-base font-serif font-medium text-white mb-3">Section 17 – Entire Agreement</h3>
            <p className="mb-3">
              These Terms of Service, along with our policies and guidelines, form the complete agreement between you and us and govern your use of our services, replacing any prior agreements or communications.
            </p>
            <p>
              Our failure to enforce any part of these Terms does not waive our rights. Any ambiguities in interpretation will not be held against either party.
            </p>
          </div>

          {/* Section 18 */}
          <div className="border-t border-white/5 pt-8">
            <h3 className="text-base font-serif font-medium text-white mb-3">Section 18 – Governing Law</h3>
            <p>
              These Terms of Service and any related agreements are governed by the laws of India.
            </p>
          </div>

          {/* Section 19 */}
          <div className="border-t border-white/5 pt-8">
            <h3 className="text-base font-serif font-medium text-white mb-3">Section 19 – Changes to Terms of Service</h3>
            <p>
              You can review the latest version of our Terms of Service on this page at any time. We may update or modify these Terms as needed, so we encourage you to check this page regularly. Continued use of our website or services after any changes means you agree to the updated Terms.
            </p>
          </div>

          {/* Section 20 */}
          <div className="border-t border-white/5 pt-8">
            <h3 className="text-base font-serif font-medium text-white mb-3">Section 20 – Contact Information</h3>
            <p className="mb-3">
              Questions about the Terms of Service should be sent to us at <a href="mailto:contact@novajewels.info" className="text-nova-gold hover:underline">contact@novajewels.info</a>.
            </p>
            <p>
              Our address: <strong>Utkarsh Jewellers, Galla mandi, Kurawali, Mainpuri - 205265</strong>
            </p>
          </div>

          {/* Section 21 */}
          <div className="border-t border-white/5 pt-8 space-y-4">
            <h3 className="text-base font-serif font-medium text-white mb-3">Section 21 – Shipping, Returns & Refund Policy</h3>
            
            <div>
              <h4 className="text-xs uppercase tracking-widest text-nova-gold font-semibold mb-1">Shipping & Handling</h4>
              <ul className="list-disc list-inside text-xs font-light pl-2 space-y-1">
                <li><strong>Shipping Time:</strong> Orders are typically processed and shipped within 48 hours.</li>
                <li><strong>Shipping Charges:</strong> Free shipping is available on orders above ₹449. Please note that international orders and returns are not eligible for free shipping.</li>
                <li><strong>Tracking:</strong> Once your order is shipped, tracking details will be shared via WhatsApp, email, and SMS.</li>
                <li><strong>Partial Deliveries:</strong> If your order includes multiple items, it may be delivered in separate shipments.</li>
                <li><strong>Delivery Area:</strong> All orders can only be delivered within India.</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-widest text-nova-gold font-semibold mb-1">Return Policy</h4>
              <p className="text-xs font-light leading-relaxed mb-2">
                We offer a 15-day return policy on unused and unworn items. Refunds are processed after a quality check. Products purchased from other platforms will follow their respective return policies. Shipping charges, if any, are non-refundable. If any item is missing in a return, the value (up to full MRP) may be deducted from your refund. This also applies to promotional items like free gifts or coins.
              </p>
              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl mt-2">
                <h5 className="text-[10px] uppercase tracking-wider text-nova-gold font-bold mb-1.5">Return & Exchange Exclusions</h5>
                <p className="text-[11px] font-light leading-relaxed text-white/60">
                  Products showing signs of wear and tear, having been resized or altered (especially by a jeweller other than NOVA), or damaged due to mishandling (e.g., bent, scratched, broken by an external force) are not eligible under the 15-day return/exchange policy. Coins and Made to Order products are not covered under 15-day returns, and nose pins (even normal orders) cannot be exchanged due to hygiene reasons; however, Lifetime Exchange/Buyback (LTE/LTB) is applicable on both these categories. Promo coins are not part of LTE/LTB and will be added to the promo wallet in case of returns/refunds.
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-widest text-nova-gold font-semibold mb-1">Refund Policy</h4>
              <p className="text-xs font-light leading-relaxed">
                Refunds are initiated once the returned product is received at our warehouse and are processed based on the original invoice value. Current price changes will not be considered.
              </p>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-widest text-nova-gold font-semibold mb-1">Replacement & Exchange</h4>
              <p className="text-xs font-light leading-relaxed">
                You can request a replacement or exchange under the same conditions as returns. Replacement will be processed after the original item is picked up or received.
              </p>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-widest text-nova-gold font-semibold mb-1">Return Process</h4>
              <p className="text-xs font-light leading-relaxed">
                Returns can be initiated via our website/app or by contacting customer support. Please ensure availability during pickup and respond to courier calls, as missed pickups may delay the process.
              </p>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-widest text-nova-gold font-semibold mb-1">Order Cancellation</h4>
              <p className="text-xs font-light leading-relaxed">
                Order cancellations are permitted for standard online jewellery orders. You may cancel your order anytime after placement, provided it has not yet been delivered.
              </p>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-widest text-nova-gold font-semibold mb-1">Non-Serviceable Areas</h4>
              <p className="text-xs font-light leading-relaxed">
                In some locations where reverse pickup is unavailable, you may need to self-ship the product (e.g., via India Post). Shipping costs up to ₹70 will be reimbursed. Any amount exceeding ₹70 will be adjusted against your refund.
              </p>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-widest text-nova-gold font-semibold mb-1">Damaged or Missing Items</h4>
              <p className="text-xs font-light leading-relaxed">
                If you receive an empty or incomplete order, please contact us within 48 hours with a 360° unboxing video. Claims without sufficient proof or with signs of tampering may not be accepted. Final decisions in such cases rest with the brand.
              </p>
            </div>
          </div>

          {/* Gift Card Terms */}
          <div className="border-t border-white/5 pt-8 space-y-4">
            <h3 className="text-base font-serif font-medium text-white mb-3">Terms and Conditions – Gift Cards</h3>
            <ul className="list-disc list-inside text-xs font-light space-y-2">
              <li>Redeemable exclusively on NOVA’s online platforms.</li>
              <li>Applicable on all products except coins, idols, and utensils.</li>
              <li>Orders placed using Gift Cards cannot be modified after confirmation.</li>
              <li>Valid only within India.</li>
              <li>Refunds for Gift Card purchases will be credited to the NOVA Wallet.</li>
              <li>E-Gift Cards are delivered instantly; however, in rare cases, delivery may take up to 24–48 hours.</li>
              <li>Gift Cards are non-returnable and non-refundable.</li>
            </ul>

            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl space-y-3 mt-4">
              <h4 className="text-xs uppercase tracking-widest text-nova-gold font-semibold">How to Redeem (Online Redemption)</h4>
              <ol className="list-decimal list-inside text-xs font-light space-y-1.5 text-white/70">
                <li>Visit our website.</li>
                <li>Add your favourite items to the cart and proceed to checkout.</li>
                <li>Enter your 16-digit Gift Card number and 6-digit PIN in the “Apply Gift Card” section.</li>
                <li>Select the amount you wish to redeem and complete your purchase.</li>
              </ol>
            </div>

            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
              <h4 className="text-xs uppercase tracking-widest text-nova-gold font-semibold mb-2">Gift Card Return Policy</h4>
              <p className="text-xs font-light leading-relaxed text-white/70">
                If a Gift Card is issued as part of a purchase from NOVA and the corresponding product is returned, the issued Gift Card shall become invalid and will not be eligible for further use.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
