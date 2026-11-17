"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Button } from "@/components/ui/button";

export function BotanicalSuiteShowcase() {
  const containerRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState<"sepia" | "rings">("sepia");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 26,
    mass: 0.4,
    restDelta: 0.001
  });

  // Smooth scroll parallax for background botanical flourishes
  const floralLeftY = useTransform(smoothProgress, [0, 1], [-40, 50]);
  const floralRightY = useTransform(smoothProgress, [0, 1], [40, -50]);
  const petalDriftY = useTransform(smoothProgress, [0, 1], [-20, 80]);

  return (
    <section className="botanical-suite-section" ref={containerRef} id="pengalaman-tamu">
      {/* Ambient Radial Warmth */}
      <div className="botanical-suite-bg-glow" aria-hidden />

      {/* Floating Parallax Floral Leaves in Background */}
      <div className="botanical-bg-parallax" aria-hidden>
        <motion.div
          className="suite-parallax-leaf left"
          style={{ y: floralLeftY }}
        >
          <Image
            src="/images/floral-leaf-cluster.png"
            alt=""
            width={180}
            height={220}
            style={{ width: "auto", height: "auto", opacity: 0.75 }}
          />
        </motion.div>
        <motion.div
          className="suite-parallax-leaf right"
          style={{ y: floralRightY }}
        >
          <Image
            src="/images/floral-peach-roses.png"
            alt=""
            width={240}
            height={200}
            style={{ width: "auto", height: "auto", opacity: 0.8 }}
          />
        </motion.div>
        <motion.div
          className="suite-parallax-petal"
          style={{ y: petalDriftY }}
        >
          <Image
            src="/images/floral-single-rose.png"
            alt=""
            width={90}
            height={90}
            style={{ width: "auto", height: "auto", opacity: 0.65 }}
          />
        </motion.div>
      </div>

      <div className="shell suite-content-shell">
        {/* Section Editorial Header */}
        <div className="suite-intro-header">
          <p className="eyebrow" style={{ justifyContent: "center" }}>
            <span /> PENGALAMAN TAMU · KARTU UNDANGAN BOTANI
          </p>
          <h2>
            Keindahan cetak fisik, <em>kemudahan undangan digital.</em>
          </h2>
          <p className="suite-lede">
            Setiap detail dirancang dengan cermat — mulai dari kanopi mawar mekar, sepasang cincin emas pengikat janji, hingga kemudahan tautan RSVP personal untuk para tamu tercinta.
          </p>

          {/* Interactive Card Selector Tabs */}
          <div className="suite-tab-controls">
            <button
              type="button"
              className={`suite-tab-btn ${activeTab === "sepia" ? "active" : ""}`}
              onClick={() => setActiveTab("sepia")}
            >
              ✦ Edisi Kanopi Peony Putih Gading
            </button>
            <button
              type="button"
              className={`suite-tab-btn ${activeTab === "rings" ? "active" : ""}`}
              onClick={() => setActiveTab("rings")}
            >
              Edisi Cincin Mahar &amp; Mawar Die-Cut
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* INTERACTIVE 3D CARD SHOWCASE STAGE                                 */}
        {/* ------------------------------------------------------------------ */}
        <div className="suite-card-stage">
          <motion.div
            className="suite-main-card-frame"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Card Shadow Foundation */}
            <div className="suite-card-drop-shadow" />

            {/* The Active Luxury Card Artwork */}
            <div className="suite-card-inner">
              {activeTab === "sepia" ? (
                <motion.div
                  key="sepia-card"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="suite-card-art-wrap"
                >
                  <Image
                    src="/images/envelope-luxury-card-sepia.jpg"
                    alt="Kartu Undangan Mewah Kanopi Mawar Peony Sepia"
                    width={613}
                    height={867}
                    priority
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "14px",
                      display: "block"
                    }}
                  />
                  <div className="card-luxury-gold-edge" />
                </motion.div>
              ) : (
                <motion.div
                  key="rings-card"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="suite-card-art-wrap"
                >
                  <Image
                    src="/images/diecut-card-full.jpg"
                    alt="Kartu Undangan Mewah Cincin Emas dan Mawar Putih Die-Cut"
                    width={657}
                    height={920}
                    priority
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "14px",
                      display: "block"
                    }}
                  />
                  <div className="card-luxury-gold-edge" />
                </motion.div>
              )}
            </div>

            {/* Floating Luxury Ribbon Badge */}
            <div className="suite-floating-tag">
              <span className="tag-sparkle">✦</span>
              <span>
                {activeTab === "sepia"
                  ? "Edisi Kanopi Botani Klasik"
                  : "Edisi Mahkota Cincin Ukir"}
              </span>
            </div>
          </motion.div>

          {/* Side Feature Highlights & Studio Guarantees */}
          <div className="suite-feature-panel">
            <div className="suite-feature-card">
              <div className="feature-icon">✨</div>
              <div className="feature-text">
                <h3>Seni Tipografi &amp; Botani Alami</h3>
                <p>
                  Menggabungkan ornamen cat air mawar peony dengan sapuan foil emas bertekstur hangat dan mewah.
                </p>
              </div>
            </div>

            <div className="suite-feature-card">
              <div className="feature-icon">💌</div>
              <div className="feature-text">
                <h3>Tautan Personal untuk Setiap Tamu</h3>
                <p>
                  Sebut nama paman, bibi, dan sahabat terdekat pada cover pembuka undangan secara otomatis tanpa batas.
                </p>
              </div>
            </div>

            <div className="suite-feature-card">
              <div className="feature-icon">🌿</div>
              <div className="feature-text">
                <h3>Responsif di Seluruh Layar Ponsel</h3>
                <p>
                  Tamu dapat membuka undangan, konfirmasi kehadiran RSVP, dan membuka Google Maps lokasi dalam satu sentuhan.
                </p>
              </div>
            </div>

            {/* Action Row */}
            <div className="suite-action-row">
              <Button size="lg" asChild className="button button-terracotta">
                <Link href="/desain/senja-di-taman/preview">
                  Buka Contoh Undangan Tamu <span aria-hidden>↗</span>
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="#kustomisasi">
                  Coba Personalisasi Nama
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
