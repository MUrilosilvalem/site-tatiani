import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL is not defined. Prisma might fail to connect.');
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
