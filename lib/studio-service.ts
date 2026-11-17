import { db } from "@/lib/db";
import {
  DEFAULT_ROLE_PERMISSIONS,
  userPermissionsSchema,
  type CreateAnalyticsInput,
  type CreateOrderInput,
  type CreateTeamMemberInput,
  type CreateTrafficHitInput,
  type StudioDashboardPayload,
  type UpdateOrderInput,
  type UpdateTeamMemberInput,
} from "@/lib/schemas/studio";

const DUMMY_TEAM = [
  {
    name: "Rafi Andhika",
    email: "rafi@temujanji.id",
    role: "ADMIN" as const,
    title: "Studio Director & Kurator Utama",
    active: true,
  },
  {
    name: "Ibrahim Zahir",
    email: "dev@temujanji.id",
    role: "DEV" as const,
    title: "Lead Full-Stack Engineer",
    active: true,
  },
  {
    name: "Dara Ayu",
    email: "dara@temujanji.id",
    role: "EDITOR" as const,
    title: "Senior Editorial & Copywriter",
    active: true,
  },
  {
    name: "Sekar Kinanti",
    email: "sekar@temujanji.id",
    role: "EDITOR" as const,
    title: "Visual & Floral Layout Designer",
    active: true,
  },
];

const DUMMY_ORDERS = [
  {
    coupleName: "Nadia & Reza",
    email: "nadia.reza@gmail.com",
    whatsapp: "081288991122",
    designSlug: "senja-di-taman",
    packageName: "Paket Cerita",
    amount: 249000,
    paymentStatus: "PAID" as const,
    rsvpStatus: "SIAP_TERBIT" as const,
    eventDate: "24 Januari 2027",
    venue: "Gedung Merdeka, Bandung",
    guestCount: 350,
    confirmedGuests: 284,
    notes: "Tambahkan segel lilin ungu dan musik instrumental piano.",
  },
  {
    coupleName: "Dara & Rafi",
    email: "dara.rafi@gmail.com",
    whatsapp: "081377665544",
    designSlug: "sejauh-mata",
    packageName: "Paket Cerita",
    amount: 249000,
    paymentStatus: "PAID" as const,
    rsvpStatus: "MENUNGGU_RSVP" as const,
    eventDate: "14 Februari 2027",
    venue: "The Dharmawangsa, Jakarta",
    guestCount: 450,
    confirmedGuests: 312,
    notes: "Galeri 10 foto prewedding outdoor.",
  },
  {
    coupleName: "Sekar & Dimas",
    email: "sekar.dimas@gmail.com",
    whatsapp: "081599887766",
    designSlug: "irama-pusaka",
    packageName: "Paket Pusaka",
    amount: 349000,
    paymentStatus: "PAID" as const,
    rsvpStatus: "SIAP_TERBIT" as const,
    eventDate: "07 Maret 2027",
    venue: "Pendopo Agung, Yogyakarta",
    guestCount: 600,
    confirmedGuests: 495,
    notes: "Sertakan jadwal akad adat Jawa dan resepsi malam.",
  },
  {
    coupleName: "Alya & Niko",
    email: "alya.niko@gmail.com",
    whatsapp: "081122334455",
    designSlug: "aksara-rasa",
    packageName: "Paket Inti",
    amount: 149000,
    paymentStatus: "PENDING" as const,
    rsvpStatus: "DRAFT" as const,
    eventDate: "20 April 2027",
    venue: "Glass House, Bogor",
    guestCount: 200,
    confirmedGuests: 42,
    notes: "Menunggu pelunasan dan kiriman foto utama.",
  },
  {
    coupleName: "Kiana & Bagas",
    email: "kiana.bagas@gmail.com",
    whatsapp: "081766554433",
    designSlug: "lembayung-kasih",
    packageName: "Paket Cerita",
    amount: 249000,
    paymentStatus: "PAID" as const,
    rsvpStatus: "MENUNGGU_RSVP" as const,
    eventDate: "11 Mei 2027",
    venue: "Plataran Menteng, Jakarta",
    guestCount: 280,
    confirmedGuests: 198,
    notes: "Peta Google Maps langsung ke valet gate.",
  },
];

