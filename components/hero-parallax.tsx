"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Button } from "@/components/ui/button";

export function HeroParallax() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Background photo 3D recess
  const bgY = useTransform(smoothProgress, [0, 1], ["0%", "28%"]);
  const bgScale = useTransform(smoothProgress, [0, 1], [1.02, 1.18]);

  // Foreground text 3D lift & tilt
  const textY = useTransform(smoothProgress, [0, 1], ["0%", "45%"]);
  const textOpacity = useTransform(smoothProgress, [0, 0.8], [1, 0.1]);
  const textRotateX = useTransform(smoothProgress, [0, 1], [0, 8]);

  // Floating 3D stamp ornament
  const sealY = useTransform(smoothProgress, [0, 1], [0, 140]);
  const sealRotate = useTransform(smoothProgress, [0, 1], [0, 35]);
  const sealScale = useTransform(smoothProgress, [0, 1], [1, 0.88]);

  return (
    <section className="celebration-hero perspective-container" ref={containerRef}>
      {/* 3D Parallax Background Layer */}
      <motion.div
        className="hero-parallax-bg"
        style={{
          y: bgY,
          scale: bgScale,
          position: "absolute",
          inset: "-8% 0",
          zIndex: -3
        }}
      >
        <Image
          src="/images/hero.jpg"
          alt="Momen bahagia pernikahan bernuansa alam"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 42%" }}
        />
      </motion.div>

      {/* Floating 3D Seal Emblem */}
      <motion.div
        className="hero-floating-seal"
        style={{
          y: sealY,
          rotate: sealRotate,
          scale: sealScale,
          position: "absolute",
          top: "14%",
          right: "8%",
          zIndex: 4,
          pointerEvents: "none"
        }}
        aria-hidden
      >
        <div className="hero-seal-badge">
          <span className="seal-ring" />
          <span className="seal-text">TEMU JANJI · STUDIO EST. 2026 · </span>
          <span className="seal-icon">✳</span>
        </div>
      </motion.div>

      {/* Foreground 3D Text & Actions */}
      <motion.div
        className="shell celebration-copy preserve-3d"
        style={{
          y: textY,
          opacity: textOpacity,
          rotateX: textRotateX,
          transformPerspective: 1000
        }}
      >
        <p className="eyebrow">
          <span /> STUDIO UNDANGAN PERNIKAHAN DIGITAL · INDONESIA
        </p>

        <h1>
          Surat untuk<br />
          <em>hari bahagia.</em>
        </h1>

        <p>
          Undangan digital berselera seni tinggi yang dirangkai khusus untuk kalian berdua.
          Cukup kirimkan detail acara — kurator studio kami yang menyempurnakan tipografi,
          tata letak, dan foto hingga siap menyapa setiap tamu tercinta.
        </p>

        <div className="hero-actions">
          <Button size="lg" asChild>
            <a href="#koleksi">
              Jelajahi koleksi studio <span aria-hidden>↗</span>
            </a>
          </Button>
          <a
            href="#contoh"
            className="button button-outline"
            style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.4)" }}
          >
            Coba buka undangan <span aria-hidden>↓</span>
          </a>
        </div>

        <div>
          <div className="hero-trust-badge">
            <span className="dot" aria-hidden />
            <span>100% Ditangani Desainer Studio · Bukan Generator Otomatis Kaku</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
