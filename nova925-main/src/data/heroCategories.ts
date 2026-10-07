export interface HeroCategoryCard {
  id: string;
  name: string;
  image: string;
}

function heroImage(...parts: string[]) {
  return `/images/${['hero category products', ...parts].map(encodeURIComponent).join('/')}`;
}

export const giftsForHerCategories: HeroCategoryCard[] = [
  { id: 'rings', name: 'Rings', image: heroImage('01 Female', '07 Female Ring.webp') },
  { id: 'earrings', name: 'Earrings', image: heroImage('01 Female', '01 Ear ring.webp') },
  { id: 'bracelets', name: 'Bracelets', image: heroImage('01 Female', '02 Female Bracelet.webp') },
  { id: 'pendants', name: 'Pendants', image: heroImage('01 Female', '06 Female Prndant Set.webp') },
  { id: 'chains', name: 'Chains', image: heroImage('01 Female', '04 Female Chain.webp') },
  { id: 'bangles', name: 'Bangles', image: heroImage('01 Female', '03 Female Bangles.webp') },
  { id: 'sets', name: 'Sets', image: heroImage('01 Female', '05 Female Set.webp') },
  { id: 'anklets', name: 'Anklets', image: heroImage('01 Female', '08 Female Anklet.webp') },
  { id: 'toe-rings', name: 'Toe Rings', image: heroImage('01 Female', '09 Female Toes Rings.webp') },
  { id: 'nose-rings', name: 'Nose Rings', image: heroImage('01 Female', '10 Female Nose-ring.webp') },
];

export const giftsForHimCategories: HeroCategoryCard[] = [
  { id: 'rings', name: 'Rings', image: heroImage('02 Male', '02 Male Rings.webp') },
  { id: 'earrings', name: 'Ear Studs', image: heroImage('02 Male', '04 Male Ear-Rings.webp') },
  { id: 'bracelets', name: 'Bracelets', image: heroImage('02 Male', '01 Male Bracelet.webp') },
  { id: 'chains', name: 'Chains', image: heroImage('02 Male', '03 Male Chains.webp') },
  { id: 'kada', name: 'Kada', image: heroImage('02 Male', '05 Male Kada.webp') },
];

export const kidsCategories: HeroCategoryCard[] = [
  { id: 'pendants', name: 'Pendants', image: heroImage('03 Kids Jewerlley', '01 Kids Pendant.webp') },
  { id: 'rings', name: 'Rings', image: heroImage('03 Kids Jewerlley', '02 Kids Rings.webp') },
  { id: 'bracelets', name: 'Bracelets', image: heroImage('03 Kids Jewerlley', '05 Kids Chain Bracelet.webp') },
  { id: 'bangles', name: 'Bangles', image: heroImage('03 Kids Jewerlley', '04 Kids Bangles.webp') },
  { id: 'chains', name: 'Chains', image: heroImage('03 Kids Jewerlley', '07 Kids Chain.webp') },
  { id: 'anklets', name: 'Anklets', image: heroImage('03 Kids Jewerlley', '03 Kids Anklet.webp') },
  { id: 'nazar', name: 'Nazariya', image: heroImage('03 Kids Jewerlley', '06 Kids Nazar Jewellery.webp') },
];

export const astroCategories: HeroCategoryCard[] = [
  { id: 'pendants', name: 'Pendants', image: heroImage('04 Astro Jewellery', '01 Astro Pendnat.webp') },
  { id: 'rings', name: 'Rings', image: heroImage('04 Astro Jewellery', '02 Astro Rings.webp') },
  { id: 'coins', name: 'Coins', image: heroImage('04 Astro Jewellery', '03 Silver Coins.webp') },
  { id: 'idols', name: 'Idols', image: heroImage('04 Astro Jewellery', '04 Astro Idol Pendant.webp') },
];
