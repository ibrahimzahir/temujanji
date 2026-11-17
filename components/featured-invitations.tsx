"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "motion/react";
import Link from "next/link";
import { templates } from "@/lib/catalog";

const featured = [templates[0], templates[1], templates[2], templates[6]];

function getMonogram(title: string): string {
  const parts = title.split(/&|dan|\+/i).map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? "D"}${parts[1][0] ?? "R"}`.toUpperCase();
  }
  return title.slice(0, 2).toUpperCase() || "DR";
}

export function FeaturedInvitations() {
  const [selected, setSelected] = useState(0);
  const [customName, setCustomName] = useState("");
  const design = featured[selected];
  const stageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 26,
    mass: 0.4,
    restDelta: 0.001
  });

  // --------------------------------------------------------------------------
  // DUAL-CARD PURPLE 3D PARALLAX ANIMATIONS
  // --------------------------------------------------------------------------
  const backdropY = useTransform(smoothProgress, [0, 1], [-45, 45]);
  const backdropScale = useTransform(smoothProgress, [0, 1], [1.1, 1.0]);

  // Left Tall Card (Vertical Date & Monogram)
  const leftCardY = useTransform(smoothProgress, [0, 1], [55, -35]);
  const leftCardX = useTransform(smoothProgress, [0, 0.5, 1], [-10, -28, -40]);
  const leftCardRotZ = useTransform(smoothProgress, [0, 1], [-4.5, -1.5]);
  const leftCardScale = useTransform(smoothProgress, [0, 0.5, 1], [0.94, 0.98, 0.95]);

  // Right Tall Card (Couple Calligraphy & Venue)
  const rightCardY = useTransform(smoothProgress, [0, 1], [20, -70]);
  const rightCardX = useTransform(smoothProgress, [0, 0.5, 1], [10, 28, 40]);
  const rightCardRotZ = useTransform(smoothProgress, [0, 1], [2.5, 5]);
  const rightCardScale = useTransform(smoothProgress, [0, 0.5, 1], [0.97, 1.03, 0.99]);

  // 3D Mouse Hover Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springMouseX = useSpring(mouseX, { stiffness: 150, damping: 22 });
  const springMouseY = useSpring(mouseY, { stiffness: 150, damping: 22 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x / 22);
    mouseY.set(-y / 22);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const activeTitle = customName.trim() ? customName.trim() : design.sample;
  const venue = "venue" in design ? design.venue : "Plataran Hutan Kota, Jakarta";
  const dateStr = "date" in design ? design.date : "Sabtu, 24 Oktober 2026";
  const monogram = getMonogram(activeTitle);

  return (
    <div className="featured-invitations">
      {/* Live Name Personalization Input */}
      <div className="personalization-box" style={{ marginBottom: 20 }}>
        <label htmlFor="couple-name-preview">
          ✦ Personalisasi Seketika · Ketik Nama Kalian
        </label>
        <div className="personalization-input-wrapper">
          <input
            id="couple-name-preview"
            type="text"
            placeholder={`contoh: ${design.sample}`}
            value={customName}
            maxLength={35}
            onChange={(e) => setCustomName(e.target.value)}
          />
        </div>
        <p className="personalization-hint">
          Ketik nama kalian berdua untuk melihat kedua kartu undangan ungu berubah seketika.
        </p>
      </div>

      {/* PURPLE DUAL-CARD 3D PARALLAX STAGE */}
      <div
        className="featured-stage purple-dual-stage perspective-container"
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Royal Plum Botanical Engraved Backdrop */}
        <motion.div
          className="purple-dual-backdrop"
          style={{
            y: backdropY,
            scale: backdropScale
          }}
          aria-hidden
        >
          <img
            src="/images/hero-floral-only.svg"
            alt=""
            className="purple-backdrop-floral left"
          />
          <img
            src="/images/hero-floral-only.svg"
            alt=""
            className="purple-backdrop-floral right"
          />
        </motion.div>

        <div className="purple-dual-cards-wrap preserve-3d">
          {/* ============================================================== */}
          {/* CARD 1 (LEFT): MONOGRAM & VERTICAL STACKED DATE                */}
          {/* ============================================================== */}
          <motion.div
            className="purple-tall-card card-left preserve-3d"
            style={{
              x: leftCardX,
              y: leftCardY,
              rotateZ: leftCardRotZ,
              scale: leftCardScale,
              rotateY: springMouseX,
              rotateX: springMouseY,
              zIndex: 5
            }}
          >
            <div className="tall-card-floral-corner top" aria-hidden />
            <div className="tall-card-floral-corner bottom" aria-hidden />

            <div className="tall-card-content">
              <span className="tall-card-monogram">{monogram}</span>

              <div className="tall-card-vertical-date">
                <span className="flourish-top">❦</span>
                <strong>24</strong>
                <i>·</i>
                <strong>10</strong>
                <i>·</i>
                <strong>26</strong>
                <span className="flourish-bot">❦</span>
              </div>

              <p className="tall-card-footer-kicker">
                WEDDING
                <br />
                INVITATION
              </p>
            </div>
          </motion.div>

          {/* ============================================================== */}
          {/* CARD 2 (RIGHT): COUPLE CALLIGRAPHY & INVITATION DETAILS        */}
          {/* ============================================================== */}
          <motion.div
            className="purple-tall-card card-right preserve-3d"
            style={{
              x: rightCardX,
              y: rightCardY,
              rotateZ: rightCardRotZ,
              scale: rightCardScale,
              rotateY: springMouseX,
              rotateX: springMouseY,
              zIndex: 10
            }}
          >
            <div className="tall-card-floral-crest top" aria-hidden />
            <div className="tall-card-floral-crest bottom" aria-hidden />

            <div className="tall-card-content">
              <p className="tall-card-together">
                TOGETHER WITH
                <br />
                THEIR FAMILIES
              </p>

              <span className="tall-card-swirl">~ ✦ ~</span>
              <h3 className="tall-card-names">{activeTitle}</h3>
              <span className="tall-card-swirl">~ ✦ ~</span>

              <p className="tall-card-invite-line">INVITE YOU TO THEIR WEDDING</p>

              <div className="tall-card-venue-box">
                <strong>{venue}</strong>
                <span>{dateStr}</span>
              </div>

              <Link
                className="tall-card-demo-link"
                href={`/desain/${design.slug}/preview`}
                title="Buka pratinjau lengkap"
              >
                <span>Buka Undangan Tamu</span>
                <span aria-hidden>↗</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Theme selector tabs */}
      <div
        className="featured-options"
        role="group"
        aria-label="Pilihan contoh tema undangan"
      >
        {featured.map((item, index) => (
          <button
            key={item.slug}
            type="button"
            aria-pressed={index === selected}
            onClick={() => setSelected(index)}
          >
            {item.name} · <span style={{ opacity: 0.75 }}>{item.category}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
