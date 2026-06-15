import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db-service';

export async function GET(request: Request) {
  // Optional security check
  const authHeader = request.headers.get('authorization');
  const hasCronSecret = process.env.CRON_SECRET;
  if (hasCronSecret && authHeader !== `Bearer ${hasCronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.GOLD_API_KEY;
  const exchangeRate = 83.5; // Fixed exchange rate for USD/INR conversion

  let gold24kUSD = 75.25; // Base Gold 24K per gram in USD
  let silverUSD = 0.94;   // Base Silver per gram in USD
  let syncSource = 'MOCK_ENGINE';

  // If live key is provided, query GoldAPI
  if (apiKey && apiKey !== 'your_api_key_placeholder') {
    try {
      // Fetch Gold (XAU)
      const goldRes = await fetch('https://www.goldapi.io/api/XAU/USD', {
        headers: { 'x-access-token': apiKey },
      });
      if (goldRes.ok) {
        const data = await goldRes.json();
        if (data.price_gram_24k) {
          gold24kUSD = data.price_gram_24k;
          syncSource = 'GOLD_API';
        }
      }

      // Fetch Silver (XAG)
      const silverRes = await fetch('https://www.goldapi.io/api/XAG/USD', {
        headers: { 'x-access-token': apiKey },
      });
      if (silverRes.ok) {
        const data = await silverRes.json();
        if (data.price_gram) {
          silverUSD = data.price_gram;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch from GoldAPI, falling back to mock rates:', e);
    }
  }

  // If using Mock Engine, simulate minor market fluctuations (+/- 0.8%)
  if (syncSource === 'MOCK_ENGINE') {
    const fluctuation = 1 + (Math.random() * 0.016 - 0.008);
    gold24kUSD = gold24kUSD * fluctuation;
    silverUSD = silverUSD * fluctuation;
  }

  // Calculate karat rates based on purity ratios
  const gold22kUSD = gold24kUSD * (22 / 24);
  const gold18kUSD = gold24kUSD * (18 / 24);
  const gold14kUSD = gold24kUSD * (14 / 24);

  const rates = [
    { id: 'GOLD_24K', name: 'Gold 24K', usd: gold24kUSD },
    { id: 'GOLD_22K', name: 'Gold 22K', usd: gold22kUSD },
    { id: 'GOLD_18K', name: 'Gold 18K', usd: gold18kUSD },
    { id: 'GOLD_14K', name: 'Gold 14K', usd: gold14kUSD },
    { id: 'SILVER', name: 'Silver', usd: silverUSD },
  ];

  try {
    const serviceRates = rates.map(r => ({
      id: r.id,
      name: r.name,
      usd: r.usd,
      inr: r.usd * exchangeRate
    }));

    await dbService.updateMetalRates(serviceRates);

    return NextResponse.json({
      success: true,
      source: syncSource,
      rates: rates.map(r => ({
        id: r.id,
        usd: Number(r.usd.toFixed(2)),
        inr: Number((r.usd * exchangeRate).toFixed(2))
      })),
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Database metal rates sync error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Support POST request as well for manual dashboard trigger
export async function POST(request: Request) {
  return GET(request);
}
