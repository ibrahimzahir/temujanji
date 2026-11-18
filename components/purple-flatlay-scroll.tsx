"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

const SPRING_CONFIG = {
  stiffness: 115,
  damping: 26,
  mass: 0.45,
  restDelta: 0.001
};

export function PurpleFlatlayScroll() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "end 0.15"]
  });

  const smoothProgress = useSpring(scrollYProgress, SPRING_CONFIG);

  // Header subtle lift
  const headerY = useTransform(smoothProgress, [0, 1], [20, -16]);
  const cueOpacity = useTransform(smoothProgress, [0, 0.35], [1, 0]);

  // 4 separated stationery components moving upward at different parallax speeds
  const envelopeY = useTransform(smoothProgress, [0, 1], [36, -42]);
  const envelopeRotate = useTransform(smoothProgress, [0, 1], [-2, 1]);

  const saveDateY = useTransform(smoothProgress, [0, 1], [60, -72]);
  const saveDateRotate = useTransform(smoothProgress, [0, 1], [2, -1]);

  const rsvpY = useTransform(smoothProgress, [0, 1], [88, -104]);
  const rsvpRotate = useTransform(smoothProgress, [0, 1], [-2.5, 1.5]);

  const thankYouY = useTransform(smoothProgress, [0, 1], [116, -132]);
  const thankYouRotate = useTransform(smoothProgress, [0, 1], [3, -2]);

  return (
    <section className="purple-flatlay-runway" ref={containerRef}>
      <div className="purple-flatlay-sticky">
        <div className="purple-flatlay-glow" aria-hidden />

        <motion.div className="shell purple-flatlay-header" style={{ y: headerY }}>
          <p className="eyebrow" style={{ justifyContent: "center" }}>
            <span /> KOLEKSI AMPLOP &amp; KARTU UNGU
          </p>
          <h2>
            Sentuhan cat air lavender, <em>harmoni alami dalam setiap detail.</em>
          </h2>
          <motion.p className="purple-flatlay-cue" style={{ opacity: cueOpacity }}>
            ↓ Gulir perlahan untuk melihat setiap elemen kartu bergerak parallax ke atas
          </motion.p>
        </motion.div>

        <div
          className="shell"
          style={{
            position: "relative",
            width: "min(620px, 92vw)",
            height: "clamp(380px, 54vw, 520px)",
            marginInline: "auto",
            marginTop: 8,
            borderRadius: 24,
            background:
              "radial-gradient(circle at 50% 45%, #efe9ed 0%, #e7dfe5 65%, #dfd5dd 100%)",
            border: "1px solid rgba(91, 35, 107, 0.1)",
            boxShadow: "0 20px 52px rgba(91, 35, 107, 0.08)",
            overflow: "hidden"
          }}
        >
          {/* 1. Envelope (Slowest upward parallax) */}
          <motion.div
            style={{
              position: "absolute",
              left: "8%",
              top: "8%",
              width: "44%",
              y: envelopeY,
              rotate: envelopeRotate,
              filter: "drop-shadow(0 16px 26px rgba(67, 23, 80, 0.14))",
              willChange: "transform"
            }}
          >
            <Image
              src="/images/suite-envelope.png"
              alt="Amplop lavender dengan lapisan bunga cat air ungu"
              width={448}
              height={466}
              priority
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </motion.div>

          {/* 2. Save The Date Card (Medium upward parallax) */}
          <motion.div
            style={{
              position: "absolute",
              right: "8%",
              top: "10%",
              width: "31%",
              y: saveDateY,
              rotate: saveDateRotate,
              filter: "drop-shadow(0 18px 28px rgba(67, 23, 80, 0.15))",
              willChange: "transform"
            }}
          >
            <Image
              src="/images/suite-save-date.png"
              alt="Kartu Save The Date emas dan botani"
              width={299}
              height={434}
              priority
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </motion.div>

          {/* 3. RSVP Card (Faster upward parallax) */}
          <motion.div
            style={{
              position: "absolute",
              left: "27%",
              bottom: "6%",
              width: "24%",
              y: rsvpY,
              rotate: rsvpRotate,
              filter: "drop-shadow(0 16px 24px rgba(67, 23, 80, 0.16))",
              willChange: "transform"
            }}
          >
            <Image
              src="/images/suite-rsvp.png"
              alt="Kartu konfirmasi kehadiran RSVP floral ungu"
              width={240}
              height={292}
              priority
              style={{ width: "100%", height: "auto", display: "block", borderRadius: 4 }}
            />
          </motion.div>

          {/* 4. Thank You Card (Fastest upward parallax) */}
          <motion.div
            style={{
              position: "absolute",
              right: "16%",
              bottom: "14%",
              width: "23%",
              y: thankYouY,
              rotate: thankYouRotate,
              filter: "drop-shadow(0 14px 22px rgba(67, 23, 80, 0.16))",
              willChange: "transform"
            }}
          >
            <Image
              src="/images/suite-thank-you.png"
              alt="Kartu ucapan Thank You floral ungu"
              width={212}
              height={151}
              priority
              style={{ width: "100%", height: "auto", display: "block", borderRadius: 4 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
