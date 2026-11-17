"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ROLE_PERMISSIONS, type StudioRole } from "@/lib/site-content";

interface DashboardHeaderProps {
  role: StudioRole;
  onRoleChange: (role: StudioRole) => void;
}

export function DashboardHeader({ role, onRoleChange }: DashboardHeaderProps) {
  const perm = ROLE_PERMISSIONS[role];

  return (
    <header className="sticky top-0 z-20 flex h-(--header-height) shrink-0 items-center gap-2 border-b border-border/80 bg-background/95 backdrop-blur-sm transition-[width,height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <span className="font-sans text-sm font-semibold tracking-tight text-foreground">
          Temu Janji Studio
        </span>
        <Badge variant="secondary" className="hidden sm:inline-flex">
          {perm.label} · {perm.badge}
        </Badge>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground md:inline">
              Peran Aktif:
            </span>
            <Select
              value={role}
              onValueChange={(val) => onRoleChange(val as StudioRole)}
            >
              <SelectTrigger className="h-8 w-[130px] text-xs" aria-label="Pilih Peran">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="dev">Dev</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" asChild size="sm" className="hidden sm:flex">
            <Link href="/" target="_blank">
              Lihat Beranda ↗
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
