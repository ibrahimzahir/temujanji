import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalDb = globalThis as typeof globalThis & { weddingDb?: PrismaClient };

export const db = globalDb.weddingDb ?? new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

if (process.env.NODE_ENV !== "production") globalDb.weddingDb = db;
