import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.ts";
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export function getPrisma() {
 if (!process.env.DATABASE_URL) throw new Error("Database configuration is missing.");
 const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
 globalForPrisma.prisma = prisma;
 return prisma;
}
