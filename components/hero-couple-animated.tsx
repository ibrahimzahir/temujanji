"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_HERO_CONTENT,
  HERO_STORAGE_KEY,
  type HeroContent
} from "@/lib/site-content";

export function HeroCoupleAnimated() {
  const heroRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [heroContent, setHeroContent] = useState<HeroContent>(DEFAULT_HERO_CONTENT);

  useEffect(() => {
    const syncHero = () => {
      try {
        const raw = window.localStorage.getItem(HERO_STORAGE_KEY);
        if (raw) {
          setHeroContent({ ...DEFAULT_HERO_CONTENT, ...JSON.parse(raw) });
        } else {
          setHeroContent(DEFAULT_HERO_CONTENT);
        }
      } catch {
        setHeroContent(DEFAULT_HERO_CONTENT);
      }
    };
    syncHero();
    window.addEventListener("temujanji-hero-updated", syncHero);
    window.addEventListener("storage", syncHero);
    return () => {
      window.removeEventListener("temujanji-hero-updated", syncHero);
      window.removeEventListener("storage", syncHero);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 26,
    mass: 0.4,
    restDelta: 0.001
  });

  // Subtle parallax depth for stage, left floral pattern & header copy
  const stageParallaxY = useTransform(smoothProgress, [0, 1], [0, 45]);
  const leftFloralY = useTransform(smoothProgress, [0, 1], [0, -35]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.85], [1, 0.15]);
  const haloScale = useTransform(smoothProgress, [0, 1], [1, 1.25]);

  // --------------------------------------------------------------------------
  // TWO-CARD SCROLL ANGLE & SKEW PARALLAX (WIDENS ANGLE AS YOU SCROLL)
  // --------------------------------------------------------------------------
  const backScrollRotate = useTransform(smoothProgress, [0, 1], [-8, -24]);
  const backScrollSkewY = useTransform(smoothProgress, [0, 1], [-1.5, -5.5]);
  const backScrollX = useTransform(smoothProgress, [0, 1], [-12, -48]);
  const backScrollY = useTransform(smoothProgress, [0, 1], [6, 22]);

  const frontScrollRotate = useTransform(smoothProgress, [0, 1], [2, 11]);
  const frontScrollSkewY = useTransform(smoothProgress, [0, 1], [0.5, 4]);
  const frontScrollX = useTransform(smoothProgress, [0, 1], [0, 26]);
  const frontScrollY = useTransform(smoothProgress, [0, 1], [0, -14]);

  return (
    <header className="hero-couple-header" ref={heroRef}>
      {/* Ambient warm radial glow */}
      <div className="hero-couple-bg-glow" aria-hidden />

      {/* Left-Side Vector Floral Pattern & Blossoms */}
      <motion.div
        className="hero-left-floral-pattern"
        style={{ y: leftFloralY }}
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 0.36, x: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
      >
        <img
          src="/images/hero-floral-only.svg"
          alt=""
          className="hero-left-floral-img"
        />
      </motion.div>

      {/* Floating subtle gold sparkles */}
      <div className="hero-sparkle-layer" aria-hidden>
        <motion.span
          className="hero-sparkle sparkle-1"
          animate={{ y: [0, -10, 0], opacity: [0.3, 0.75, 0.3] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          ✦
        </motion.span>
        <motion.span
          className="hero-sparkle sparkle-2"
          animate={{ y: [0, -14, 0], opacity: [0.35, 0.85, 0.35] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          ✧
        </motion.span>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN HERO CONTENT (TWO COLUMNS: EDITORIAL COPY + TWO-CARD STACK)   */}
      {/* ------------------------------------------------------------------ */}
      <motion.div className="shell hero-couple-content" style={{ opacity: heroOpacity }}>
        {/* Left Column: Storytelling Headline & Intentional CTAs */}
        <div className="hero-couple-copy">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow">
              <span /> {heroContent.eyebrow}
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {heroContent.titleLine1} <br />
            <em>{heroContent.titleHighlight}</em>
          </motion.h1>

          <motion.p
            className="hero-couple-lead"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {heroContent.lead}
          </motion.p>

          {/* Action Row */}
          <motion.div
            className="hero-couple-actions"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Button size="lg" asChild>
              <Link href={heroContent.primaryCtaHref}>
                {heroContent.primaryCtaLabel} <span aria-hidden>→</span>
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href={heroContent.secondaryCtaHref}>
                {heroContent.secondaryCtaLabel}
              </Link>
            </Button>
          </motion.div>

          {/* Social Proof & Reassurance */}
          <motion.div
            className="hero-couple-proof"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.45 }}
          >
            <div className="proof-stars">{heroContent.proofRating}</div>
            <p>{heroContent.proofText}</p>
          </motion.div>
        </div>

        {/* Right Column: Interactive Two-Card Stack with Wide Scroll & Hover Skew */}
        <div className="hero-couple-stage-col">
          <motion.div
            className="hero-couple-stage"
            style={{ y: stageParallaxY }}
          >
            {/* Sacred Islamic Arch Backdrop */}
            <div className="hero-stage-arch" aria-hidden />

            {/* Radiant Golden Blessing Halo */}
            <motion.div
              className="hero-stage-halo"
              style={{ scale: haloScale }}
              animate={{ opacity: [0.4, 0.65, 0.4] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            />

            {/* TWO-CARD INTERACTIVE STACK (SCROLL + HOVER ANGLE & SKEW) */}
            <motion.div
              className="hero-two-card-stack"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              initial={{ opacity: 0, y: 28, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.95, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* 1. BACK BLUSH CARD (Scroll + Hover Angle/Skew) */}
              <motion.div
                className="hero-stack-card-back-wrap"
                style={{
                  rotate: backScrollRotate,
                  skewY: backScrollSkewY,
                  x: backScrollX,
                  y: backScrollY
                }}
              >
                <motion.div
                  className="hero-stack-card-back"
                  animate={{
                    rotate: isHovered ? -11 : 0,
                    skewY: isHovered ? -4.5 : 0,
                    skewX: isHovered ? 2 : 0,
                    x: isHovered ? -26 : 0,
                    y: isHovered ? 12 : 0,
                    scale: isHovered ? 1.02 : 1
                  }}
                  transition={{ type: "spring", stiffness: 220, damping: 20 }}
                />
              </motion.div>

              {/* 2. FRONT WATERCOLOR FLORAL CARD (Opposite Scroll + Hover Angle/Skew) */}
              <motion.div
                className="hero-stack-card-front-wrap"
                style={{
                  rotate: frontScrollRotate,
                  skewY: frontScrollSkewY,
                  x: frontScrollX,
                  y: frontScrollY
                }}
              >
                <motion.div
                  className="hero-card-art-frame"
                  animate={{
                    rotate: isHovered ? 7.5 : 0,
                    skewY: isHovered ? 3.5 : 0,
                    skewX: isHovered ? -2 : 0,
                    x: isHovered ? 16 : 0,
                    y: isHovered ? -10 : 0,
                    scale: isHovered ? 1.03 : 1
                  }}
                  transition={{ type: "spring", stiffness: 220, damping: 20 }}
                >
                  <Image
                    src="/images/grace-adam-purple-card.jpg"
                    alt="Kartu Undangan Pernikahan Watercolor Bunga Lavender Temu Janji"
                    width={310}
                    height={432}
                    priority
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "12px",
                      display: "block"
                    }}
                  />
                  <div className="card-luxury-gold-edge" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Floating Luxury Glassmorphism Badge */}
            <motion.div
              className="hero-invitation-badge"
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="badge-monogram">
                <span>D</span>
                <span className="amp">&amp;</span>
                <span>R</span>
              </div>
              <div className="badge-details">
                <span className="badge-subtitle">The Wedding Celebration</span>
                <h3 className="badge-names">Dara Ayu &amp; Rafi Andhika</h3>
                <p className="badge-meta">Sabtu, 24 Oktober 2026 · Plataran Hutan Kota</p>
              </div>
              <span className="badge-tag">Undangan Tamu Resmi</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Subtle Scroll Down Indicator */}
      <motion.div
        className="hero-scroll-cue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <span>Gulir ke bawah untuk menjelajahi kisah</span>
        <motion.div
          className="cue-arrow"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          ↓
        </motion.div>
      </motion.div>
    </header>
  );
}
