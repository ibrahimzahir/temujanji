"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Button } from "@/components/ui/button";

const SPRING_CONFIG = {
  stiffness: 130,
  damping: 26,
  mass: 0.4,
  restDelta: 0.001
};

export function PlumCardOpenScroll() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.9"]
  });

  const smoothProgress = useSpring(scrollYProgress, SPRING_CONFIG);

  // --------------------------------------------------------------------------
  // 3D CARD OPENING + NATURAL MULTI-DEPTH PARALLAX
  // --------------------------------------------------------------------------
  const headerY = useTransform(smoothProgress, [0, 0.45, 1], [20, 0, -10]);
  const bookY = useTransform(smoothProgress, [0, 0.5, 1], [28, 0, -14]);
  const coverRotateY = useTransform(smoothProgress, [0.18, 0.82], [0, -160]);
  const cardTiltX = useTransform(smoothProgress, [0, 0.5, 0.85], [10, 4, 0]);
  const cardScale = useTransform(smoothProgress, [0, 0.82], [0.94, 1]);
  const spreadCenterX = useTransform(smoothProgress, [0.18, 0.82], [0, 160]);

  // Wax seal fades away as cover lifts
  const sealOpacity = useTransform(smoothProgress, [0.1, 0.22], [1, 0]);
  const sealScale = useTransform(smoothProgress, [0.1, 0.22], [1, 0.78]);

  // Prompt fades out as card opens
  const promptOpacity = useTransform(smoothProgress, [0, 0.22], [1, 0]);

  // CTA button fades in once inside card is revealed
  const ctaOpacity = useTransform(smoothProgress, [0.58, 0.78], [0, 1]);
  const ctaY = useTransform(smoothProgress, [0.58, 0.78], [16, 0]);

  return (
    <section className="plum-card-runway" ref={containerRef} id="pengalaman-tamu">
      <div className="plum-card-sticky">
        <div className="plum-card-bg-glow" aria-hidden />

        {/* Section Editorial Header */}
        <motion.div className="shell plum-card-header" style={{ y: headerY }}>
          <p className="eyebrow" style={{ justifyContent: "center" }}>
            <span /> PENGALAMAN TAMU · BUKA KARTU 3D
          </p>
          <h2>
            Keanggunan kartu undangan, <em>mekar terbuka dalam 3D.</em>
          </h2>
          <motion.p className="plum-scroll-cue" style={{ opacity: promptOpacity }}>
            ↓ Gulir perlahan untuk membuka kartu dan melihat bunga bermekaran
          </motion.p>
        </motion.div>

        {/* LAYER 2: 3D PERSPECTIVE BI-FOLD CARD STAGE */}
        <div className="plum-card-stage">
          {/* THE 3D FOLDING CARD BOOK */}
          <motion.div
            className="plum-card-book"
            style={{
              x: spreadCenterX,
              y: bookY,
              rotateX: cardTiltX,
              scale: cardScale
            }}
          >
            {/* INSIDE RIGHT PAGE: The uploaded matching Floral Invitation Inside Card */}
            <div className="plum-card-inside-right floral-inside-photo">
              <Image
                src="/images/floral-3d-inside.png"
                alt="Isi Kartu Undangan Pernikahan Floral"
                width={460}
                height={620}
                priority
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block"
                }}
              />
              <div className="inside-spine-shadow" aria-hidden />
            </div>

            {/* FRONT COVER: Hinged on left spine, swings open 0 -> -160deg */}
            <motion.div
              className="plum-card-cover"
              style={{ rotateY: coverRotateY }}
            >
              {/* FRONT FACE: The uploaded Taupe Diamond & White Rose Cover */}
              <div className="plum-cover-front">
                <Image
                  src="/images/floral-3d-cover.png"
                  alt="Sampul Kartu Undangan Pernikahan Floral"
                  width={450}
                  height={620}
                  priority
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block"
                  }}
                />

                {/* Wax Seal Badge */}
                <motion.div
                  className="plum-cover-seal"
                  style={{ opacity: sealOpacity, scale: sealScale }}
                  aria-hidden
                >
                  <span>TJ</span>
                </motion.div>
              </div>

              {/* BACK FACE: Warm Cream-Taupe Inner Left Lining */}
              <div className="plum-cover-back warm-linen-back">
                <div className="inside-left-lining">
                  <span className="lining-monogram">Temu Janji</span>
                  <p className="lining-verse">
                    &ldquo;Dan di antara tanda-tanda kebesaran-Nya diciptakan-Nya untukmu pasangan hidup agar kamu tenteram bersamanya.&rdquo;
                  </p>
                  <span className="lining-ref">QS. AR-RUM : 21</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Action Button Appearing When Card Opens */}
        <motion.div
          className="plum-card-bottom-cta"
          style={{ opacity: ctaOpacity, y: ctaY }}
        >
          <Button size="lg" asChild>
            <Link href="/desain/senja-di-taman/preview">
              Buka Pratinjau Tamu Lengkap <span aria-hidden>↗</span>
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
