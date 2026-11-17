"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 36);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="nav-inner">
        <Link href="/" className="wordmark" title="Temu Janji Studio">
          temu<span>janji</span><sup>✳</sup>
        </Link>
        <nav aria-label="Navigasi utama">
          <Link href="/#koleksi">Koleksi Desain</Link>
          <Link href="/#pengalaman-tamu">Pengalaman Tamu</Link>
          <Link href="/#proses">Cara Pesan &amp; Harga</Link>
        </nav>
        <Link className="account" href="/dashboard" title="Masuk ke Studio Dashboard">
          <span>Dashboard</span>
          <span aria-hidden>↗</span>
        </Link>
      </div>
    </header>
  );
}
