"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Button } from "@/components/ui/button";

export function ScrollEnvelopeExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeEdition, setActiveEdition] = useState<"sepia" | "blush">("sepia");

  // 240vh runway gives generous, tactile control over every stage of unsealing
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

  // --------------------------------------------------------------------------
  // MULTI-STAGE SCROLL PROGRESSION:
  // Stage 1 (0.00 -> 0.20): Sealed envelope on luxury velvet with wax seal
  // Stage 2 (0.20 -> 0.45): Flap unseals in 3D, card glides up PARTIALLY (peek)
  // Stage 3 (0.45 -> 0.75): Card glides completely out of pocket & floats in 3D
  // Stage 4 (0.75 -> 1.00): Steady presentation with full details & studio action
  // --------------------------------------------------------------------------

  // Wax seal release & lift
  const sealScale = useTransform(smoothProgress, [0.05, 0.20, 0.32], [1, 1.2, 0]);
  const sealOpacity = useTransform(smoothProgress, [0.05, 0.22, 0.32], [1, 1, 0]);
  const sealY = useTransform(smoothProgress, [0.05, 0.22], [0, -18]);

  // Flap 3D fold-back rotation (hinged at top center)
  const flapRotateX = useTransform(smoothProgress, [0.08, 0.28], [0, -175]);
  const flapShadowOpacity = useTransform(smoothProgress, [0.08, 0.26], [0.35, 0]);

  // Flap Z-Index: starts in front of card (z: 22), flips behind the envelope back (z: 2)
  const flapZIndex = useTransform(smoothProgress, [0.08, 0.20], [22, 2]);

  // Card Y Movement:
  // Starts inside pocket (160px) -> pops up partially (30px) -> pops up fully (-150px)
  const cardY = useTransform(
    smoothProgress,
    [0.18, 0.38, 0.46, 0.74, 1.0],
    [160, 30, 30, -150, -150]
  );

  // Card Scale: snug in pocket -> gentle peek -> full grand presentation
  const cardScale = useTransform(
    smoothProgress,
    [0.18, 0.38, 0.46, 0.74, 1.0],
    [0.88, 0.93, 0.93, 1.02, 1.02]
  );

  // Card 3D Tilt: lifts forward toward viewer as it clears the pocket
  const cardRotateX = useTransform(smoothProgress, [0.42, 0.74], [4, 0]);
  const cardZ = useTransform(smoothProgress, [0.42, 0.74], [0, 50]);

  // Dynamic Z-Index elevation: once it clears the front pocket
  const cardZIndex = useTransform(smoothProgress, [0.18, 0.58], [8, 30]);

  // Opacity for the partial pop-up indicator badge
  const partialPeekOpacity = useTransform(smoothProgress, [0.26, 0.38, 0.48], [0, 1, 0]);

  // Opacity for full invitation footer actions
  const fullContentOpacity = useTransform(smoothProgress, [0.60, 0.76], [0, 1]);

  // Gold foil shimmer light line across the card as it emerges
  const foilShimmerX = useTransform(smoothProgress, [0.3, 0.85], ["-120%", "220%"]);
  const foilShimmerOpacity = useTransform(smoothProgress, [0.3, 0.55, 0.85], [0, 0.75, 0]);

  return (
    <section className="scroll-envelope-runway" ref={containerRef}>
      <div className="envelope-sticky-stage">
        {/* Ambient Dark Velvet Backdrop Glow */}
        <div className="velvet-ambient-backdrop" aria-hidden />

        {/* Narrative Headline */}
        <div className="envelope-narrative-header">
          <p className="eyebrow" style={{ color: "#d4af37", justifyContent: "center" }}>
            <span style={{ backgroundColor: "#d4af37" }} /> PENGALAMAN TAMU · BUKA AMPLOP MEWAH
          </p>
          <h2>
            Satu amplop, <em>seribu rasa bahagia.</em>
          </h2>
          <p className="envelope-subtext">
            Gulir perlahan ke bawah untuk menyaksikan segel lilin terbuka dan kartu undangan fisik mewah terangkat keluar.
          </p>

          {/* Interactive Card Edition Switcher */}
          <div className="envelope-edition-switcher">
            <span className="switcher-label">Pilihan Varian Kartu:</span>
            <div className="switcher-buttons">
              <button
                type="button"
                className={`edition-btn ${activeEdition === "sepia" ? "active" : ""}`}
                onClick={() => setActiveEdition("sepia")}
              >
                ✦ Kanopi Peony Putih Gading &amp; Sepia
              </button>
              <button
                type="button"
                className={`edition-btn ${activeEdition === "blush" ? "active" : ""}`}
                onClick={() => setActiveEdition("blush")}
              >
                Mawar Blush &amp; Bingkai Emas
              </button>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 3D LUXURY ENVELOPE ASSEMBLY STAGE                                   */}
        {/* ------------------------------------------------------------------ */}
        <div className="envelope-perspective-viewport">
          <motion.div
            className="envelope-container preserve-3d"
            style={{
              rotateX: 8,
              rotateZ: -1
            }}
          >
            {/* Layer 1: Envelope Base / Back Liner with Golden Botanical Print */}
            <div className="envelope-back-liner">
              <div className="liner-botanical-pattern" aria-hidden />
            </div>

            {/* Layer 2: Foldable Top Flap (Hinged at top, opens in 3D) */}
            <motion.div
              className="envelope-top-flap preserve-3d"
              style={{
                rotateX: flapRotateX,
                zIndex: flapZIndex,
                transformOrigin: "top center"
              }}
            >
              <div className="flap-gold-trim" />
              <motion.div
                className="flap-crease-shadow"
                style={{ opacity: flapShadowOpacity }}
                aria-hidden
              />
              <div className="flap-botanical-ornament" aria-hidden />
            </motion.div>

            {/* Layer 3: Burgundy/Oxblood Wax Seal with Gold Botanical Crest */}
            <motion.div
              className="envelope-wax-seal"
              style={{
                scale: sealScale,
                opacity: sealOpacity,
                y: sealY
              }}
            >
              <div className="seal-emblem burgundy-seal">
                <svg className="seal-botanical-svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C12 2 13 6 16 8C19 10 22 10 22 10C22 10 20 13 18 16C16 19 16 22 16 22C16 22 13 21 11 18C9 15 6 15 6 15C6 15 8 12 10 9C12 6 12 2 12 2Z" />
                </svg>
                <span>TJ</span>
              </div>
            </motion.div>

            {/* -------------------------------------------------------------- */}
            {/* Layer 4: THE EXACT LUXURY BLUSH PEONY INVITATION CARD           */}
            {/* -------------------------------------------------------------- */}
            <motion.div
              className="invitation-slide-card preserve-3d luxury-peony-card"
              style={{
                y: cardY,
                scale: cardScale,
                rotateX: cardRotateX,
                z: cardZ,
                zIndex: cardZIndex
              }}
            >
              <div className="invitation-card-inner">
                {/* PARTIAL TEASER BADGE (Prompts guest to continue scrolling) */}
                <motion.div
                  className="card-partial-indicator"
                  style={{ opacity: partialPeekOpacity }}
                >
                  <span>✦ Terbuka Sebagian · Gulir lagi untuk menarik keluar kartu utuh ↓</span>
                </motion.div>

                {/* THE EXACT WEDDING INVITATION CARD IMAGE */}
                <div className="exact-luxury-card-wrapper">
                  <Image
                    src={
                      activeEdition === "sepia"
                        ? "/images/envelope-luxury-card-sepia.jpg"
                        : "/images/envelope-luxury-card-exact.jpg"
                    }
                    alt={
                      activeEdition === "sepia"
                        ? "Kartu Undangan Mewah Peony Sepia & Putih Gading"
                        : "Kartu Undangan Pernikahan Mewah Mawar Blush & Aksen Emas"
                    }
                    width={613}
                    height={868}
                    priority
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "10px",
                      display: "block"
                    }}
                  />

                  {/* Gold Foil Shimmer Light Reflection Sweep */}
                  <motion.div
                    className="card-foil-shimmer-sweep"
                    style={{
                      x: foilShimmerX,
                      opacity: foilShimmerOpacity
                    }}
                    aria-hidden
                  />
                </div>

                {/* Action Controls when Card is Fully Revealed */}
                <motion.div
                  className="card-full-reveal-actions"
                  style={{ opacity: fullContentOpacity }}
                >
                  <Button size="sm" asChild className="button button-terracotta" style={{ paddingInline: 22 }}>
                    <Link href="/desain/senja-di-taman/preview">
                      Buka Pratinjau Undangan Digital Tamu <span aria-hidden>↗</span>
                    </Link>
                  </Button>
                  <Link href="#koleksi" className="studio-text-link" style={{ fontSize: 12 }}>
                    Lihat 8 koleksi tema lainnya ↓
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Layer 5: Envelope Front Pocket (holds the sliding card inside) */}
            <div className="envelope-front-pocket">
              <div className="pocket-gold-branch-ornament" aria-hidden />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
