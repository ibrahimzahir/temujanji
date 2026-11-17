"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function DemoOpening({
  image,
  title,
  eventLabel,
  venue = "Plataran Hutan Kota, Jakarta",
  eventDate = "2027-06-19",
  dateFormatted = "Sabtu, 19 Juni 2027",
  children
}: {
  image: string;
  title: string;
  eventLabel: string;
  venue?: string;
  eventDate?: string;
  dateFormatted?: string;
  children: React.ReactNode;
}) {
  const [opened, setOpened] = useState(false);
  const [playingMusic, setPlayingMusic] = useState(true);
  const [rsvpStatus, setRsvpStatus] = useState<string | null>(null);
  const [mockWish, setMockWish] = useState("");
  const [wishSent, setWishSent] = useState(false);
  const invitationRef = useRef<HTMLDivElement>(null);

  // Dynamic countdown calculations
  const [timeLeft, setTimeLeft] = useState({
    days: 184,
    hours: 12,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    if (opened) {
      invitationRef.current?.focus();
    }
  }, [opened]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (opened) {
    return (
      <div className="demo-opened" ref={invitationRef} tabIndex={-1}>
        {/* Ambient music bar simulator */}
        <div className="demo-ambient-bar">
          <span className="music-title">
            <span aria-hidden>{playingMusic ? "♫" : "⏸"}</span>
            <span>Musik Latar: <em>Temu Bahagia (Acoustic Strings)</em></span>
          </span>
          <button
            type="button"
            onClick={() => setPlayingMusic(!playingMusic)}
            style={{ color: "#ffffff", fontSize: 11, textDecoration: "underline" }}
          >
            {playingMusic ? "Heningkan" : "Putar Musik"}
          </button>
        </div>

        {/* Children contains the InvitationCover and base date */}
        {children}

        {/* Countdown to Wedding Day */}
        <div className="demo-date">
          <p className="city">Hitung Mundur Hari Bahagia</p>
          <h2>Menuju Janji Suci.</h2>
          <time dateTime={eventDate}>{dateFormatted}</time>

          <div className="demo-countdown" aria-label="Waktu tersisa menuju hari bahagia">
            <div className="countdown-box">
              <span className="num">{timeLeft.days}</span>
              <span className="unit">Hari</span>
            </div>
            <div className="countdown-box">
              <span className="num">{timeLeft.hours}</span>
              <span className="unit">Jam</span>
            </div>
            <div className="countdown-box">
              <span className="num">{timeLeft.minutes}</span>
              <span className="unit">Menit</span>
            </div>
            <div className="countdown-box">
              <span className="num">{timeLeft.seconds}</span>
              <span className="unit">Detik</span>
            </div>
          </div>

          {/* Event Rundown */}
          <div className="demo-schedule">
            <div className="schedule-card">
              <h4>Akad Nikah</h4>
              <p className="time">08.00 – 10.00 WIB</p>
              <p className="location">{venue}</p>
            </div>
            <div className="schedule-card">
              <h4>Resepsi Pernikahan</h4>
              <p className="time">11.00 – 14.00 WIB</p>
              <p className="location">{venue}</p>
            </div>
          </div>
        </div>

        {/* Interactive RSVP Guest Simulator */}
        <div className="panel" style={{ textAlign: "left", marginTop: 20 }}>
          <p className="eyebrow"><span /> SIMULASI RSVP TAMU</p>
          <h3 style={{ fontSize: 24, marginBottom: 8 }}>Konfirmasi Kehadiran</h3>
          <p style={{ fontSize: 13, color: "var(--ink-muted)", marginBottom: 16 }}>
            Ini adalah tampilan formulir RSVP yang akan diisi oleh para tamu saat menerima tautan khusus dari kalian.
          </p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <button
              type="button"
              className={`button ${rsvpStatus === "hadir" ? "" : "button-outline"}`}
              style={{ minHeight: 38, fontSize: 12, padding: "8px 16px" }}
              onClick={() => setRsvpStatus("hadir")}
            >
              ✓ Ya, Saya Akan Hadir
            </button>
            <button
              type="button"
              className={`button ${rsvpStatus === "tidak" ? "" : "button-outline"}`}
              style={{ minHeight: 38, fontSize: 12, padding: "8px 16px" }}
              onClick={() => setRsvpStatus("tidak")}
            >
              ✕ Maaf, Berhalangan
            </button>
          </div>

          {rsvpStatus && (
            <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600 }}>
                Kirim Ucapan & Doa Hangat:
                <textarea
                  rows={2}
                  placeholder="Tuliskan ucapan selamat untuk kedua mempelai..."
                  value={mockWish}
                  onChange={(e) => setMockWish(e.target.value)}
                  style={{ marginTop: 4 }}
                />
              </label>
              <div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setWishSent(true)}
                  disabled={wishSent}
                >
                  {wishSent ? "Ucapan Terkirim ✓" : "Kirim Ucapan"}
                </Button>
                {wishSent && (
                  <span style={{ fontSize: 12, color: "var(--moss)", marginLeft: 12 }}>
                    Tersimpan di buku tamu digital mempelai!
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Re-seal option */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button
            type="button"
            className="studio-text-link"
            onClick={() => {
              setOpened(false);
              setWishSent(false);
              setRsvpStatus(null);
            }}
          >
            ← Tutup dan segel kembali amplop
          </button>
        </div>
      </div>
    );
  }

  // Closed envelope state with authentic wax seal
  return (
    <div className="demo-envelope">
      <Image
        src={image}
        alt=""
        fill
        sizes="(max-width: 700px) 94vw, 680px"
        priority
      />
      <div className="demo-envelope-paper">
        <p className="demo-event-label">{eventLabel}</p>
        <h1>{title}</h1>
        <p className="demo-guest-line">
          Kepada Yth. Tamu Undangan Terhormat
        </p>

        {/* Tactile Wax Seal Button */}
        <div className="wax-seal-wrapper">
          <button
            type="button"
            className="wax-seal-btn"
            onClick={() => setOpened(true)}
            aria-label="Buka undangan dengan memecah segel lilin"
            title="Ketuk segel untuk membuka"
          >
            <span>TJ</span>
          </button>
          <span className="wax-seal-hint">Ketuk segel untuk membuka ↗</span>
        </div>
      </div>
    </div>
  );
}
