import { useState, useEffect } from 'react';

export const MOBILE_BREAKPOINT = 768; // px — same as Tailwind's `md`

// ── Hook: detects mobile viewport, re-evaluates on resize ────────────────────
export function useIsMobile(breakpoint: number = MOBILE_BREAKPOINT): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== 'undefined' && window.innerWidth < breakpoint
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    // Use addEventListener for modern browsers, addListener as fallback
    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
    } else {
      (mq as any).addListener(handler);
    }

    // Sync immediately in case window resized before effect ran
    setIsMobile(mq.matches);

    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener('change', handler);
      } else {
        (mq as any).removeListener(handler);
      }
    };
  }, [breakpoint]);

  return isMobile;
}

export default useIsMobile;
