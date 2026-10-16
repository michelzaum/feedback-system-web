"use client";

import { PlusIcon } from "lucide-react";
import {
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import type { Project } from "@/api/projects/types";

export function ListProjects({
  projects,
  onNewProjectClick,
}: {
  projects: Project[]
  onNewProjectClick: () => void
}) {
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
  );
}

export default ListProjects;
