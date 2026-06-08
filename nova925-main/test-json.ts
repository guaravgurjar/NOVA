async function run() {
  const folderId = '1Fd4XIcffsA5cl6kAS4HByeRqVYSCZ2Qb';
  const url = `https://drive.google.com/drive/folders/${folderId}?usp=sharing`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await response.text();
  
  const ids = [
    '1xxkUgLtxWLaHX6hoCOR-q5joPdHFwGtw',
    '1cceqm-UNTu6saNB9Q2SaWNaETtx73qVk',
    '1_BAAgkEJ03SQ1duB6_80Qb1QZ5Eirkih',
    '1mjGBAktH5jK_DFwPhd9gpYL1-NhkkRKX',
    '1oGk3_c13Qz5fLDCGvejFd5LTThu82eeJ',
    '1yNg7t537MvOQgUAJWRw9oocj82F3TK6g'
  ];

  const lines = html.split('\n');
  for (const id of ids) {
    console.log(`\n--- ID: ${id} ---`);
    for (const line of lines) {
      if (line.includes(id)) {
        // Log a portion of the line containing the ID
        const idx = line.indexOf(id);
        const snippet = line.substring(Math.max(0, idx - 100), Math.min(line.length, idx + 200));
        console.log(snippet);
      }
    }
  }
}

run().catch(console.error);
