"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

export function LineDrawingScroll() {
  const containerRef = useRef<HTMLDivElement>(null);

  // 180vh runway provides a buttery-smooth, responsive pen drawing experience
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 26,
    mass: 0.4,
    restDelta: 0.001
  });

  // --------------------------------------------------------------------------
  // PEN DRAWING SCROLL PROGRESSION:
  // Phase 1 (0.00 -> 0.15): Blank canvas waiting on warm ambient background
  // Phase 2 (0.15 -> 0.75): Fountain pen draws continuous ink silhouette of modest Islamic bride & groom
  // Phase 3 (0.75 -> 0.90): Tuxedo blacks and watercolor details bloom to 100% completion
  // Phase 4 (0.90 -> 1.00): Pen lifts with golden sparkle; couple title appears
  // --------------------------------------------------------------------------

  // Progressive reveal clip path (sweeps smoothly from left to right as the pen draws)
  const clipInset = useTransform(smoothProgress, [0.15, 0.75], [100, 0]);
  const clipPath = useTransform(clipInset, (val) => `inset(0 ${val}% 0 0)`);

  // Pen nib position along the drawing path
  // Follows the sweep across the couple's gown, hijab, and tuxedo
  const penX = useTransform(
    smoothProgress,
    [0.15, 0.28, 0.42, 0.58, 0.75],
    [-240, -140, -40, 60, 240]
  );

  const penY = useTransform(
    smoothProgress,
    [0.15, 0.28, 0.42, 0.58, 0.75],
    [135, 110, -20, -100, 135]
  );

  const penRotate = useTransform(
    smoothProgress,
    [0.15, 0.28, 0.42, 0.58, 0.75],
    [25, 40, -15, -35, 20]
  );

  // Ring visibility: subtly visible at rest (0.45) so users see the starting point, fades out at completion (0.80)
  const penOpacity = useTransform(smoothProgress, [0, 0.15, 0.74, 0.80], [0.45, 1, 1, 0]);

  // Deep fill enhancement and watercolor bloom as drawing completes
  const fullArtworkOpacity = useTransform(smoothProgress, [0.70, 0.85], [0.85, 1]);
  const completedColorOpacity = useTransform(smoothProgress, [0.75, 0.90], [0, 1]);
  const completedGlowOpacity = useTransform(smoothProgress, [0.75, 0.90], [0, 0.65]);

  // Narrative text stages
  const text1Opacity = useTransform(smoothProgress, [0, 0.15, 0.25], [1, 1, 0]);
  const text2Opacity = useTransform(smoothProgress, [0.25, 0.48, 0.68], [0, 1, 0]);
  const text3Opacity = useTransform(smoothProgress, [0.72, 0.88], [0, 1]);
  const text3Y = useTransform(smoothProgress, [0.72, 0.88], [20, 0]);

  return (
    <section className="line-drawing-runway" ref={containerRef}>
      <div className="line-drawing-sticky">
        {/* Soft parchment paper lighting background */}
        <div className="line-drawing-ambient" aria-hidden />

        {/* Narrative Header Bar */}
        <div className="shell line-drawing-header">
          <p className="eyebrow" style={{ justifyContent: "center" }}>
            <span /> SENI GARIS TUNGGAL · SATU TARIKAN PENA
          </p>

          <div className="line-text-stack">
            {/* Phase 1 Text */}
            <motion.div className="line-text-block" style={{ opacity: text1Opacity }}>
              <h2>
                Setiap kisah bermula dari <em>satu goresan pena...</em>
              </h2>
              <p className="line-prompt">
                ↓ Gulir perlahan untuk melihat pena melukiskan siluet mempelai
              </p>
            </motion.div>

            {/* Phase 2 Text */}
            <motion.div
              className="line-text-block absolute-text"
              style={{ opacity: text2Opacity }}
            >
              <h2>
                Satu garis tanpa putus, <em>simbol janji abadi.</em>
              </h2>
              <p className="line-prompt highlight-moss">
                ✦ Mengikuti lekuk anggun hijab mempelai wanita dan keteguhan jas sang mempelai
              </p>
            </motion.div>

            {/* Phase 3 Text */}
            <motion.div
              className="line-text-block absolute-text"
              style={{ opacity: text3Opacity, y: text3Y }}
            >
              <h2>
                Terukir sempurna dalam <em>keanggunan seni abadi.</em>
              </h2>
              <p className="line-completed-quote">
                &ldquo;Dua raga yang saling menguatkan, terikat dalam satu garis takdir yang tak terpisahkan.&rdquo;
              </p>
            </motion.div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* DRAWING CANVAS STAGE (PURE TRANSPARENT BACKGROUND)                  */}
        {/* ------------------------------------------------------------------ */}
        <div className="line-drawing-canvas perspective-container">
          {/* Golden completed bloom aura */}
          <motion.div
            className="canvas-completed-bloom"
            style={{ opacity: completedGlowOpacity }}
            aria-hidden
          />

          {/* The progressive line drawing artwork */}
          <div className="canvas-artwork-wrap">
            {/* Ghost outline baseline */}
            <div className="ghost-baseline" aria-hidden />

            {/* 0. Faint Ghost Sketch Outline visible on page load so users see what is waiting to be drawn */}
            <div
              className="progressive-artwork-layer"
              style={{ opacity: 0.14, pointerEvents: "none" }}
              aria-hidden
            >
              <Image
                src="/images/line-art-islamic-couple.png"
                alt=""
                width={500}
                height={500}
                priority
                style={{ width: "auto", height: "auto", maxWidth: "100%", objectFit: "contain" }}
              />
            </div>

            {/* 1. Progressive revealed ink artwork (Modest Hijab Bride & Groom) */}
            <motion.div
              className="progressive-artwork-layer"
              style={{
                clipPath,
                opacity: fullArtworkOpacity
              }}
            >
              <Image
                src="/images/line-art-islamic-couple.png"
                alt="Lukisan Garis Tunggal Mempelai Muslim Berhijab Syar'i dan Jas Tuksedo"
                width={500}
                height={500}
                priority
                style={{ width: "auto", height: "auto", maxWidth: "100%", objectFit: "contain" }}
              />
            </motion.div>

            {/* 2. Color Bloom on Drawing Completion */}
            <motion.div
              className="progressive-artwork-layer full-color-reveal"
              style={{
                clipPath,
                opacity: completedColorOpacity
              }}
            >
              <Image
                src="/images/islamic-couple-front-united.png"
                alt="Mempelai Muslim Lengkap dengan Hijab Putih dan Gaun Tertutup"
                width={500}
                height={500}
                priority
                style={{ width: "auto", height: "auto", maxWidth: "100%", objectFit: "contain" }}
              />
            </motion.div>

            {/* Active Sparkling Diamond Ring gliding along the drawing path */}
            <motion.div
              className="active-drawing-pen"
              style={{
                x: penX,
                y: penY,
                rotate: penRotate,
                opacity: penOpacity
              }}
              aria-hidden
            >
              <div className="pen-nib-graphic">
                <Image
                  src="/images/diamond-gold-ring.png"
                  alt=""
                  width={44}
                  height={54}
                  style={{ width: "44px", height: "auto", display: "block" }}
                />
              </div>
              {/* Dynamic diamond sparkle */}
              <div className="pen-ink-sparkle" />
            </motion.div>
          </div>

          {/* Completed artwork title badge */}
          <motion.div
            className="drawing-completed-badge"
            style={{ opacity: text3Opacity }}
          >
            <span className="badge-flourish" />
            <div className="badge-details">
              <h3>Dara Ayu &amp; Rafi Andhika</h3>
              <p>Ilustrasi Garis Klasik · Edisi Eksklusif Pengantin Muslim Temu Janji</p>
            </div>
            <span className="badge-flourish" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
