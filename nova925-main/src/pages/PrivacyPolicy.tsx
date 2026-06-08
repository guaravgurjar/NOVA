import { useEffect } from 'react';

export function PrivacyPolicy() {
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
          <h1 className="text-3xl md:text-4xl font-serif tracking-wider mb-2">Privacy Policy</h1>
          <p className="text-white/60 max-w-xl text-xs md:text-sm font-light">
            Understand how your personal information is collected, used, and shared.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-16 max-w-4xl flex-1 text-white/70 text-sm font-light leading-relaxed">
        <div className="space-y-8">
          
          <p>
            This Privacy Policy explains how your personal information is collected, used, and shared when you visit or make a purchase from our website.
          </p>

          {/* PERSONAL INFORMATION WE COLLECT */}
          <div className="border-t border-white/5 pt-8">
            <h2 className="text-lg font-serif tracking-wide text-white mb-4 uppercase text-nova-gold">Personal Information We Collect</h2>
            <p className="mb-4">
              When you visit our website, we automatically collect certain information about your device, such as your web browser, IP address, time zone, and cookies. We also gather details about the pages and products you view, how you found our site, and how you interact with it. This information is referred to as <strong>“Device Information.”</strong>
            </p>
            <p className="mb-4">
              We collect “Device Information” using various technologies, such as cookies, log files, and similar tracking tools:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-3 mb-6">
              <li>
                <strong>“Cookies”</strong> are small data files stored on your device, often including an anonymous unique identifier. You can learn more about cookies and how to disable them at <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-nova-gold hover:underline">allaboutcookies.org</a>.
              </li>
              <li>
                <strong>“Log files”</strong> track activity on the site and collect information such as your IP address, browser type, internet service provider, referring/exit pages, and date/time stamps.
              </li>
              <li>
                <strong>“Web beacons”</strong>, <strong>“tags”</strong>, and <strong>“pixels”</strong> are electronic tools used to understand how you browse and interact with the site.
              </li>
            </ul>
            <p className="mb-4">
              When you make or attempt to make a purchase on our website, we collect details such as your name, billing and shipping address, payment information, email, and phone number. <strong>Please note that we do not store your credit card or other payment details.</strong> This information is referred to as <strong>“Order Information.”</strong>
            </p>
            <p>
              When we refer to “Personal Information” in this Privacy Policy, it includes both Device Information and Order Information.
            </p>
          </div>

          {/* HOW DO WE USE YOUR PERSONAL INFORMATION */}
          <div className="border-t border-white/5 pt-8">
            <h2 className="text-lg font-serif tracking-wide text-white mb-4 uppercase text-nova-gold">How Do We Use Your Personal Information?</h2>
            <p className="mb-4">
              By using our website or making a purchase, you agree to the use of your personal information as outlined in this policy.
            </p>
            <p className="mb-4">
              We use the Order Information we collect to process and fulfil your orders, including handling payments, shipping, and sending order confirmations or invoices. Additionally, we use this information to:
            </p>
            <ol className="list-decimal list-inside pl-4 space-y-2 mb-6">
              <li>Communicate with you via SMS, email, WhatsApp, RCS, and other channels.</li>
              <li>Screen orders for potential risk or fraud.</li>
              <li>Share updates, offers, and information about our products or services.</li>
            </ol>
            <p className="mb-4">
              We use the Device Information we collect to help identify potential risk and fraud (including your IP address), and to improve and optimize our website. This includes analysing how customers browse and interact with the site, and evaluating the effectiveness of our marketing and advertising campaigns.
            </p>
          </div>

          {/* HOW WE SHARE YOUR PERSONAL INFORMATION */}
          <div className="border-t border-white/5 pt-8">
            <h2 className="text-lg font-serif tracking-wide text-white mb-4 uppercase text-nova-gold">How We Share Your Personal Information</h2>
            <p>
              We may share your personal information only when it is necessary to comply with applicable laws and regulations, respond to valid legal requests such as a subpoena or search warrant, or protect our legal rights and services. Please be assured that your privacy and trust remain very important to us, and any such sharing is done responsibly and with care.
            </p>
          </div>

          {/* BEHAVIOURAL ADVERTISING */}
          <div className="border-t border-white/5 pt-8">
            <h2 className="text-lg font-serif tracking-wide text-white mb-4 uppercase text-nova-gold">Behavioural Advertising</h2>
            <p className="mb-4">
              We use your personal information to show you relevant advertisements and marketing communications that may match your interests. For more information on how targeted advertising works, you can visit the Network Advertising Initiative’s educational page.
            </p>
            <p className="mb-4">
              You can opt out of targeted advertising by using the links below:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-2 mb-6">
              <li>
                <strong>Facebook:</strong> <a href="https://www.facebook.com/settings/?tab=ads" target="_blank" rel="noopener noreferrer" className="text-nova-gold hover:underline">facebook.com/settings/?tab=ads</a>
              </li>
              <li>
                <strong>Google:</strong> <a href="https://www.google.com/settings/ads/anonymous" target="_blank" rel="noopener noreferrer" className="text-nova-gold hover:underline">google.com/settings/ads/anonymous</a>
              </li>
              <li>
                <strong>Bing:</strong> <a href="https://advertise.bingads.microsoft.com/en-us/resources/policies/personalized-ads" target="_blank" rel="noopener noreferrer" className="text-nova-gold hover:underline">advertise.bingads.microsoft.com</a>
              </li>
            </ul>
            <p>
              You can also choose to opt out of certain advertising services by visiting the Digital Advertising Alliance’s opt-out portal.
            </p>
          </div>

          {/* DO NOT TRACK */}
          <div className="border-t border-white/5 pt-8">
            <h2 className="text-lg font-serif tracking-wide text-white mb-4 uppercase text-nova-gold">Do Not Track</h2>
            <p>
              Please note that we do not change our website’s data collection or usage practices when your browser sends a Do Not Track signal.
            </p>
          </div>

          {/* DATA RETENTION */}
          <div className="border-t border-white/5 pt-8">
            <h2 className="text-lg font-serif tracking-wide text-white mb-4 uppercase text-nova-gold">Data Retention</h2>
            <p>
              When you place an order through our website, we retain your Order Information for our records unless you request us to delete it.
            </p>
          </div>

          {/* CHANGES TO THIS POLICY */}
          <div className="border-t border-white/5 pt-8">
            <h2 className="text-lg font-serif tracking-wide text-white mb-4 uppercase text-nova-gold">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or for operational, legal, or regulatory reasons.
            </p>
          </div>

          {/* CONTACT INFORMATION */}
          <div className="border-t border-white/5 pt-8">
            <h2 className="text-lg font-serif tracking-wide text-white mb-4 uppercase text-nova-gold">Contact Us</h2>
            <p>
              For more information about our privacy practices, or if you have any questions or concerns, please feel free to contact us at <a href="mailto:contact@novajewels.info" className="text-nova-gold hover:underline">contact@novajewels.info</a>.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
