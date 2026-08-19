import { useEffect } from 'react';
import { DEFAULT_ORIGIN, DEFAULT_OG_IMAGE, SITE_NAME, RouteSEOOptions } from './seoConfig';

/**
 * Dynamic Meta Tags & SEO Head Manager
 * Programmatically injects unique title, meta description, Open Graph,
 * Twitter Cards, canonical URL, and JSON-LD structured data.
 */
export function usePageSEO(options: RouteSEOOptions) {
  const {
    title,
    description,
    keywords,
    canonicalPath,
    ogTitle,
    ogDescription,
    ogImage,
    ogType = 'website',
    twitterCard = 'summary_large_image',
    twitterTitle,
    twitterDescription,
    twitterImage,
    noIndex = false,
    jsonLd,
  } = options;

  useEffect(() => {
    // 1. Title
    const formattedTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    document.title = formattedTitle;

    // Helper: set or update meta tag by property or name
    const setMetaTag = (attributeName: 'name' | 'property', attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attributeName}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper: remove meta tag if present
    const removeMetaTag = (attributeName: 'name' | 'property', attrValue: string) => {
      const element = document.querySelector(`meta[${attributeName}="${attrValue}"]`);
      if (element) {
        element.remove();
      }
    };

    // 2. Meta Description
    if (description) {
      setMetaTag('name', 'description', description);
    } else {
      removeMetaTag('name', 'description');
    }

    // 3. Meta Keywords
    if (keywords) {
      setMetaTag('name', 'keywords', keywords);
    } else {
      removeMetaTag('name', 'keywords');
    }

    // 4. Robots Index Status
    const robotsValue = noIndex ? 'noindex, nofollow' : 'index, follow';
    setMetaTag('name', 'robots', robotsValue);

    // 5. Canonical URL
    let fullCanonicalUrl: string;
    if (canonicalPath) {
      if (canonicalPath.startsWith('http://') || canonicalPath.startsWith('https://')) {
        fullCanonicalUrl = canonicalPath;
      } else {
        const cleanPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
        fullCanonicalUrl = `${DEFAULT_ORIGIN}${cleanPath}`;
      }
    } else if (typeof window !== 'undefined') {
      const origin = window.location.origin.includes('localhost') ? DEFAULT_ORIGIN : window.location.origin;
      fullCanonicalUrl = `${origin}${window.location.pathname}`;
    } else {
      fullCanonicalUrl = DEFAULT_ORIGIN;
    }

    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (linkCanonical) {
      linkCanonical.setAttribute('href', fullCanonicalUrl);
    } else {
      linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      linkCanonical.href = fullCanonicalUrl;
      document.head.appendChild(linkCanonical);
    }

    // 6. Open Graph Tags
    const finalOgTitle = ogTitle || title || SITE_NAME;
    const finalOgDesc = ogDescription || description || '';
    const finalOgImage = ogImage || DEFAULT_OG_IMAGE;

    setMetaTag('property', 'og:site_name', SITE_NAME);
    setMetaTag('property', 'og:title', finalOgTitle);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:url', fullCanonicalUrl);

    if (finalOgDesc) setMetaTag('property', 'og:description', finalOgDesc);
    if (finalOgImage) setMetaTag('property', 'og:image', finalOgImage);

    // 7. Twitter Card Tags
    const finalTwitterTitle = twitterTitle || finalOgTitle;
    const finalTwitterDesc = twitterDescription || finalOgDesc;
    const finalTwitterImage = twitterImage || finalOgImage;

    setMetaTag('name', 'twitter:card', twitterCard);
    setMetaTag('name', 'twitter:title', finalTwitterTitle);

    if (finalTwitterDesc) setMetaTag('name', 'twitter:description', finalTwitterDesc);
    if (finalTwitterImage) setMetaTag('name', 'twitter:image', finalTwitterImage);

    // 8. JSON-LD Structured Data
    const JSON_LD_ID = 'route-json-ld';
    let scriptJsonLd = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null;

    if (jsonLd) {
      if (!scriptJsonLd) {
        scriptJsonLd = document.createElement('script');
        scriptJsonLd.id = JSON_LD_ID;
        scriptJsonLd.type = 'application/ld+json';
        document.head.appendChild(scriptJsonLd);
      }
      scriptJsonLd.text = JSON.stringify(jsonLd);
    } else if (scriptJsonLd) {
      scriptJsonLd.remove();
    }

    // Restore fallback defaults on unmount
    return () => {
      document.title = `NOVA Jewellery | Buy 925 Sterling Silver Jewellery Online India`;
    };
  }, [
    title,
    description,
    keywords,
    canonicalPath,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
    noIndex,
    jsonLd,
  ]);
}