function buildDummyAnalytics(): Array<{
  date: string;
  desktopViews: number;
  mobileViews: number;
  rsvpSubmitted: number;
  inquiries: number;
}> {
  const baseDate = new Date("2026-11-17T00:00:00Z");
  const rows = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setUTCDate(baseDate.getUTCDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const wave = (14 - i) * 12;
    rows.push({
      date: iso,
      desktopViews: 180 + wave + ((i * 23) % 90),
      mobileViews: 320 + wave * 2 + ((i * 41) % 140),
      rsvpSubmitted: 38 + ((i * 7) % 29),
      inquiries: 8 + ((i * 3) % 11),
    });
  }
  return rows;
}

const DUMMY_TRAFFIC_HITS = [
  {
    path: "/",
    pageTitle: "Beranda Studio Temu Janji",
    location: "Jakarta, ID",
    deviceType: "Mobile",
    os: "iOS 19",
    browser: "Safari",
    hits: 3420,
    uniqueVisitors: 2610,
    avgDurationSec: 142,
  },
  {
    path: "/desain/senja-di-taman",
    pageTitle: "Tema Senja di Taman",
    location: "Bandung, ID",
    deviceType: "Mobile",
    os: "Android 15",
    browser: "Chrome",
    hits: 2180,
    uniqueVisitors: 1740,
    avgDurationSec: 118,
  },
  {
    path: "/desain/irama-pusaka",
    pageTitle: "Tema Irama Pusaka",
    location: "Yogyakarta, ID",
    deviceType: "Desktop",
    os: "macOS",
    browser: "Chrome",
    hits: 1490,
    uniqueVisitors: 1120,
    avgDurationSec: 164,
  },
  {
    path: "/desain/sejauh-mata",
    pageTitle: "Tema Sejauh Mata",
    location: "Surabaya, ID",
    deviceType: "Mobile",
    os: "iOS 19",
    browser: "Safari",
    hits: 1310,
    uniqueVisitors: 980,
    avgDurationSec: 109,
  },
  {
    path: "/pesan/senja-di-taman",
    pageTitle: "Formulir Pesanan Tema",
    location: "Jakarta, ID",
    deviceType: "Desktop",
    os: "Windows 11",
    browser: "Edge",
    hits: 890,
    uniqueVisitors: 720,
    avgDurationSec: 215,
  },
  {
    path: "/undangan/tamu",
    pageTitle: "Undangan Tamu Personal",
    location: "Medan, ID",
    deviceType: "Mobile",
    os: "Android 15",
    browser: "Chrome",
    hits: 2840,
    uniqueVisitors: 2390,
    avgDurationSec: 94,
  },
  {
    path: "/akun",
    pageTitle: "Ruang Klien & RSVP",
    location: "Bali, ID",
    deviceType: "Tablet",
    os: "iPadOS",
    browser: "Safari",
    hits: 620,
    uniqueVisitors: 480,
    avgDurationSec: 188,
  },
];

export async function ensureStudioSeeded() {
  const [orderCount, memberCount, analyticsCount, trafficCount] =
    await Promise.all([
      db.studioOrderRecord.count(),
      db.studioMember.count(),
      db.analyticsDaily.count(),
      db.trafficHit.count(),
    ]);

  if (memberCount === 0) {
    await db.studioMember.createMany({
      data: DUMMY_TEAM,
      skipDuplicates: true,
    });
  }
  if (orderCount === 0) {
    await db.studioOrderRecord.createMany({
      data: DUMMY_ORDERS,
    });
  }
  if (analyticsCount === 0) {
    await db.analyticsDaily.createMany({
      data: buildDummyAnalytics(),
      skipDuplicates: true,
    });
  }
  if (trafficCount === 0) {
    await db.trafficHit.createMany({
      data: DUMMY_TRAFFIC_HITS,
      skipDuplicates: true,
    });
  }
}

export async function reseedStudioDummyData() {
  await db.$transaction([
    db.studioOrderRecord.deleteMany(),
    db.studioMember.deleteMany(),
    db.analyticsDaily.deleteMany(),
    db.trafficHit.deleteMany(),
  ]);
  await ensureStudioSeeded();
  return getStudioDashboardPayload();
}

