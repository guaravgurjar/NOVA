import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Google Drive subfolders for categories
const CATEGORIES = [
  { name: 'Chains', id: '1jY1wEqWEbdqgYVPJxGlw4prrhXQteEeW', key: 'chains' },
  { name: 'Ear-rings', id: '1miV7rUZAO-suUx3UlzDfEmpQiFao24QQ', key: 'earrings' },
  { name: 'Bracelets', id: '1-zVnOwRgNlY86oqZuh1IhpqHKISWSfSm', key: 'bracelets' },
  { name: 'Bangles', id: '1tw7EUh5dOh21iCbzJpT5M9rfH6JEjrHM', key: 'bangles' },
  { name: 'Pendants', id: '1_uUC0ldDvMpdP-RBOP3j9Fc0yk2-9A8E', key: 'pendants' },
  { name: 'Sets', id: '199vGnkprAkJoY3sjywbpzH7KzbIFRspk', key: 'sets' }
];

interface ProductData {
  id: string;
  name: string;
  price: number;
  image: string;
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

async function scrapeFolderFiles(folderId: string): Promise<{ id: string; name: string }[]> {
  const url = `https://drive.google.com/drive/folders/${folderId}?usp=sharing`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch folder page: ${response.statusText}`);
  }
  const html = await response.text();
  
  // Extract file items
  const regex = /\[\[null,"([a-zA-Z0-9_-]{28,38})"\][^{}]*?\[\[\["([^"]+?\.(?:jpe?g|jpg|png|webp))",/gi;
  let match;
  const filesMap = new Map<string, string>();
  while ((match = regex.exec(html)) !== null) {
    filesMap.set(match[1], match[2]);
  }
  
  return Array.from(filesMap.entries()).map(([id, name]) => ({ id, name }));
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
  // Introduce some variations
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
      const files = await scrapeFolderFiles(cat.id);
      console.log(`Found ${files.length} images in Google Drive.`);
      
      if (files.length === 0) {
        console.warn(`No files found in category ${cat.name}. Skipping...`);
        continue;
      }
      
      const catSubdir = path.join(targetDir, cat.key);
      fs.mkdirSync(catSubdir, { recursive: true });
      
      const categoryProducts: ProductData[] = [];
      let convertedCount = 0;
      
      // Limit parallelism to avoid throttling
      const batchSize = 5;
      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        await Promise.all(batch.map(async (file, idx) => {
          const index = i + idx;
          const productId = `${cat.key}_${index + 1}`;
          const webpFilename = `${file.id}.webp`;
          const webpPath = path.join(catSubdir, webpFilename);
          const relativeImageSrc = `/images/products/${cat.key}/${webpFilename}`;
          
          try {
            // Check if file already exists locally to speed up subsequent syncs
            if (!fs.existsSync(webpPath)) {
              const fileBuffer = await downloadFile(file.id);
              
              // Convert to optimized WebP using sharp
              await sharp(fileBuffer)
                .resize({ width: 800, height: 800, fit: 'cover', withoutEnlargement: true })
                .webp({ quality: 80 })
                .toFile(webpPath);
            }
            
            const name = getNameForCategory(cat.key, index);
            const price = getPriceForCategory(cat.key, index);
            
            categoryProducts.push({
              id: productId,
              name,
              price,
              image: relativeImageSrc,
              category: cat.key
            });
            convertedCount++;
          } catch (err: any) {
            console.error(`Error processing file ${file.id} (${file.name}):`, err.message || err);
          }
        }));
        process.stdout.write(`Progress: ${Math.min(i + batchSize, files.length)}/${files.length} processed...\r`);
      }
      
      console.log(`\nCategory ${cat.name} complete! Successfully synced ${categoryProducts.length} images.`);
      
      if (categoryProducts.length > 0) {
        allProducts.push(...categoryProducts);
        // Use the first image as the category cover
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
