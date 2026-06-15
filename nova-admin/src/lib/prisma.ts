import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = (() => {
  try {
    const p = globalForPrisma.prisma ?? new PrismaClient();
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = p;
    return p;
  } catch (e) {
    console.warn("Prisma Client failed to initialize:", e);
    return null as any;
  }
})();
