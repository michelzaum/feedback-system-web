"use client"

import {
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import { PlusIcon } from "lucide-react"

export function ListProjects({
  projects,
  onNewProjectClick,
}: {
  projects: { name: string; url: string; icon: React.ReactNode }[]
  onNewProjectClick: () => void
}) {
  return (
    <SidebarMenuSub>
      {projects.map((project) => (
        <SidebarMenuSubItem key={project.name}>
          <SidebarMenuSubButton render={<a href={project.url} />}>
            {project.icon}
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