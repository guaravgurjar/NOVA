import { Prisma } from '@prisma/client';

type Decimal = Prisma.Decimal;

export interface PricingInput {
  metalWeight: number;
  pricePerGram: number | Decimal;
  gemstoneCost: number | Decimal;
  markup: number | Decimal;
}

/**
 * Calculates the dynamic final price for a product variant.
 * Formula: (Metal Weight * Price Per Gram) + Gemstone Cost + Markup/Making Charge
 */
export function calculateVariantPrice({
  metalWeight,
  pricePerGram,
  gemstoneCost,
  markup
}: PricingInput): number {
  const rate = typeof pricePerGram === 'number' ? pricePerGram : Number(pricePerGram.toString());
  const gem = typeof gemstoneCost === 'number' ? gemstoneCost : Number(gemstoneCost.toString());
  const mark = typeof markup === 'number' ? markup : Number(markup.toString());

  return Math.round((metalWeight * rate) + gem + mark);
}

/**
 * Helper to auto-generate SKUs for product variants based on attributes.
 * Format: [BASE_SKU]-[METAL]-[WEIGHT_G]-[SIZE]
 */
export function generateVariantSKU(
  baseSKU: string,
  metalType: string,
  weight: number,
  size?: string
): string {
  const cleanBase = baseSKU.trim().toUpperCase();
  const cleanMetal = metalType.replace('GOLD_', 'G').replace('SILVER', 'S').toUpperCase();
  const cleanWeight = weight.toFixed(1).replace('.', '') + 'G';
  const cleanSize = size ? `SZ${size.trim().replace(/\s+/g, '').toUpperCase()}` : 'OS';
  
  return `${cleanBase}-${cleanMetal}-${cleanWeight}-${cleanSize}`;
}
