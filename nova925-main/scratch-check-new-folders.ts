async function run() {
  const mainFolderId = '1Fd4XIcffsA5cl6kAS4HByeRqVYSCZ2Qb';
  const url = `https://drive.google.com/drive/folders/${mainFolderId}?usp=sharing`;
  console.log(`Fetching ${url}...`);
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await response.text();
  console.log(`Fetched html. Length: ${html.length}`);

  // Find all unique 33-char drive IDs
  const idRegex = /\b(1[a-zA-Z0-9_-]{32})\b/g;
  const matches = new Set<string>();
  let match;
  while ((match = idRegex.exec(html)) !== null) {
    matches.add(match[1]);
  }
  
  console.log(`Found ${matches.size} unique ID-like strings.`);
  
  for (const id of matches) {
    const idx = html.indexOf(id);
    if (idx !== -1) {
      const chunk = html.substring(idx, idx + 3000);
      const labelMatch = chunk.match(/aria-label="([^"]+)"/i);
      if (labelMatch) {
        console.log(`ID: ${id} -> ${labelMatch[1]}`);
      }
    }
  }
}

run().catch(console.error);
