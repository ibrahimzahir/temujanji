import { packages as defaultCatalogPackages } from "@/lib/catalog";

export interface ProcessStep {
  title: string;
  description: string;
}

export interface ManagedPackage {
  id: string;
  name: string;
  price: number;
  popular: boolean;
  badge?: string;
  description: string;
  features: string[];
}

export interface TestimonialItem {
  quote: string;
  author: string;
  location: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface SiteSectionsData {
  process: {
    eyebrow: string;
    titleLine1: string;
    titleHighlight: string;
    description: string;
    steps: ProcessStep[];
  };
  packages: {
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
    items: ManagedPackage[];
  };
  testimonials: {
    eyebrow: string;
    titleLine1: string;
    titleHighlight: string;
    items: TestimonialItem[];
  };
  faq: {
    eyebrow: string;
    title: string;
    items: FaqItem[];
  };
  footer: {
    tagline: string;
    copyright: string;
    bottomQuote: string;
    links: FooterLink[];
  };
}

export const DEFAULT_SITE_SECTIONS: SiteSectionsData = {
  process: {
    eyebrow: "CARA PESAN · MUDAH & TENANG",
    titleLine1: "Dari desain hingga",
    titleHighlight: "siap dibagikan ke para tamu.",
    description:
      "Kami paham betapa padatnya masa-masa persiapan pernikahan. Temu Janji hadir agar kalian tidak perlu repot mengatur tata letak teknis sendiri.",
    steps: [
      {
        title: "01. Pilih Desain & Paket",
        description:
          "Temukan desain yang pas di hati dan pilih paket yang sesuai kebutuhan galeri serta musik latar kalian."
      },
      {
        title: "02. Kirim Detail Acara",
        description:
          "Cukup kirimkan nama mempelai, tanggal acara, lokasi, dan foto favorit kalian. Kurator studio kami akan langsung menyusun dan menyelaraskan setiap detailnya."
      },
      {
        title: "03. Bagikan ke Tamu Tercinta",
        description:
          "Buat tautan personal dengan nama masing-masing tamu secara tak terbatas, lalu pantau konfirmasi kehadiran (RSVP) dan ucapan doa di Ruang Klien kalian."
      }
    ]
  },
  packages: {
    title: "Pilihan Paket",
    subtitle: "Biaya transparan sekali bayar untuk seluruh rangkaian acara kalian.",
    ctaLabel: "Pilih desain favorit",
    ctaHref: "#koleksi",
    items: defaultCatalogPackages.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      popular: Boolean("popular" in p && p.popular),
      badge: "badge" in p ? p.badge : undefined,
      description: p.description,
      features: [...p.features]
    }))
  },
  testimonials: {
    eyebrow: "KISAH BAHAGIA DARI MEMPELAI",
    titleLine1: "Kata mereka yang telah",
    titleHighlight: "mempercayakan harinya.",
    items: [
      {
        quote:
          "“Tamu-tamu kami banyak yang memuji betapa mewahnya undangan ini. Rasanya sangat personal saat nama mereka muncul di amplop segel lilin.”",
        author: "Nadia & Reza",
        location: "Pernikahan di Bandung"
      },
      {
        quote:
          "“Pelayanan studio sangat hangat dan profesional. Kami tidak perlu repot utak-atik sendiri, hasil jadinya sangat estetik dan rapi sempurna.”",
        author: "Dara & Rafi",
        location: "Pernikahan di Jakarta"
      },
      {
        quote:
          "“Fitur tautan nama tamu tak terbatas dan rekap RSVP di Ruang Klien sangat membantu tim keluarga kami saat menghitung kapasitas catering.”",
        author: "Sekar & Dimas",
        location: "Pernikahan di Yogyakarta"
      }
    ]
  },
  faq: {
    eyebrow: "JAWABAN STUDIO",
    title: "Pertanyaan yang sering diajukan.",
    items: [
      {
        question: "Berapa lama proses pembuatan undangan oleh studio?",
        answer:
          "Setelah kalian mengirimkan detail acara dan foto melalui formulir pesanan, tim kurator studio kami akan menyelesaikan draf pertama dalam 1×24 jam untuk kalian review."
      },
      {
        question: "Apakah kami bisa mengajukan revisi jika ada perubahan jadwal?",
        answer:
          "Tentu. Kami memberikan jaminan revisi teks, waktu, maupun lokasi hingga hari H pernikahan kalian agar kalian tetap tenang menghadapi penyesuaian acara."
      },
      {
        question: "Bagaimana cara membuat tautan dengan nama tamu berbeda?",
        answer:
          "Sangat mudah! Di Ruang Klien Temu Janji, kalian cukup mengetikkan daftar nama kerabat, dan sistem akan menghasilkan tautan personal khusus yang siap disalin ke WhatsApp."
      },
      {
        question: "Apakah ada batasan jumlah tamu yang bisa diundang?",
        answer:
          "Sama sekali tidak ada batasan. Satu pesanan dapat kalian gunakan untuk mengundang puluhan, ratusan, hingga ribuan tamu tanpa dikenakan biaya tambahan."
      }
    ]
  },
  footer: {
    tagline:
      "Studio undangan digital berkelas untuk pernikahan dan syukuran keluarga di Indonesia.",
    copyright: "© 2026 Temu Janji Studio. Hak Cipta Dilindungi.",
    bottomQuote: "Dibuat dengan cinta dan ketelitian untuk hari bahagia kalian.",
    links: [
      { label: "Koleksi", href: "/#koleksi" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Pengalaman Tamu", href: "/#pengalaman-tamu" },
      { label: "Paket Harga", href: "/#proses" },
      { label: "Ruang Klien", href: "/akun" }
    ]
  }
};
