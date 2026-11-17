import { hash, verify } from "@node-rs/argon2";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(db, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
    password: {
      hash: (password) => hash(password, { memoryCost: 19456, timeCost: 2, parallelism: 1 }),
      verify: ({ hash: digest, password }) => verify(digest, password),
    },
  },
  rateLimit: { enabled: true, storage: "database" },
  advanced: { ipAddress: { ipAddressHeaders: ["x-forwarded-for"] } },
  plugins: [nextCookies()],
});
