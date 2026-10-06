const fs = require('fs');
const path = require('path');

const publicDir = path.resolve(__dirname, '../public');
const productsBase = path.join(publicDir, 'images/Products');
const dataFilePath = path.resolve(__dirname, '../src/data.ts');

const ZODIAC_NAMES = [
  'Aries Zodiac 925 Silver Pendant',
  'Taurus Zodiac 925 Silver Pendant',
  'Gemini Zodiac 925 Silver Pendant',
  'Cancer Zodiac 925 Silver Pendant',
  'Leo Zodiac 925 Silver Pendant',
  'Virgo Zodiac 925 Silver Pendant',
  'Libra Zodiac 925 Silver Pendant',
  'Scorpio Zodiac 925 Silver Pendant',
  'Sagittarius Zodiac 925 Silver Pendant',
  'Capricorn Zodiac 925 Silver Pendant',
  'Aquarius Zodiac 925 Silver Pendant',
  'Pisces Zodiac 925 Silver Pendant'
];

const ASTRO_RINGS = [
  'Astro Navratna Silver Ring',
  'Astro Planetary Silver Ring',
  'Astro Cosmic Gem Silver Ring',
  'Astro Solitaire Silver Band Ring',
  'Astro Sacred Zodiac Silver Ring'
];

const SILVER_COINS = [
  'Pure Silver Lakshmi Ganesha 999 Coin',
  'Pure Silver Saraswati & Lakshmi Puja Coin',
  'Sacred Om & Swastik Silver Coin',
  'Traditional Shubh Labh Silver Coin'
];

const IDOL_PENDANTS = [
  'Lord Ganesha 925 Silver Pendant',
  'Lord Shiva Mahadev Silver Pendant',
  'Lord Hanuman Ji Silver Pendant',
  'Sacred Om Trishul Silver Pendant',
  'Radha Krishna Divine Silver Pendant',
  'Goddess Durga Mata Silver Pendant',
  'Lord Balaji Tirupati Silver Pendant',
  'Shri Ram Darbar Silver Pendant',
  'Sacred Mahamrityunjaya Silver Pendant'
];

function sanitizeId(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function scanLeafFolders(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const imgFiles = entries
    .filter(e => e.isFile() && /\.(webp|jpg|jpeg|png)$/i.test(e.name))
    .map(e => e.name)
    .sort();

  if (imgFiles.length > 0) {
    return [{ dir, images: imgFiles }];
  }

  let results = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      results = results.concat(scanLeafFolders(path.join(dir, entry.name)));
    }
  }
  return results;
}

const leafDirs = scanLeafFolders(productsBase);
console.log('Total product leaf directories found:', leafDirs.length);

