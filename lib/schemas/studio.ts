import { z } from "zod";

export const studioRoleSchema = z.enum(["admin", "dev", "editor"]);
export type StudioRoleType = z.infer<typeof studioRoleSchema>;

export const paymentStatusSchema = z.enum(["PENDING", "PAID"]);
export type PaymentStatusType = z.infer<typeof paymentStatusSchema>;

export const rsvpStatusSchema = z.enum(["DRAFT", "MENUNGGU_RSVP", "SIAP_TERBIT"]);
export type RsvpStatusType = z.infer<typeof rsvpStatusSchema>;

export const createOrderSchema = z.object({
  coupleName: z
    .string()
    .trim()
    .min(3, "Nama pasangan minimal 3 karakter")
    .max(100, "Nama pasangan maksimal 100 karakter"),
  email: z.string().trim().email("Format email tidak valid"),
  whatsapp: z
    .string()
    .trim()
    .min(8, "Nomor WhatsApp minimal 8 digit")
    .max(24, "Nomor WhatsApp maksimal 24 digit"),
  designSlug: z.string().trim().min(2, "Pilih tema undangan"),
  packageName: z.enum(["Paket Inti", "Paket Cerita", "Paket Pusaka"]),
  amount: z.coerce
    .number()
    .int("Nominal harus bilangan bulat")
    .min(50000, "Nominal minimal Rp 50.000")
    .max(50000000, "Nominal terlalu besar"),
  eventDate: z.string().trim().min(4, "Tanggal acara wajib diisi"),
  venue: z.string().trim().min(3, "Lokasi acara minimal 3 karakter").max(160),
  guestCount: z.coerce.number().int().min(10, "Minimal 10 tamu").max(5000),
  notes: z.string().trim().max(400).default(""),
});
export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const updateOrderSchema = z.object({
  id: z.string().min(1),
  paymentStatus: paymentStatusSchema.optional(),
  rsvpStatus: rsvpStatusSchema.optional(),
  confirmedGuests: z.coerce.number().int().min(0).max(5000).optional(),
});
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;

export const deleteByIdSchema = z.object({
  id: z.string().min(1, "ID wajib diisi"),
});
export type DeleteByIdInput = z.infer<typeof deleteByIdSchema>;

export const createTeamMemberSchema = z.object({
  name: z.string().trim().min(2, "Nama anggota minimal 2 karakter").max(80),
  email: z.string().trim().email("Format email tidak valid"),
  role: z.enum(["ADMIN", "DEV", "EDITOR"]),
  title: z.string().trim().min(2, "Jabatan minimal 2 karakter").max(80),
  active: z.boolean().default(true),
});
export type CreateTeamMemberInput = z.infer<typeof createTeamMemberSchema>;

export const updateTeamMemberSchema = z.object({
  id: z.string().min(1),
  role: z.enum(["ADMIN", "DEV", "EDITOR"]).optional(),
  active: z.boolean().optional(),
});
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>;

export const createAnalyticsSchema = z.object({
  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Gunakan format tanggal YYYY-MM-DD"),
  desktopViews: z.coerce.number().int().min(0).max(1000000),
  mobileViews: z.coerce.number().int().min(0).max(1000000),
  rsvpSubmitted: z.coerce.number().int().min(0).max(100000),
  inquiries: z.coerce.number().int().min(0).max(100000),
});
export type CreateAnalyticsInput = z.infer<typeof createAnalyticsSchema>;

export const studioOrderRecordSchema = z.object({
  id: z.string(),
  coupleName: z.string(),
  email: z.string(),
  whatsapp: z.string(),
  designSlug: z.string(),
  packageName: z.string(),
  amount: z.number(),
  paymentStatus: paymentStatusSchema,
  rsvpStatus: rsvpStatusSchema,
  eventDate: z.string(),
  venue: z.string(),
  guestCount: z.number(),
  confirmedGuests: z.number(),
  notes: z.string(),
  createdAt: z.string(),
});
export type StudioOrderRecordDTO = z.infer<typeof studioOrderRecordSchema>;

export const studioMemberRecordSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.enum(["ADMIN", "DEV", "EDITOR"]),
  title: z.string(),
  active: z.boolean(),
  createdAt: z.string(),
});
export type StudioMemberRecordDTO = z.infer<typeof studioMemberRecordSchema>;

