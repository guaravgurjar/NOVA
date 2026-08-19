import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ROUTE_SEO_CONFIGS } from '../lib/seoConfig';
import { usePageSEO } from '../lib/usePageSEO';

/**
 * RouteSEOObserver checks current route pathname against ROUTE_SEO_CONFIGS
 * and applies baseline SEO metadata automatically across all routes.
 */
export function RouteSEOObserver() {
  const location = useLocation();
  const config = ROUTE_SEO_CONFIGS[location.pathname];

  // Apply route configuration if available
  usePageSEO(
    config || {
      title: 'Buy 925 Sterling Silver Jewellery Online India',
      description: 'Explore NOVA Jewellery for certified 925 sterling silver rings, earrings, necklaces, bracelets & accessories.',
      canonicalPath: location.pathname,
    }
  );

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}
