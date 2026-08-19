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

async function run() {
  const ids = [
    '1xxkUgLtxWLaHX6hoCOR-q5joPdHFwGtw',
    '1cceqm-UNTu6saNB9Q2SaWNaETtx73qVk',
    '1_BAAgkEJ03SQ1duB6_80Qb1QZ5Eirkih',
    '1mjGBAktH5jK_DFwPhd9gpYL1-NhkkRKX',
    '1oGk3_c13Qz5fLDCGvejFd5LTThu82eeJ',
    '1yNg7t537MvOQgUAJWRw9oocj82F3TK6g'
  ];

  for (const id of ids) {
    try {
      const files = await scrapeFolderFiles(id);
      console.log(`\nFolder ID: ${id}`);
      console.log(`Total files: ${files.length}`);
      console.log(`Sample files:`);
      files.slice(0, 3).forEach(f => console.log(`  - ${f.name} (ID: ${f.id})`));
    } catch (e: any) {
      console.error(`Error scraping ${id}:`, e.message || e);
    }
  }
}

run().catch(console.error);