const generatedProducts = leafDirs.map((item, idx) => {
  const relPath = path.relative(publicDir, item.dir).replace(/\\/g, '/');
  const parts = relPath.split('/'); // ['images', 'Products', '01 Female', ...]

  const topCategoryFolder = parts[2];
  const subCategoryFolder = parts[3];
  const remaining = parts.slice(4);
  const remainingStr = remaining.join(' ');
  const folderTag = remaining.length > 0 ? remaining[remaining.length - 1] : String(idx + 1).padStart(2, '0');

  let category = '';
  let subcategory = '';
  let name = '';
  let id = '';

  const imgPaths = item.images.map(img => '/' + relPath + '/' + img);
  const mainImage = imgPaths[0];

  // 1. FEMALE
  if (topCategoryFolder === '01 Female') {
    category = 'gifts-for-her';
    if (subCategoryFolder.includes('Ear-Rings')) {
      subcategory = 'earrings';
      if (remainingStr.includes('TYP 01')) name = `Silver Jhumka Earrings (Design ${folderTag})`;
      else if (remainingStr.includes('TYP 02')) name = `Silver Drop Earrings (Design ${folderTag})`;
      else if (remainingStr.includes('TYP 03')) name = `Silver Hoop Bali Earrings (Design ${folderTag})`;
      else if (remainingStr.includes('TYP 04')) name = `Silver Stud Earrings (Design ${folderTag})`;
      else if (remainingStr.includes('MOON')) name = `Moon Baliyna Silver Earrings (Design ${folderTag})`;
      else if (remainingStr.includes('GIYA')) name = `Giya Chandbali Silver Earrings (Design ${folderTag})`;
      else if (remainingStr.includes('TYP 07')) name = `Silver Designer Bali Earrings (Design ${folderTag})`;
      else name = `Silver Earrings (Design ${folderTag})`;
    } else if (subCategoryFolder.includes('Bracelet')) {
      subcategory = 'bracelets';
      if (remainingStr.includes('TYP 01')) name = `925 Sterling Silver Charm Bracelet (Design ${folderTag})`;
      else if (remainingStr.includes('TYP 02')) name = `Silver Link Bracelet (Design ${folderTag})`;
      else if (remainingStr.includes('TYP 03')) name = `Silver Cuff Bracelet (Design ${folderTag})`;
      else if (remainingStr.includes('TYP 04')) name = `Silver Bangle Bracelet (Design ${folderTag})`;
      else name = `Artisan Silver Bracelet (Design ${folderTag})`;
    } else if (subCategoryFolder.includes('Bangel')) {
      subcategory = 'bangles';
      name = `Silver Designer Bangle (Design ${folderTag})`;
    } else if (subCategoryFolder.includes('Chain')) {
      subcategory = 'chains';
      name = `Dainty Silver Chain (Design ${folderTag})`;
    } else if (subCategoryFolder.includes('sets')) {
      subcategory = 'sets';
      name = `Luxury Silver Jewellery Set (Design ${folderTag})`;
    } else if (subCategoryFolder.includes('Pendant Set')) {
      subcategory = 'pendants';
      name = `Silver Pendant & Earring Set (Design ${folderTag})`;
    } else if (subCategoryFolder.includes('Rings')) {
      subcategory = 'rings';
      if (remainingStr.includes('TYP 02')) name = `Floral Silver Ring (Design ${folderTag})`;
      else name = `925 Sterling Silver Ring (Design ${folderTag})`;
    } else if (subCategoryFolder.includes('Anklet')) {
      subcategory = 'anklets';
      name = `Traditional Silver Payal (Design ${folderTag})`;
    } else if (subCategoryFolder.includes('Toes Rings')) {
      subcategory = 'rings';
      name = `Silver Bichhiya Toe Ring (Pair ${folderTag})`;
    } else if (subCategoryFolder.includes('Nose-ring')) {
      subcategory = 'earrings';
      name = `Traditional Silver Nose Ring (Design ${folderTag})`;
    } else {
      subcategory = 'jewellery';
      name = `Silver Jewellery (Design ${folderTag})`;
    }
    id = 'her_' + sanitizeId(subCategoryFolder) + '_' + sanitizeId(remaining.join('_'));

  // 2. MALE
  } else if (topCategoryFolder === '02 Male') {
    category = 'gifts-for-him';
    if (subCategoryFolder.includes('Bracelets')) {
      subcategory = 'bracelets';
      name = `Men's Silver Link Bracelet (Design ${folderTag})`;
    } else if (subCategoryFolder.includes('Rings')) {
      subcategory = 'rings';
      name = `Men's Silver Signet Ring (Design ${folderTag})`;
    } else if (subCategoryFolder.includes('chains')) {
      subcategory = 'chains';
      name = `Men's 925 Silver Chain (Design ${folderTag})`;
    } else if (subCategoryFolder.includes('Studs')) {
      subcategory = 'earrings';
      name = `Men's Silver Ear Stud (Design ${folderTag})`;
    } else if (subCategoryFolder.includes('Kada')) {
      subcategory = 'bracelets';
      name = `Men's Royal Silver Kada (Design ${folderTag})`;
    } else {
      subcategory = 'jewellery';
      name = `Men's Silver Jewellery (Design ${folderTag})`;
    }
    id = 'him_' + sanitizeId(subCategoryFolder) + '_' + sanitizeId(remaining.join('_'));

  // 3. KIDS
  } else if (topCategoryFolder === '03 Kids') {
    category = 'kids';
    if (subCategoryFolder.includes('Pendant')) {
      subcategory = 'pendants';
      name = `Kids Silver Charm Pendant (Design ${folderTag})`;
    } else if (subCategoryFolder.includes('Rings')) {
      subcategory = 'rings';
      name = `Kids Silver Adjustable Ring (Design ${folderTag})`;
    } else if (subCategoryFolder.includes('Anklet')) {
      subcategory = 'anklets';
      name = `Kids Silver Nazariya Payal (Design ${folderTag})`;
    } else if (subCategoryFolder.includes('Bangles')) {
      subcategory = 'bangles';
      name = `Kids Silver Kada Bangle (Design ${folderTag})`;
    } else if (subCategoryFolder.includes('bracelet')) {
      subcategory = 'bracelets';
      name = `Kids Silver Chain Bracelet (Design ${folderTag})`;
    } else if (subCategoryFolder.includes('Nazar')) {
      subcategory = 'bracelets';
      name = `Kids Protective Nazariya (Design ${folderTag})`;
    } else if (subCategoryFolder.includes('Chain')) {
      subcategory = 'chains';
      name = `Kids Dainty Silver Chain (Design ${folderTag})`;
    } else {
      subcategory = 'jewellery';
      name = `Kids Silver Jewellery (Design ${folderTag})`;
    }
    id = 'kids_' + sanitizeId(subCategoryFolder) + '_' + sanitizeId(remaining.join('_'));

  // 4. ASTRO
  } else if (topCategoryFolder === '04 Astro Jewellery') {
    category = 'astro-collection';
    const lastFolder = remaining.length > 0 ? remaining[remaining.length - 1] : '';
    const num = parseInt(lastFolder, 10);

    if (subCategoryFolder.includes('Pendnat')) {
      subcategory = 'pendants';
      if (!isNaN(num) && num >= 1 && num <= 12) {
        name = ZODIAC_NAMES[num - 1];
      } else {
        name = `Astro Zodiac Silver Pendant (Design ${folderTag})`;
      }
    } else if (subCategoryFolder.includes('Ring')) {
      subcategory = 'rings';
      if (!isNaN(num) && num >= 1 && num <= ASTRO_RINGS.length) {
        name = ASTRO_RINGS[num - 1];
      } else {
        name = `Astro Silver Ring (Design ${folderTag})`;
      }
    } else if (subCategoryFolder.includes('Coins')) {
      subcategory = 'pendants';
      if (!isNaN(num) && num >= 1 && num <= SILVER_COINS.length) {
        name = SILVER_COINS[num - 1];
      } else {
        name = `Pure Silver Sacred Coin (Design ${folderTag})`;
      }
    } else if (subCategoryFolder.includes('Idol')) {
      subcategory = 'pendants';
      if (!isNaN(num) && num >= 1 && num <= IDOL_PENDANTS.length) {
        name = IDOL_PENDANTS[num - 1];
      } else {
        name = `Sacred Deity Silver Pendant (Design ${folderTag})`;
      }
    } else {
      subcategory = 'jewellery';
      name = `Astro Silver Jewellery (Design ${folderTag})`;
    }
    id = 'astro_' + sanitizeId(subCategoryFolder) + '_' + sanitizeId(remaining.join('_'));
  }

  return {
    id,
    name,
    price: 0,
    image: mainImage,
    images: imgPaths,
    category,
    subcategory
  };
});