export async function getStudioDashboardPayload(): Promise<StudioDashboardPayload> {
  await ensureStudioSeeded();

  const [orders, team, analytics, trafficHits, publishedThemesCount] =
    await Promise.all([
      db.studioOrderRecord.findMany({ orderBy: { createdAt: "desc" } }),
      db.studioMember.findMany({ orderBy: { createdAt: "asc" } }),
      db.analyticsDaily.findMany({ orderBy: { date: "asc" } }),
      db.trafficHit.findMany({ orderBy: { hits: "desc" } }),
      db.designTemplate.count({ where: { published: true } }),
    ]);

  const paidOrders = orders.filter((o) => o.paymentStatus === "PAID");
  const totalRevenue = paidOrders.reduce((acc, o) => acc + o.amount, 0);
  const totalConfirmedRsvp = orders.reduce((acc, o) => acc + o.confirmedGuests, 0);
  const totalViews30d = analytics.reduce(
    (acc, a) => acc + a.desktopViews + a.mobileViews,
    0
  );
  const activeTeamCount = team.filter((m) => m.active).length;

  return {
    summary: {
      totalOrders: orders.length,
      paidOrders: paidOrders.length,
      totalRevenue,
      totalConfirmedRsvp,
      totalViews30d,
      activeTeamCount,
      publishedThemesCount: publishedThemesCount || 6,
    },
    orders: orders.map((o) => ({
      ...o,
      createdAt: o.createdAt.toISOString(),
    })),
    team: team.map((m) => {
      const parsedPerm = userPermissionsSchema.safeParse(m.permissions);
      return {
        ...m,
        previousRole: m.previousRole ?? null,
        permissions: parsedPerm.success
          ? parsedPerm.data
          : DEFAULT_ROLE_PERMISSIONS[m.role],
        createdAt: m.createdAt.toISOString(),
      };
    }),
    analytics: analytics.map((a) => ({
      id: a.id,
      date: a.date,
      desktopViews: a.desktopViews,
      mobileViews: a.mobileViews,
      rsvpSubmitted: a.rsvpSubmitted,
      inquiries: a.inquiries,
    })),
    trafficHits: trafficHits.map((t) => ({
      id: t.id,
      path: t.path,
      pageTitle: t.pageTitle,
      location: t.location,
      deviceType: t.deviceType,
      os: t.os,
      browser: t.browser,
      hits: t.hits,
      uniqueVisitors: t.uniqueVisitors,
      avgDurationSec: t.avgDurationSec,
    })),
  };
}

export async function createStudioOrder(input: CreateOrderInput) {
  await db.studioOrderRecord.create({
    data: {
      coupleName: input.coupleName,
      email: input.email,
      whatsapp: input.whatsapp,
      designSlug: input.designSlug,
      packageName: input.packageName,
      amount: input.amount,
      eventDate: input.eventDate,
      venue: input.venue,
      guestCount: input.guestCount,
      notes: input.notes ?? "",
    },
  });
  return getStudioDashboardPayload();
}

export async function updateStudioOrder(input: UpdateOrderInput) {
  await db.studioOrderRecord.update({
    where: { id: input.id },
    data: {
      ...(input.paymentStatus ? { paymentStatus: input.paymentStatus } : {}),
      ...(input.rsvpStatus ? { rsvpStatus: input.rsvpStatus } : {}),
      ...(typeof input.confirmedGuests === "number"
        ? { confirmedGuests: input.confirmedGuests }
        : {}),
    },
  });
  return getStudioDashboardPayload();
}

export async function deleteStudioOrder(id: string) {
  await db.studioOrderRecord.delete({ where: { id } });
  return getStudioDashboardPayload();
}

export async function createStudioMember(
  input: CreateTeamMemberInput,
  actorRole = "admin"
) {
  const created = await db.studioMember.create({
    data: {
      name: input.name,
      email: input.email,
      role: input.role,
      status: input.active ? "ACTIVE" : "SUSPENDED",
      title: input.title,
      active: input.active,
    },
  });
  await db.auditLog.create({
    data: {
      actorRole,
      action: "USER_CREATED",
      target: created.email,
      detail: `Pengguna baru "${created.name}" dibuat dengan peran ${created.role}.`,
    },
  });
  return getStudioDashboardPayload();
}

