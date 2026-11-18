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
    offset: ["start 0.85", "end 0.25"]
  });

  const smoothProgress = useSpring(scrollYProgress, SPRING_CONFIG);

  // --------------------------------------------------------------------------
  // NATURAL MULTI-PLANE PARALLAX: FLOWERS PARTING FROM THE PURPLE CARD
  // Begins smoothly as section enters viewport; each depth layer moves at its own pace.
  // --------------------------------------------------------------------------
  const headerY = useTransform(smoothProgress, [0, 1], [16, -12]);
  const cardScale = useTransform(smoothProgress, [0, 0.5, 1], [0.96, 1.01, 1.04]);
  const cardRotate = useTransform(smoothProgress, [0, 1], [-1.8, 1.2]);
  const cardY = useTransform(smoothProgress, [0, 1], [24, -18]);

  // Right peony glides smoothly outward & upward
  const rightFlowerX = useTransform(smoothProgress, [0, 1], [0, 155]);
  const rightFlowerY = useTransform(smoothProgress, [0, 1], [22, -46]);
  const rightFlowerRotate = useTransform(smoothProgress, [0, 1], [-2, 14]);
  const rightFlowerOpacity = useTransform(smoothProgress, [0, 0.85, 1], [0.96, 1, 0.88]);

  // Left roses & petals glide smoothly outward & downward
  const leftFlowerX = useTransform(smoothProgress, [0, 1], [0, -145]);
  const leftFlowerY = useTransform(smoothProgress, [0, 1], [-8, 42]);
  const leftFlowerRotate = useTransform(smoothProgress, [0, 1], [2, -15]);
  const leftFlowerOpacity = useTransform(smoothProgress, [0, 0.85, 1], [0.96, 1, 0.88]);

  const cueOpacity = useTransform(smoothProgress, [0, 0.35], [1, 0]);

  return (
    <section className="purple-flatlay-runway" ref={containerRef}>
      <div className="purple-flatlay-sticky">
        <div className="purple-flatlay-glow" aria-hidden />

        <motion.div className="shell purple-flatlay-header" style={{ y: headerY }}>
          <p className="eyebrow" style={{ justifyContent: "center" }}>
            <span /> KOLEKSI AMPLOP &amp; KARTU UNGU
          </p>
          <h2>
            Bunga menyingkir lembut, <em>mengungkap kartu undangan ungu.</em>
          </h2>
          <motion.p className="purple-flatlay-cue" style={{ opacity: cueOpacity }}>
            ↓ Gulir perlahan untuk melihat kelopak bunga bergerak menjauh dari kartu
          </motion.p>
        </motion.div>

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
      </div>
    </section>
  );
}
