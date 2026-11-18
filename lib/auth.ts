import { hash, verify } from "@node-rs/argon2";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins";
import { db } from "@/lib/db";
import { sendEmailWithResend } from "@/lib/email";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(db, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
    password: {
      hash: (password) =>
        hash(password, { memoryCost: 19456, timeCost: 2, parallelism: 1 }),
      verify: ({ hash: digest, password }) => verify(digest, password),
    },
  },
  rateLimit: { enabled: true, storage: "database" },
  advanced: {
    ipAddress: {
      ipAddressHeaders: ["cf-connecting-ip", "x-forwarded-for"],
    },
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  databaseHooks: {
    session: {
      create: {
        after: async (session) => {
          try {
            await db.auditLog.create({
              data: {
                actorRole: "user",
                action: "AUTH_SESSION_CREATED",
                target: session.userId,
                detail: `Login sesi baru terverifikasi dari IP ${session.ipAddress ?? "unknown"}.`,
              },
            });
          } catch {
            // Non-blocking audit log
          }
        },
      },
    },
  },
  plugins: [
    twoFactor({
      issuer: "Temu Janji Studio",
      otpOptions: {
        async sendOTP({ user, otp }) {
          await sendEmailWithResend({
            to: user.email,
            subject: "Kode Verifikasi 2FA · Temu Janji Studio",
            text: `Halo ${user.name}, kode verifikasi 2FA Anda adalah: ${otp}. Kode berlaku 5 menit.`,
            html: `<div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #ebe4f0;border-radius:12px;">
              <h2 style="color:#5b236b;margin:0 0 12px;">Verifikasi Keamanan 2FA</h2>
              <p>Halo <strong>${user.name}</strong>, masukkan kode OTP berikut untuk melanjutkan masuk ke Temu Janji Studio:</p>
              <div style="font-size:28px;font-weight:700;letter-spacing:6px;color:#341942;background:#f6eff9;padding:14px 20px;border-radius:8px;text-align:center;margin:16px 0;">${otp}</div>
              <p style="font-size:12px;color:#6c537a;">Jangan bagikan kode ini kepada siapa pun.</p>
            </div>`,
          });
        },
      },
    }),
    nextCookies(),
  ],
});
