import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Google Drive subfolders for categories
const CATEGORIES = [
  { name: 'Chains', id: '1_BAAgkEJ03SQ1duB6_80Qb1QZ5Eirkih', key: 'chains' },
  { name: 'Ear-rings', id: '1mjGBAktH5jK_DFwPhd9gpYL1-NhkkRKX', key: 'earrings' },
  { name: 'Bracelets', id: '1cceqm-UNTu6saNB9Q2SaWNaETtx73qVk', key: 'bracelets' },
  { name: 'Bangles', id: '1xxkUgLtxWLaHX6hoCOR-q5joPdHFwGtw', key: 'bangles' },
  { name: 'Pendants', id: '1oGk3_c13Qz5fLDCGvejFd5LTThu82eeJ', key: 'pendants' },
  { name: 'Sets', id: '1yNg7t537MvOQgUAJWRw9oocj82F3TK6g', key: 'sets' }
];

interface ProductData {
  id: string;
  name: string;
  price: number;
  image: string;
  images: string[];
  category: string;
}

async function downloadFile(fileId: string): Promise<Buffer> {
  const url = `https://lh3.googleusercontent.com/d/${fileId}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download file ${fileId}: ${response.statusText}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

interface DriveItem {
  id: string;
  name: string;
  isFolder: boolean;
  isImage: boolean;
}

function parseFolderItems(html: string): DriveItem[] {
  const idRegex = /\b(1[a-zA-Z0-9_-]{32})\b/g;
  const matches = new Set<string>();
  let match;
  while ((match = idRegex.exec(html)) !== null) {
    matches.add(match[1]);
  }

  const items: DriveItem[] = [];
  for (const id of matches) {
    const idx = html.indexOf(id);
    if (idx === -1) continue;
    
    const chunk = html.substring(idx, idx + 3000);
    const labelMatch = chunk.match(/aria-label="([^"]+)"/i);
    
    if (labelMatch) {
      const label = labelMatch[1];
      let isFolder = false;
      let isImage = false;
      let name = '';
      
      if (label.toLowerCase().includes('folder')) {
        isFolder = true;
        name = label.replace(/shared folder/i, '').trim();
      } else if (label.toLowerCase().includes('image')) {
        isImage = true;
        name = label.replace(/image shared/i, '').trim();
        name = name.split(' ')[0];
      }
      
      if (isFolder || isImage) {
        items.push({ id, name, isFolder, isImage });
      }
    }
  }
  
  const uniqueItems: DriveItem[] = [];
  const visited = new Set<string>();
  for (const item of items) {
    if (!visited.has(item.id)) {
      visited.add(item.id);
      uniqueItems.push(item);
    }
  }
  return uniqueItems;
}

interface ScrapedProduct {
  id: string;
  name: string;
  files: { id: string; name: string }[];
}

async function scrapeProductsForCategory(catId: string, catKey: string): Promise<ScrapedProduct[]> {
  const url = `https://drive.google.com/drive/folders/${catId}?usp=sharing`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch category folder page: ${response.statusText}`);
  }
  const html = await response.text();
  const items = parseFolderItems(html);
  
  const productsList: ScrapedProduct[] = [];
  const folders = items.filter(item => item.isFolder);
  const directImages = items.filter(item => item.isImage);
  
  if (folders.length > 0) {
    for (const folder of folders) {
      console.log(`Scraping product subfolder: ${folder.name} (${folder.id})...`);
      try {
        const subUrl = `https://drive.google.com/drive/folders/${folder.id}?usp=sharing`;
        const subRes = await fetch(subUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        if (subRes.ok) {
          const subHtml = await subRes.text();
          const subItems = parseFolderItems(subHtml);
          const subImages = subItems.filter(item => item.isImage);
          if (subImages.length > 0) {
            // Sort image files alphabetically to ensure consistent sequence (e.g. 01.png first)
            subImages.sort((a, b) => a.name.localeCompare(b.name));
            productsList.push({
              id: `${catKey}_${folder.name.replace(/[^a-zA-Z0-9_-]/g, '')}`,
              name: folder.name,
              files: subImages.map(img => ({ id: img.id, name: img.name }))
            });
          }
        }
      } catch (err: any) {
        console.error(`Failed to scrape subfolder ${folder.name}:`, err.message || err);
      }
    }
  } else {
    // If no folders, treat direct images as individual products
    directImages.sort((a, b) => a.name.localeCompare(b.name));
    directImages.forEach((img, idx) => {
      productsList.push({
        id: `${catKey}_${idx + 1}`,
        name: img.name,
        files: [{ id: img.id, name: img.name }]
      });
    });
  }
  
  return productsList;
}

