"use client"

import {
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import { PlusIcon } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight } from "lucide-react"

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
