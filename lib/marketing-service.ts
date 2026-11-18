import { db } from "@/lib/db";
import type {
  CreatePinterestPinInput,
  GeneratePinterestPinInput,
  PinterestPinRecordDTO,
  UpdatePinterestPinInput,
} from "@/lib/schemas/studio";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://temujanji.id";

const THEME_META: Record<
  string,
  { name: string; image: string; vibe: string }
> = {
  "senja-di-taman": {
    name: "Senja di Taman",
    image: "/images/garden.jpg",
    vibe: "botani hangat dan segel lilin ungu plum",
  },
  "sejauh-mata": {
    name: "Sejauh Mata",
    image: "/images/motion.jpg",
    vibe: "animasi sinematik dan galeri foto editorial",
  },
  "irama-pusaka": {
    name: "Irama Pusaka",
    image: "/images/hero.jpg",
    vibe: "sentuhan adat Nusantara modern dan tipografi klasik",
  },
  "aksara-rasa": {
    name: "Aksara Rasa",
    image: "/images/details.jpg",
    vibe: "minimalis intim dengan kaligrafi puitis",
  },
};

export async function ensurePinterestSeeded() {
  const count = await db.pinterestPin.count();
  if (count > 0) return;

  const now = Date.now();
  await db.pinterestPin.createMany({
    data: [
      {
        title: "Undangan Pernikahan Digital Senja di Taman · Segel Lilin & Botani",
        description:
          "Rayakan momen suci dengan undangan digital bernuansa botani hangat, RSVP real-time, dan tautan nama tamu tak terbatas. Kurasi done-for-you 1×24 jam · Pesan via Temu Janji & Shopee.",
        board: "Undangan Pernikahan Digital Elegan",
        designSlug: "senja-di-taman",
        imageUrl: "/images/garden.jpg",
        destinationUrl: `${SITE_URL}/desain/senja-di-taman?utm_source=pinterest&utm_medium=pin&utm_campaign=senja`,
        keywords: "undangan pernikahan digital, undangan botani, wedding invitation indonesia",
        status: "SCHEDULED",
        scheduledAt: new Date(now + 3600_000 * 6),
      },
      {
        title: "Inspirasi Undangan Adat Modern · Tema Irama Pusaka",
        description:
          "Perpaduan sakral adat Jawa & estetika modern untuk akad dan resepsi. Dilengkapi hitung mundur acara, Google Maps, dan buku tamu digital.",
        board: "Inspirasi Akad & Resepsi Adat",
        designSlug: "irama-pusaka",
        imageUrl: "/images/hero.jpg",
        destinationUrl: `${SITE_URL}/desain/irama-pusaka?utm_source=pinterest&utm_medium=pin&utm_campaign=pusaka`,
        keywords: "undangan adat jawa, undangan pernikahan elegan, temu janji",
        status: "SCHEDULED",
        scheduledAt: new Date(now + 3600_000 * 24),
      },
      {
        title: "Undangan Digital Motion Parallax · Sejauh Mata (Shopee Ready)",
        description:
          "Galeri prewedding hingga 10 potret dengan transisi halus dan musik latar berlisensi. Mulai Rp 149rb, bebas revisi hingga hari H.",
        board: "Tema Botani & Ungu Plum",
        designSlug: "sejauh-mata",
        imageUrl: "/images/motion.jpg",
        destinationUrl: `${SITE_URL}/desain/sejauh-mata?utm_source=pinterest&utm_medium=pin&utm_campaign=motion`,
        keywords: "undangan digital shopee, undangan parallax, rsvp online",
        status: "PUBLISHED",
        scheduledAt: new Date(now - 3600_000 * 12),
        publishedAt: new Date(now - 3600_000 * 12),
      },
    ],
  });
}

export async function listPinterestPins(): Promise<PinterestPinRecordDTO[]> {
  await ensurePinterestSeeded();
  const rows = await db.pinterestPin.findMany({
    orderBy: { scheduledAt: "asc" },
  });
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    board: r.board,
    designSlug: r.designSlug,
    imageUrl: r.imageUrl,
    destinationUrl: r.destinationUrl,
    keywords: r.keywords,
    status: r.status as PinterestPinRecordDTO["status"],
    scheduledAt: r.scheduledAt.toISOString(),
    publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null,
  }));
}

