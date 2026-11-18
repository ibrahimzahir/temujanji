import { HeroCoupleAnimated } from "@/components/hero-couple-animated";
import { StudioPillars } from "@/components/studio-pillars";
import { LineDrawingScroll } from "@/components/line-drawing-scroll";
import { CoupleConvergenceScroll } from "@/components/couple-convergence-scroll";
import { PlumCardOpenScroll } from "@/components/plum-card-open-scroll";
import { PurpleFlatlayScroll } from "@/components/purple-flatlay-scroll";
import { FeaturedInvitations } from "@/components/featured-invitations";
import { CollectionSection } from "@/components/collection-section";
import { LowerSections } from "@/components/lower-sections";
import { categories, packages, rupiah } from "@/lib/catalog";
import { getCollectionData } from "@/lib/collection-service";
import { getSiteSections } from "@/lib/site-sections-service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [collectionData, sectionsPayload] = await Promise.all([
    getCollectionData(),
    getSiteSections()
  ]);
  const startingPrice =
    sectionsPayload.data.packages.items[0]?.price ?? packages[0].price;
  return (
    <>
      {/* -------------------------------------------------------------------- */}
      {/* 1. HERO: LUXURY ANIMATED GROOM & BRIDE ISLAMIC WEDDING SHOWCASE       */}
      {/* -------------------------------------------------------------------- */}
      <HeroCoupleAnimated />

      {/* -------------------------------------------------------------------- */}
      {/* 2. STUDIO PILLARS: BESPOKE EDITORIAL BENTO CARDS                     */}
      {/* -------------------------------------------------------------------- */}
      <StudioPillars
        categoriesCount={categories.length}
        startingPrice={rupiah(startingPrice)}
      />

      {/* -------------------------------------------------------------------- */}
      {/* 3. LINE DRAWING SCROLL: PEN DRAWING COMPLETES THE ARTWORK            */}
      {/* -------------------------------------------------------------------- */}
      <LineDrawingScroll />

      {/* -------------------------------------------------------------------- */}
      {/* 4. SCROLL CONVERGENCE: TWO SOULS MEETING INTO ONE EMBRACE             */}
      {/* -------------------------------------------------------------------- */}
      <CoupleConvergenceScroll />

      {/* -------------------------------------------------------------------- */}
      {/* 5. PURPLE ENVELOPE & CARD WITH FLOWERS PARTING ON SCROLL             */}
      {/* -------------------------------------------------------------------- */}
      <PurpleFlatlayScroll />

      {/* -------------------------------------------------------------------- */}
      {/* 5B. 3D SCROLL-OPENING PLUM FLORAL INVITATION CARD                    */}
      {/* -------------------------------------------------------------------- */}
      <PlumCardOpenScroll />

      {/* -------------------------------------------------------------------- */}
      {/* 4. DUAL-PHONE SCROLL PARALLAX & LIVE PERSONALIZATION SHOWCASE        */}
      {/* -------------------------------------------------------------------- */}
      <section className="invitation-story" id="kustomisasi">
        <div className="shell studio-hero">
          <FeaturedInvitations />
          <div className="studio-hero-copy">
            <p className="eyebrow">
              <span /> PERSONALISASI LANGSUNG · PAMERAN DUA PONSEL
            </p>
            <h2>
              Lihat undangan dengan <em>nama kalian berdua.</em>
            </h2>
            <p className="studio-lede">
              Ketik nama kalian berdua pada kotak personalisasi di samping untuk melihat kedua tampilan ponsel
              (Cover Pembuka &amp; Rangkaian Acara) berubah seketika. Rasakan perpaduan seni tipografi modern,
              sapuan cat air lembut, dan keindahan adat yang abadi.
            </p>
            <div style={{ marginTop: 14 }}>
              <a className="studio-text-link" href="#koleksi">
                Jelajahi semua {categories.length} kategori tema studio <span aria-hidden>↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 5. CURATED COLLECTION: BACKEND-MANAGED 4-COLUMN DESIGN GRID          */}
      {/* -------------------------------------------------------------------- */}
      <CollectionSection initialData={collectionData} />

      {/* -------------------------------------------------------------------- */}
      {/* 6-8. BACKEND-MANAGED PROCESS, PACKAGES, TESTIMONIALS & FAQ           */}
      {/* -------------------------------------------------------------------- */}
      <LowerSections initialData={sectionsPayload.data} />
    </>
  );
}
