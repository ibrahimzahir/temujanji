"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Ban,
  CheckCircle2,
  Clock,
  Globe,
  Laptop,
  MapPin,
  PauseCircle,
  Plus,
  RefreshCw,
  Shield,
  Smartphone,
  Tablet,
  Trash2,
  Undo2,
  Users,
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
  FormDescription,
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
import { Textarea } from "@/components/ui/textarea";
import {
  createAnalyticsSchema,
  createOrderSchema,
  createTeamMemberSchema,
  createTrafficHitSchema,
  type StudioDashboardPayload,
  type StudioRoleType,
} from "@/lib/schemas/studio";

interface PanelProps {
  role: StudioRoleType;
  payload: StudioDashboardPayload;
  onPayloadChange: (next: StudioDashboardPayload) => void;
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

async function studioFetch(
  url: string,
  method: "POST" | "PATCH" | "DELETE",
  role: StudioRoleType,
  body?: unknown
): Promise<StudioDashboardPayload> {
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-studio-role": role,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Gagal memproses permintaan");
  }
  return json as StudioDashboardPayload;
}

export function OrdersRsvpPanel({
  role,
  payload,
  onPayloadChange,
}: PanelProps) {
  const form = useZodForm({
    schema: createOrderSchema,
    defaultValues: {
      coupleName: "",
      email: "",
      whatsapp: "",
      designSlug: "senja-di-taman",
      packageName: "Paket Cerita",
      amount: 249000,
      eventDate: "",
      venue: "",
      guestCount: 250,
      notes: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const updated = await studioFetch("/api/studio/orders", "POST", role, data);
      onPayloadChange(updated);
      form.reset();
      toast.success(`Pesanan ${data.coupleName} berhasil disimpan ke Prisma`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan pesanan");
    }
  });

  const handleTogglePayment = async (
    id: string,
    current: "PENDING" | "PAID"
  ) => {
    try {
      const nextStatus = current === "PAID" ? "PENDING" : "PAID";
      const updated = await studioFetch("/api/studio/orders", "PATCH", role, {
        id,
        paymentStatus: nextStatus,
      });
      onPayloadChange(updated);
      toast.success(`Status pembayaran diperbarui ke ${nextStatus}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memperbarui status");
    }
  };

  const handleRsvpStatus = async (
    id: string,
    rsvpStatus: "DRAFT" | "MENUNGGU_RSVP" | "SIAP_TERBIT"
  ) => {
    try {
      const updated = await studioFetch("/api/studio/orders", "PATCH", role, {
        id,
        rsvpStatus,
      });
      onPayloadChange(updated);
      toast.success("Status kurasi & RSVP diperbarui");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memperbarui RSVP");
    }
  };

  const handleDeleteOrder = async (id: string, coupleName: string) => {
    try {
      const updated = await studioFetch("/api/studio/orders", "DELETE", role, {
        id,
      });
      onPayloadChange(updated);
      toast.success(`Pesanan ${coupleName} dihapus`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus pesanan");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-12 lg:px-6">
      <Card className="border-border/80 lg:col-span-5">
        <CardHeader>
          <CardTitle className="font-sans text-base font-semibold">
            Tambah Pesanan &amp; RSVP
          </CardTitle>
          <CardDescription>
            Validasi Zod + Prisma ORM. Data langsung tersimpan ke database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form form={form} onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                form={form}
                name="coupleName"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Nama Pasangan</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: Hana &amp; Fajar"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                form={form}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Klien</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="hana@gmail.com"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                form={form}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="081234567890"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                          <SelectValue placeholder="Pilih tema" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="senja-di-taman">Senja di Taman</SelectItem>
                        <SelectItem value="sejauh-mata">Sejauh Mata</SelectItem>
                        <SelectItem value="irama-pusaka">Irama Pusaka</SelectItem>
                        <SelectItem value="aksara-rasa">Aksara Rasa</SelectItem>
                        <SelectItem value="lembayung-kasih">Lembayung Kasih</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                form={form}
                name="packageName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paket Studio</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(v) => {
                        const pkg = v as "Paket Inti" | "Paket Cerita" | "Paket Pusaka";
                        field.onChange(pkg);
                        const priceMap = {
                          "Paket Inti": 149000,
                          "Paket Cerita": 249000,
                          "Paket Pusaka": 349000,
                        };
                        form.setValue("amount", priceMap[pkg]);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Paket Inti">Paket Inti (Rp 149rb)</SelectItem>
                        <SelectItem value="Paket Cerita">Paket Cerita (Rp 249rb)</SelectItem>
                        <SelectItem value="Paket Pusaka">Paket Pusaka (Rp 349rb)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                form={form}
                name="eventDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Acara</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="18 Juni 2027"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                form={form}
                name="guestCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kuota Tamu</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                form={form}
                name="venue"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Lokasi Acara</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Hotel Majapahit, Surabaya"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                form={form}
                name="notes"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Catatan Kurator</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Permintaan musik latar, warna segel lilin, atau jadwal akad..."
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              disabled={form.isSubmitting}
              className="w-full gap-1.5"
            >
              <Plus className="size-4" />
              {form.isSubmitting ? "Menyimpan..." : "Simpan Pesanan Baru"}
            </Button>
          </Form>
        </CardContent>
      </Card>

      <Card className="border-border/80 lg:col-span-7">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-sans text-base font-semibold">
              Daftar Pesanan &amp; Rekap RSVP ({payload.orders.length})
            </CardTitle>
            <CardDescription>
              Klik status bayar untuk menandai lunas atau ubah progres kurasi.
            </CardDescription>
          </div>
          <Badge variant="secondary">{formatRupiah(payload.summary.totalRevenue)}</Badge>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pasangan</TableHead>
                <TableHead>Paket &amp; Tema</TableHead>
                <TableHead>RSVP</TableHead>
                <TableHead>Bayar</TableHead>
                <TableHead>Progres</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payload.orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">{order.coupleName}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.eventDate} · {order.venue}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-medium">{order.packageName}</div>
                    <div className="text-[11px] text-muted-foreground">{order.designSlug}</div>
                  </TableCell>
                  <TableCell className="tabular-nums text-xs">
                    {order.confirmedGuests}/{order.guestCount}
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => handleTogglePayment(order.id, order.paymentStatus)}
                      className="inline-flex cursor-pointer"
                    >
                      <Badge
                        variant={order.paymentStatus === "PAID" ? "default" : "secondary"}
                        className="gap-1"
                      >
                        {order.paymentStatus === "PAID" ? (
                          <CheckCircle2 className="size-3" />
                        ) : (
                          <Clock className="size-3" />
                        )}
                        {order.paymentStatus}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.rsvpStatus}
                      onValueChange={(v) =>
                        handleRsvpStatus(
                          order.id,
                          v as "DRAFT" | "MENUNGGU_RSVP" | "SIAP_TERBIT"
                        )
                      }
                    >
                      <SelectTrigger className="h-7 w-[140px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="MENUNGGU_RSVP">Menunggu RSVP</SelectItem>
                        <SelectItem value="SIAP_TERBIT">Siap Terbit</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={role === "editor"}
                      title={
                        role === "editor"
                          ? "Hanya Admin/Dev yang dapat menghapus"
                          : "Hapus pesanan"
                      }
                      onClick={() => handleDeleteOrder(order.id, order.coupleName)}
                    >
                      <Trash2 className="size-4 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export function AnalyticsPanel({
  role,
  payload,
  onPayloadChange,
}: PanelProps) {
  const form = useZodForm({
    schema: createAnalyticsSchema,
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      desktopViews: 260,
      mobileViews: 540,
      rsvpSubmitted: 64,
      inquiries: 14,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const updated = await studioFetch(
        "/api/studio/analytics",
        "POST",
        role,
        data
      );
      onPayloadChange(updated);
      toast.success(`Metrik tanggal ${data.date} berhasil diperbarui`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan analitik");
    }
  });

  const trafficForm = useZodForm({
    schema: createTrafficHitSchema,
    defaultValues: {
      path: "/desain/aksara-rasa",
      pageTitle: "Tema Aksara Rasa",
      location: "Semarang, ID",
      deviceType: "Mobile",
      os: "Android 15",
      browser: "Chrome",
      hits: 120,
      uniqueVisitors: 95,
      avgDurationSec: 112,
    },
  });

  const onSubmitTraffic = trafficForm.handleSubmit(async (data) => {
    try {
      const updated = await studioFetch(
        "/api/studio/traffic",
        "POST",
        role,
        data
      );
      onPayloadChange(updated);
      toast.success(`Hit trafik ${data.path} (${data.location}) disimpan`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan trafik");
    }
  });

  const totalTrafficHits = payload.trafficHits.reduce(
    (sum, item) => sum + item.hits,
    0
  );

  const locationBreakdown = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const row of payload.trafficHits) {
      map.set(row.location, (map.get(row.location) ?? 0) + row.hits);
    }
    return Array.from(map.entries())
      .map(([location, hits]) => ({
        location,
        hits,
        pct: totalTrafficHits ? Math.round((hits / totalTrafficHits) * 100) : 0,
      }))
      .sort((a, b) => b.hits - a.hits);
  }, [payload.trafficHits, totalTrafficHits]);

  const deviceBreakdown = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const row of payload.trafficHits) {
      map.set(row.deviceType, (map.get(row.deviceType) ?? 0) + row.hits);
    }
    return Array.from(map.entries())
      .map(([deviceType, hits]) => ({
        deviceType,
        hits,
        pct: totalTrafficHits ? Math.round((hits / totalTrafficHits) * 100) : 0,
      }))
      .sort((a, b) => b.hits - a.hits);
  }, [payload.trafficHits, totalTrafficHits]);

  return (
    <div className="space-y-4 px-4 lg:px-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="border-border/80 lg:col-span-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-sans text-base font-semibold">
                Analitik Kunjungan &amp; RSVP Harian
              </CardTitle>
              <CardDescription>
                Total {payload.summary.totalViews30d.toLocaleString("id-ID")} tayangan undangan tercatat di database.
              </CardDescription>
            </div>
            <Badge variant="secondary">14 Hari Terakhir</Badge>
          </CardHeader>
          <CardContent className="h-[300px] pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={payload.analytics}>
                <defs>
                  <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5b236b" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#5b236b" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#efe8f3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(v: string) => v.slice(5)}
                  fontSize={12}
                />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={40} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="mobileViews"
                  name="Mobile"
                  stroke="#5b236b"
                  fill="url(#fillMobile)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="desktopViews"
                  name="Desktop"
                  stroke="#d4af37"
                  fill="url(#fillDesktop)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/80 lg:col-span-4">
          <CardHeader>
            <CardTitle className="font-sans text-base font-semibold">
              Catat / Perbarui Metrik Harian
            </CardTitle>
            <CardDescription>
              Upsert data analitik ke Prisma berdasarkan tanggal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form form={form} onSubmit={onSubmit}>
              <FormField
                form={form}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal (YYYY-MM-DD)</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  form={form}
                  name="mobileViews"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kunjungan Mobile</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  form={form}
                  name="desktopViews"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kunjungan Desktop</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  form={form}
                  name="rsvpSubmitted"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RSVP Masuk</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  form={form}
                  name="inquiries"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Konsultasi WA</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={form.isSubmitting} className="w-full gap-1.5">
                <RefreshCw className="size-4" />
                {form.isSubmitting ? "Menyimpan..." : "Simpan Data Analitik"}
              </Button>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Web Traffic Breakdown: Top Pages + Locations + Devices */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="border-border/80 lg:col-span-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 font-sans text-base font-semibold">
                <Globe className="size-4 text-primary" />
                Halaman Paling Banyak Dikunjungi
              </CardTitle>
              <CardDescription>
                Urutan rute dengan hit tertinggi ({totalTrafficHits.toLocaleString("id-ID")} total hits).
              </CardDescription>
            </div>
            <Badge variant="secondary">{payload.trafficHits.length} Rute</Badge>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Halaman</TableHead>
                  <TableHead>Lokasi &amp; Perangkat</TableHead>
                  <TableHead className="text-right">Hits</TableHead>
                  <TableHead className="text-right">Unik</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payload.trafficHits.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div className="font-mono text-xs font-medium">{row.path}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {row.pageTitle} · {row.avgDurationSec}s avg
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">{row.location}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {row.deviceType} · {row.os} · {row.browser}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-xs font-semibold tabular-nums">
                      {row.hits.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-right text-xs tabular-nums text-muted-foreground">
                      {row.uniqueVisitors.toLocaleString("id-ID")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-border/80 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-sans text-base font-semibold">
              <MapPin className="size-4 text-primary" />
              Lokasi Pengunjung
            </CardTitle>
            <CardDescription>Distribusi kota dengan hit terbanyak.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {locationBreakdown.map((loc) => (
              <div key={loc.location} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{loc.location}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {loc.hits.toLocaleString("id-ID")} ({loc.pct}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${loc.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/80 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-sans text-base font-semibold">
              <Smartphone className="size-4 text-primary" />
              Perangkat Pengguna
            </CardTitle>
            <CardDescription>Proporsi Mobile, Desktop, dan Tablet.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {deviceBreakdown.map((dev) => {
              const Icon =
                dev.deviceType === "Mobile"
                  ? Smartphone
                  : dev.deviceType === "Tablet"
                    ? Tablet
                    : Laptop;
              return (
                <div key={dev.deviceType} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Icon className="size-3.5 text-primary" />
                      {dev.deviceType}
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                      {dev.hits.toLocaleString("id-ID")} ({dev.pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${dev.pct}%` }}
                    />
                  </div>
                </div>
              );
            })}

            <div className="border-t border-border/80 pt-3">
              <p className="mb-2 text-xs font-semibold">Simulasi / Catat Hit Halaman</p>
              <Form form={trafficForm} onSubmit={onSubmitTraffic}>
                <FormField
                  form={trafficForm}
                  name="path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Path</FormLabel>
                      <FormControl>
                        <Input
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    form={trafficForm}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lokasi</FormLabel>
                        <FormControl>
                          <Input
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    form={trafficForm}
                    name="deviceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Perangkat</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(v) =>
                            field.onChange(v as "Mobile" | "Desktop" | "Tablet")
                          }
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Mobile">Mobile</SelectItem>
                            <SelectItem value="Desktop">Desktop</SelectItem>
                            <SelectItem value="Tablet">Tablet</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  size="sm"
                  disabled={trafficForm.isSubmitting}
                  className="w-full"
                >
                  {trafficForm.isSubmitting ? "Menyimpan..." : "Catat Hit Trafik"}
                </Button>
              </Form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function TeamAccessPanel({
  role,
  payload,
  onPayloadChange,
}: PanelProps) {
  const canManageTeam = role === "admin" || role === "dev";
  const form = useZodForm({
    schema: createTeamMemberSchema,
    defaultValues: {
      name: "",
      email: "",
      role: "EDITOR",
      title: "",
      active: true,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const updated = await studioFetch("/api/studio/team", "POST", role, data);
      onPayloadChange(updated);
      form.reset();
      toast.success(`Anggota ${data.name} ditambahkan ke tim studio`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menambah anggota");
    }
  });

  const handleAssignRole = async (
    id: string,
    nextRole: "ADMIN" | "DEV" | "EDITOR",
    name: string
  ) => {
    try {
      const updated = await studioFetch("/api/studio/team", "PATCH", role, {
        id,
        role: nextRole,
      });
      onPayloadChange(updated);
      toast.success(`Peran ${name} diubah ke ${nextRole}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengubah peran");
    }
  };

  const handleRollbackRole = async (id: string, name: string) => {
    try {
      const updated = await studioFetch("/api/studio/team", "PATCH", role, {
        id,
        rollbackRole: true,
      });
      onPayloadChange(updated);
      toast.success(`Peran ${name} berhasil di-rollback`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal rollback peran");
    }
  };

  const handleSetStatus = async (
    id: string,
    status: "ACTIVE" | "SUSPENDED" | "BLOCKED",
    name: string
  ) => {
    try {
      const updated = await studioFetch("/api/studio/team", "PATCH", role, {
        id,
        status,
      });
      onPayloadChange(updated);
      const labelMap = {
        ACTIVE: "diaktifkan kembali",
        SUSPENDED: "disuspend sementara",
        BLOCKED: "diblokir",
      };
      toast.success(`Akun ${name} ${labelMap[status]}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengubah status");
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    try {
      const updated = await studioFetch("/api/studio/team", "DELETE", role, {
        id,
      });
      onPayloadChange(updated);
      toast.success(`${name} dihapus dari daftar tim`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus anggota");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-12 lg:px-6">
      <Card className="border-border/80 lg:col-span-5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-sans text-base font-semibold">
            <Shield className="size-4 text-primary" />
            Tambah Anggota &amp; Hak Akses
          </CardTitle>
          <CardDescription>
            {canManageTeam
              ? "Dilindungi middleware API untuk peran Admin & Dev."
              : "Mode Editor hanya dapat melihat daftar tim (ubah peran ke Admin/Dev di header)."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form form={form} onSubmit={onSubmit}>
            <FormField
              form={form}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: Nadia Pratiwi"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              form={form}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Studio</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="nadia@temujanji.id"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                form={form}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peran</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(v) =>
                        field.onChange(v as "ADMIN" | "DEV" | "EDITOR")
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="DEV">Dev</SelectItem>
                        <SelectItem value="EDITOR">Editor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                form={form}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jabatan</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Kurator Desain"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormDescription>
              Admin &amp; Dev memiliki akses penuh ke database, tema, dan tim.
            </FormDescription>
            <Button
              type="submit"
              disabled={!canManageTeam || form.isSubmitting}
              className="w-full gap-1.5"
            >
              <Users className="size-4" />
              {form.isSubmitting ? "Menyimpan..." : "Tambah Anggota Tim"}
            </Button>
          </Form>
        </CardContent>
      </Card>

      <Card className="border-border/80 lg:col-span-7">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-sans text-base font-semibold">
              Tim Studio Aktif ({payload.summary.activeTeamCount})
            </CardTitle>
            <CardDescription>
              Kelola peran Admin, Dev, dan Editor secara real-time.
            </CardDescription>
          </div>
          <Badge variant="secondary">{payload.team.length} Anggota</Badge>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Anggota</TableHead>
                <TableHead>Peran &amp; Rollback</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Kontrol Akses</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payload.team.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">{member.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {member.email} · {member.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Select
                        disabled={!canManageTeam}
                        value={member.role}
                        onValueChange={(v) =>
                          handleAssignRole(
                            member.id,
                            v as "ADMIN" | "DEV" | "EDITOR",
                            member.name
                          )
                        }
                      >
                        <SelectTrigger className="h-7 w-[104px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">ADMIN</SelectItem>
                          <SelectItem value="DEV">DEV</SelectItem>
                          <SelectItem value="EDITOR">EDITOR</SelectItem>
                        </SelectContent>
                      </Select>
                      {member.previousRole && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 gap-1 px-2 text-[11px]"
                          disabled={!canManageTeam}
                          title={`Rollback peran ke ${member.previousRole}`}
                          onClick={() => handleRollbackRole(member.id, member.name)}
                        >
                          <Undo2 className="size-3" />
                          {member.previousRole}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        member.status === "ACTIVE"
                          ? "secondary"
                          : member.status === "SUSPENDED"
                            ? "outline"
                            : "destructive"
                      }
                    >
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1">
                      {member.status !== "ACTIVE" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 gap-1 px-2 text-[11px]"
                          disabled={!canManageTeam}
                          onClick={() =>
                            handleSetStatus(member.id, "ACTIVE", member.name)
                          }
                        >
                          <CheckCircle2 className="size-3" />
                          Unblock
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 gap-1 px-2 text-[11px]"
                            disabled={!canManageTeam}
                            title="Suspend sementara"
                            onClick={() =>
                              handleSetStatus(member.id, "SUSPENDED", member.name)
                            }
                          >
                            <PauseCircle className="size-3" />
                            Suspend
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 gap-1 px-2 text-[11px] text-destructive hover:text-destructive"
                            disabled={!canManageTeam}
                            title="Blokir pengguna"
                            onClick={() =>
                              handleSetStatus(member.id, "BLOCKED", member.name)
                            }
                          >
                            <Ban className="size-3" />
                            Block
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        disabled={!canManageTeam}
                        onClick={() => handleDeleteMember(member.id, member.name)}
                      >
                        <Trash2 className="size-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
