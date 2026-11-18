"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import {
  DEFAULT_SITE_SECTIONS,
  type SiteSectionsData
} from "@/lib/site-sections-types";

export function LandingHeaderWrapper() {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard")) return null;
  return <SiteHeader />;
}

export function LandingFooterWrapper() {
  const pathname = usePathname();
  const [footer, setFooter] = useState(DEFAULT_SITE_SECTIONS.footer);

  useEffect(() => {
    const sync = async () => {
      try {
        const res = await fetch("/api/site-sections", { cache: "no-store" });
        if (res.ok) {
          const json = (await res.json()) as { data: SiteSectionsData };
          if (json?.data?.footer) setFooter(json.data.footer);
        }
      } catch {
        // Keep default footer if offline
      }
    };
    sync();
    window.addEventListener("temujanji-sections-updated", sync);
    return () => window.removeEventListener("temujanji-sections-updated", sync);
  }, []);

  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <footer>
      <div className="shell footer">
        <div>
          <Link href="/" className="wordmark">
            temu<span>janji</span><sup>✳</sup>
          </Link>
          <p style={{ marginTop: 6, fontSize: 13, color: "var(--ink-subtle)" }}>
            {footer.tagline}
          </p>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 13, fontWeight: 500, flexWrap: "wrap" }}>
          {footer.links.map((link, idx) => (
            <Link key={idx} href={link.href}>
              {link.label}
            </Link>
          ))}
          <Link href="/privasi">Privasi</Link>
          <Link href="/syarat-ketentuan">Syarat &amp; Ketentuan</Link>
        </div>
      </div>
      <div className="shell footer-studio-quote">
        <span>{footer.copyright}</span>
        <span>{footer.bottomQuote}</span>
      </div>
    </footer>
  );
}
