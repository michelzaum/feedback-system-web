"use client"

import { PlusIcon, ChevronRight } from "lucide-react"
import {
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface Project {
  id: string;
  name: string;
  slug: string;
  organizationId: string;
}

interface OrganizationWithProjects {
  id: string;
  name: string;
  slug: string;
  role: string;
  projects: Project[];
}

export function ListProjects({
  organizations,
  onNewProjectClick,
}: {
  organizations: OrganizationWithProjects[]
  onNewProjectClick: () => void
}) {
  return (
    <SidebarMenuSub>
      {organizations.map((org) => (
        <SidebarMenuSubItem key={org.id}>
          <Collapsible>
            <CollapsibleTrigger render={<SidebarMenuSubButton><ChevronRight className="size-4 mr-1" /><span>{org.name}</span></SidebarMenuSubButton>} nativeButton={false} />
            <CollapsibleContent>
              <SidebarMenuSub>
                {org.projects.map((project) => (
                  <SidebarMenuSubItem key={project.id}>
                    <SidebarMenuSubButton render={<a href={`/projects/${project.slug}`} />}>
                      <span>{project.name}</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenuSubItem>
      ))}
      <SidebarMenuSubItem>
        <SidebarMenuSubButton
          className="hover:cursor-pointer"
          onClick={onNewProjectClick}
        >
          <PlusIcon className="size-4" />
          <span>Novo projeto</span>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    </SidebarMenuSub>
  )
}
