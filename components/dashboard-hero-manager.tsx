"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, RotateCcw, ShieldCheck, Sparkles, Code2, PenLine, Layers, LayoutTemplate } from "lucide-react";
import { DashboardCollectionManager } from "@/components/dashboard-collection-manager";
import { DashboardSectionsManager } from "@/components/dashboard-sections-manager";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DEFAULT_HERO_CONTENT,
  HERO_STORAGE_KEY,
  ROLE_PERMISSIONS,
  type HeroContent,
  type StudioRole
} from "@/lib/site-content";

interface DashboardHeroManagerProps {
  role: StudioRole;
}

const TEAM_MEMBERS: Array<{
  name: string;
  email: string;
  role: StudioRole;
  status: string;
}> = [
  { name: "Rafi Andhika", email: "rafi@temujanji.id", role: "admin", status: "Aktif" },
  { name: "Ibrahim Zahir", email: "dev@temujanji.id", role: "dev", status: "Aktif" },
  { name: "Dara Ayu", email: "editor@temujanji.id", role: "editor", status: "Aktif" }
];

export function DashboardHeroManager({ role }: DashboardHeroManagerProps) {
  const [form, setForm] = useState<HeroContent>(DEFAULT_HERO_CONTENT);
  const [savedNotice, setSavedNotice] = useState(false);
  const perm = ROLE_PERMISSIONS[role];

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(HERO_STORAGE_KEY);
      if (raw) {
        setForm({ ...DEFAULT_HERO_CONTENT, ...JSON.parse(raw) });
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!perm.canEditHero) return;
    window.localStorage.setItem(HERO_STORAGE_KEY, JSON.stringify(form));
    window.dispatchEvent(new Event("temujanji-hero-updated"));
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleReset = () => {
    setForm(DEFAULT_HERO_CONTENT);
    window.localStorage.removeItem(HERO_STORAGE_KEY);
    window.dispatchEvent(new Event("temujanji-hero-updated"));
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="px-4 lg:px-6">
      <Tabs defaultValue="hero" className="w-full space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="hero" className="gap-1.5">
              <PenLine className="size-3.5" />
              Kelola Hero &amp; Konten
            </TabsTrigger>
            <TabsTrigger value="collection" className="gap-1.5">
              <Layers className="size-3.5" />
              Koleksi &amp; Tema (Backend)
            </TabsTrigger>
            <TabsTrigger value="sections" className="gap-1.5">
              <LayoutTemplate className="size-3.5" />
              Proses · Paket · FAQ · Footer
            </TabsTrigger>
            <TabsTrigger value="roles" className="gap-1.5">
              <ShieldCheck className="size-3.5" />
              Hak Akses (Admin · Dev · Editor)
            </TabsTrigger>
            {perm.canManageDevConfig && (
              <TabsTrigger value="dev" className="gap-1.5">
                <Code2 className="size-3.5" />
                Konfigurasi Dev
              </TabsTrigger>
            )}
          </TabsList>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-amber-500" />
            <span>{perm.description}</span>
          </div>
        </div>

        {/* TAB 1: HERO CONTENT EDITOR + LIVE PREVIEW */}
        <TabsContent value="hero" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Editor Form */}
            <Card className="lg:col-span-7">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <CardTitle>Editor Konten Hero Utama</CardTitle>
                    <CardDescription>
                      Ubah teks, tombol CTA, dan testimoni singkat yang tampil di halaman depan.
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{perm.label}</Badge>
                </div>
              </CardHeader>

              <form onSubmit={handleSave}>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="hero-eyebrow">Eyebrow Studio</Label>
                    <Input
                      id="hero-eyebrow"
                      value={form.eyebrow}
                      onChange={(e) => setForm({ ...form, eyebrow: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="hero-title-1">Judul Baris 1</Label>
                      <Input
                        id="hero-title-1"
                        value={form.titleLine1}
                        onChange={(e) => setForm({ ...form, titleLine1: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="hero-title-2">Judul Kaligrafi (Highlight)</Label>
                      <Input
                        id="hero-title-2"
                        value={form.titleHighlight}
                        onChange={(e) => setForm({ ...form, titleHighlight: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="hero-lead">Deskripsi Utama</Label>
                    <textarea
                      id="hero-lead"
                      rows={3}
                      className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={form.lead}
                      onChange={(e) => setForm({ ...form, lead: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="cta-1-label">Tombol Utama</Label>
                      <Input
                        id="cta-1-label"
                        value={form.primaryCtaLabel}
                        onChange={(e) => setForm({ ...form, primaryCtaLabel: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cta-1-href">Tautan Tombol Utama</Label>
                      <Input
                        id="cta-1-href"
                        value={form.primaryCtaHref}
                        onChange={(e) => setForm({ ...form, primaryCtaHref: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="cta-2-label">Tombol Kedua</Label>
                      <Input
                        id="cta-2-label"
                        value={form.secondaryCtaLabel}
                        onChange={(e) => setForm({ ...form, secondaryCtaLabel: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cta-2-href">Tautan Tombol Kedua</Label>
                      <Input
                        id="cta-2-href"
                        value={form.secondaryCtaHref}
                        onChange={(e) => setForm({ ...form, secondaryCtaHref: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="proof-stars">Bintang</Label>
                      <Input
                        id="proof-stars"
                        value={form.proofRating}
                        onChange={(e) => setForm({ ...form, proofRating: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-3">
                      <Label htmlFor="proof-text">Teks Kepercayaan Klien</Label>
                      <Input
                        id="proof-text"
                        value={form.proofText}
                        onChange={(e) => setForm({ ...form, proofText: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                  <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
                    <RotateCcw className="mr-1.5 size-3.5" />
                    Reset Bawaan
                  </Button>
                  <div className="flex items-center gap-2">
                    {savedNotice && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <Check className="size-3.5" /> Tersimpan ke Beranda
                      </span>
                    )}
                    <Button type="submit" size="sm">
                      Simpan Perubahan Hero
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </Card>

            {/* Live Preview Card */}
            <Card className="lg:col-span-5">
              <CardHeader>
                <CardTitle>Pratinjau Langsung Hero</CardTitle>
                <CardDescription>
                  Tampilan aktual teks yang akan dilihat tamu &amp; calon pengantin.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border bg-gradient-to-br from-white via-[#fcf9fa] to-[#f6eff9] p-6 shadow-xs">
                  <p className="text-[10px] font-semibold tracking-[0.16em] text-[#6c537a] uppercase">
                    — {form.eyebrow}
                  </p>
                  <h2 className="mt-3 font-serif text-3xl leading-tight text-[#341942]">
                    {form.titleLine1}
                    <br />
                    <span className="text-[#5b236b]" style={{ fontFamily: "var(--script)", fontSize: "1.25em" }}>
                      {form.titleHighlight}
                    </span>
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#6c537a]">
                    {form.lead}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    <Button size="sm" asChild>
                      <Link href={`/${form.primaryCtaHref.replace(/^\/+/, "")}`}>
                        {form.primaryCtaLabel} →
                      </Link>
                    </Button>
                    <Button size="sm" variant="secondary" asChild>
                      <Link href={`/${form.secondaryCtaHref.replace(/^\/+/, "")}`}>
                        {form.secondaryCtaLabel}
                      </Link>
                    </Button>
                  </div>
                  <div className="mt-5 flex items-center gap-2 border-t border-[#efe8eb] pt-3 text-xs text-[#6c537a]">
                    <span className="tracking-widest text-[#d4af37]">{form.proofRating}</span>
                    <span>{form.proofText}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: BACKEND COLLECTION & THEMES MANAGER */}
        <TabsContent value="collection">
          <DashboardCollectionManager role={role} />
        </TabsContent>

        {/* TAB 3: BACKEND LOWER SECTIONS (PROCESS, PACKAGES, TESTIMONIALS, FAQ, FOOTER) */}
        <TabsContent value="sections">
          <DashboardSectionsManager role={role} />
        </TabsContent>

        {/* TAB 3: ROLE PERMISSIONS (ADMIN, DEV, EDITOR) */}
        <TabsContent value="roles" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {(["admin", "dev", "editor"] as StudioRole[]).map((r) => {
              const p = ROLE_PERMISSIONS[r];
              const isActive = role === r;
              return (
                <Card key={r} className={isActive ? "border-primary ring-1 ring-primary/20" : ""}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{p.label}</CardTitle>
                      <Badge variant={isActive ? "default" : "secondary"}>
                        {isActive ? "Aktif" : p.badge}
                      </Badge>
                    </div>
                    <CardDescription>{p.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span>Edit Hero &amp; CTA</span>
                      <span>{p.canEditHero ? "✓ Diizinkan" : "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kelola Pesanan Klien</span>
                      <span>{p.canManageOrders ? "✓ Diizinkan" : "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Konfigurasi Teknis / Dev</span>
                      <span>{p.canManageDevConfig ? "✓ Diizinkan" : "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kelola Tim &amp; Peran</span>
                      <span>{p.canManageRoles ? "✓ Diizinkan" : "—"}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Daftar Anggota Tim Studio</CardTitle>
              <CardDescription>
                {perm.canManageRoles
                  ? "Sebagai Admin, Anda memiliki akses penuh untuk mengelola peran tim."
                  : "Hanya peran Admin yang dapat mengubah penetapan peran anggota tim."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Peran</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {TEAM_MEMBERS.map((m) => (
                    <TableRow key={m.email}>
                      <TableCell className="font-medium">{m.name}</TableCell>
                      <TableCell>{m.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="uppercase">
                          {m.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{m.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: DEV CONFIG (ONLY FOR ADMIN & DEV) */}
        {perm.canManageDevConfig && (
          <TabsContent value="dev">
            <Card>
              <CardHeader>
                <CardTitle>Konfigurasi Developer &amp; Sistem</CardTitle>
                <CardDescription>
                  Panel teknis khusus peran Admin &amp; Dev untuk memantau rute, font, dan aset desain.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-3 text-sm">
                <div className="rounded-lg border p-4">
                  <p className="text-xs text-muted-foreground">Tema Aktif</p>
                  <p className="mt-1 font-medium">Royal Plum &amp; Champagne Gold</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-xs text-muted-foreground">Tipografi</p>
                  <p className="mt-1 font-medium">Cormorant Garamond · Alex Brush</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-xs text-muted-foreground">Integrasi Penyimpanan</p>
                  <p className="mt-1 font-medium">Live Sync (localStorage + Studio DB)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
