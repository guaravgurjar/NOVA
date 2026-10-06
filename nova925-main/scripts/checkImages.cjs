const fs = require('fs');
const path = require('path');
const base = path.resolve(__dirname, '../public/images/Products');
const publicDir = path.resolve(__dirname, '../public');

let allImages = [];
function findImages(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      findImages(full);
    } else if (/\.(webp|jpg|jpeg|png)$/i.test(e.name)) {
      allImages.push(full);
    }
  }
}
findImages(base);
console.log('Total images found in public/images/Products:', allImages.length);

const dataContent = fs.readFileSync(path.resolve(__dirname, '../src/data.ts'), 'utf8');

const used = [];
const unused = [];

for (const img of allImages) {
  const rel = '/' + path.relative(publicDir, img).split(path.sep).join('/');
  if (dataContent.includes(rel)) {
    used.push(rel);
  } else {
    unused.push(rel);
  }
}

console.log('Images referenced in src/data.ts:', used.length);
console.log('Images NOT referenced in src/data.ts:', unused.length);

if (unused.length > 0) {
  console.log('Sample unused images (first 20):');
  unused.slice(0, 20).forEach(u => console.log(u));
}
