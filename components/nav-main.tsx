"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
  activeKey,
  onSelect,
}: {
  items: {
    key: string;
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      key?: string;
    }[];
  }[];
  activeKey?: string;
  onSelect?: (key: string) => void;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu Studio</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasSub = Boolean(item.items && item.items.length > 0);
          if (!hasSub) {
            return (
              <SidebarMenuItem key={item.key}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={activeKey === item.key}
                  onClick={() => onSelect?.(item.key)}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              key={item.key}
              asChild
              defaultOpen={item.isActive || activeKey === item.key}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={activeKey === item.key}
                    onClick={() => onSelect?.(item.key)}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          onClick={(e) => {
                            if (subItem.key) {
                              e.preventDefault();
                              onSelect?.(subItem.key);
                            }
                          }}
                        >
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
