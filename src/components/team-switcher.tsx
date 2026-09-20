import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { useAuthStore } from "@/store/auth"
import { getOrganizations } from "@/api/auth"
import type { Organization } from "@/api/auth"
import { toast } from "sonner"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Briefcase, ChevronDownIcon } from "lucide-react"

export function TeamSwitcher() {
  const navigate = useNavigate()
  const selectedOrganization = useAuthStore((state) => state.selectedOrganization)
  const setSelectedOrganization = useAuthStore((state) => state.setSelectedOrganization)
  const [organizations, setOrganizations] = useState<Organization[]>([])

  useEffect(() => {
    async function fetchOrgs() {
      try {
        const orgs = await getOrganizations()
        setOrganizations(orgs)
      } catch {
        toast.error("Failed to load organizations")
      }
    }
    fetchOrgs()
  }, [])

  const handleSwitch = (org: Organization) => {
    setSelectedOrganization(org)
    navigate("/", { replace: true })
  }

  if (!selectedOrganization) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Briefcase />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{selectedOrganization.name}</span>
              <span className="truncate text-xs">{selectedOrganization.role}</span>
            </div>
            <ChevronDownIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-fit" side="right" align="end" sideOffset={4}>
            {organizations.map((org) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => handleSwitch(org)}
                className="cursor-pointer"
              >
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{org.name}</span>
                  <span className="truncate text-xs">{org.role}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default TeamSwitcher
