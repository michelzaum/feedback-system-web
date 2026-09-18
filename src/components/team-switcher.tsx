import { type ReactNode } from "react"
import { Link } from "react-router"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function TeamSwitcher({
  team,
}: {
  team: {
    name: string
    logo: ReactNode
    plan: string
  }
}) {
  if (!team) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem className="hover:cursor-pointer">
        <Link to="/">
          <SidebarMenuButton size="lg" className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              {team.logo}
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{team.name}</span>
              <span className="truncate text-xs">{team.plan}</span>
            </div>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
