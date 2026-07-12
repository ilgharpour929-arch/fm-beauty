import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient(): PrismaClient {
  try {
    return new PrismaClient();
  } catch {
    return {} as PrismaClient;
  }
}

const prismaInstance = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production" && prismaInstance && Object.keys(prismaInstance).length > 0) {
  globalForPrisma.prisma = prismaInstance;
}

export const prisma = prismaInstance;