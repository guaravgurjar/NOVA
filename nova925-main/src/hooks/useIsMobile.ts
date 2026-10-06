import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the viewport is below a given breakpoint (default: 768px).
 *
 * Specifications:
 * - SSR-safe initial state (checks `typeof window !== 'undefined'`)
 * - Listens for media query change events (`max-width: ${breakpoint - 1}px`, e.g. `max-width: 767px`)
 * - Updates state dynamically on window resize
 * - Cleans up the event listener on component unmount
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const query = `(max-width: ${breakpoint - 1}px)`;
    const mediaQuery = window.matchMedia(query);

    const updateMatch = (matches: boolean) => {
      setIsMobile(matches);
    };

    // Synchronize state with current media query match
    updateMatch(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      updateMatch(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      (mediaQuery as any).addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        (mediaQuery as any).removeListener(handleChange);
      }
    };
  }, [breakpoint]);

  return isMobile;
}

export default useIsMobile;