export const analyticsDailyRecordSchema = z.object({
  id: z.string(),
  date: z.string(),
  desktopViews: z.number(),
  mobileViews: z.number(),
  rsvpSubmitted: z.number(),
  inquiries: z.number(),
});
export type AnalyticsDailyRecordDTO = z.infer<typeof analyticsDailyRecordSchema>;

export const studioDashboardPayloadSchema = z.object({
  summary: z.object({
    totalOrders: z.number(),
    paidOrders: z.number(),
    totalRevenue: z.number(),
    totalConfirmedRsvp: z.number(),
    totalViews30d: z.number(),
    activeTeamCount: z.number(),
    publishedThemesCount: z.number(),
  }),
  orders: z.array(studioOrderRecordSchema),
  team: z.array(studioMemberRecordSchema),
  analytics: z.array(analyticsDailyRecordSchema),
});
export type StudioDashboardPayload = z.infer<typeof studioDashboardPayloadSchema>;

export const updateSystemConfigSchema = z.object({
  maintenanceMode: z.boolean(),
  maintenanceMessage: z
    .string()
    .trim()
    .min(5, "Pesan pemeliharaan minimal 5 karakter")
    .max(300, "Pesan maksimal 300 karakter"),
  dailyBackupEnabled: z.boolean().default(true),
  backupRetentionDay: z.coerce.number().int().min(7).max(365).default(30),
});
export type UpdateSystemConfigInput = z.infer<typeof updateSystemConfigSchema>;

export const createBackupSchema = z.object({
  label: z
    .string()
    .trim()
    .min(3, "Label backup minimal 3 karakter")
    .max(80, "Label maksimal 80 karakter"),
});
export type CreateBackupInput = z.infer<typeof createBackupSchema>;

export const devActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("healthcheck"),
  }),
  z.object({
    action: z.literal("maintenance"),
    payload: updateSystemConfigSchema,
  }),
  z.object({
    action: z.literal("backup"),
    payload: createBackupSchema,
  }),
]);
export type DevActionInput = z.infer<typeof devActionSchema>;

export const devConsolePayloadSchema = z.object({
  systemConfig: z.object({
    maintenanceMode: z.boolean(),
    maintenanceMessage: z.string(),
    dailyBackupEnabled: z.boolean(),
    backupRetentionDay: z.number(),
    updatedBy: z.string(),
    updatedAt: z.string(),
  }),
  health: z.object({
    status: z.enum(["HEALTHY", "DEGRADED", "MAINTENANCE"]),
    dbConnected: z.boolean(),
    dbLatencyMs: z.number(),
    nodeVersion: z.string(),
    platform: z.string(),
    uptimeSec: z.number(),
    memoryMb: z.object({
      rss: z.number(),
      heapUsed: z.number(),
      heapTotal: z.number(),
    }),
    envChecks: z.array(
      z.object({
        key: z.string(),
        present: z.boolean(),
        note: z.string(),
      })
    ),
    checkedAt: z.string(),
  }),
  databaseTables: z.array(
    z.object({
      table: z.string(),
      rows: z.number(),
    })
  ),
  apiEndpoints: z.array(
    z.object({
      path: z.string(),
      methods: z.string(),
      auth: z.string(),
      status: z.enum(["ONLINE", "PROTECTED"]),
    })
  ),
  packages: z.array(
    z.object({
      name: z.string(),
      version: z.string(),
      category: z.enum(["Framework", "Database", "Auth & Validation", "UI & Motion"]),
    })
  ),
  advisories: z.array(
    z.object({
      id: z.string(),
      severity: z.enum(["INFO", "WARN", "ACTION"]),
      title: z.string(),
      detail: z.string(),
    })
  ),
  backups: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      type: z.string(),
      status: z.string(),
      sizeKb: z.number(),
      tablesCount: z.number(),
      checksum: z.string(),
      createdAt: z.string(),
    })
  ),
  recommendations: z.array(
    z.object({
      id: z.string(),
      priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
      title: z.string(),
      description: z.string(),
    })
  ),
  auditLogs: z.array(
    z.object({
      id: z.string(),
      actorRole: z.string(),
      action: z.string(),
      target: z.string(),
      detail: z.string(),
      createdAt: z.string(),
    })
  ),
});
export type DevConsolePayload = z.infer<typeof devConsolePayloadSchema>;

