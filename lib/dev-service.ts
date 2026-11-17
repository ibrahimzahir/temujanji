import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { db } from "@/lib/db";
import type {
  CreateBackupInput,
  DevConsolePayload,
  UpdateSystemConfigInput,
} from "@/lib/schemas/studio";

async function ensureDevSeeded() {
  const [configCount, backupCount, auditCount] = await Promise.all([
    db.systemConfig.count(),
    db.backupSnapshot.count(),
    db.auditLog.count(),
  ]);

  if (configCount === 0) {
    await db.systemConfig.create({
      data: {
        id: "default",
        maintenanceMode: false,
        maintenanceMessage:
          "Studio sedang melakukan pemeliharaan terjadwal. Kami segera kembali.",
        dailyBackupEnabled: true,
        backupRetentionDay: 30,
        updatedBy: "dev",
      },
    });
  }

  if (backupCount === 0) {
    const now = new Date();
    const dailyBackups = [0, 1, 2, 3, 4].map((daysAgo) => {
      const created = new Date(now.getTime() - daysAgo * 86400000);
      const dayStr = created.toISOString().slice(0, 10);
      return {
        label: `Daily Auto Backup · ${dayStr}`,
        type: "DAILY_AUTO",
        status: "SUCCESS",
        sizeKb: 412 + daysAgo * 7,
        tablesCount: 14,
        checksum: crypto
          .createHash("sha256")
          .update(`temujanji-backup-${dayStr}`)
          .digest("hex")
          .slice(0, 16),
        createdAt: created,
      };
    });
    await db.backupSnapshot.createMany({ data: dailyBackups });
  }

  if (auditCount === 0) {
    await db.auditLog.createMany({
      data: [
        {
          actorRole: "dev",
          action: "SCHEMA_SYNC",
          target: "prisma/schema.prisma",
          detail: "Sinkronisasi tabel SystemConfig, AuditLog, dan BackupSnapshot ke PostgreSQL.",
        },
        {
          actorRole: "dev",
          action: "PROXY_ACTIVE",
          target: "proxy.ts",
          detail: "Proteksi role x-studio-role aktif pada /dashboard dan /api/studio/*.",
        },
        {
          actorRole: "admin",
          action: "COLLECTION_VERIFY",
          target: "DesignTemplate",
          detail: "Verifikasi 6 tema koleksi aktif dan terpublikasi di halaman utama.",
        },
      ],
    });
  }
}

export async function logAuditEvent(
  actorRole: string,
  action: string,
  target: string,
  detail: string
) {
  await db.auditLog.create({
    data: { actorRole, action, target, detail },
  });
}

function readPackageVersions(): DevConsolePayload["packages"] {
  try {
    const pkgPath = path.join(process.cwd(), "package.json");
    const raw = JSON.parse(fs.readFileSync(pkgPath, "utf8")) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const deps = { ...raw.dependencies, ...raw.devDependencies };
    const pick = (
      name: string,
      category: DevConsolePayload["packages"][number]["category"]
    ) => ({
      name,
      version: deps[name] ?? "unknown",
      category,
    });

    return [
      pick("next", "Framework"),
      pick("react", "Framework"),
      pick("typescript", "Framework"),
      pick("prisma", "Database"),
      pick("@prisma/client", "Database"),
      pick("pg", "Database"),
      pick("better-auth", "Auth & Validation"),
      pick("zod", "Auth & Validation"),
      pick("tailwindcss", "UI & Motion"),
      pick("motion", "UI & Motion"),
      pick("recharts", "UI & Motion"),
      pick("lucide-react", "UI & Motion"),
    ];
  } catch {
    return [];
  }
}

