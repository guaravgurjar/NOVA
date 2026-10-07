export interface HeroCategoryCard {
  id: string;
  name: string;
  image: string;
}

function heroImage(section: string, file: string) {
  return `/images/${encodeURIComponent('hero category products')}/${encodeURIComponent(section)}/${encodeURIComponent(file)}.webp`;
}

export const giftsForHerCategories: HeroCategoryCard[] = [
  { id: 'rings', name: 'Rings', image: heroImage('Gifts for her', 'rings') },
  { id: 'earrings', name: 'Earrings', image: heroImage('Gifts for her', 'earrings') },
  { id: 'bracelets', name: 'Bracelets', image: heroImage('Gifts for her', 'bracelets') },
  { id: 'pendants', name: 'Pendants', image: heroImage('Gifts for her', 'pendants') },
  { id: 'chains', name: 'Chains', image: heroImage('Gifts for her', 'chains') },
  { id: 'bangles', name: 'Bangles', image: heroImage('Gifts for her', 'bangles') },
  { id: 'sets', name: 'Sets', image: heroImage('Gifts for her', 'sets') },
  { id: 'anklets', name: 'Anklets', image: heroImage('Gifts for her', 'anklets') },
];

export const giftsForHimCategories: HeroCategoryCard[] = [
  { id: 'rings', name: 'Rings', image: heroImage('Gifts for him', 'rings') },
  { id: 'earrings', name: 'Ear Studs', image: heroImage('Gifts for him', 'earrings') },
  { id: 'bracelets', name: 'Bracelets', image: heroImage('Gifts for him', 'bracelets') },
  { id: 'chains', name: 'Chains', image: heroImage('Gifts for him', 'chains') },
  { id: 'kada', name: 'Kada', image: heroImage('Gifts for him', 'kada') },
];

export const kidsCategories: HeroCategoryCard[] = [
  { id: 'pendants', name: 'Pendants', image: heroImage('Kids', 'pendants') },
  { id: 'rings', name: 'Rings', image: heroImage('Kids', 'rings') },
  { id: 'bracelets', name: 'Bracelets', image: heroImage('Kids', 'bracelets') },
  { id: 'bangles', name: 'Bangles', image: heroImage('Kids', 'bangles') },
  { id: 'chains', name: 'Chains', image: heroImage('Kids', 'chains') },
  { id: 'anklets', name: 'Anklets', image: heroImage('Kids', 'anklets') },
  { id: 'nazar', name: 'Nazariya', image: heroImage('Kids', 'nazar') },
];

export const astroCategories: HeroCategoryCard[] = [
  { id: 'pendants', name: 'Pendants', image: heroImage('Astro', 'pendants') },
  { id: 'rings', name: 'Rings', image: heroImage('Astro', 'rings') },
  { id: 'coins', name: 'Coins', image: heroImage('Astro', 'coins') },
  { id: 'idols', name: 'Idols', image: heroImage('Astro', 'idols') },
];
