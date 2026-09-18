"use client"

import { useState, type ReactNode } from "react"

import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { CreateProjectModal } from "@/components/create-project"
import { ListProjects } from "@/components/list-projects"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { GalleryVerticalEndIcon, LayoutDashboard, Users, MessageCircle, AppWindow } from "lucide-react"
import { useAuthStore } from "@/store/auth"

const team = {
  name: "Acme Inc",
  logo: (
    <GalleryVerticalEndIcon />
  ),
  plan: "Enterprise",
}

const projects = [
  {
    name: "Overview",
    url: "#",
    icon: (
      <LayoutDashboard />
    ),
  },
  {
    name: "Feedbacks",
    url: "#",
    icon: (
      <MessageCircle />
    ),
  },
  {
    name: "Membros",
    url: "#",
    icon: (
      <Users />
    ),
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [projectsList, setProjectsList] = useState<{ name: string; url: string; icon: ReactNode }[]>([]);
  const authUser = useAuthStore((state) => state.user)

  const user = authUser ? { name: authUser.name ?? "", email: authUser.email, avatar: authUser.avatar ?? "" } : { name: "", email: "", avatar: "" }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher team={team} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={projects} />
        <SidebarGroup className="group-data-[collapsible=icon]:hidden hover:cursor-pointer">
          <SidebarGroupLabel>Projetos</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setIsProjectsOpen(!isProjectsOpen)} className="hover:cursor-pointer">
                <AppWindow />
                <span>Projetos</span>
              </SidebarMenuButton>
              {isProjectsOpen && (
                <ListProjects
                  projects={projectsList}
                  onNewProjectClick={() => {
                    setIsCreateProjectModalOpen(true)
                  }}
                />
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <CreateProjectModal
          isModalOpen={isCreateProjectModalOpen}
          onOpenModalChange={setIsCreateProjectModalOpen}
          onProjectCreated={(name) => {
            setProjectsList((prev) => [...prev, { name, url: "#", icon: <AppWindow /> }])
          }}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
