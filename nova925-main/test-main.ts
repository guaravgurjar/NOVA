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
  
  const regex = /\[\[null,"([a-zA-Z0-9_-]{28,38})"\][^{}]*?\[\[\["([^"]+?\.(?:jpe?g|jpg|png|webp))",/gi;
  let match;
  const filesMap = new Map<string, string>();
  while ((match = regex.exec(html)) !== null) {
    filesMap.set(match[1], match[2]);
  }
  
  return Array.from(filesMap.entries()).map(([id, name]) => ({ id, name }));
}

async function run() {
  const mainId = '1Fd4XIcffsA5cl6kAS4HByeRqVYSCZ2Qb';
  try {
    const files = await scrapeFolderFiles(mainId);
    console.log(`\nMain Folder ID: ${mainId}`);
    console.log(`Total files: ${files.length}`);
    console.log(`Sample files:`);
    files.slice(0, 5).forEach(f => console.log(`  - ${f.name} (ID: ${f.id})`));
  } catch (e: any) {
    console.error(`Error scraping main:`, e.message || e);
  }
}

run().catch(console.error);
