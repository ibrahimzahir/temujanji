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

export function PurpleFlatlayScroll() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, SPRING_CONFIG);

  // --------------------------------------------------------------------------
  // FLOWERS PARTING AWAY FROM THE PURPLE CARD AS YOU SCROLL
  // 0.00 -> Flowers nestled closely around the purple envelope & card
  // 1.00 -> Flowers glide smoothly away outward (left & right) revealing card
  // --------------------------------------------------------------------------
  const cardScale = useTransform(smoothProgress, [0, 1], [0.95, 1.04]);
  const cardRotate = useTransform(smoothProgress, [0, 1], [-2, 1.5]);
  const cardY = useTransform(smoothProgress, [0, 1], [12, -8]);

  // Right peony glides away to the right & slightly up
  const rightFlowerX = useTransform(smoothProgress, [0, 1], [0, 170]);
  const rightFlowerY = useTransform(smoothProgress, [0, 1], [0, -40]);
  const rightFlowerRotate = useTransform(smoothProgress, [0, 1], [0, 16]);
  const rightFlowerOpacity = useTransform(smoothProgress, [0, 0.8, 1], [1, 0.95, 0.78]);

  // Left roses & petals glide away to the left & slightly down
  const leftFlowerX = useTransform(smoothProgress, [0, 1], [0, -160]);
  const leftFlowerY = useTransform(smoothProgress, [0, 1], [0, 40]);
  const leftFlowerRotate = useTransform(smoothProgress, [0, 1], [0, -18]);
  const leftFlowerOpacity = useTransform(smoothProgress, [0, 0.8, 1], [1, 0.95, 0.78]);

  const cueOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);
  const stageParallaxY = useTransform(smoothProgress, [0.6, 1], [0, -28]);
  const stageParallaxScale = useTransform(smoothProgress, [0.6, 1], [1, 0.96]);
  const stageParallaxOpacity = useTransform(smoothProgress, [0.7, 1], [1, 0.86]);

  return (
    <section className="purple-flatlay-runway" ref={containerRef}>
      <motion.div
        className="purple-flatlay-sticky"
        style={{
          y: stageParallaxY,
          scale: stageParallaxScale,
          opacity: stageParallaxOpacity
        }}
      >
        <div className="purple-flatlay-glow" aria-hidden />

        <div className="shell purple-flatlay-header">
          <p className="eyebrow" style={{ justifyContent: "center" }}>
            <span /> KOLEKSI AMPLOP &amp; KARTU UNGU
          </p>
          <h2>
            Bunga menyingkir lembut, <em>mengungkap kartu undangan ungu.</em>
          </h2>
          <motion.p className="purple-flatlay-cue" style={{ opacity: cueOpacity }}>
            ↓ Gulir perlahan untuk melihat kelopak bunga bergerak menjauh dari kartu
          </motion.p>
        </div>

        <div className="purple-flatlay-stage">
          {/* LEFT SMALL ROSES & PETALS (Move Left & Away on Scroll) */}
          <motion.div
            className="flatlay-flower-left"
            style={{
              x: leftFlowerX,
              y: leftFlowerY,
              rotate: leftFlowerRotate,
              opacity: leftFlowerOpacity
            }}
            aria-hidden
          >
            <Image
              src="/images/flatlay-flower-left.png"
              alt=""
              width={285}
              height={402}
              priority
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </motion.div>

          {/* CENTER CRISP ROYAL PLUM ENVELOPE & LAVENDER CARD */}
          <motion.div
            className="flatlay-stationery-compose"
            style={{
              scale: cardScale,
              rotate: cardRotate,
              y: cardY
            }}
          >
            {/* Tilted Royal Plum Envelope */}
            <div className="flatlay-plum-envelope" aria-hidden>
              <div className="flatlay-envelope-flap" />
            </div>

            {/* Crisp Unbroken Lavender Card */}
            <div className="flatlay-lavender-card">
              <div className="flatlay-card-inner">
                <span className="flatlay-card-kicker">THE WEDDING OF</span>
                <h3 className="flatlay-card-title">
                  DARA <span className="flatlay-card-amp">&amp;</span> RAFI
                </h3>
                <p className="flatlay-card-date">SABTU, 24 OKTOBER 2026</p>
                <p className="flatlay-card-time">PLATARAN HUTAN KOTA · 10.00 WIB</p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT LARGE PEONY & LEAVES (Move Right & Away on Scroll) */}
          <motion.div
            className="flatlay-flower-right"
            style={{
              x: rightFlowerX,
              y: rightFlowerY,
              rotate: rightFlowerRotate,
              opacity: rightFlowerOpacity
            }}
            aria-hidden
          >
            <Image
              src="/images/flatlay-flower-right.png"
              alt=""
              width={429}
              height={570}
              priority
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
