"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  CalendarClock,
  CheckCircle2,
  ExternalLink,
  Play,
  ShoppingBag,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useZodForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  generatePinterestPinSchema,
  type PinterestPinRecordDTO,
  type StudioRoleType,
} from "@/lib/schemas/studio";

export function MarketingPinterestPanel({ role }: { role: StudioRoleType }) {
  const [pins, setPins] = React.useState<PinterestPinRecordDTO[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [runningCron, setRunningCron] = React.useState(false);

  const loadPins = React.useCallback(async () => {
    try {
      const res = await fetch("/api/studio/pinterest", {
        headers: { "x-studio-role": role },
        cache: "no-store",
      });
      if (res.ok) {
        const json = (await res.json()) as { pins: PinterestPinRecordDTO[] };
        setPins(json.pins);
      }
    } finally {
      setLoading(false);
    }
  }, [role]);

  React.useEffect(() => {
    loadPins();
  }, [loadPins]);

  const form = useZodForm({
    schema: generatePinterestPinSchema,
    defaultValues: {
      designSlug: "senja-di-taman",
      board: "Undangan Pernikahan Digital Elegan",
      angle: "promo-shopee",
      scheduledAt: new Date(Date.now() + 3600_000 * 2).toISOString().slice(0, 16),
    },
  });

  const onGenerate = form.handleSubmit(async (data) => {
    try {
      const res = await fetch("/api/studio/pinterest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-studio-role": role,
        },
        body: JSON.stringify({ mode: "generate", payload: data }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Gagal membuat konten Pin");
      setPins(json.pins as PinterestPinRecordDTO[]);
      toast.success("Konten Pinterest dibuat oleh Antigravity & dijadwalkan");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal membuat Pin");
    }
  });

  const handlePublishDue = async () => {
    setRunningCron(true);
    try {
      const res = await fetch("/api/studio/pinterest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-studio-role": role,
        },
        body: JSON.stringify({ mode: "publish-due" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Gagal menjalankan scheduler");
      setPins(json.pins as PinterestPinRecordDTO[]);
      toast.success(
        `${json.publishedCount ?? 0} Pin jatuh tempo dipublikasikan`
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Scheduler gagal");
    } finally {
      setRunningCron(false);
    }
  };

  const handlePublishNow = async (id: string) => {
    const res = await fetch("/api/studio/pinterest", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-studio-role": role,
      },
      body: JSON.stringify({ id, status: "PUBLISHED" }),
    });
    const json = await res.json();
    if (res.ok) {
      setPins(json.pins as PinterestPinRecordDTO[]);
      toast.success("Pin dipublikasikan");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch("/api/studio/pinterest", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-studio-role": role,
      },
      body: JSON.stringify({ id }),
    });
    const json = await res.json();
    if (res.ok) {
      setPins(json.pins as PinterestPinRecordDTO[]);
      toast.success("Pin dihapus");
    }
  };

  return (
    <div className="space-y-4 px-4 lg:px-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="border-border/80 lg:col-span-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-sans text-base font-semibold">
              <Sparkles className="size-4 text-primary" />
              Antigravity Pinterest Generator &amp; Scheduler
            </CardTitle>
            <CardDescription>
              Hasilkan copy Pin SEO + tautan UTM dan jadwalkan publikasi otomatis
              dari situs Temu Janji.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form form={form} onSubmit={onGenerate}>
              <FormField
                form={form}
                name="designSlug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tema Undangan</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(v) => field.onChange(v)}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="senja-di-taman">Senja di Taman</SelectItem>
                        <SelectItem value="sejauh-mata">Sejauh Mata</SelectItem>
                        <SelectItem value="irama-pusaka">Irama Pusaka</SelectItem>
                        <SelectItem value="aksara-rasa">Aksara Rasa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                form={form}
                name="board"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Board Pinterest</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(v) => field.onChange(v)}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Undangan Pernikahan Digital Elegan">
                          Undangan Pernikahan Digital Elegan
                        </SelectItem>
                        <SelectItem value="Inspirasi Akad & Resepsi Adat">
                          Inspirasi Akad &amp; Resepsi Adat
                        </SelectItem>
                        <SelectItem value="Tema Botani & Ungu Plum">
                          Tema Botani &amp; Ungu Plum
                        </SelectItem>
                        <SelectItem value="Tipografi & Kaligrafi Undangan">
                          Tipografi &amp; Kaligrafi Undangan
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                form={form}
                name="angle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Angle Konten</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(v) =>
                        field.onChange(
                          v as "romantis" | "adat" | "minimalis" | "promo-shopee"
                        )
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="promo-shopee">
                          Promo Shopee (Rp 149rb)
                        </SelectItem>
                        <SelectItem value="romantis">Romantis &amp; Intim</SelectItem>
                        <SelectItem value="adat">Adat Nusantara</SelectItem>
                        <SelectItem value="minimalis">Minimalis Eksklusif</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                form={form}
                name="scheduledAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jadwal Publikasi</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={form.isSubmitting}
                className="w-full gap-1.5"
              >
                <Sparkles className="size-4" />
                {form.isSubmitting
                  ? "Menghasilkan..."
                  : "Generate & Jadwalkan Pin"}
              </Button>
            </Form>
          </CardContent>
        </Card>

        <Card className="border-border/80 lg:col-span-7">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2 font-sans text-base font-semibold">
                <CalendarClock className="size-4 text-primary" />
                Antrean Jadwal Konten Pinterest ({pins.length})
              </CardTitle>
              <CardDescription>
                Endpoint cron otomatis: <code className="font-mono">/api/cron/pinterest</code>
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              disabled={runningCron}
              onClick={handlePublishDue}
            >
              <Play className="size-3.5" />
              {runningCron ? "Memproses..." : "Jalankan Scheduler"}
            </Button>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {loading ? (
              <p className="text-xs text-muted-foreground">Memuat jadwal Pin...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pin &amp; Board</TableHead>
                    <TableHead>Jadwal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pins.map((pin) => (
                    <TableRow key={pin.id}>
                      <TableCell>
                        <div className="font-medium text-foreground">{pin.title}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {pin.board} · {pin.designSlug}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {new Date(pin.scheduledAt).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            pin.status === "PUBLISHED" ? "default" : "secondary"
                          }
                        >
                          {pin.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-1">
                          {pin.status !== "PUBLISHED" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 gap-1 px-2 text-[11px]"
                              onClick={() => handlePublishNow(pin.id)}
                            >
                              <CheckCircle2 className="size-3" />
                              Terbitkan
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={() => handleDelete(pin.id)}
                          >
                            <Trash2 className="size-3.5 text-muted-foreground" />
                          </Button>
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

      {/* Shopee + Legal Quick Playbook */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-sans text-base font-semibold">
              <ShoppingBag className="size-4 text-primary" />
              Playbook Penjualan Shopee
            </CardTitle>
            <CardDescription>
              Alur konversi Shopee → Pesanan &amp; RSVP → Ruang Klien (1×24 jam).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            <p>
              • <strong>3 SKU Utama:</strong> Paket Inti (Rp 149rb), Paket Cerita
              (Rp 249rb), Paket Pusaka (Rp 349rb).
            </p>
            <p>
              • <strong>Auto-Reply Shopee Chat:</strong> Kirim tautan demo{" "}
              <code className="font-mono">/desain/senja-di-taman</code> &amp;
              formulir data pengantin.
            </p>
            <p>
              • <strong>Fulfillment:</strong> Catat order Shopee di tab{" "}
              <strong>Pesanan &amp; RSVP</strong> agar tamu &amp; revisi terpantau.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-sans text-base font-semibold">
              <ExternalLink className="size-4 text-primary" />
              Halaman Legal &amp; Kepatuhan
            </CardTitle>
            <CardDescription>
              Tersedia publik untuk verifikasi Shopee, Pinterest Merchant, &amp; UU PDP.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="/privasi" target="_blank" rel="noreferrer">
                Kebijakan Privasi (/privasi)
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="/syarat-ketentuan" target="_blank" rel="noreferrer">
                Syarat &amp; Ketentuan (/syarat-ketentuan)
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
