"use client";

import * as React from "react";
import {
  BarChart3,
  ClipboardList,
  ExternalLink,
  FolderHeart,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Tim Temu Janji",
    email: "studio@temujanji.id",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Temu Janji Studio",
      logo: Sparkles,
      plan: "Admin · Akses Penuh",
    },
    {
      name: "Tim Kurasi",
      logo: FolderHeart,
      plan: "Editor · Konten",
    },
    {
      name: "Engineering",
      logo: ShieldCheck,
      plan: "Dev · Prisma & API",
    },
  ],
  navMain: [
    {
      key: "ringkasan",
      title: "Ringkasan Studio",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      key: "koleksi",
      title: "Koleksi & Tema",
      url: "/dashboard?tab=koleksi",
      icon: FolderHeart,
      items: [
        { title: "Tema & Katalog", url: "#koleksi", key: "koleksi" },
        { title: "Hero & Konten", url: "#hero", key: "ringkasan" },
      ],
    },
    {
      key: "pesanan",
      title: "Pesanan & RSVP",
      url: "/dashboard?tab=pesanan",
      icon: ClipboardList,
    },
    {
      key: "analitik",
      title: "Analitik Kunjungan",
      url: "/dashboard?tab=analitik",
      icon: BarChart3,
    },
    {
      key: "tim",
      title: "Tim & Hak Akses",
      url: "/dashboard?tab=tim",
      icon: Users,
    },
    {
      key: "marketing",
      title: "Marketing & Pinterest",
      url: "/dashboard?tab=marketing",
      icon: Sparkles,
    },
    {
      key: "dev",
      title: "Developer & Infra",
      url: "/dashboard?tab=dev",
      icon: ShieldCheck,
    },
  ],
  projects: [
    {
      name: "Lihat Beranda",
      url: "/",
      icon: ExternalLink,
    },
    {
      name: "Ruang Klien",
      url: "/akun",
      icon: Sparkles,
    },
  ],
};

export function AppSidebar({
  activeSection,
  onSelectSection,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  activeSection?: string;
  onSelectSection?: (section: string) => void;
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={data.navMain}
          activeKey={activeSection}
          onSelect={onSelectSection}
        />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
