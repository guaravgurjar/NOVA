export interface RouteSEOOptions {
  title: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  noIndex?: boolean;
  jsonLd?: Record<string, any>;
}

export const DEFAULT_ORIGIN = 'https://novajewellery.in';
export const DEFAULT_OG_IMAGE = `${DEFAULT_ORIGIN}/images/logo.png`;
export const SITE_NAME = 'NOVA Jewellery';

/**
 * Route-level default SEO configurations dictionary for static pages
 */
export const ROUTE_SEO_CONFIGS: Record<string, RouteSEOOptions> = {
  '/': {
    title: 'Buy 925 Sterling Silver Jewellery Online India',
    description: 'Explore NOVA Jewellery for certified 925 sterling silver rings, earrings, necklaces, bracelets & accessories. Hallmarked purity, free shipping, cash on delivery.',
    keywords: 'silver jewellery, 925 sterling silver, online jewellery store India, silver rings, silver necklaces, hallmarked silver',
    canonicalPath: '/',
    ogType: 'website',
  },
  '/shop': {
    title: 'Shop 925 Sterling Silver Collection',
    description: 'Browse the entire NOVA luxury sterling silver jewellery collection. Filter by category, price, gemstone, and finish.',
    keywords: 'shop silver jewellery, buy 925 silver rings, silver pendants, luxury silver ornaments',
    canonicalPath: '/shop',
    ogType: 'website',
  },
  '/kit': {
    title: 'Jewellery Care Kit & Maintenance',
    description: 'Keep your 925 sterling silver jewellery shining like new with the official NOVA Jewellery anti-tarnish care kit and cleaning tips.',
    keywords: 'jewellery care kit, clean silver jewellery, silver polishing cloth, anti tarnish silver',
    canonicalPath: '/kit',
    ogType: 'website',
  },
  '/warranty': {
    title: 'Warranty & 925 Purity Guarantee',
    description: 'Every NOVA piece comes with an official certificate of authenticity guaranteeing 92.5% pure hallmarked sterling silver.',
    keywords: 'silver purity warranty, 925 authenticity certificate, hallmarked silver guarantee',
    canonicalPath: '/warranty',
    ogType: 'website',
  },
  '/about': {
    title: 'About Us — Heritage & Craftsmanship',
    description: 'Discover NOVA Jewellery by Utkarsh Jewellers — our legacy of craftsmanship, ethical sourcing, and commitment to luxury silver.',
    keywords: 'about nova jewellery, utkarsh jewellers, sterling silver brand, luxury jewellery history',
    canonicalPath: '/about',
    ogType: 'website',
  },
  '/contact': {
    title: 'Contact Us & Customer Support',
    description: 'Get in touch with NOVA Jewellery support team. Reach us for order inquiries, size help, and custom orders via phone or email.',
    keywords: 'contact nova jewellery, customer care silver jewellery, jewellery support email',
    canonicalPath: '/contact',
    ogType: 'website',
  },
  '/faq': {
    title: 'Frequently Asked Questions (FAQ)',
    description: 'Find quick answers to common questions about NOVA Jewellery orders, shipping, 7-day returns, warranty, and silver care.',
    keywords: 'nova jewellery FAQ, silver shipping policy help, order tracking questions',
    canonicalPath: '/faq',
    ogType: 'website',
  },
  '/shipping': {
    title: 'Shipping & Delivery Policy',
    description: 'Free pan-India shipping on all orders. Learn about dispatch timelines, order tracking, and tamper-proof packaging.',
    keywords: 'jewellery shipping policy, free shipping silver jewellery, delivery timelines',
    canonicalPath: '/shipping',
    ogType: 'website',
  },
  '/return': {
    title: 'Easy 7-Day Return & Exchange Policy',
    description: 'Hassle-free 7-day returns and size exchanges on all NOVA sterling silver jewellery. Simple door step pickup.',
    keywords: 'jewellery return policy, 7 day silver exchange, return policy nova',
    canonicalPath: '/return',
    ogType: 'website',
  },
  '/privacy': {
    title: 'Privacy Policy',
    description: 'Learn how NOVA Jewellery protects customer personal data, SSL encryption, and confidential payment details.',
    canonicalPath: '/privacy',
    ogType: 'website',
  },
  '/cookies': {
    title: 'Cookie Policy',
    description: 'Understand how cookies and local storage are utilized on NOVA Jewellery to optimize your browsing and cart experience.',
    canonicalPath: '/cookies',
    ogType: 'website',
  },
  '/terms': {
    title: 'Terms of Service',
    description: 'Terms and conditions governing the purchase of products and website use at NOVA Jewellery.',
    canonicalPath: '/terms',
    ogType: 'website',
  },
  '/gifts-for-him': {
    title: 'Gifts For Him — Men\'s 925 Silver Jewellery',
    description: 'Explore curated 925 sterling silver gifts for men. Modern rings, masculine chains, bracelets, and ear studs.',
    keywords: 'gifts for men, silver jewellery for men, mens silver rings, mens silver bracelets',
    canonicalPath: '/gifts-for-him',
    ogType: 'website',
  },
  '/gifts-for-her': {
    title: 'Gifts For Her — Women\'s 925 Silver Jewellery',
    description: 'Explore curated 925 sterling silver gifts for women. Rings, elegant necklaces, bracelets, and earrings.',
    keywords: 'gifts for women, silver jewellery for women, womens silver rings, silver pendants',
    canonicalPath: '/gifts-for-her',
    ogType: 'website',
  },
  '/cart': {
    title: 'Shopping Bag',
    description: 'Review your selected items in your NOVA Jewellery shopping bag.',
    canonicalPath: '/cart',
    noIndex: true,
  },
  '/wishlist': {
    title: 'My Wishlist',
    description: 'Your saved NOVA Jewellery pieces. Review and transfer items to your shopping bag.',
    canonicalPath: '/wishlist',
    noIndex: true,
  },
  '/profile': {
    title: 'My Account Profile',
    description: 'Manage your NOVA account details, saved delivery addresses, and track active orders.',
    canonicalPath: '/profile',
    noIndex: true,
  },
  '/login': {
    title: 'Login & Register',
    description: 'Sign in or create a NOVA Jewellery account to access fast checkout and saved items.',
    canonicalPath: '/login',
    noIndex: true,
  },
};
