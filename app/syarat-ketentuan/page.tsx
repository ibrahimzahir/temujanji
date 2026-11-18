import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description:
    "Syarat dan Ketentuan penggunaan layanan undangan pernikahan digital Temu Janji Studio, pemesanan Shopee, revisi kurator, dan hak cipta.",
};

export default function TermsPage() {
  return (
    <section className="shell section" style={{ paddingTop: 120, paddingBottom: 72 }}>
      <p className="eyebrow">
        <span /> DOKUMEN LEGAL · KETENTUAN LAYANAN
      </p>
      <h1 style={{ fontSize: "clamp(36px, 4.5vw, 56px)", marginBottom: 16 }}>
        Syarat &amp; <em>Ketentuan</em>
      </h1>
      <p style={{ maxWidth: 680, color: "var(--ink-muted)", marginBottom: 32 }}>
        Dengan memesan melalui situs Temu Janji Studio maupun toko resmi Shopee kami,
        Anda menyetujui ketentuan layanan berikut.
      </p>

      <div className="stack" style={{ maxWidth: 780, gap: 24 }}>
        <div>
          <h3>1. Layanan Kurasi Done-For-You</h3>
          <p style={{ color: "var(--ink-muted)" }}>
            Seluruh paket (Paket Inti, Paket Cerita, Paket Pusaka) mencakup penyusunan
            tata letak oleh desainer studio dalam 1×24 jam setelah materi lengkap diterima,
            tautan tamu personal tak terbatas, serta revisi teks dan jadwal hingga hari H.
          </p>
        </div>

        <div>
          <h3>2. Pemesanan Melalui Shopee &amp; Pembayaran</h3>
          <p style={{ color: "var(--ink-muted)" }}>
            Pesanan yang dilakukan melalui Shopee akan diproses setelah status pembayaran
            terkonfirmasi dan formulir detail acara dikirimkan. Pengiriman fisik (jika
            disyaratkan oleh kategori produk) berupa kartu ucapan/invoice resmi studio,
            sementara tautan undangan digital aktif dikirim melalui Ruang Klien &amp; WhatsApp.
          </p>
        </div>

        <div>
          <h3>3. Hak Kekayaan Intelektual</h3>
          <p style={{ color: "var(--ink-muted)" }}>
            Seluruh ilustrasi botani, animasi parallax, tipografi terkurasi, dan kode
            antarmuka merupakan hak milik Temu Janji Studio. Lisensi penggunaan diberikan
            untuk satu rangkaian acara pernikahan per pesanan.
          </p>
        </div>

        <div>
          <h3>4. Masa Aktif &amp; Dukungan</h3>
          <p style={{ color: "var(--ink-muted)" }}>
            Undangan digital aktif minimal 12 bulan sejak tanggal publikasi dan dilindungi
            backup harian otomatis. Untuk pertanyaan legal atau kendala teknis, hubungi
            studio@temujanji.id.
          </p>
        </div>
      </div>
    </section>
  );
}
