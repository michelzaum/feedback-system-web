import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store/auth";
import { getOrganizations } from "@/api/organizations";
import type { Organization } from "@/api/organizations/types";
import { toast } from "sonner";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Briefcase, ChevronsUpDown, Plus } from "lucide-react";

export function TeamSwitcher() {
  const navigate = useNavigate();
  const { isMobile } = useSidebar();
  const selectedOrganization = useAuthStore((state) => state.selectedOrganization);
  const setSelectedOrganization = useAuthStore((state) => state.setSelectedOrganization);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    async function fetchOrgs() {
      try {
        const orgs = await getOrganizations();
        setOrganizations(orgs);
      } catch {
        toast.error("Failed to load organizations");
      }
    }
    fetchOrgs();
  }, []);

  const handleSwitch = (org: Organization) => {
    setSelectedOrganization(org);
    navigate("/", { replace: true });
  };

  if (!selectedOrganization) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            }
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Briefcase className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{selectedOrganization.name}</span>
              <span className="truncate text-xs">{selectedOrganization.role}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--anchor-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Organizations
              </DropdownMenuLabel>
              {organizations.map((org, index) => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => handleSwitch(org)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <Briefcase className="size-3.5 shrink-0" />
                  </div>
                  {org.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export default TeamSwitcher;
