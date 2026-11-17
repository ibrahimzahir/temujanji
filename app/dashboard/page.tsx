"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardCollectionManager } from "@/components/dashboard-collection-manager";
import { DashboardHeroManager } from "@/components/dashboard-hero-manager";
import { DashboardSectionsManager } from "@/components/dashboard-sections-manager";
import {
  AnalyticsPanel,
  OrdersRsvpPanel,
  TeamAccessPanel,
} from "@/components/dashboard-studio-panels";
import { DevConsolePanel } from "@/components/dashboard-dev-panel";
import { SectionCards } from "@/components/section-cards";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { StudioDashboardPayload } from "@/lib/schemas/studio";
import {
  ROLE_PERMISSIONS,
  ROLE_STORAGE_KEY,
  type StudioRole,
} from "@/lib/site-content";

type DashboardSectionKey =
  | "ringkasan"
  | "koleksi"
  | "pesanan"
  | "analitik"
  | "tim"
  | "dev";

const SECTION_LABELS: Record<DashboardSectionKey, string> = {
  ringkasan: "Ringkasan Studio",
  koleksi: "Koleksi & Tema",
  pesanan: "Pesanan & RSVP",
  analitik: "Analitik Kunjungan",
  tim: "Tim & Hak Akses",
  dev: "Developer & Infra",
};

export default function DashboardPage() {
  const [role, setRole] = useState<StudioRole>("admin");
  const [activeSection, setActiveSection] =
    useState<DashboardSectionKey>("ringkasan");
  const [payload, setPayload] = useState<StudioDashboardPayload | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStudioData = useCallback(async (activeRole: StudioRole) => {
    try {
      const res = await fetch("/api/studio", {
        headers: { "x-studio-role": activeRole },
        cache: "no-store",
      });
      if (res.ok) {
        const json = (await res.json()) as StudioDashboardPayload;
        setPayload(json);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let initialRole: StudioRole = "admin";
    try {
      const saved = window.localStorage.getItem(ROLE_STORAGE_KEY) as StudioRole | null;
      if (saved === "admin" || saved === "dev" || saved === "editor") {
        initialRole = saved;
        setRole(saved);
      }
      document.cookie = `tj_studio_role=${initialRole}; path=/; SameSite=Lax`;
    } catch {
      // Ignore storage errors
    }
    loadStudioData(initialRole);
  }, [loadStudioData]);

  const handleRoleChange = (nextRole: StudioRole) => {
    setRole(nextRole);
    try {
      window.localStorage.setItem(ROLE_STORAGE_KEY, nextRole);
      document.cookie = `tj_studio_role=${nextRole}; path=/; SameSite=Lax`;
    } catch {
      // Ignore storage errors
    }
    loadStudioData(nextRole);
  };

  const handleReseedDummy = async () => {
    try {
      const res = await fetch("/api/studio", {
        method: "POST",
        headers: { "x-studio-role": role },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Gagal mereset data dummy");
      setPayload(json as StudioDashboardPayload);
      toast.success("Data dummy Prisma berhasil direset & dimuat ulang");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mereset data");
    }
  };

  const perm = ROLE_PERMISSIONS[role];

  return (
    <SidebarProvider>
      <AppSidebar
        activeSection={activeSection}
        onSelectSection={(key) => setActiveSection(key as DashboardSectionKey)}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/80 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink
                    href="/dashboard"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSection("ringkasan");
                    }}
                  >
                    Temu Janji Studio
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{SECTION_LABELS[activeSection]}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              {perm.label} · {perm.badge}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={role}
              onValueChange={(v) => handleRoleChange(v as StudioRole)}
            >
              <SelectTrigger className="h-8 w-[125px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="dev">Dev</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
              </SelectContent>
            </Select>
            {(role === "admin" || role === "dev") && (
              <Button
                variant="outline"
                size="sm"
                className="hidden gap-1.5 sm:inline-flex"
                onClick={handleReseedDummy}
              >
                <RotateCcw className="size-3.5" />
                Reset Dummy
              </Button>
            )}
            <Button variant="outline" size="sm" asChild className="gap-1">
              <Link href="/" target="_blank">
                Beranda
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </header>

        <div className="@container/main flex flex-1 flex-col gap-4 py-4">
          {activeSection === "ringkasan" && (
            <>
              <SectionCards summary={payload?.summary} />
              {payload ? (
                <>
                  <AnalyticsPanel
                    role={role}
                    payload={payload}
                    onPayloadChange={setPayload}
                  />
                  <OrdersRsvpPanel
                    role={role}
                    payload={payload}
                    onPayloadChange={setPayload}
                  />
                </>
              ) : (
                <div className="px-4 text-sm text-muted-foreground lg:px-6">
                  {loading
                    ? "Memuat data studio dari Prisma..."
                    : "Data tidak tersedia."}
                </div>
              )}
              <DashboardHeroManager role={role} />
            </>
          )}

          {activeSection === "koleksi" && (
            <div className="space-y-6 px-4 lg:px-6">
              <DashboardCollectionManager role={role} />
              <DashboardSectionsManager role={role} />
            </div>
          )}

          {activeSection === "pesanan" && payload && (
            <OrdersRsvpPanel
              role={role}
              payload={payload}
              onPayloadChange={setPayload}
            />
          )}

          {activeSection === "analitik" && payload && (
            <AnalyticsPanel
              role={role}
              payload={payload}
              onPayloadChange={setPayload}
            />
          )}

          {activeSection === "tim" && payload && (
            <TeamAccessPanel
              role={role}
              payload={payload}
              onPayloadChange={setPayload}
            />
          )}

          {activeSection === "dev" && <DevConsolePanel role={role} />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
