"use client";

import { useState } from "react";

import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { OrganizationSwitcher } from "@/components/organization-switcher";
import { CreateProjectModal } from "@/components/create-project";
import { ListProjects } from "@/components/list-projects";
import { useProjects } from "@/components/use-projects";
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
} from "@/components/ui/sidebar";
import { LayoutGrid, Users, MessageCircle, AppWindow } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useLocation } from "react-router";

const projects = [
  {
    name: "Visão geral",
    url: "/overview",
    icon: (
      <LayoutGrid />
    ),
  },
  {
    name: "Feedbacks",
    url: "/feedbacks",
    icon: (
      <MessageCircle />
    ),
  },
  {
    name: "Membros",
    url: "/members",
    icon: (
      <Users />
    ),
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const { organizationsWithProjects, fetchProjects } = useProjects();
  const authUser = useAuthStore((state) => state.user);
  const selectedOrganization = useAuthStore((state) => state.selectedOrganization);
  const location = useLocation();

  const isAdmin = selectedOrganization?.role === "ADMIN";
  const navItems = projects.filter((item) => item.name !== "Membros" || isAdmin);

  const user = authUser ? { name: authUser.name ?? "", email: authUser.email, avatar: authUser.avatar ?? "" } : { name: "", email: "", avatar: "" };

  const handleProjectsClick = () => {
    setIsProjectsOpen(!isProjectsOpen);
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <OrganizationSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={navItems} activeUrl={location.pathname} />
        <SidebarGroup className="group-data-[collapsible=icon]:hidden hover:cursor-pointer">
          <SidebarGroupLabel>Projetos</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleProjectsClick} className="hover:cursor-pointer">
                <AppWindow />
                <span>Projetos</span>
              </SidebarMenuButton>
              {isProjectsOpen && (
                <ListProjects
                  organizations={organizationsWithProjects}
                  onNewProjectClick={() => {
                    setIsCreateProjectModalOpen(true);
                  }}
                />
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <CreateProjectModal
          isModalOpen={isCreateProjectModalOpen}
          onOpenModalChange={setIsCreateProjectModalOpen}
          onProjectCreated={() => {
            fetchProjects();
          }}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
