"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Button } from "@/components/ui/button";

export function HeroBookOpening() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Live countdown state
  const [timeLeft, setTimeLeft] = useState({
    days: 184,
    hours: 12,
    minutes: 45,
    seconds: 30
  });

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

  // 170vh runway provides a responsive, buttery-smooth physical experience
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.6,
    restDelta: 0.0001
  });

  // 3D Book Transforms
  // 1. Shift book from centering the right-side cover to centering the whole open 2-page spread
  const bookX = useTransform(smoothProgress, [0.06, 0.44], ["-25%", "0%"]);
  const bookScale = useTransform(smoothProgress, [0, 0.44, 0.85, 1], [0.94, 1.02, 1, 0.95]);
  const bookY = useTransform(smoothProgress, [0.8, 1], ["0%", "10%"]);
  const bookOpacity = useTransform(smoothProgress, [0.88, 1], [1, 0.15]);

  // 2. Front cover 3D page flip around left spine (0deg -> -180deg)
  const coverRotateY = useTransform(smoothProgress, [0.08, 0.46], [0, -180]);
  const coverShadow = useTransform(smoothProgress, [0.08, 0.28, 0.46], [0, 0.4, 0]);

  // 3. Header text fade as user scrolls into the opened book
  const headerOpacity = useTransform(smoothProgress, [0, 0.14], [1, 0]);
  const headerY = useTransform(smoothProgress, [0, 0.14], [0, -20]);

  // 4. Inner spread reveal opacity
  const innerContentOpacity = useTransform(smoothProgress, [0.18, 0.48], [0, 1]);

  return (
    <section className="book-hero-runway" ref={containerRef}>
      <div className="book-hero-sticky">
        {/* Ambient Warm Lighting Backdrop */}
        <div className="book-ambient-backdrop" aria-hidden />

        {/* Floating Top Intro Title (fades as book opens) */}
        <motion.div
          className="book-hero-intro"
          style={{ opacity: headerOpacity, y: headerY }}
        >
          <p className="eyebrow" style={{ justifyContent: "center" }}>
            <span /> STUDIO UNDANGAN PERNIKAHAN DIGITAL · INDONESIA
          </p>
          <h1>
            Kisah Bahagia <em>Dimulai Dari Sini.</em>
          </h1>
          <p className="book-scroll-prompt">
            ↓ Gulir ke bawah perlahan untuk membuka lembaran buku pernikahan
          </p>
        </motion.div>

        {/* 3D BOOK STAGE */}
        <div className="book-3d-stage perspective-container">
          <motion.div
            className="book-wrapper preserve-3d"
            style={{
              x: bookX,
              scale: bookScale,
              y: bookY,
              opacity: bookOpacity
            }}
          >
            {/* BOOK BASE / SHADOW */}
            <div className="book-spine-crease" aria-hidden />

            {/* ---------------------------------------------------------------- */}
            {/* LEFT PAGE SPREAD (Revealed underneath the open cover)             */}
            {/* ---------------------------------------------------------------- */}
            <div className="book-page book-page-left">
              <div className="page-paper-texture" />
              <div className="page-border-frame" />

              <motion.div
                className="page-content page-left-content"
                style={{ opacity: innerContentOpacity }}
              >
                {/* Couple Title */}
                <h2 className="couple-book-title">Dara &amp; Rafi</h2>
                <span className="couple-script-sub">The Wedding Celebration</span>

                {/* Parents Blessing Texts (from User's 2nd Image Reference) */}
                <div className="parents-blessing-columns">
                  <div className="parents-col">
                    <span className="col-label">Loving daughter of</span>
                    <strong>Bpk. Ir. Hendra Prasetyo</strong>
                    <span className="mom">&amp; Ibu Maya Wardhani</span>
                  </div>
                  <div className="parents-divider" />
                  <div className="parents-col">
                    <span className="col-label">Loving son of</span>
                    <strong>Bpk. Bambang Soediro</strong>
                    <span className="mom">&amp; Ibu Sri Rahayu</span>
                  </div>
                </div>

                {/* Couple Illustration (The User's Uploaded 2nd Image) */}
                <div className="couple-illustration-frame">
                  <Image
                    src="/images/islamic-couple-front-united.png"
                    alt="Ilustrasi Mempelai Pria dan Wanita"
                    fill
                    sizes="(max-width: 768px) 85vw, 420px"
                    priority
                    style={{ objectFit: "contain", objectPosition: "center bottom" }}
                  />
                </div>

                <p className="couple-page-vow">
                  &ldquo;Dua langkah yang akhirnya sepakat menempuh perjalanan panjang di bawah langit yang sama.&rdquo;
                </p>
              </motion.div>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* RIGHT PAGE SPREAD (Always present on right side)                 */}
            {/* ---------------------------------------------------------------- */}
            <div className="book-page book-page-right">
              <div className="page-paper-texture" />
              <div className="page-border-frame" />

              <div className="page-content page-right-content">
                <span className="book-arabic-quote">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
                <p className="book-holy-verse">
                  &ldquo;Dan di antara tanda-tanda kebesaran-Nya diciptakan-Nya untukmu pasangan hidup
                  agar kamu tenteram bersamanya...&rdquo;
                  <span className="verse-surah">QS. Ar-Rum: 21</span>
                </p>

                <div className="book-ceremony-announcement">
                  <p className="ceremony-eyebrow">UNDANGAN PERNIKAHAN</p>
                  <h3 className="ceremony-date-heading">Sabtu, 24 Oktober 2026</h3>
                  <p className="ceremony-venue-text">
                    Plataran Hutan Kota · Main Garden Lawn, Senayan, Jakarta
                  </p>
                </div>

                {/* Schedule times */}
                <div className="book-schedule-grid">
                  <div className="schedule-item">
                    <span className="sched-label">Akad Nikah</span>
                    <strong>08.00 – 10.00 WIB</strong>
                    <span>Bale Heritage</span>
                  </div>
                  <div className="schedule-item">
                    <span className="sched-label">Resepsi</span>
                    <strong>11.00 – 14.00 WIB</strong>
                    <span>Garden Ballroom</span>
                  </div>
                </div>

                {/* Live Countdown Clock */}
                <div className="book-countdown-strip">
                  <span className="strip-title">Menuju Hari Bahagia:</span>
                  <div className="book-countdown-numbers">
                    <div>
                      <span>{timeLeft.days}</span>
                      <small>Hari</small>
                    </div>
                    <div>
                      <span>{timeLeft.hours}</span>
                      <small>Jam</small>
                    </div>
                    <div>
                      <span>{timeLeft.minutes}</span>
                      <small>Mnt</small>
                    </div>
                    <div>
                      <span>{timeLeft.seconds}</span>
                      <small>Dtk</small>
                    </div>
                  </div>
                </div>

                {/* Page Action Buttons */}
                <div className="book-page-actions">
                  <Button size="sm" asChild className="button button-terracotta">
                    <a href="#koleksi">
                      Jelajahi Koleksi Studio <span aria-hidden>↗</span>
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/desain/senja-di-taman/preview">
                      Coba Pratinjau Tamu
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* 3D TURNING FRONT COVER (Anchored on the left center spine)       */}
            {/* ---------------------------------------------------------------- */}
            <motion.div
              className="book-front-cover preserve-3d"
              style={{
                rotateY: coverRotateY,
                transformOrigin: "left center"
              }}
            >
              {/* FACE 1: Outside of Front Cover (Luxury Hardcover) */}
              <div className="cover-face cover-outside">
                <div className="cover-leather-texture" />
                <div className="cover-gold-foil-border" />

                <div className="cover-typography">
                  <span className="cover-eyebrow">STUDIO UNDANGAN DIGITAL</span>
                  <h2 className="cover-studio-wordmark">
                    temu<span>janji</span><sup>✳</sup>
                  </h2>

                  <div className="cover-gold-crest">
                    <span className="crest-ring" />
                    <span className="crest-initials">TJ</span>
                  </div>

                  <p className="cover-wedding-of">THE WEDDING CELEBRATION OF</p>
                  <h3 className="cover-couple-names">Dara &amp; Rafi</h3>
                  <span className="cover-edition-tag">Buku Kisah Pernikahan · Edisi Eksklusif</span>
                </div>

                {/* Hanging Gold Silk Bookmark Ribbon */}
                <div className="cover-bookmark-ribbon" />
              </div>

              {/* FACE 2: Inside of Front Cover (Vintage Marble Endpaper Lining) */}
              <div className="cover-face cover-inside">
                <div className="cover-endpaper-pattern" />
                <div className="cover-inside-quote">
                  <p>&ldquo;Cinta bukan menemukan seseorang yang sempurna, melainkan melihat ketidaksempurnaan dengan rasa syukur yang utuh.&rdquo;</p>
                  <span>— Temu Janji Studio Curated Story</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
