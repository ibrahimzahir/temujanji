import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description:
    "Kebijakan Privasi Temu Janji Studio sesuai UU Perlindungan Data Pribadi (UU PDP) untuk data pasangan, tamu undangan, dan keamanan akun.",
};

export default function PrivacyPage() {
  return (
    <section className="shell section" style={{ paddingTop: 120, paddingBottom: 72 }}>
      <p className="eyebrow">
        <span /> DOKUMEN LEGAL · PRIVASI DATA
      </p>
      <h1 style={{ fontSize: "clamp(36px, 4.5vw, 56px)", marginBottom: 16 }}>
        Kebijakan <em>Privasi</em>
      </h1>
      <p style={{ maxWidth: 680, color: "var(--ink-muted)", marginBottom: 32 }}>
        Terakhir diperbarui: 17 November 2026. Temu Janji Studio berkomitmen melindungi
        privasi calon pengantin, keluarga, serta seluruh tamu undangan sesuai Undang-Undang
        Perlindungan Data Pribadi (UU No. 27 Tahun 2022).
      </p>

      <div className="stack" style={{ maxWidth: 780, gap: 24 }}>
        <div>
          <h3>1. Data yang Kami Kumpulkan</h3>
          <p style={{ color: "var(--ink-muted)" }}>
            Kami mengumpulkan data yang Anda kirimkan untuk pembuatan undangan digital:
            nama mempelai, nama orang tua, jadwal &amp; lokasi acara, foto galeri, alamat
            email, nomor WhatsApp, serta data konfirmasi kehadiran (RSVP) dan ucapan doa
            dari tamu undangan.
          </p>
        </div>

        <div>
          <h3>2. Keamanan Akun &amp; Verifikasi 2FA</h3>
          <p style={{ color: "var(--ink-muted)" }}>
            Setiap akses akun dilindungi enkripsi kata sandi Argon2id serta verifikasi dua
            faktor (2FA) melalui OTP email (Resend) atau aplikasi autentikator. Seluruh
            lalu lintas dilindungi TLS/HTTPS melalui Cloudflare dan dicatat dalam log audit
            keamanan internal.
          </p>
        </div>

        <div>
          <h3>3. Penggunaan Data &amp; Pihak Ketiga</h3>
          <p style={{ color: "var(--ink-muted)" }}>
            Kami tidak pernah menjual atau membagikan data tamu Anda kepada pihak ketiga
            untuk iklan. Pemrosesan infrastruktur hanya menggunakan layanan tepercaya
            (PostgreSQL terenkripsi, Cloudflare untuk perlindungan DDoS/CDN, dan Resend
            untuk pengiriman kode verifikasi).
          </p>
        </div>

        <div>
          <h3>4. Hak Penghapusan &amp; Retensi Data</h3>
          <p style={{ color: "var(--ink-muted)" }}>
            Anda berhak meminta ekspor, pembaruan, atau penghapusan permanen data acara
            dan daftar tamu kapan saja setelah rangkaian acara selesai dengan menghubungi
            tim kurator studio melalui email resmi studio@temujanji.id.
          </p>
        </div>
      </div>
    </section>
  );
}
