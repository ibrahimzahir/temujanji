"use client";

import { useEffect, useState } from "react";
import { Check, Plus, RotateCcw, Trash2, Pencil, Database } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { categories } from "@/lib/catalog";
import {
  DEFAULT_COLLECTION_SECTION,
  type CollectionPayload,
  type CollectionSectionCopy,
  type ManagedTemplate
} from "@/lib/collection-types";
import type { StudioRole } from "@/lib/site-content";

const EMPTY_TEMPLATE: ManagedTemplate = {
  slug: "",
  name: "",
  category: "Lux Floral",
  image: "/images/garden.jpg",
  color: "#f4ecf9",
  layout: "botanical",
  sample: "Dara & Rafi",
  description: "",
  tag: "Baru",
  accent: "#5b236b",
  venue: "Plataran Hutan Kota, Jakarta",
  date: "Sabtu, 24 Oktober 2026",
  quote: "Dua hati yang dipersatukan dalam doa dan restu keluarga.",
  published: true,
  sortOrder: 9
};

export function DashboardCollectionManager({ role }: { role: StudioRole }) {
  const [section, setSection] = useState<CollectionSectionCopy>(DEFAULT_COLLECTION_SECTION);
  const [templates, setTemplates] = useState<ManagedTemplate[]>([]);
  const [source, setSource] = useState<"prisma" | "file">("file");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [editing, setEditing] = useState<ManagedTemplate | null>(null);

  const fetchCollection = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/collection", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as CollectionPayload;
        setSection(data.section);
        setTemplates(data.templates);
        setSource(data.source);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollection();
  }, []);

  const showNotice = (msg: string) => {
    setNotice(msg);
    window.dispatchEvent(new Event("temujanji-collection-updated"));
    setTimeout(() => setNotice(null), 2800);
  };

  const handleSaveCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/collection", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(section)
      });
      if (res.ok) {
        const data = (await res.json()) as CollectionPayload;
        setSection(data.section);
        showNotice("Teks koleksi tersimpan ke backend");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch("/api/collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upsert", template: editing })
      });
      if (res.ok) {
        const data = (await res.json()) as CollectionPayload;
        setTemplates(data.templates);
        setEditing(null);
        showNotice(`Tema "${editing.name}" tersimpan`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublished = async (tpl: ManagedTemplate) => {
    const res = await fetch("/api/collection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "upsert",
        template: { ...tpl, published: !tpl.published }
      })
    });
    if (res.ok) {
      const data = (await res.json()) as CollectionPayload;
      setTemplates(data.templates);
      showNotice(`Status "${tpl.name}" diperbarui`);
    }
  };

  const handleDeleteTemplate = async (slug: string) => {
    const res = await fetch("/api/collection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", slug })
    });
    if (res.ok) {
      const data = (await res.json()) as CollectionPayload;
      setTemplates(data.templates);
      showNotice("Tema dihapus");
    }
  };

  const handleResetAll = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" })
      });
      if (res.ok) {
        const data = (await res.json()) as CollectionPayload;
        setSection(data.section);
        setTemplates(data.templates);
        setEditing(null);
        showNotice("Koleksi dikembalikan ke bawaan studio");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/30 px-4 py-2.5 text-xs">
        <div className="flex items-center gap-2">
          <Database className="size-3.5 text-primary" />
          <span>
            Backend API aktif: <code className="font-mono">/api/collection</code> (
            {source === "prisma" ? "PostgreSQL · Prisma" : "Server JSON Store"})
          </span>
          <Badge variant="outline" className="uppercase">
            {role}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          {notice && (
            <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
              <Check className="size-3.5" /> {notice}
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={handleResetAll} disabled={saving}>
            <RotateCcw className="mr-1.5 size-3.5" />
            Reset Bawaan
          </Button>
        </div>
      </div>

      {/* 1. Section Header Copy Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Header &amp; Pencarian Koleksi Studio</CardTitle>
          <CardDescription>
            Atur teks judul, deskripsi, dan label pencarian untuk bagian Koleksi Studio.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSaveCopy}>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="col-eyebrow">Eyebrow</Label>
              <Input
                id="col-eyebrow"
                value={section.eyebrow}
                onChange={(e) => setSection({ ...section, eyebrow: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="col-search">Label Pencarian</Label>
              <Input
                id="col-search"
                value={section.searchPlaceholder}
                onChange={(e) =>
                  setSection({ ...section, searchPlaceholder: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="col-t1">Judul Utama</Label>
              <Input
                id="col-t1"
                value={section.titleLine1}
                onChange={(e) => setSection({ ...section, titleLine1: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="col-t2">Highlight Kaligrafi</Label>
              <Input
                id="col-t2"
                value={section.titleHighlight}
                onChange={(e) =>
                  setSection({ ...section, titleHighlight: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="col-desc">Deskripsi Koleksi</Label>
              <textarea
                id="col-desc"
                rows={2}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={section.description}
                onChange={(e) =>
                  setSection({ ...section, description: e.target.value })
                }
              />
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 justify-end">
            <Button type="submit" size="sm" disabled={saving}>
              Simpan Teks Koleksi
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* 2. Create / Edit Theme Form (if active) */}
      {editing && (
        <Card className="border-primary/40">
          <CardHeader>
            <CardTitle>
              {templates.some((t) => t.slug === editing.slug)
                ? `Edit Tema: ${editing.name}`
                : "Tambah Tema Desain Baru"}
            </CardTitle>
            <CardDescription>
              Perubahan akan langsung tersimpan di backend dan tampil di grid 4 kolom.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSaveTemplate}>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="tpl-name">Nama Tema</Label>
                <Input
                  id="tpl-name"
                  required
                  value={editing.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const autoSlug = editing.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                    setEditing({ ...editing, name, slug: autoSlug });
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tpl-slug">Slug URL</Label>
                <Input
                  id="tpl-slug"
                  required
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tpl-cat">Kategori</Label>
                <Select
                  value={editing.category}
                  onValueChange={(val) => setEditing({ ...editing, category: val })}
                >
                  <SelectTrigger id="tpl-cat">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tpl-sample">Contoh Nama Pasangan</Label>
                <Input
                  id="tpl-sample"
                  required
                  value={editing.sample}
                  onChange={(e) => setEditing({ ...editing, sample: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tpl-tag">Badge / Tag</Label>
                <Input
                  id="tpl-tag"
                  value={editing.tag}
                  onChange={(e) => setEditing({ ...editing, tag: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tpl-color">Warna Latar Kartu (Hex)</Label>
                <Input
                  id="tpl-color"
                  value={editing.color}
                  onChange={(e) => setEditing({ ...editing, color: e.target.value })}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-3">
                <Label htmlFor="tpl-desc">Deskripsi Tema</Label>
                <Input
                  id="tpl-desc"
                  required
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-4">
              <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(null)}>
                Batal
              </Button>
              <Button type="submit" size="sm" disabled={saving}>
                Simpan Tema ke Backend
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* 3. Templates Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Daftar Tema Undangan ({templates.length})</CardTitle>
            <CardDescription>
              Kelola seluruh tema desain yang muncul di halaman utama Koleksi Studio.
            </CardDescription>
          </div>
          <Button
            size="sm"
            onClick={() =>
              setEditing({
                ...EMPTY_TEMPLATE,
                sortOrder: templates.length + 1
              })
            }
          >
            <Plus className="mr-1.5 size-3.5" />
            Tambah Tema
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Memuat koleksi dari backend...
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tema</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Pasangan</TableHead>
                  <TableHead>Tag</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((tpl) => (
                  <TableRow key={tpl.slug}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block size-3.5 rounded-full border"
                          style={{ backgroundColor: tpl.color }}
                        />
                        <span>{tpl.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{tpl.category}</TableCell>
                    <TableCell>{tpl.sample}</TableCell>
                    <TableCell>
                      {tpl.tag ? <Badge variant="secondary">{tpl.tag}</Badge> : "—"}
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => handleTogglePublished(tpl)}
                        className="cursor-pointer"
                      >
                        <Badge variant={tpl.published ? "default" : "outline"}>
                          {tpl.published ? "Tayang" : "Draft"}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => setEditing(tpl)}
                          title="Edit tema"
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        {role === "admin" && (
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => handleDeleteTemplate(tpl.slug)}
                            title="Hapus tema"
                          >
                            <Trash2 className="size-3.5 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
