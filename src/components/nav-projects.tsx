"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { FolderIcon, ArrowRightIcon, Trash2Icon } from "lucide-react";

export function NavProjects({
  organizationMenuItems,
  activeUrl,
}: {
  organizationMenuItems: {
    name: string
    url: string
    icon: React.ReactNode
  }[]
  activeUrl?: string
}) {
  const { isMobile } = useSidebar();
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Organização</SidebarGroupLabel>
      <SidebarMenu>
        {organizationMenuItems.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton render={<a href={item.url} />} isActive={activeUrl === item.url}>
              {item.icon}
              <span>{item.name}</span>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuContent
                className="w-fit"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <FolderIcon
                  />
                  <span>Ver projeto</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArrowRightIcon
                  />
                  <span>Compartilhar projeto</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <Trash2Icon
                  />
                  <span>Excluir projeto</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
