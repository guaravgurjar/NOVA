import { useEffect } from 'react';

export function CookiePolicy() {
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
          <h1 className="text-3xl md:text-4xl font-serif tracking-wider mb-2">Cookie Policy</h1>
          <p className="text-white/60 max-w-xl text-xs md:text-sm font-light">
            Learn how we use cookies to provide a premium, seamless jewelry shopping experience.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-16 max-w-4xl flex-1 text-white/70 text-sm font-light leading-relaxed">
        <div className="space-y-8">
          
          <p>
            At <strong>NOVA Jewellery</strong> (powered by Utkarsh Jewellers Group), we believe in being clear and transparent about how we collect and use data related to you. This Cookie Policy explains what cookies are, how we use them on our website, and how you can manage your preferences.
          </p>

          {/* WHAT ARE COOKIES */}
          <div className="border-t border-white/5 pt-8">
            <h2 className="text-lg font-serif tracking-wide text-white mb-4 uppercase text-nova-gold">What Are Cookies?</h2>
            <p className="mb-4">
              Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
            </p>
            <p>
              Cookies may be "persistent" (remaining on your device for a set period or until deleted) or "session" cookies (deleted automatically when you close your web browser).
            </p>
          </div>

          {/* HOW WE USE COOKIES FOR JEWELRY SHOPPING */}
          <div className="border-t border-white/5 pt-8">
            <h2 className="text-lg font-serif tracking-wide text-white mb-4 uppercase text-nova-gold">How We Use Cookies</h2>
            <p className="mb-4">
              We use cookies to enhance your shopping experience, secure our checkout processes, and deliver personalized product suggestions. Specifically, cookies allow us to:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-3">
              <li>Keep items in your <strong>Shopping Cart</strong> as you browse different pages of the boutique.</li>
              <li>Save items to your <strong>Wishlist</strong> so you can easily find your favorite pieces later.</li>
              <li>Remember your login session and secure your personal account details.</li>
              <li>Provide our interactive <strong>Luxury Concierge Chatbot</strong> to assist you with styling and sizing.</li>
              <li>Analyze store performance, traffic patterns, and popular jewelry collections to improve our services.</li>
              <li>Display relevant advertisements for jewelry designs that match your taste and browsing history.</li>
            </ul>
          </div>

          {/* TYPES OF COOKIES WE USE */}
          <div className="border-t border-white/5 pt-8">
            <h2 className="text-lg font-serif tracking-wide text-white mb-4 uppercase text-nova-gold">Types of Cookies We Use</h2>
            
            <p className="mb-6">
              The cookies used on our website are categorized as follows:
            </p>

            <div className="space-y-6">
              
              {/* Category 1 */}
              <div>
                <h3 className="text-white font-medium mb-2 font-serif text-sm uppercase tracking-wider">1. Strictly Necessary Cookies</h3>
                <p className="mb-3">
                  These cookies are essential for the operation of our website. Without them, core functions like checkout, shopping cart persistence, and secure account access cannot be provided.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-white/10 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10 text-nova-gold">
                        <th className="p-3 font-semibold">Cookie Name</th>
                        <th className="p-3 font-semibold">Purpose</th>
                        <th className="p-3 font-semibold">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="p-3 font-mono font-semibold">nova_session</td>
                        <td className="p-3">Maintains checkout flow and active user sessions.</td>
                        <td className="p-3">Session</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-semibold">nova_cart</td>
                        <td className="p-3">Persists shopping cart items while you browse.</td>
                        <td className="p-3">30 Days</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-semibold">nova_auth</td>
                        <td className="p-3">Secures login details for your account dashboard.</td>
                        <td className="p-3">Persistent</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Category 2 */}
              <div className="pt-4">
                <h3 className="text-white font-medium mb-2 font-serif text-sm uppercase tracking-wider">2. Preference & Functional Cookies</h3>
                <p className="mb-3">
                  These cookies allow our site to remember choices you make (such as your username, language, or currency) and provide enhanced, more personal features like saving your wishlist or recalling previous styling chats.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-white/10 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10 text-nova-gold">
                        <th className="p-3 font-semibold">Cookie Name</th>
                        <th className="p-3 font-semibold">Purpose</th>
                        <th className="p-3 font-semibold">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="p-3 font-mono font-semibold">nova_wishlist</td>
                        <td className="p-3">Remembers your bookmarked jewelry designs.</td>
                        <td className="p-3">60 Days</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-semibold">nova_cookie_consent</td>
                        <td className="p-3">Remembers your preference for the cookie banner.</td>
                        <td className="p-3">1 Year</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Category 3 */}
              <div className="pt-4">
                <h3 className="text-white font-medium mb-2 font-serif text-sm uppercase tracking-wider">3. Performance & Analytics Cookies</h3>
                <p className="mb-3">
                  These cookies collect information about how visitors use our website, such as which pages are visited most often, or if they receive error messages. The data collected is anonymous and used solely to improve how our store functions.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-white/10 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10 text-nova-gold">
                        <th className="p-3 font-semibold">Service</th>
                        <th className="p-3 font-semibold">Purpose</th>
                        <th className="p-3 font-semibold">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="p-3 font-mono font-semibold">Google Analytics</td>
                        <td className="p-3">Anonymously tracks traffic, page views, and user flows on the store.</td>
                        <td className="p-3">Up to 2 Years</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Category 4 */}
              <div className="pt-4">
                <h3 className="text-white font-medium mb-2 font-serif text-sm uppercase tracking-wider">4. Targeting & Marketing Cookies</h3>
                <p className="mb-3">
                  These cookies are used to deliver jewelry recommendations and advertisements relevant to you and your interests. They also limit the number of times you see an advertisement and help measure the effectiveness of advertising campaigns.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-white/10 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10 text-nova-gold">
                        <th className="p-3 font-semibold">Provider</th>
                        <th className="p-3 font-semibold">Purpose</th>
                        <th className="p-3 font-semibold">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="p-3 font-mono font-semibold">Meta Pixel</td>
                        <td className="p-3">Tracks store actions to show relevant jewelry ads on Facebook and Instagram.</td>
                        <td className="p-3">180 Days</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-semibold">Google Ads</td>
                        <td className="p-3">Enables retargeting campaigns for items you viewed on our website.</td>
                        <td className="p-3">30 Days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>

          {/* MANAGING YOUR COOKIES */}
          <div className="border-t border-white/5 pt-8">
            <h2 className="text-lg font-serif tracking-wide text-white mb-4 uppercase text-nova-gold">Managing Your Cookie Preferences</h2>
            <p className="mb-4">
              You have the right to decide whether to accept or reject non-essential cookies. You can exercise your preferences when you first visit our site via the Cookie Consent Banner.
            </p>
            <p className="mb-4">
              Additionally, you can configure your web browser to accept, reject, or alert you about new cookies. Because the exact method varies from browser to browser, you should consult your browser's Help menu for details:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-2 mb-6">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-nova-gold hover:underline">Google Chrome</a></li>
              <li><a href="https://support.apple.com/en-us/HT201265" target="_blank" rel="noopener noreferrer" className="text-nova-gold hover:underline">Apple Safari</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-nova-gold hover:underline">Mozilla Firefox</a></li>
              <li><a href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd" target="_blank" rel="noopener noreferrer" className="text-nova-gold hover:underline">Microsoft Edge</a></li>
            </ul>
            <p>
              Please note that disabling strictly necessary cookies may prevent certain pages or features (like adding jewelry to your shopping cart or checking out) from working properly.
            </p>
          </div>

          {/* CONTACT INFORMATION */}
          <div className="border-t border-white/5 pt-8">
            <h2 className="text-lg font-serif tracking-wide text-white mb-4 uppercase text-nova-gold">Questions or Comments</h2>
            <p>
              If you have any questions or require further assistance regarding our Cookie Policy, please contact our support team at <a href="mailto:contact@novajewels.info" className="text-nova-gold hover:underline">contact@novajewels.info</a>.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
