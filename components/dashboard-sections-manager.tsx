"use client";

import { useEffect, useState } from "react";
import { Check, Database, Plus, RotateCcw, Trash2 } from "lucide-react";
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
  DEFAULT_SITE_SECTIONS,
  type SiteSectionsData
} from "@/lib/site-sections-types";
import type { StudioRole } from "@/lib/site-content";

export function DashboardSectionsManager({ role }: { role: StudioRole }) {
  const [data, setData] = useState<SiteSectionsData>(DEFAULT_SITE_SECTIONS);
  const [source, setSource] = useState<"prisma" | "file">("file");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/site-sections", { cache: "no-store" });
        if (res.ok) {
          const json = (await res.json()) as {
            data: SiteSectionsData;
            source: "prisma" | "file";
          };
          setData(json.data);
          setSource(json.source);
        }
      } catch {
        // Keep defaults
      }
    };
    load();
  }, []);

  const notify = (msg: string) => {
    setNotice(msg);
    window.dispatchEvent(new Event("temujanji-sections-updated"));
    setTimeout(() => setNotice(null), 2800);
  };

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/site-sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const json = (await res.json()) as {
          data: SiteSectionsData;
          source: "prisma" | "file";
        };
        setData(json.data);
        setSource(json.source);
        notify("Seluruh bagian situs tersimpan ke backend");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/site-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" })
      });
      if (res.ok) {
        const json = (await res.json()) as {
          data: SiteSectionsData;
          source: "prisma" | "file";
        };
        setData(json.data);
        notify("Dikembalikan ke bawaan studio");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Backend Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/30 px-4 py-2.5 text-xs">
        <div className="flex items-center gap-2">
          <Database className="size-3.5 text-primary" />
          <span>
            Backend API aktif: <code className="font-mono">/api/site-sections</code> (
            {source === "prisma" ? "PostgreSQL · Prisma" : "Server JSON Store"})
          </span>
          <Badge variant="outline" className="uppercase">
            {role}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {notice && (
            <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
              <Check className="size-3.5" /> {notice}
            </span>
          )}
          <Button type="button" variant="ghost" size="sm" onClick={handleReset} disabled={saving}>
            <RotateCcw className="mr-1.5 size-3.5" />
            Reset
          </Button>
          <Button type="submit" size="sm" disabled={saving}>
            Simpan Semua Bagian
          </Button>
        </div>
      </div>

      {/* 1. CARA PESAN */}
      <Card>
        <CardHeader>
          <CardTitle>1. Cara Pesan &amp; Langkah Studio</CardTitle>
          <CardDescription>
            Kelola judul dan ke-3 langkah proses pemesanan (*01, 02, 03*).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Eyebrow</Label>
              <Input
                value={data.process.eyebrow}
                onChange={(e) =>
                  setData({ ...data, process: { ...data.process, eyebrow: e.target.value } })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Judul Utama</Label>
              <Input
                value={data.process.titleLine1}
                onChange={(e) =>
                  setData({ ...data, process: { ...data.process, titleLine1: e.target.value } })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Highlight Kaligrafi</Label>
              <Input
                value={data.process.titleHighlight}
                onChange={(e) =>
                  setData({
                    ...data,
                    process: { ...data.process, titleHighlight: e.target.value }
                  })
                }
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Deskripsi</Label>
            <Input
              value={data.process.description}
              onChange={(e) =>
                setData({ ...data, process: { ...data.process, description: e.target.value } })
              }
            />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {data.process.steps.map((step, idx) => (
              <div key={idx} className="space-y-2 rounded-lg border p-3">
                <Label className="text-xs">Judul Langkah {idx + 1}</Label>
                <Input
                  value={step.title}
                  onChange={(e) => {
                    const steps = [...data.process.steps];
                    steps[idx] = { ...step, title: e.target.value };
                    setData({ ...data, process: { ...data.process, steps } });
                  }}
                />
                <Label className="text-xs">Keterangan</Label>
                <textarea
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={step.description}
                  onChange={(e) => {
                    const steps = [...data.process.steps];
                    steps[idx] = { ...step, description: e.target.value };
                    setData({ ...data, process: { ...data.process, steps } });
                  }}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2. PILIHAN PAKET */}
      <Card>
        <CardHeader>
          <CardTitle>2. Pilihan Paket &amp; Harga</CardTitle>
          <CardDescription>
            Kelola Paket Inti (Rp 149.000), Paket Cerita (Rp 249.000), badge rekomendasi, dan daftar fitur.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Judul Paket</Label>
              <Input
                value={data.packages.title}
                onChange={(e) =>
                  setData({ ...data, packages: { ...data.packages, title: e.target.value } })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Subjudul</Label>
              <Input
                value={data.packages.subtitle}
                onChange={(e) =>
                  setData({ ...data, packages: { ...data.packages, subtitle: e.target.value } })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Label Tombol CTA</Label>
              <Input
                value={data.packages.ctaLabel}
                onChange={(e) =>
                  setData({ ...data, packages: { ...data.packages, ctaLabel: e.target.value } })
                }
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {data.packages.items.map((pkg, idx) => (
              <div key={pkg.id} className="space-y-3 rounded-lg border p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Nama Paket</Label>
                    <Input
                      value={pkg.name}
                      onChange={(e) => {
                        const items = [...data.packages.items];
                        items[idx] = { ...pkg, name: e.target.value };
                        setData({ ...data, packages: { ...data.packages, items } });
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Harga (Rp)</Label>
                    <Input
                      type="number"
                      value={pkg.price}
                      onChange={(e) => {
                        const items = [...data.packages.items];
                        items[idx] = { ...pkg, price: Number(e.target.value) || 0 };
                        setData({ ...data, packages: { ...data.packages, items } });
                      }}
                    />
                  </div>
                </div>
                {pkg.popular && (
                  <div className="space-y-1">
                    <Label className="text-xs">Badge Rekomendasi</Label>
                    <Input
                      value={pkg.badge ?? ""}
                      onChange={(e) => {
                        const items = [...data.packages.items];
                        items[idx] = { ...pkg, badge: e.target.value };
                        setData({ ...data, packages: { ...data.packages, items } });
                      }}
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <Label className="text-xs">Deskripsi Paket</Label>
                  <Input
                    value={pkg.description}
                    onChange={(e) => {
                      const items = [...data.packages.items];
                      items[idx] = { ...pkg, description: e.target.value };
                      setData({ ...data, packages: { ...data.packages, items } });
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Daftar Fitur (1 per baris)</Label>
                  <textarea
                    rows={5}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={pkg.features.join("\n")}
                    onChange={(e) => {
                      const items = [...data.packages.items];
                      items[idx] = {
                        ...pkg,
                        features: e.target.value.split("\n").filter((l) => l.trim().length > 0)
                      };
                      setData({ ...data, packages: { ...data.packages, items } });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3. TESTIMONI */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle>3. Testimoni Mempelai</CardTitle>
            <CardDescription>
              Kelola kisah bahagia dan ulasan pasangan pengantin.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setData({
                ...data,
                testimonials: {
                  ...data.testimonials,
                  items: [
                    ...data.testimonials.items,
                    { quote: "“Ulasan baru...”", author: "Nama Pasangan", location: "Kota" }
                  ]
                }
              })
            }
          >
            <Plus className="mr-1 size-3.5" /> Tambah Testimoni
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-3">
            {data.testimonials.items.map((item, idx) => (
              <div key={idx} className="space-y-2 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Testimoni #{idx + 1}</Label>
                  {data.testimonials.items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() =>
                        setData({
                          ...data,
                          testimonials: {
                            ...data.testimonials,
                            items: data.testimonials.items.filter((_, i) => i !== idx)
                          }
                        })
                      }
                    >
                      <Trash2 className="size-3 text-destructive" />
                    </Button>
                  )}
                </div>
                <textarea
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-xs shadow-xs"
                  value={item.quote}
                  onChange={(e) => {
                    const items = [...data.testimonials.items];
                    items[idx] = { ...item, quote: e.target.value };
                    setData({ ...data, testimonials: { ...data.testimonials, items } });
                  }}
                />
                <Input
                  value={item.author}
                  placeholder="Nama Pasangan"
                  onChange={(e) => {
                    const items = [...data.testimonials.items];
                    items[idx] = { ...item, author: e.target.value };
                    setData({ ...data, testimonials: { ...data.testimonials, items } });
                  }}
                />
                <Input
                  value={item.location}
                  placeholder="Lokasi"
                  onChange={(e) => {
                    const items = [...data.testimonials.items];
                    items[idx] = { ...item, location: e.target.value };
                    setData({ ...data, testimonials: { ...data.testimonials, items } });
                  }}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 4. FAQ */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle>4. Jawaban Studio (FAQ)</CardTitle>
            <CardDescription>
              Kelola pertanyaan yang sering diajukan oleh calon pengantin.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setData({
                ...data,
                faq: {
                  ...data.faq,
                  items: [
                    ...data.faq.items,
                    { question: "Pertanyaan baru?", answer: "Jawaban studio..." }
                  ]
                }
              })
            }
          >
            <Plus className="mr-1 size-3.5" /> Tambah FAQ
          </Button>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {data.faq.items.map((item, idx) => (
            <div key={idx} className="space-y-2 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Pertanyaan #{idx + 1}</Label>
                {data.faq.items.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() =>
                      setData({
                        ...data,
                        faq: {
                          ...data.faq,
                          items: data.faq.items.filter((_, i) => i !== idx)
                        }
                      })
                    }
                  >
                    <Trash2 className="size-3 text-destructive" />
                  </Button>
                )}
              </div>
              <Input
                value={item.question}
                onChange={(e) => {
                  const items = [...data.faq.items];
                  items[idx] = { ...item, question: e.target.value };
                  setData({ ...data, faq: { ...data.faq, items } });
                }}
              />
              <textarea
                rows={2}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-xs shadow-xs"
                value={item.answer}
                onChange={(e) => {
                  const items = [...data.faq.items];
                  items[idx] = { ...item, answer: e.target.value };
                  setData({ ...data, faq: { ...data.faq, items } });
                }}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 5. FOOTER */}
      <Card>
        <CardHeader>
          <CardTitle>5. Footer Studio</CardTitle>
          <CardDescription>
            Kelola tagline, hak cipta, dan kutipan bawah halaman.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5 sm:col-span-3">
            <Label>Tagline Footer</Label>
            <Input
              value={data.footer.tagline}
              onChange={(e) =>
                setData({ ...data, footer: { ...data.footer, tagline: e.target.value } })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label>Teks Hak Cipta</Label>
            <Input
              value={data.footer.copyright}
              onChange={(e) =>
                setData({ ...data, footer: { ...data.footer, copyright: e.target.value } })
              }
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Kutipan Bawah</Label>
            <Input
              value={data.footer.bottomQuote}
              onChange={(e) =>
                setData({ ...data, footer: { ...data.footer, bottomQuote: e.target.value } })
              }
            />
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 justify-end">
          <Button type="submit" size="sm" disabled={saving}>
            Simpan Seluruh Perubahan ke Backend
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