// Generate realistic pricing based on category
function getPriceForCategory(catKey: string, index: number): number {
  const basePrices: Record<string, number> = {
    chains: 2200,
    earrings: 1400,
    bracelets: 2800,
    bangles: 3200,
    pendants: 1800,
    sets: 5500
  };
  const base = basePrices[catKey] || 2000;
  return base + (index * 150) % 1200;
}

// Generate realistic names
function getNameForCategory(catKey: string, index: number): string {
  const prefixes = ['Classic', 'Dainty', 'Elegant', 'Luxury', 'Timeless', 'Minimalist', 'Royal', 'Sterling', 'Vintage', 'Modern'];
  const items: Record<string, string> = {
    chains: 'Silver Link Chain',
    earrings: 'Silver Drop Earrings',
    bracelets: 'Silver Charm Bracelet',
    bangles: 'Engraved Silver Bangle',
    pendants: 'Crystal Silver Pendant',
    sets: 'Luxury Silver Jewelry Set'
  };
  const prefix = prefixes[index % prefixes.length];
  const item = items[catKey] || 'Silver Jewellery';
  return `${prefix} ${item}`;
}

async function sync() {
  console.log('Starting Google Drive Image Sync & Conversion...');
  
  const publicDir = path.join(process.cwd(), 'public');
  const targetDir = path.join(publicDir, 'images', 'products');
  
  // Create directories
  fs.mkdirSync(targetDir, { recursive: true });
  
  const allProducts: ProductData[] = [];
  const activeCategories: { id: string; name: string; key: string; image: string }[] = [];
  
  for (const cat of CATEGORIES) {
    console.log(`\nProcessing category: ${cat.name} (${cat.id})...`);
    try {
      const scrapedProducts = await scrapeProductsForCategory(cat.id, cat.key);
      console.log(`Found ${scrapedProducts.length} products in category ${cat.name}.`);
      
      if (scrapedProducts.length === 0) {
        console.warn(`No products found in category ${cat.name}. Skipping...`);
        continue;
      }
      
      const catSubdir = path.join(targetDir, cat.key);
      fs.mkdirSync(catSubdir, { recursive: true });
      
      const categoryProducts: ProductData[] = [];
      let productIndex = 0;
      
      for (const sp of scrapedProducts) {
        console.log(`Syncing product ${sp.name} (${sp.files.length} images)...`);
        const productImages: string[] = [];
        
        // Process each image file for this product
        for (const file of sp.files) {
          const webpFilename = `${file.id}.webp`;
          const webpPath = path.join(catSubdir, webpFilename);
          const relativeImageSrc = `/images/products/${cat.key}/${webpFilename}`;
          
          try {
            if (!fs.existsSync(webpPath)) {
              const fileBuffer = await downloadFile(file.id);
              // Convert to optimized WebP using sharp
              await sharp(fileBuffer)
                .resize({ width: 800, height: 800, fit: 'cover', withoutEnlargement: true })
                .webp({ quality: 80 })
                .toFile(webpPath);
            }
            productImages.push(relativeImageSrc);
          } catch (err: any) {
            console.error(`Error processing image ${file.id} for product ${sp.name}:`, err.message || err);
          }
        }
        
        if (productImages.length > 0) {
          const name = getNameForCategory(cat.key, productIndex);
          const price = getPriceForCategory(cat.key, productIndex);
          
          categoryProducts.push({
            id: sp.id,
            name,
            price,
            image: productImages[0], // first image as main cover
            images: productImages,
            category: cat.key
          });
          productIndex++;
        }
      }
      
      console.log(`Category ${cat.name} complete! Successfully synced ${categoryProducts.length} products.`);
      
      if (categoryProducts.length > 0) {
        allProducts.push(...categoryProducts);
        // Use the first image of the first product as category cover
        activeCategories.push({
          id: cat.key,
          name: cat.name,
          key: cat.key,
          image: categoryProducts[0].image
        });
      }
    } catch (err: any) {
      console.error(`Failed to process category ${cat.name}:`, err.message || err);
    }
  }
  
  console.log(`\nSync complete. Total products synced: ${allProducts.length}`);
  
  // Generate Astro Jewellery Collection (12 Zodiac Pendants)
  console.log('\nGenerating Astro Jewellery Collection...');
  const zodiacSigns = [
    { name: 'Aries' }, { name: 'Taurus' }, { name: 'Gemini' },
    { name: 'Cancer' }, { name: 'Leo' }, { name: 'Virgo' },
    { name: 'Libra' }, { name: 'Scorpio' }, { name: 'Sagittarius' },
    { name: 'Capricorn' }, { name: 'Aquarius' }, { name: 'Pisces' }
  ];

  const pendantProducts = allProducts.filter(p => p.category === 'pendants');
  const astroProducts: ProductData[] = [];

  zodiacSigns.forEach((z, idx) => {
    // Map each Zodiac sign to one of our synced pendant image arrays
    const matchedPendant = pendantProducts[idx % pendantProducts.length];
    const images = matchedPendant && matchedPendant.images.length > 0
      ? matchedPendant.images
      : ['/images/products/pendants/11EYtNFKycNrIZyGOSRBWw36wXY1XqpRl.webp'];

    astroProducts.push({
      id: `astro_${z.name.toLowerCase()}`,
      name: `${z.name} Zodiac Silver Pendant`,
      price: 1850 + (idx * 50) % 250,
      image: images[0],
      images: images,
      category: 'astro'
    });
  });

  allProducts.push(...astroProducts);

  // Add Astro Jewellery to category listing
  activeCategories.push({
    id: 'astro',
    name: 'Astro Jewellery',
    key: 'astro',
    image: astroProducts[4].image // Use Leo pendant as the category cover
  });

  // Prepare Featured Products (take 2 from each category, up to 8 total)
  const featuredProducts: ProductData[] = [];
  const categoriesList = Array.from(new Set(allProducts.map(p => p.category)));
  for (let i = 0; i < 2; i++) {
    for (const catKey of categoriesList) {
      const catProducts = allProducts.filter(p => p.category === catKey);
      if (catProducts[i]) {
        featuredProducts.push(catProducts[i]);
      }
    }
  }
  
  // Pick some reviews to make it look premium
  const reviewsData = [
    { id: 'r1', author: 'Aishwarya Sen', rating: 5, content: 'Absolutely gorgeous craftsmanship. The 925 sterling silver shines beautifully and doesn\'t tarnish. Customer support was amazing!' },
    { id: 'r2', author: 'Kabir Mehta', rating: 5, content: 'Bought the luxury silver chain for daily wear. It\'s sturdy, looks premium, and the polish is top notch. Delivery was incredibly fast.' },
    { id: 'r3', author: 'Pooja Hegde', rating: 5, content: 'The pendant set is so delicate and elegant. Perfect for office wear as well as small gatherings. Highly recommend NOVA.' },
    { id: 'r4', author: 'Vikram Rathore', rating: 5, content: 'Great collection of Men\'s jewellery. The quality is certified and the designs are extremely modern. 5 stars!' }
  ];
  
  // Write src/data.ts
  const dataTsContent = `import { Product, Category, Review } from './types';
 
export const products: Product[] = ${JSON.stringify(allProducts, null, 2)};
 
export const featuredProducts: Product[] = ${JSON.stringify(featuredProducts.slice(0, 8), null, 2)};
 
export const shopCategories: Category[] = ${JSON.stringify(activeCategories, null, 2)};
 
export const reviews: Review[] = ${JSON.stringify(reviewsData, null, 2)};
`;
 
  fs.writeFileSync(path.join(process.cwd(), 'src', 'data.ts'), dataTsContent, 'utf-8');
  console.log('Successfully updated src/data.ts with new product data.');
}

sync().catch(err => {
  console.error('Fatal sync error:', err);
});
