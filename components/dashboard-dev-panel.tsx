"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Database,
  HardDriveDownload,
  Lock,
  Package,
  RefreshCw,
  Server,
  ShieldAlert,
  Terminal,
  Wrench,
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
import { Checkbox } from "@/components/ui/checkbox";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  createBackupSchema,
  updateSystemConfigSchema,
  type DevConsolePayload,
  type StudioRoleType,
} from "@/lib/schemas/studio";

interface DevConsolePanelProps {
  role: StudioRoleType;
}

export function DevConsolePanel({ role }: DevConsolePanelProps) {
  const [devData, setDevData] = React.useState<DevConsolePayload | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [runningCheck, setRunningCheck] = React.useState(false);

  const loadDevData = React.useCallback(async () => {
    if (role !== "dev") {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/studio/dev", {
        headers: { "x-studio-role": role },
        cache: "no-store",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || "Gagal memuat konsol developer");
      }
      const json = (await res.json()) as DevConsolePayload;
      setDevData(json);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memuat data dev");
    } finally {
      setLoading(false);
    }
  }, [role]);

  React.useEffect(() => {
    loadDevData();
  }, [loadDevData]);

  const maintenanceForm = useZodForm({
    schema: updateSystemConfigSchema,
    defaultValues: {
      maintenanceMode: devData?.systemConfig.maintenanceMode ?? false,
      maintenanceMessage:
        devData?.systemConfig.maintenanceMessage ??
        "Studio sedang melakukan pemeliharaan terjadwal. Kami segera kembali.",
      dailyBackupEnabled: devData?.systemConfig.dailyBackupEnabled ?? true,
      backupRetentionDay: devData?.systemConfig.backupRetentionDay ?? 30,
    },
  });

  React.useEffect(() => {
    if (!devData) return;
    maintenanceForm.reset({
      maintenanceMode: devData.systemConfig.maintenanceMode,
      maintenanceMessage: devData.systemConfig.maintenanceMessage,
      dailyBackupEnabled: devData.systemConfig.dailyBackupEnabled,
      backupRetentionDay: devData.systemConfig.backupRetentionDay,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devData?.systemConfig.updatedAt]);

  const backupForm = useZodForm({
    schema: createBackupSchema,
    defaultValues: {
      label: `Pre-release Snapshot · ${new Date().toISOString().slice(0, 10)}`,
    },
  });

  const postDevAction = async (body: unknown) => {
    const res = await fetch("/api/studio/dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-studio-role": role,
      },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || "Aksi developer gagal");
    setDevData(json as DevConsolePayload);
  };

  const handleRunHealthCheck = async () => {
    setRunningCheck(true);
    try {
      await postDevAction({ action: "healthcheck" });
      toast.success("Health check sistem & PostgreSQL selesai");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Health check gagal");
    } finally {
      setRunningCheck(false);
    }
  };

  const handleSaveMaintenance = maintenanceForm.handleSubmit(async (data) => {
    try {
      await postDevAction({ action: "maintenance", payload: data });
      toast.success(
        data.maintenanceMode
          ? "Mode Pemeliharaan DIAKTIFKAN"
          : "Pengaturan sistem & backup diperbarui"
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan config");
    }
  });

  const handleCreateBackup = backupForm.handleSubmit(async (data) => {
    try {
      await postDevAction({ action: "backup", payload: data });
      toast.success(`Backup snapshot "${data.label}" berhasil dibuat`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal membuat backup");
    }
  });

  if (role !== "dev") {
    return (
      <div className="px-4 lg:px-6">
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-sans text-base font-semibold">
              <Lock className="size-4 text-primary" />
              Akses Khusus Developer
            </CardTitle>
            <CardDescription>
              Konsol Infrastruktur, System Health, Maintenance Mode, Audit Log, dan
              Backup hanya tersedia untuk peran <strong>Dev</strong>. Pilih{" "}
              <strong>Dev</strong> pada pemilih peran di header kanan atas.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (loading || !devData) {
    return (
      <div className="px-4 text-sm text-muted-foreground lg:px-6">
        Memuat telemetri infrastruktur, database, paket, dan audit log...
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 lg:px-6">
      {/* 1. System Health KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>Status Aplikasi</span>
              <Activity className="size-4 text-primary" />
            </CardDescription>
            <CardTitle className="flex items-center gap-2 font-sans text-2xl font-semibold">
              {devData.health.status}
              <Badge
                variant={
                  devData.health.status === "HEALTHY" ? "secondary" : "destructive"
                }
              >
                {devData.health.dbLatencyMs} ms DB
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Uptime {devData.health.uptimeSec}s · {devData.health.platform}
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>Memori Runtime</span>
              <Server className="size-4 text-primary" />
            </CardDescription>
            <CardTitle className="font-sans text-2xl font-semibold tabular-nums">
              {devData.health.memoryMb.heapUsed} / {devData.health.memoryMb.heapTotal} MB
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            RSS {devData.health.memoryMb.rss} MB · Node {devData.health.nodeVersion}
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>Backup Harian</span>
              <HardDriveDownload className="size-4 text-primary" />
            </CardDescription>
            <CardTitle className="font-sans text-2xl font-semibold">
              {devData.systemConfig.dailyBackupEnabled ? "Aktif" : "Nonaktif"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {devData.backups.length} snapshot · Retensi{" "}
            {devData.systemConfig.backupRetentionDay} hari
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>Audit Log &amp; Health Check</span>
              <Terminal className="size-4 text-primary" />
            </CardDescription>
            <CardTitle className="font-sans text-2xl font-semibold tabular-nums">
              {devData.auditLogs.length} Entri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              size="sm"
              variant="outline"
              className="h-7 w-full gap-1.5 text-xs"
              disabled={runningCheck}
              onClick={handleRunHealthCheck}
            >
              <RefreshCw className={`size-3.5 ${runningCheck ? "animate-spin" : ""}`} />
              {runningCheck ? "Memeriksa..." : "Jalankan Health Check"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 2. Maintenance Mode Form + Manual Backup Form */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="border-border/80 lg:col-span-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-sans text-base font-semibold">
              <Wrench className="size-4 text-primary" />
              Maintenance Mode &amp; Kebijakan Backup
            </CardTitle>
            <CardDescription>
              Dikelola di Prisma `SystemConfig` dan diaudit otomatis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form form={maintenanceForm} onSubmit={handleSaveMaintenance}>
              <FormField
                form={maintenanceForm}
                name="maintenanceMode"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border border-border/80 p-3">
                    <div>
                      <FormLabel className="text-sm font-medium">
                        Aktifkan Maintenance Mode
                      </FormLabel>
                      <FormDescription>
                        Menandai status `/api/health` menjadi MAINTENANCE.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(Boolean(checked))
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                form={maintenanceForm}
                name="maintenanceMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pesan Pemeliharaan</FormLabel>
                    <FormControl>
                      <Textarea
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormField
                  form={maintenanceForm}
                  name="dailyBackupEnabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border border-border/80 p-3">
                      <FormLabel>Auto Backup Harian</FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(Boolean(checked))
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  form={maintenanceForm}
                  name="backupRetentionDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Retensi (Hari)</FormLabel>
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
              <Button
                type="submit"
                disabled={maintenanceForm.isSubmitting}
                className="w-full"
              >
                {maintenanceForm.isSubmitting
                  ? "Menyimpan..."
                  : "Simpan Konfigurasi Sistem"}
              </Button>
            </Form>
          </CardContent>
        </Card>

        <Card className="border-border/80 lg:col-span-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-sans text-base font-semibold">
              <HardDriveDownload className="size-4 text-primary" />
              Status Backup Harian &amp; Snapshot Manual
            </CardTitle>
            <CardDescription>
              Buat snapshot database kapan saja sebelum deploy atau migrasi.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form form={backupForm} onSubmit={handleCreateBackup}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                <FormField
                  form={backupForm}
                  name="label"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Label Snapshot Backup</FormLabel>
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
                <Button
                  type="submit"
                  disabled={backupForm.isSubmitting}
                  className="shrink-0"
                >
                  {backupForm.isSubmitting ? "Membuat..." : "Buat Backup"}
                </Button>
              </div>
            </Form>

            <div className="max-h-[210px] overflow-y-auto rounded-md border border-border/80">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Snapshot</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Ukuran</TableHead>
                    <TableHead>Checksum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devData.backups.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="text-xs font-medium">{b.label}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{b.type}</Badge>
                      </TableCell>
                      <TableCell className="text-xs tabular-nums">
                        {b.sizeKb} KB
                      </TableCell>
                      <TableCell className="font-mono text-[11px] text-muted-foreground">
                        {b.checksum}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Database Tables + API Endpoints + Env Checks */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="border-border/80 lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-sans text-base font-semibold">
              <Database className="size-4 text-primary" />
              Database &amp; Environment
            </CardTitle>
            <CardDescription>
              Baris tabel PostgreSQL &amp; variabel lingkungan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              {devData.health.envChecks.map((env) => (
                <div
                  key={env.key}
                  className="flex items-center justify-between rounded-md border border-border/70 px-2.5 py-1.5 text-xs"
                >
                  <div>
                    <span className="font-mono font-medium">{env.key}</span>
                    <p className="text-[11px] text-muted-foreground">{env.note}</p>
                  </div>
                  <Badge variant={env.present ? "secondary" : "destructive"}>
                    {env.present ? "OK" : "MISSING"}
                  </Badge>
                </div>
              ))}
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model Prisma</TableHead>
                  <TableHead className="text-right">Baris</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devData.databaseTables.map((t) => (
                  <TableRow key={t.table}>
                    <TableCell className="font-mono text-xs">{t.table}</TableCell>
                    <TableCell className="text-right text-xs tabular-nums">
                      {t.rows}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-border/80 lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-sans text-base font-semibold">
              <Server className="size-4 text-primary" />
              API &amp; Proxy Endpoints
            </CardTitle>
            <CardDescription>
              Rute aktif Next.js App Router &amp; middleware.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Akses</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devData.apiEndpoints.map((ep) => (
                  <TableRow key={ep.path}>
                    <TableCell>
                      <div className="font-mono text-xs">{ep.path}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {ep.methods}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{ep.auth}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{ep.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-border/80 lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-sans text-base font-semibold">
              <Package className="size-4 text-primary" />
              Framework &amp; Paket Terpasang
            </CardTitle>
            <CardDescription>
              Versi langsung dari `package.json`.
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[340px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paket</TableHead>
                  <TableHead>Versi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devData.packages.map((pkg) => (
                  <TableRow key={pkg.name}>
                    <TableCell>
                      <div className="font-mono text-xs">{pkg.name}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {pkg.category}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {pkg.version}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* 4. Advisories + Recommendations */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-sans text-base font-semibold">
              <ShieldAlert className="size-4 text-primary" />
              Advisory Keamanan &amp; Runtime
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {devData.advisories.map((adv) => (
              <div
                key={adv.id}
                className="flex items-start gap-2.5 rounded-lg border border-border/80 p-3 text-xs"
              >
                {adv.severity === "INFO" ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                ) : (
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
                )}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-semibold">
                    <span>{adv.title}</span>
                    <Badge variant="secondary">{adv.severity}</Badge>
                  </div>
                  <p className="text-muted-foreground">{adv.detail}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-sans text-base font-semibold">
              <SparklesIcon />
              Rekomendasi Infrastruktur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {devData.recommendations.map((rec) => (
              <div
                key={rec.id}
                className="rounded-lg border border-border/80 p-3 text-xs"
              >
                <div className="mb-1 flex items-center justify-between gap-2 font-semibold">
                  <span>{rec.title}</span>
                  <Badge variant={rec.priority === "HIGH" ? "default" : "secondary"}>
                    {rec.priority}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{rec.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 5. Audit Log Table */}
      <Card className="border-border/80">
        <CardHeader>
          <CardTitle className="font-sans text-base font-semibold">
            Audit Log Aktivitas Studio
          </CardTitle>
          <CardDescription>
            Catatan kronologis perubahan konfigurasi, health check, dan snapshot.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead>Aksi</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devData.auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap font-mono text-[11px] text-muted-foreground">
                    {new Date(log.createdAt).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{log.actorRole}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs font-medium">
                    {log.action}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {log.target}
                  </TableCell>
                  <TableCell className="text-xs">{log.detail}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function SparklesIcon() {
  return <Activity className="size-4 text-primary" />;
}
