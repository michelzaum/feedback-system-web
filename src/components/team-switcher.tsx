import { Link } from "react-router"
import { useAuthStore } from "@/store/auth"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Briefcase } from "lucide-react"

export function TeamSwitcher() {
  const selectedOrganization = useAuthStore((state) => state.selectedOrganization)

  if (!selectedOrganization) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem className="hover:cursor-pointer">
        <Link to="/">
          <SidebarMenuButton size="lg" className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Briefcase />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{selectedOrganization.name}</span>
              <span className="truncate text-xs">{selectedOrganization.role}</span>
            </div>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default TeamSwitcher;
