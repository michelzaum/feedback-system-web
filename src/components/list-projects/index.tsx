"use client"

import { PlusIcon } from "lucide-react"
import {
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"

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
  const projects = organizations[0]?.projects ?? [];

  return (
    <SidebarMenuSub>
      {projects.map((project) => (
        <SidebarMenuSubItem key={project.id}>
          <SidebarMenuSubButton render={<a href={`/projects/${project.slug}`} />}>
            <span>{project.name}</span>
          </SidebarMenuSubButton>
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

export default ListProjects;