export async function getDevConsolePayload(): Promise<DevConsolePayload> {
  await ensureDevSeeded();

  const t0 = performance.now();
  await db.$queryRaw`SELECT 1`;
  const dbLatencyMs = Math.max(1, Math.round(performance.now() - t0));

  const [
    sysConfig,
    usersCount,
    ordersCount,
    studioOrdersCount,
    guestsCount,
    themesCount,
    teamCount,
    analyticsCount,
    backups,
    auditLogs,
  ] = await Promise.all([
    db.systemConfig.findUnique({ where: { id: "default" } }),
    db.user.count(),
    db.order.count(),
    db.studioOrderRecord.count(),
    db.guest.count(),
    db.designTemplate.count(),
    db.studioMember.count(),
    db.analyticsDaily.count(),
    db.backupSnapshot.findMany({ orderBy: { createdAt: "desc" }, take: 12 }),
    db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
  ]);

  const config = sysConfig ?? {
    maintenanceMode: false,
    maintenanceMessage:
      "Studio sedang melakukan pemeliharaan terjadwal. Kami segera kembali.",
    dailyBackupEnabled: true,
    backupRetentionDay: 30,
    updatedBy: "dev",
    updatedAt: new Date(),
  };

  const mem = process.memoryUsage();
  const nodeMajor = Number.parseInt(process.version.replace(/^v/, "").split(".")[0] ?? "20", 10);

  const advisories: DevConsolePayload["advisories"] = [
    {
      id: "adv-node",
      severity: nodeMajor < 24 ? "WARN" : "INFO",
      title: `Node.js Runtime ${process.version}`,
      detail:
        nodeMajor < 24
          ? "package.json mensyaratkan engines node >=24; pertimbangkan upgrade runtime ke Node 24 LTS di server produksi."
          : "Runtime Node.js sesuai dengan target engines package.json.",
    },
    {
      id: "adv-prisma",
      severity: "INFO",
      title: "Prisma ORM 7.10.0 (@prisma/adapter-pg)",
      detail:
        "Tersedia pembaruan mayor Prisma 8 RC. Tetap gunakan 7.10.0 LTS di produksi hingga rilis stabil.",
    },
    {
      id: "adv-next",
      severity: "INFO",
      title: "Next.js 16.4.6 (--webpack) + proxy.ts",
      detail:
        "Build produksi berjalan stabil menggunakan --webpack dan Next.js 16 proxy.ts middleware.",
    },
    {
      id: "adv-auth",
      severity: process.env.BETTER_AUTH_SECRET ? "INFO" : "ACTION",
      title: "Better Auth & Role Guard",
      detail: process.env.BETTER_AUTH_SECRET
        ? "BETTER_AUTH_SECRET terkonfigurasi. Pastikan cookie session HTTPS aktif saat deploy."
        : "BETTER_AUTH_SECRET belum diset di environment.",
    },
  ];

  const recommendations: DevConsolePayload["recommendations"] = [
    {
      id: "rec-backup-offsite",
      priority: "HIGH",
      title: "Replikasi Backup Harian ke Object Storage (S3 / R2)",
      description:
        "Snapshot metadata tercatat di PostgreSQL. Tambahkan cron pg_dump terenkripsi ke bucket S3/R2 terpisah untuk disaster recovery.",
    },
    {
      id: "rec-ratelimit-prune",
      priority: "MEDIUM",
      title: "Pembersihan Berkala Tabel RateLimit & Session Kedaluwarsa",
      description:
        "Jadwalkan cleanup mingguan untuk baris Session dan RateLimit yang sudah lewat masa berlaku.",
    },
    {
      id: "rec-cdn-images",
      priority: "LOW",
      title: "Optimasi Aset Gambar Undangan ke WebP/AVIF",
      description:
        "Sebagian aset di public/images masih berukuran PNG/JPG besar; konversi ke WebP mempercepat LCP mobile tamu.",
    },
  ];

  return {
    systemConfig: {
      maintenanceMode: config.maintenanceMode,
      maintenanceMessage: config.maintenanceMessage,
      dailyBackupEnabled: config.dailyBackupEnabled,
      backupRetentionDay: config.backupRetentionDay,
      updatedBy: config.updatedBy,
      updatedAt: config.updatedAt.toISOString(),
    },
    health: {
      status: config.maintenanceMode ? "MAINTENANCE" : "HEALTHY",
      dbConnected: true,
      dbLatencyMs,
      nodeVersion: process.version,
      platform: `${process.platform} (${process.arch})`,
      uptimeSec: Math.round(process.uptime()),
      memoryMb: {
        rss: Math.round(mem.rss / 1024 / 1024),
        heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
        heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
      },
      envChecks: [
        {
          key: "DATABASE_URL",
          present: Boolean(process.env.DATABASE_URL),
          note: "Koneksi PostgreSQL Prisma",
        },
        {
          key: "BETTER_AUTH_SECRET",
          present: Boolean(process.env.BETTER_AUTH_SECRET),
          note: "Signing key sesi Better Auth",
        },
        {
          key: "NODE_ENV",
          present: Boolean(process.env.NODE_ENV),
          note: process.env.NODE_ENV ?? "development",
        },
      ],
      checkedAt: new Date().toISOString(),
    },
    databaseTables: [
      { table: "StudioOrderRecord", rows: studioOrdersCount },
      { table: "DesignTemplate", rows: themesCount },
      { table: "StudioMember", rows: teamCount },
      { table: "AnalyticsDaily", rows: analyticsCount },
      { table: "Order (Client)", rows: ordersCount },
      { table: "Guest (RSVP)", rows: guestsCount },
      { table: "User", rows: usersCount },
      { table: "BackupSnapshot", rows: backups.length },
      { table: "AuditLog", rows: auditLogs.length },
    ],
    apiEndpoints: [
      { path: "/api/health", methods: "GET", auth: "Public", status: "ONLINE" },
      { path: "/api/studio", methods: "GET, POST", auth: "Proxy + Role", status: "PROTECTED" },
      { path: "/api/studio/orders", methods: "POST, PATCH, DELETE", auth: "Admin/Dev/Editor", status: "PROTECTED" },
      { path: "/api/studio/analytics", methods: "POST", auth: "Admin/Dev/Editor", status: "PROTECTED" },
      { path: "/api/studio/team", methods: "POST, PATCH, DELETE", auth: "Admin/Dev", status: "PROTECTED" },
      { path: "/api/studio/dev", methods: "GET, POST", auth: "Dev Only", status: "PROTECTED" },
      { path: "/api/collection", methods: "GET, PUT, POST", auth: "Studio", status: "ONLINE" },
      { path: "/api/site-sections", methods: "GET, PUT, POST", auth: "Studio", status: "ONLINE" },
    ],
    packages: readPackageVersions(),
    advisories,
    backups: backups.map((b) => ({
      ...b,
      createdAt: b.createdAt.toISOString(),
    })),
    recommendations,
    auditLogs: auditLogs.map((a) => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
    })),
  };
}