export async function updateStudioMember(
  input: UpdateTeamMemberInput,
  actorRole = "admin"
) {
  const existing = await db.studioMember.findUnique({
    where: { id: input.id },
  });
  if (!existing) {
    throw new Error("Anggota tim tidak ditemukan");
  }

  if (input.rollbackRole) {
    if (!existing.previousRole) {
      throw new Error("Tidak ada peran sebelumnya untuk di-rollback");
    }
    const targetRole = existing.previousRole;
    await db.studioMember.update({
      where: { id: input.id },
      data: {
        role: targetRole,
        previousRole: existing.role,
      },
    });
    await db.auditLog.create({
      data: {
        actorRole,
        action: "ROLE_ROLLED_BACK",
        target: existing.email,
        detail: `Peran ${existing.name} dikembalikan dari ${existing.role} ke ${targetRole}.`,
      },
    });
    return getStudioDashboardPayload();
  }

  const nextStatus =
    input.status ??
    (typeof input.active === "boolean"
      ? input.active
        ? "ACTIVE"
        : "SUSPENDED"
      : existing.status);
  const nextActive = nextStatus === "ACTIVE";
  const roleChanged = Boolean(input.role && input.role !== existing.role);

  await db.studioMember.update({
    where: { id: input.id },
    data: {
      ...(roleChanged && input.role
        ? { role: input.role, previousRole: existing.role }
        : {}),
      status: nextStatus,
      active: nextActive,
      ...(typeof input.statusReason === "string"
        ? { statusReason: input.statusReason }
        : {}),
      ...(input.permissions ? { permissions: input.permissions } : {}),
    },
  });

  if (input.permissions) {
    await db.auditLog.create({
      data: {
        actorRole,
        action: "PERMISSIONS_UPDATED",
        target: existing.email,
        detail: `Izin mikro ${existing.name} diperbarui: ${input.permissions.pages.length} halaman, ${input.permissions.operations.length} operasi.`,
      },
    });
  } else if (roleChanged && input.role) {
    await db.auditLog.create({
      data: {
        actorRole,
        action: "ROLE_ASSIGNED",
        target: existing.email,
        detail: `Peran ${existing.name} diubah dari ${existing.role} ke ${input.role}.`,
      },
    });
  } else if (nextStatus !== existing.status) {
    await db.auditLog.create({
      data: {
        actorRole,
        action:
          nextStatus === "BLOCKED"
            ? "USER_BLOCKED"
            : nextStatus === "SUSPENDED"
              ? "USER_SUSPENDED"
              : "USER_UNBLOCKED",
        target: existing.email,
        detail: `Status ${existing.name} diubah dari ${existing.status} ke ${nextStatus}.`,
      },
    });
  }

  return getStudioDashboardPayload();
}

export async function deleteStudioMember(id: string, actorRole = "admin") {
  const existing = await db.studioMember.findUnique({ where: { id } });
  await db.studioMember.delete({ where: { id } });
  if (existing) {
    await db.auditLog.create({
      data: {
        actorRole,
        action: "USER_DELETED",
        target: existing.email,
        detail: `Akun ${existing.name} dihapus dari daftar tim studio.`,
      },
    });
  }
  return getStudioDashboardPayload();
}

export async function upsertAnalyticsDaily(input: CreateAnalyticsInput) {
  await db.analyticsDaily.upsert({
    where: { date: input.date },
    create: {
      date: input.date,
      desktopViews: input.desktopViews,
      mobileViews: input.mobileViews,
      rsvpSubmitted: input.rsvpSubmitted,
      inquiries: input.inquiries,
    },
    update: {
      desktopViews: input.desktopViews,
      mobileViews: input.mobileViews,
      rsvpSubmitted: input.rsvpSubmitted,
      inquiries: input.inquiries,
    },
  });
  return getStudioDashboardPayload();
}

export async function upsertTrafficHit(input: CreateTrafficHitInput) {
  await db.trafficHit.upsert({
    where: {
      path_location_deviceType: {
        path: input.path,
        location: input.location,
        deviceType: input.deviceType,
      },
    },
    create: {
      path: input.path,
      pageTitle: input.pageTitle,
      location: input.location,
      deviceType: input.deviceType,
      os: input.os,
      browser: input.browser,
      hits: input.hits,
      uniqueVisitors: input.uniqueVisitors,
      avgDurationSec: input.avgDurationSec,
    },
    update: {
      pageTitle: input.pageTitle,
      os: input.os,
      browser: input.browser,
      hits: { increment: input.hits },
      uniqueVisitors: { increment: input.uniqueVisitors },
      avgDurationSec: input.avgDurationSec,
    },
  });
  return getStudioDashboardPayload();
}
