# Temu Janji Studio — Shopee & Pinterest Growth Playbook & Automation

## 1. Shopee Marketplace Playbook (Primary Sales Channel)

### Store & SKU Architecture
- **Store Name**: `Temu Janji Official Studio`
- **Category**: Jasa & Layanan / Perlengkapan Pesta & Pernikahan -> Undangan Pernikahan Digital
- **3 Core SKUs**:
  1. **Paket Inti (Rp 149.000)** — Undangan mobile-first + RSVP real-time + tautan tamu personal tak terbatas.
  2. **Paket Cerita (Rp 249.000 · Terlaris)** — Semua fitur Paket Inti + Galeri 10 foto + Motion Parallax + Musik latar + Love Story timeline.
  3. **Paket Pusaka (Rp 349.000)** — Kurasi prioritas + Tema eksklusif adat Nusantara + Custom segel lilin & domain/slug khusus.

### Shopee SEO Title Formula
`[1x24 JAM JADI] Undangan Pernikahan Digital Website Elegan Botani Ungu Plum · RSVP & Nama Tamu Tanpa Batas (Temu Janji)`

### Post-Checkout Fulfillment Automation
1. Pembeli checkout di Shopee dan menerima pesan otomatis berisi tautan formulir detail acara (`/pesan/[slug]` atau WhatsApp Studio).
2. Admin/Editor memasukkan pesanan ke **Dashboard -> Pesanan & RSVP** (`/dashboard`) agar status pembayaran (`PAID`) dan progres kurasi (`DRAFT` → `MENUNGGU_RSVP` → `SIAP_TERBIT`) tercatat di PostgreSQL.
3. Desainer studio menyusun undangan dalam **1×24 jam** dan mengirimkan tautan Ruang Klien (`/ruang`) ke pembeli.
4. Shopee Affiliate Kit: berikan komisi 10–15% untuk kreator konten pernikahan yang mengulas demo `/desain/senja-di-taman` dan `/desain/sejauh-mata`.

---

## 2. Pinterest Organic & Automation Playbook

### Board Structure
1. **Undangan Pernikahan Digital Elegan**
2. **Inspirasi Akad & Resepsi Adat**
3. **Tema Botani & Ungu Plum**
4. **Tipografi & Kaligrafi Undangan**

### Creative & UTM Spec
- **Aspect Ratio**: 2:3 vertical (`1000×1500px`) menampilkan kartu amplop ungu plum + ilustrasi pasangan.
- **Destination URL Pattern**:
  `https://temujanji.id/desain/<slug>?utm_source=pinterest&utm_medium=pin&utm_campaign=<angle>`
- **Daily Cadence**: 2–3 Pin terjadwal per hari (09:00 WIB, 14:00 WIB, 19:30 WIB).

### Website-Managed Content Generation & Scheduling Automation
1. Buka **Dashboard -> Marketing & Pinterest** (`/dashboard`).
2. Gunakan **Antigravity Pinterest Generator** untuk membuat judul, deskripsi SEO Indonesia, kata kunci, board, dan URL UTM otomatis dari katalog tema.
3. Jadwalkan tanggal & jam tayang (`SCHEDULED`).
4. Di Hostinger VPS, jalankan cron setiap 15 menit untuk mempublikasikan Pin yang sudah jatuh tempo dan mencatatnya ke `AuditLog`:
   ```bash
   */15 * * * * curl -sf -X POST http://127.0.0.1:3100/api/cron/pinterest >/dev/null
   ```