export async function generateAndSavePinterestPin(
  input: GeneratePinterestPinInput,
  actorRole: string
) {
  const theme = THEME_META[input.designSlug] ?? {
    name: input.designSlug,
    image: "/images/garden.jpg",
    vibe: "estetika botani mewah dan tipografi klasik",
  };

  const angleMap: Record<GeneratePinterestPinInput["angle"], { title: string; desc: string; kw: string }> = {
    romantis: {
      title: `Undangan Pernikahan Digital ${theme.name} · Nuansa Romantis & Intim`,
      desc: `Sapa setiap tamu dengan nama mereka sendiri melalui ${theme.name} (${theme.vibe}). Lengkap dengan RSVP real-time, Google Maps, dan kurasi desainer studio 1×24 jam.`,
      kw: "undangan pernikahan digital, undangan romantis, temu janji studio, rsvp online",
    },
    adat: {
      title: `Inspirasi Undangan Akad & Resepsi · ${theme.name} oleh Temu Janji`,
      desc: `Menghormati tradisi keluarga dalam balutan desain modern. ${theme.name} menghadirkan ${theme.vibe} serta tautan tamu WhatsApp tak terbatas.`,
      kw: "undangan akad nikah, undangan adat modern, undangan digital indonesia",
    },
    minimalis: {
      title: `Desain Undangan Minimalis Eksklusif · ${theme.name}`,
      desc: `Tampilan bersih, ringan di semua ponsel tamu, dan bebas repot diatur sendiri. Dikerjakan langsung oleh kurator Temu Janji Studio.`,
      kw: "undangan minimalis, wedding website indonesia, undangan elegan",
    },
    "promo-shopee": {
      title: `Paket Undangan Digital ${theme.name} · Mulai Rp 149rb di Shopee & Web`,
      desc: `Sekali bayar tanpa biaya tersembunyi! Bebas revisi teks & jadwal hingga hari H, lengkap dengan Ruang Klien untuk pantau RSVP. Cek demo & pesan di Shopee Temu Janji.`,
      kw: "undangan digital shopee, jasa undangan pernikahan murah, temu janji",
    },
  };

  const copy = angleMap[input.angle];
  await db.pinterestPin.create({
    data: {
      title: copy.title,
      description: copy.desc,
      board: input.board,
      designSlug: input.designSlug,
      imageUrl: theme.image,
      destinationUrl: `${SITE_URL}/desain/${input.designSlug}?utm_source=pinterest&utm_medium=pin&utm_campaign=${input.angle}`,
      keywords: copy.kw,
      status: "SCHEDULED",
      scheduledAt: new Date(input.scheduledAt),
    },
  });

  await db.auditLog.create({
    data: {
      actorRole,
      action: "PINTEREST_PIN_GENERATED",
      target: input.designSlug,
      detail: `Antigravity menghasilkan Pin Pinterest terjadwal untuk board "${input.board}".`,
    },
  });

  return listPinterestPins();
}

export async function createPinterestPin(
  input: CreatePinterestPinInput,
  actorRole: string
) {
  await db.pinterestPin.create({
    data: {
      title: input.title,
      description: input.description,
      board: input.board,
      designSlug: input.designSlug,
      imageUrl: input.imageUrl,
      destinationUrl: input.destinationUrl,
      keywords: input.keywords,
      status: "SCHEDULED",
      scheduledAt: new Date(input.scheduledAt),
    },
  });

  await db.auditLog.create({
    data: {
      actorRole,
      action: "PINTEREST_PIN_SCHEDULED",
      target: input.designSlug,
      detail: `Pin "${input.title}" dijadwalkan untuk ${input.scheduledAt}.`,
    },
  });

  return listPinterestPins();
}

export async function updatePinterestPin(
  input: UpdatePinterestPinInput,
  actorRole: string
) {
  await db.pinterestPin.update({
    where: { id: input.id },
    data: {
      ...(input.status ? { status: input.status } : {}),
      ...(input.status === "PUBLISHED" ? { publishedAt: new Date() } : {}),
      ...(input.scheduledAt ? { scheduledAt: new Date(input.scheduledAt) } : {}),
    },
  });

  await db.auditLog.create({
    data: {
      actorRole,
      action: "PINTEREST_PIN_UPDATED",
      target: input.id,
      detail: `Status Pin diperbarui menjadi ${input.status ?? "SCHEDULED"}.`,
    },
  });

  return listPinterestPins();
}

export async function deletePinterestPin(id: string) {
  await db.pinterestPin.delete({ where: { id } });
  return listPinterestPins();
}

export async function publishDuePinterestPins(actorRole = "cron") {
  const now = new Date();
  const due = await db.pinterestPin.findMany({
    where: {
      status: "SCHEDULED",
      scheduledAt: { lte: now },
    },
  });

  if (due.length > 0) {
    await db.pinterestPin.updateMany({
      where: { id: { in: due.map((d) => d.id) } },
      data: { status: "PUBLISHED", publishedAt: now },
    });

    await db.auditLog.create({
      data: {
        actorRole,
        action: "PINTEREST_AUTO_PUBLISHED",
        target: "PinterestPin",
        detail: `${due.length} Pin Pinterest jatuh tempo dipublikasikan otomatis oleh scheduler.`,
      },
    });
  }

  return { publishedCount: due.length, pins: await listPinterestPins() };
}
