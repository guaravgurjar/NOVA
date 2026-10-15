import type { ReactNode } from 'react';
import { RefreshCw, ShieldCheck, Truck } from 'lucide-react';

const promises: { title: string; detail: string; icon: ReactNode }[] = [
  {
    title: '925 Fine',
    detail: 'Silver',
    icon: <FineSilverIcon />,
  },
  {
    title: '6-Month',
    detail: 'Warranty',
    icon: <ShieldCheck strokeWidth={1.6} className="h-7 w-7" aria-hidden="true" />,
  },
  {
    title: '15-Days',
    detail: 'Return',
    icon: <RefreshCw strokeWidth={1.6} className="h-7 w-7" aria-hidden="true" />,
  },
  {
    title: 'Pan India',
    detail: 'Delivery',
    icon: <Truck strokeWidth={1.6} className="h-7 w-7" aria-hidden="true" />,
  },
];

function FineSilverIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" aria-hidden="true">
      <circle cx="24" cy="25" r="14" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M18.5 18.2c1.4-2 3.4-3 5.5-3s4.1 1 5.5 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M24 12.2l1.7 2.6h-3.4L24 12.2z" fill="currentColor" />
      <text
        x="24"
        y="29.5"
        textAnchor="middle"
        fill="currentColor"
        fontSize="9"
        fontWeight="700"
        fontFamily="Montserrat, ui-sans-serif, system-ui, sans-serif"
      >
        925
      </text>
    </svg>
  );
}

/**
 * The promises artwork is one wide banner. A fixed height plus object-cover
 * fills a desktop strip, but on a phone the same crop cuts off the outer items.
 * Small screens get a 2-column reading of the same promises; md+ keeps the banner.
 */
export function PromisesStrip() {
  return (
    <section aria-label="Our promises" className="w-full bg-white">
      <img
        src="/images/banners/promises.webp"
        alt="925 Fine Silver, 6-Month Warranty, 15-Days Return, and Pan India Delivery"
        className="hidden h-32 w-full object-cover object-center md:block lg:h-37"
        loading="lazy"
      />

      <ul className="grid grid-cols-2 gap-2.5 px-4 py-4 md:hidden">
        {promises.map((promise) => (
          <li
            key={promise.title}
            className="flex min-w-0 items-center gap-2.5 rounded-2xl bg-[#e8f1f8] px-3 py-3 text-[#162033]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center">
              {promise.icon}
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block text-[13px] font-semibold tracking-tight">{promise.title}</span>
              <span className="block text-[13px] font-medium">{promise.detail}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
