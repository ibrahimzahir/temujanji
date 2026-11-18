"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

const SPRING_CONFIG = {
  stiffness: 120,
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

  const headerY = useTransform(smoothProgress, [0, 1], [16, -12]);
  const suiteScale = useTransform(smoothProgress, [0, 0.5, 1], [0.94, 1, 1.03]);
  const suiteY = useTransform(smoothProgress, [0, 1], [28, -18]);
  const suiteRotateX = useTransform(smoothProgress, [0, 0.6, 1], [6, 1, 0]);
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
            Sentuhan cat air lavender, <em>harmoni alami dalam setiap detail.</em>
          </h2>
          <motion.p className="purple-flatlay-cue" style={{ opacity: cueOpacity }}>
            ↓ Gulir perlahan untuk menikmati kedalaman suite undangan lavender
          </motion.p>
        </motion.div>

        <div
          className="shell"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            perspective: 1200,
            marginTop: 12
          }}
        >
          <motion.div
            style={{
              scale: suiteScale,
              y: suiteY,
              rotateX: suiteRotateX,
              width: "min(540px, 92vw)",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 24px 60px rgba(91, 35, 107, 0.14)",
              border: "1px solid rgba(91, 35, 107, 0.12)",
              background: "#f3ecf2"
            }}
          >
            <Image
              src="/images/lavender-suite-flatlay.jpg"
              alt="Suite undangan pernikahan lavender dengan amplop floral cat air, kartu Save The Date, RSVP, dan Thank You"
              width={1000}
              height={1000}
              priority
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
