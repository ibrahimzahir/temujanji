"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

const SPRING_CONFIG = {
  stiffness: 130,
  damping: 26,
  mass: 0.4,
  restDelta: 0.001
};

export function CoupleConvergenceScroll() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, SPRING_CONFIG);

  // --------------------------------------------------------------------------
  // 3-ACT CINEMATIC STORY PARALLAX (CLEAN EXIT-THEN-ENTER, ZERO GHOST OVERLAP)
  //
  // ACT I   (0.00 -> 0.315): Titik Temu — Saling mendekat
  // ACT II  (0.305 -> 0.665): Menautkan Janji — Bergandengan tangan
  // ACT III (0.655 -> 1.00): Ikatan Abadi — Dekapan hangat & berkah suci
  // --------------------------------------------------------------------------

  // Interactive Progress Pill Width & Smooth Label Highlights
  const progressMeterWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const step1Highlight = useTransform(smoothProgress, [0, 0.28, 0.33], [1, 1, 0.45]);
  const step2Highlight = useTransform(smoothProgress, [0.28, 0.33, 0.63, 0.68], [0.45, 1, 1, 0.45]);
  const step3Highlight = useTransform(smoothProgress, [0.63, 0.68, 1], [0.45, 1, 1]);

  // --------------------------------------------------------------------------
  // ACT I: TITIK TEMU (SCENE 1)
  // --------------------------------------------------------------------------
  const scene1Opacity = useTransform(smoothProgress, [0, 0.26, 0.315], [1, 1, 0]);
  const scene1Scale = useTransform(smoothProgress, [0, 0.26, 0.315], [0.97, 1.01, 0.95]);
  const scene1Y = useTransform(smoothProgress, [0, 0.26, 0.315], [8, 0, -20]);

  const text1Opacity = useTransform(smoothProgress, [0, 0.24, 0.295], [1, 1, 0]);
  const text1Y = useTransform(smoothProgress, [0, 0.24, 0.295], [0, 0, -12]);

  // --------------------------------------------------------------------------
  // ACT II: MENAUTKAN JANJI (SCENE 2)
  // --------------------------------------------------------------------------
  const scene2Opacity = useTransform(smoothProgress, [0.305, 0.36, 0.61, 0.665], [0, 1, 1, 0]);
  const scene2Scale = useTransform(smoothProgress, [0.305, 0.36, 0.61, 0.665], [0.95, 1.0, 1.02, 0.95]);
  const scene2Y = useTransform(smoothProgress, [0.305, 0.36, 0.61, 0.665], [20, 0, -4, -20]);

  const text2Opacity = useTransform(smoothProgress, [0.32, 0.375, 0.60, 0.655], [0, 1, 1, 0]);
  const text2Y = useTransform(smoothProgress, [0.32, 0.375, 0.60, 0.655], [12, 0, 0, -12]);

  // --------------------------------------------------------------------------
  // ACT III: IKATAN ABADI (SCENE 3)
  // --------------------------------------------------------------------------
  const scene3Opacity = useTransform(smoothProgress, [0.655, 0.72, 1], [0, 1, 1]);
  const scene3Scale = useTransform(smoothProgress, [0.655, 0.72, 1], [0.95, 1.0, 1.02]);
  const scene3Y = useTransform(smoothProgress, [0.655, 0.72, 1], [20, 0, -4]);
  const scene3Rotate = useTransform(smoothProgress, [0.655, 0.72, 1], [-1.5, 0.4, 0]);

  // Golden Sacred Aura pulses softly during transitions and blooms in Scene 3
  const auraOpacity = useTransform(
    smoothProgress,
    [0, 0.27, 0.31, 0.36, 0.62, 0.66, 0.74, 1],
    [0.15, 0.2, 0.5, 0.2, 0.2, 0.55, 0.75, 0.7]
  );
  const auraScale = useTransform(smoothProgress, [0, 0.62, 0.85], [0.85, 0.9, 1.18]);

  const text3Opacity = useTransform(smoothProgress, [0.675, 0.74, 1], [0, 1, 1]);
  const text3Y = useTransform(smoothProgress, [0.675, 0.74], [14, 0]);

  const badgeOpacity = useTransform(smoothProgress, [0.71, 0.80, 1], [0, 1, 1]);
  const badgeY = useTransform(smoothProgress, [0.71, 0.80], [14, 0]);

  // --------------------------------------------------------------------------
  // ARCH PARALLAX
  // --------------------------------------------------------------------------
  const archY = useTransform(smoothProgress, [0, 1], [-12, 18]);

  const scrollToPhase = (phase: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetRatio = phase === 1 ? 0.05 : phase === 2 ? 0.48 : 0.88;
    const targetY = scrollTop + rect.top + targetRatio * (containerRef.current.offsetHeight - window.innerHeight);
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  return (
    <section className="couple-convergence-runway" ref={containerRef} id="kisah-cinta">
      <div className="convergence-sticky">
        <div className="convergence-backdrop-glow" aria-hidden />

        {/* NARRATIVE HEADER BAR WITH 3-STAGE INTERACTIVE STEP NAVIGATOR */}
        <div className="shell convergence-header">
          <div className="convergence-step-pill" role="navigation" aria-label="Bab Kisah Pengantin">
            <div className="step-pill-labels">
              <button
                type="button"
                className="step-pill-btn"
                onClick={() => scrollToPhase(1)}
                title="Buka Bab I: Titik Temu"
              >
                <motion.span style={{ opacity: step1Highlight }} className="step-label-text">
                  ✦ Bab I · Titik Temu
                </motion.span>
              </button>
              <span className="step-pill-divider">·</span>
              <button
                type="button"
                className="step-pill-btn"
                onClick={() => scrollToPhase(2)}
                title="Buka Bab II: Menautkan Janji"
              >
                <motion.span style={{ opacity: step2Highlight }} className="step-label-text">
                  ✦ Bab II · Menautkan Janji
                </motion.span>
              </button>
              <span className="step-pill-divider">·</span>
              <button
                type="button"
                className="step-pill-btn"
                onClick={() => scrollToPhase(3)}
                title="Buka Bab III: Ikatan Abadi"
              >
                <motion.span style={{ opacity: step3Highlight }} className="step-label-text">
                  ✦ Bab III · Ikatan Abadi
                </motion.span>
              </button>
            </div>
            <div className="step-pill-meter">
              <motion.div className="step-pill-fill" style={{ width: progressMeterWidth }} />
            </div>
          </div>

          <div className="convergence-text-stack">
            <motion.div
              className="convergence-text-block"
              style={{ opacity: text1Opacity, y: text1Y }}
            >
              <h2>
                Dua langkah yang bermula dari <em>jalan berbeda...</em>
              </h2>
              <p className="convergence-prompt">
                ↓ Gulir ke bawah perlahan untuk mendekatkan langkah mereka berdua
              </p>
            </motion.div>

            <motion.div
              className="convergence-text-block absolute-text"
              style={{ opacity: text2Opacity, y: text2Y }}
            >
              <h2>
                Menautkan jemari, <em>melangkah berdampingan...</em>
              </h2>
              <p className="convergence-prompt highlight-moss">
                ✦ Dalam ikhtiar dan doa restu keluarga, merajut impian bersama menuju masa depan
              </p>
            </motion.div>

            <motion.div
              className="convergence-text-block absolute-text"
              style={{ opacity: text3Opacity, y: text3Y }}
            >
              <h2>
                Hingga bersatu dalam <em>ikatan suci pernikahan.</em>
              </h2>
              <p className="convergence-verse-arabic">
                وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
              </p>
              <p className="convergence-verse-translation">
                &ldquo;Dan di antara tanda-tanda kebesaran-Nya diciptakan-Nya untukmu pasangan hidup dari jenismu sendiri,
                agar kamu tenteram bersamanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.&rdquo;
                <span> — QS. Ar-Rum: 21</span>
              </p>
            </motion.div>
          </div>
        </div>

        {/* PARALLAX STAGE: THE THREE LIVING ARTWORK SCENES */}
        <div className="convergence-stage perspective-container">
          <motion.div
            className="convergence-aura"
            style={{
              scale: auraScale,
              opacity: auraOpacity
            }}
            aria-hidden
          />

          <motion.div className="convergence-arch-backdrop" style={{ y: archY }} aria-hidden>
            <svg viewBox="0 0 700 700" className="arch-svg-shape">
              <path
                d="M 120 700 L 120 320 C 120 180 220 80 350 40 C 480 80 580 180 580 320 L 580 700 Z"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="1.2"
                strokeDasharray="4 6"
                opacity="0.35"
              />
              <circle cx="350" cy="40" r="3.5" fill="#D4AF37" opacity="0.8" />
              <circle cx="350" cy="120" r="2" fill="#D4AF37" opacity="0.5" />
            </svg>
          </motion.div>

          {/* THE 3 CINEMATIC ARTWORK LAYERS */}
          <div className="scenes-viewport-stage">
            {/* SCENE 1: TITIK TEMU */}
            <motion.div
              className="story-scene-layer"
              style={{
                opacity: scene1Opacity,
                scale: scene1Scale,
                y: scene1Y
              }}
            >
              <div className="scene-artwork-wrapper">
                <Image
                  src="/images/story-scene-1-meeting-clean.png"
                  alt="Mempelai Pria dan Wanita Berhijab Melangkah Saling Mendekat"
                  width={1024}
                  height={572}
                  priority
                  style={{
                    width: "100%",
                    height: "auto",
                    maxWidth: "720px",
                    objectFit: "contain",
                    display: "block"
                  }}
                />
              </div>
              <div className="scene-floor-shadow" />
            </motion.div>

            {/* SCENE 2: MENAUTKAN JANJI */}
            <motion.div
              className="story-scene-layer"
              style={{
                opacity: scene2Opacity,
                scale: scene2Scale,
                y: scene2Y
              }}
            >
              <div className="scene-artwork-wrapper">
                <Image
                  src="/images/story-scene-2-handinhand-clean.png"
                  alt="Mempelai Bergandengan Tangan Melangkah Berdampingan"
                  width={1024}
                  height={572}
                  priority
                  style={{
                    width: "100%",
                    height: "auto",
                    maxWidth: "720px",
                    objectFit: "contain",
                    display: "block"
                  }}
                />
              </div>
              <div className="scene-floor-shadow" />
            </motion.div>

            {/* SCENE 3: IKATAN ABADI */}
            <motion.div
              className="story-scene-layer"
              style={{
                opacity: scene3Opacity,
                scale: scene3Scale,
                y: scene3Y,
                rotate: scene3Rotate
              }}
            >
              <div className="scene-artwork-wrapper">
                <Image
                  src="/images/story-scene-3-embrace-clean.png"
                  alt="Dekapan Bahagia Mempelai Muslim dalam Ikatan Abadi"
                  width={1024}
                  height={572}
                  priority
                  style={{
                    width: "100%",
                    height: "auto",
                    maxWidth: "720px",
                    objectFit: "contain",
                    display: "block"
                  }}
                />
              </div>
              <div className="scene-floor-shadow wide" />
            </motion.div>
          </div>

          {/* Floating Couple Badge at Climax (Scene 3) */}
          <motion.div
            className="united-couple-badge"
            style={{
              opacity: badgeOpacity,
              y: badgeY
            }}
          >
            <span className="badge-line" />
            <div className="badge-text">
              <h3>Dara Ayu &amp; Rafi Andhika</h3>
              <p>Sabtu, 24 Oktober 2026 · Plataran Hutan Kota, Jakarta</p>
            </div>
            <span className="badge-line" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
