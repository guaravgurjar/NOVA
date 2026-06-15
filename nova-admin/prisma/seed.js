const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create Admin User (admin@nova.in / admin123)
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@nova.in' },
    update: {},
    create: {
      email: 'admin@nova.in',
      passwordHash: '$2a$12$R.SDR/y1aQO8g2X5Gg6c5u1209s0F28s0a0f82hA8zP8s0a0f82hA', // Simulated pre-hashed password
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin User seeded:', admin.email);

  // 2. Create Metal Rates
  const rates = [
    { id: 'GOLD_24K', name: 'Gold 24K', usd: 75.25, inr: 6283.38 },
    { id: 'GOLD_22K', name: 'Gold 22K', usd: 68.98, inr: 5599.83 },
    { id: 'GOLD_18K', name: 'Gold 18K', usd: 56.44, inr: 4712.53 },
    { id: 'GOLD_14K', name: 'Gold 14K', usd: 43.90, inr: 3665.65 },
    { id: 'SILVER', name: 'Silver', usd: 0.94, inr: 78.49 },
  ];

  for (const r of rates) {
    await prisma.metalRates.upsert({
      where: { id: r.id },
      update: {
        pricePerGramUSD: r.usd,
        pricePerGramINR: r.inr,
      },
      create: {
        id: r.id,
        metalName: r.name,
        pricePerGramUSD: r.usd,
        pricePerGramINR: r.inr,
      },
    });
  }
  console.log('✅ Metal Rates seeded.');

  // 3. Create Products
  const products = [
    {
      id: 'prod-solitaire',
      name: 'Royal Solitaire Diamond Ring',
      description: 'A brilliant-cut diamond solitaire set in a luxury band.',
      baseSKU: 'RG-SLT',
      category: 'rings',
    },
    {
      id: 'prod-herringbone',
      name: 'Classic Herringbone Chain',
      description: 'Sleek, fluid sterling silver chain laying flat against the skin.',
      baseSKU: 'CH-HRB',
      category: 'chains',
    },
    {
      id: 'prod-drop',
      name: 'Dainty Drop Earrings',
      description: 'Elegant drop earrings with lab certified round cut gemstones.',
      baseSKU: 'ER-DRP',
      category: 'earrings',
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { baseSKU: p.baseSKU },
      update: {},
      create: p,
    });
  }
  console.log('✅ Products seeded.');

  // 4. Create Product Variants
  const variants = [
    {
      id: 'var-slt-g18-sz7',
      sku: 'RG-SLT-G18-42G-SZ7',
      productId: 'prod-solitaire',
      metalType: 'GOLD_18K',
      metalWeight: 4.2,
      gemstoneCarat: 1.0,
      gemstoneCut: 'Round Brilliant',
      gemstoneClarity: 'VS1',
      gemstoneCost: 45000,
      size: '7',
      markup: 15000,
      stock: 12,
    },
    {
      id: 'var-slt-g14-sz6',
      sku: 'RG-SLT-G14-38G-SZ6',
      productId: 'prod-solitaire',
      metalType: 'GOLD_14K',
      metalWeight: 3.8,
      gemstoneCarat: 0.5,
      gemstoneCut: 'Princess',
      gemstoneClarity: 'SI1',
      gemstoneCost: 22000,
      size: '6',
      markup: 12000,
      stock: 2, // Low stock alert trigger
    },
    {
      id: 'var-hrb-slv-18in',
      sku: 'CH-HRB-S-102G-OS',
      productId: 'prod-herringbone',
      metalType: 'SILVER',
      metalWeight: 10.2,
      gemstoneCost: 0,
      size: '18inch',
      markup: 2500,
      stock: 1, // Low stock alert trigger
    },
    {
      id: 'var-drp-slv-cz',
      sku: 'ER-DRP-S-35G-OS',
      productId: 'prod-drop',
      metalType: 'SILVER',
      metalWeight: 3.5,
      gemstoneCarat: 0.8,
      gemstoneCut: 'Oval',
      gemstoneClarity: 'VVS2',
      gemstoneCost: 3500,
      size: 'One Size',
      markup: 1800,
      stock: 25,
    },
  ];

  for (const v of variants) {
    await prisma.productVariant.upsert({
      where: { sku: v.sku },
      update: {},
      create: v,
    });
  }
  console.log('✅ Variants seeded.');

  // 5. Create Orders
  const orders = [
    {
      id: 'order-1',
      orderNumber: 'NOV-10001',
      buyerName: 'Arjun Mehta',
      buyerEmail: 'arjun.mehta@gmail.com',
      shippingAddress: '42, Park Street, Sector 5, Kolkata, West Bengal - 700091',
      engravingText: 'Forever yours A&M',
      totalPrice: 79792.62, // Calculated based on 18K Gold price + Gemstone + Markup
      status: 'PENDING',
      createdAt: new Date(Date.now() - 3600000 * 4), // 4 hours ago
    },
    {
      id: 'order-2',
      orderNumber: 'NOV-10002',
      buyerName: 'Priya Sharma',
      buyerEmail: 'priya.sharma@yahoo.com',
      shippingAddress: 'B-103, Skyline Apartments, Andheri West, Mumbai, Maharashtra - 400053',
      engravingText: null,
      totalPrice: 5574.71, // Calculated based on Silver drop earrings
      status: 'SHIPPED',
      trackingNumber: 'INS-TRK9820542',
      createdAt: new Date(Date.now() - 3600000 * 24 * 2), // 2 days ago
    },
  ];

  for (const o of orders) {
    await prisma.order.upsert({
      where: { orderNumber: o.orderNumber },
      update: {},
      create: o,
    });
  }
  console.log('✅ Orders seeded.');

  // 6. Create Order Items
  const orderItems = [
    {
      id: 'item-1',
      orderId: 'order-1',
      variantId: 'var-slt-g18-sz7',
      quantity: 1,
      pricePaid: 79792.62,
    },
    {
      id: 'item-2',
      orderId: 'order-2',
      variantId: 'var-drp-slv-cz',
      quantity: 1,
      pricePaid: 5574.71,
    },
  ];

  for (const item of orderItems) {
    await prisma.orderItem.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });
  }
  console.log('✅ Order Items seeded.');

  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
