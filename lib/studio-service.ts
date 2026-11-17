import { db } from "@/lib/db";
import type {
  CreateAnalyticsInput,
  CreateOrderInput,
  CreateTeamMemberInput,
  StudioDashboardPayload,
  UpdateOrderInput,
  UpdateTeamMemberInput,
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

export async function ensureStudioSeeded() {
  const [orderCount, memberCount, analyticsCount] = await Promise.all([
    db.studioOrderRecord.count(),
    db.studioMember.count(),
    db.analyticsDaily.count(),
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
}

export async function reseedStudioDummyData() {
  await db.$transaction([
    db.studioOrderRecord.deleteMany(),
    db.studioMember.deleteMany(),
    db.analyticsDaily.deleteMany(),
  ]);
  await ensureStudioSeeded();
  return getStudioDashboardPayload();
}

export async function getStudioDashboardPayload(): Promise<StudioDashboardPayload> {
  await ensureStudioSeeded();

  const [orders, team, analytics, publishedThemesCount] = await Promise.all([
    db.studioOrderRecord.findMany({ orderBy: { createdAt: "desc" } }),
    db.studioMember.findMany({ orderBy: { createdAt: "asc" } }),
    db.analyticsDaily.findMany({ orderBy: { date: "asc" } }),
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
    team: team.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
    })),
    analytics: analytics.map((a) => ({
      id: a.id,
      date: a.date,
      desktopViews: a.desktopViews,
      mobileViews: a.mobileViews,
      rsvpSubmitted: a.rsvpSubmitted,
      inquiries: a.inquiries,
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

export async function createStudioMember(input: CreateTeamMemberInput) {
  await db.studioMember.create({
    data: {
      name: input.name,
      email: input.email,
      role: input.role,
      title: input.title,
      active: input.active,
    },
  });
  return getStudioDashboardPayload();
}

export async function updateStudioMember(input: UpdateTeamMemberInput) {
  await db.studioMember.update({
    where: { id: input.id },
    data: {
      ...(input.role ? { role: input.role } : {}),
      ...(typeof input.active === "boolean" ? { active: input.active } : {}),
    },
  });
  return getStudioDashboardPayload();
}

export async function deleteStudioMember(id: string) {
  await db.studioMember.delete({ where: { id } });
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
