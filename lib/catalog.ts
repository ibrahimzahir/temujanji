export const categories = [
  "Motion",
  "Motion Adat",
  "Art",
  "Lux Floral",
  "Exclusive",
  "Adat",
  "Islami",
  "Khitanan"
] as const;

export type Category = (typeof categories)[number];

export const templates = [
  {
    slug: "senja-di-taman",
    name: "Senja di Taman",
    category: "Lux Floral",
    image: "/images/garden.jpg",
    color: "#e6e8dd",
    layout: "botanical",
    sample: "Dara & Rafi",
    description: "Nuansa taman yang teduh, dibingkai ilustrasi botani halus dan tipografi klasik abadi.",
    tag: "Terfavorit",
    accent: "#43523d",
    venue: "Plataran Hutan Kota, Jakarta",
    date: "Sabtu, 24 Oktober 2026",
    quote: "Menemukanmu adalah jawaban paling tenang atas setiap doa yang pernah kulangitkan."
  },
  {
    slug: "sejauh-mata",
    name: "Sejauh Mata",
    category: "Motion",
    image: "/images/motion.jpg",
    color: "#eee6db",
    layout: "cinematic",
    sample: "Alya & Niko",
    description: "Potret dramatis dengan gerak parallax lembut yang mengalirkan babak kisah cinta kalian.",
    tag: "Studio Signature",
    accent: "#8c5344",
    venue: "Bumi Samami, Bandung",
    date: "Minggu, 15 November 2026",
    quote: "Dua langkah yang akhirnya sepakat menempuh perjalanan panjang di bawah langit yang sama."
  },
  {
    slug: "aksara-rasa",
    name: "Aksara Rasa",
    category: "Adat",
    image: "/images/details.jpg",
    color: "#eed2c8",
    layout: "framed",
    sample: "Sekar & Dimas",
    description: "Sentuhan anggun tradisi Jawa & Nusantara dengan ruang lapang untuk tata cara keluarga.",
    tag: "Tradisi Agung",
    accent: "#6c4238",
    venue: "Gedung De Majestic, Bandung",
    date: "Sabtu, 05 Desember 2026",
    quote: "Membangun janji suci di atas akar tradisi yang kokoh dan restu keluarga yang tulus."
  },
  {
    slug: "irama-pusaka",
    name: "Irama Pusaka",
    category: "Motion Adat",
    image: "/images/details.jpg",
    color: "#dfc4b1",
    layout: "cinematic",
    sample: "Ayu & Bagas",
    description: "Perayaan tradisi berpadu transisi sinematik modern dan aksen warna keemasan yang hangat.",
    tag: "Motion Adat",
    accent: "#5c3c2f",
    venue: "Pendopo Ageng Pura Mangkunegaran, Surakarta",
    date: "Minggu, 20 Desember 2026",
    quote: "Mengalun seperti tembang lawas, hangat dan menenangkan hati selamanya."
  },
  {
    slug: "lukis-kita",
    name: "Lukis Kita",
    category: "Art",
    image: "/images/garden.jpg",
    color: "#f0dfd6",
    layout: "gallery",
    sample: "Nara & Rian",
    description: "Komposisi puitis berjiwa seni dengan warna pastel lembut, minimalis namun sangat berkesan.",
    tag: "Artistic Edition",
    accent: "#7a554a",
    venue: "Rumah Luwih Beach Resort, Bali",
    date: "Sabtu, 16 Januari 2027",
    quote: "Kisah kita dilukis bukan dengan kata yang rumit, melainkan tatapan yang saling mengerti."
  },
  {
    slug: "satu-halaman",
    name: "Satu Halaman",
    category: "Exclusive",
    image: "/images/motion.jpg",
    color: "#e4e1d7",
    layout: "gallery",
    sample: "Arin & Raka",
    description: "Tata letak editorial kontemporer dengan kurasi foto monokromatis sebagai pusat cerita.",
    tag: "Editorial Lux",
    accent: "#383a34",
    venue: "The Dharmawangsa, Jakarta",
    date: "Minggu, 14 Februari 2027",
    quote: "Dalam satu halaman sederhana ini, kami mengundangmu menjadi saksi babak baru kehidupan kami."
  },
  {
    slug: "dalam-doa",
    name: "Dalam Doa",
    category: "Islami",
    image: "/images/garden.jpg",
    color: "#dae5d5",
    layout: "framed",
    sample: "Zahra & Faris",
    description: "Desain syahdu bernuansa islami untuk merayakan rangkaian akad nikah dan walimatul 'ursy.",
    tag: "Nuansa Syahdu",
    accent: "#3a513b",
    venue: "Masjid Raya Al-Jabbar & Ballroom, Bandung",
    date: "Sabtu, 20 Maret 2027",
    quote: "Dan di antara tanda-tanda kebesaran-Nya diciptakan-Nya untukmu pasangan hidup agar kamu tenteram bersamanya."
  },
  {
    slug: "hari-untukmu",
    name: "Hari Untukmu",
    category: "Khitanan",
    image: "/images/details.jpg",
    color: "#ede6d1",
    layout: "botanical",
    sample: "Hari Bahagia Arka",
    description: "Undangan hangat penuh syukur untuk merayakan langkah baru sang putra bersama keluarga besar.",
    tag: "Syukuran Keluarga",
    accent: "#5a5038",
    venue: "Sasana Kriya TMII, Jakarta",
    date: "Minggu, 11 April 2027",
    quote: "Ungkapan rasa syukur dan doa terbaik atas langkah kedewasaan ananda tercinta."
  }
] as const;

export const packages = [
  {
    id: "inti",
    name: "Paket Inti",
    price: 149000,
    badge: "Esensial",
    popular: false,
    description: "Undangan digital mobile-first lengkap dengan RSVP terintegrasi, tautan tamu personal, dan disiapkan langsung oleh kurator studio.",
    features: [
      "Undangan digital responsif mobile-first",
      "Tautan personal tak terbatas per nama tamu",
      "RSVP real-time & buku tamu digital interaktif",
      "Hitung mundur acara & navigasi Google Maps",
      "Bebas revisi teks dan jadwal hingga terbit",
      "100% tata letak dirapikan oleh desainer studio"
    ]
  },
  {
    id: "cerita",
    name: "Paket Cerita",
    price: 249000,
    badge: "Paling Diminati · Rekomendasi Studio",
    popular: true,
    description: "Koleksi paling sempurna bagi pasangan yang menginginkan perayaan berkelas dengan galeri foto terkurasi, musik latar, dan animasi gerak halus.",
    features: [
      "Semua keunggulan dalam Paket Inti",
      "Kurasi galeri foto editorial (hingga 10 potret)",
      "Animasi Motion Parallax & transisi sinematik",
      "Musik latar romantis berlisensi studio",
      "Kisah cinta puitis (Love Story timeline)",
      "Buku panduan etiket sebar undangan WhatsApp",
      "Dukungan prioritas dari kurator hingga hari H"
    ]
  }
] as const;

export const rupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);
