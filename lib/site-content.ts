export type StudioRole = "admin" | "dev" | "editor";

export interface HeroContent {
  eyebrow: string;
  titleLine1: string;
  titleHighlight: string;
  lead: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  proofRating: string;
  proofText: string;
}

export const HERO_STORAGE_KEY = "temujanji_hero_content_v1";
export const ROLE_STORAGE_KEY = "temujanji_studio_role_v1";

export const DEFAULT_HERO_CONTENT: HeroContent = {
  eyebrow: "TEMU JANJI · STUDIO UNDANGAN DIGITAL INDONESIA",
  titleLine1: "Satu kisah kasih,",
  titleHighlight: "satu janji yang abadi.",
  lead: "Undangan pernikahan digital bernuansa hangat dan intim. Mengalirkan rasa hormat kepada keluarga, menyapa setiap tamu dengan nama mereka, dan merayakan awal perjalanan suci kalian berdua dengan sentuhan seni botani abadi.",
  primaryCtaLabel: "Pilih Desain Kalian",
  primaryCtaHref: "#koleksi",
  secondaryCtaLabel: "Coba Personalisasi Nama",
  secondaryCtaHref: "#kustomisasi",
  proofRating: "★★★★★",
  proofText: "Dipercaya oleh 1.400+ pasangan dengan kurasi done-for-you bebas repot."
};

export const ROLE_PERMISSIONS: Record<
  StudioRole,
  {
    label: string;
    badge: string;
    description: string;
    canEditHero: boolean;
    canManageOrders: boolean;
    canManageRoles: boolean;
    canManageDevConfig: boolean;
  }
> = {
  admin: {
    label: "Admin",
    badge: "Akses Penuh",
    description: "Mengelola seluruh konten Hero, pesanan klien, harga paket, tim, dan konfigurasi studio.",
    canEditHero: true,
    canManageOrders: true,
    canManageRoles: true,
    canManageDevConfig: true
  },
  dev: {
    label: "Developer",
    badge: "Teknis & Sistem",
    description: "Mengelola konten Hero, token desain, integrasi API, webhook, dan status build.",
    canEditHero: true,
    canManageOrders: true,
    canManageRoles: false,
    canManageDevConfig: true
  },
  editor: {
    label: "Editor",
    badge: "Kurator Konten",
    description: "Menyunting teks Hero, tombol CTA, pratinjau undangan, dan daftar tamu.",
    canEditHero: true,
    canManageOrders: true,
    canManageRoles: false,
    canManageDevConfig: false
  }
};
