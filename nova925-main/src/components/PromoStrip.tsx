export function PromoStrip() {
  const items = [
    "7-Day Easy Returns",
    "Globally Delivered",
    "Extra 5% OFF Above ₹3,000",
    "Extra 10% OFF Above ₹8,000"
  ];

  // Repeat the items list to ensure it is long enough to span wide desktop screens
  const repeatedItems = [...items, ...items, ...items];

  return (
    /* We update the background to your rich dark color and use the silver color for a sharp, specular border */
    <div className="bg-sterling-glow text-nova-darker py-3 border-y border-silver/20 font-medium overflow-hidden whitespace-nowrap flex select-none relative z-10">
      <div className="animate-marquee whitespace-nowrap flex shrink-0 items-center">
        {repeatedItems.map((item, index) => (
          <span
            key={`marquee-1-${index}`}
            /* text-sterling-glow gives the text that high-contrast metallic look */
            className="text-sterling-glow mx-8 text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold flex items-center gap-2"
          >
            <span className="opacity-80">✨</span> {item}
          </span>
        ))}
      </div>
      <div className="animate-marquee whitespace-nowrap flex shrink-0 items-center" aria-hidden="true">
        {repeatedItems.map((item, index) => (
          <span
            key={`marquee-2-${index}`}
            className="text-sterling-glow mx-8 text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold flex items-center gap-2"
          >
            <span className="opacity-80">✨</span> {item}
          </span>
        ))}
      </div>
    </div>
  );
}