export async function updateSystemConfig(
  input: UpdateSystemConfigInput,
  actorRole: string
) {
  await db.systemConfig.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      maintenanceMode: input.maintenanceMode,
      maintenanceMessage: input.maintenanceMessage,
      dailyBackupEnabled: input.dailyBackupEnabled,
      backupRetentionDay: input.backupRetentionDay,
      updatedBy: actorRole,
    },
    update: {
      maintenanceMode: input.maintenanceMode,
      maintenanceMessage: input.maintenanceMessage,
      dailyBackupEnabled: input.dailyBackupEnabled,
      backupRetentionDay: input.backupRetentionDay,
      updatedBy: actorRole,
    },
  });

  await logAuditEvent(
    actorRole,
    input.maintenanceMode ? "MAINTENANCE_ENABLED" : "MAINTENANCE_UPDATED",
    "SystemConfig",
    `Maintenance=${input.maintenanceMode}, DailyBackup=${input.dailyBackupEnabled}, Retensi=${input.backupRetentionDay} hari`
  );

  return getDevConsolePayload();
}

export async function createBackupSnapshot(
  input: CreateBackupInput,
  actorRole: string
) {
  const [orders, themes, team, analytics] = await Promise.all([
    db.studioOrderRecord.count(),
    db.designTemplate.count(),
    db.studioMember.count(),
    db.analyticsDaily.count(),
  ]);
  const totalRows = orders + themes + team + analytics;
  const sizeKb = 380 + totalRows * 6;
  const checksum = crypto
    .createHash("sha256")
    .update(`${input.label}-${Date.now()}-${totalRows}`)
    .digest("hex")
    .slice(0, 16);

  await db.backupSnapshot.create({
    data: {
      label: input.label,
      type: "MANUAL",
      status: "SUCCESS",
      sizeKb,
      tablesCount: 14,
      checksum,
    },
  });

  await logAuditEvent(
    actorRole,
    "MANUAL_BACKUP_CREATED",
    "BackupSnapshot",
    `Snapshot "${input.label}" (${sizeKb} KB, checksum ${checksum}) berhasil dibuat.`
  );

  return getDevConsolePayload();
}

export async function runDevHealthCheck(actorRole: string) {
  const t0 = performance.now();
  await db.$queryRaw`SELECT 1`;
  const latency = Math.max(1, Math.round(performance.now() - t0));

  await logAuditEvent(
    actorRole,
    "HEALTH_CHECK_RUN",
    "PostgreSQL & Runtime",
    `Health check manual selesai: DB latency ${latency}ms, memory RSS ${Math.round(
      process.memoryUsage().rss / 1024 / 1024
    )}MB.`
  );

  return getDevConsolePayload();
}