console.log(`Generated ${generatedProducts.length} products.`);

// Read existing src/data.ts
const originalDataContent = fs.readFileSync(dataFilePath, 'utf8');

// Find where "export const products: Product[] = [" begins
const startTag = 'export const products: Product[] = [';
const startIndex = originalDataContent.indexOf(startTag);
if (startIndex === -1) {
  console.error('Could not find start of products array in src/data.ts');
  process.exit(1);
}

// Find line 1009 or the delimiter where previous additions started:
// Look for "astro_pisces" product block
const piscesIndex = originalDataContent.indexOf('"id": "astro_pisces"');
let cutIndex = -1;
if (piscesIndex !== -1) {
  // Find the end of the astro_pisces object (the closing '}')
  const closingBrace = originalDataContent.indexOf('}', piscesIndex);
  cutIndex = closingBrace + 1;
} else {
  console.error('Could not find astro_pisces in src/data.ts');
  process.exit(1);
}

// Find where "export const featuredProducts" starts
const featuredTag = 'export const featuredProducts: Product[] = [';
const featuredIndex = originalDataContent.indexOf(featuredTag);
if (featuredIndex === -1) {
  console.error('Could not find featuredProducts in src/data.ts');
  process.exit(1);
}

const headerPart = originalDataContent.slice(0, cutIndex);
const tailPart = originalDataContent.slice(featuredIndex);

// Format the new products JSON
const newProductsFormatted = generatedProducts.map(p => {
  return '  ' + JSON.stringify(p);
}).join(',\n');

const updatedFileContent = headerPart + ',\n\n  // ════════════════════════════════════════════════════════════════════════════\n  // ─── CATALOG PRODUCTS (327 ITEMS FROM Products/ FOLDER) ─────────────────────\n  // ════════════════════════════════════════════════════════════════════════════\n' + newProductsFormatted + '\n];\n\n' + tailPart;

fs.writeFileSync(dataFilePath, updatedFileContent, 'utf8');
console.log('Successfully updated src/data.ts with all 327 catalog products!');
