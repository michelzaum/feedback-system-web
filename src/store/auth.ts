import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import { type Project } from "@/api/projects/types";

export interface User {
  id?: string;
  name?: string;
  email: string;
  avatar?: string;
}

interface Organization {
  id: string;
  name: string;
  slug: string;
  role: string;
}

interface OrganizationWithProjects extends Organization {
  projects: Project[];
}

interface Store {
  isAuthenticated: boolean;
  user: User | null;
  selectedOrganization: Organization | null;
  organizations: Organization[];
  organizationsWithProjects: OrganizationWithProjects[];
}

interface Actions {
  login: (user?: User, organization?: OrganizationWithProjects) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setSelectedOrganization: (org: Organization) => void;
  setOrganizations: (orgs: Organization[]) => void;
  setOrganizationsWithProjects: (orgs: OrganizationWithProjects[]) => void;
}

export const useAuthStore = create<Store & Actions>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        user: null,
        selectedOrganization: null,
        organizations: [],
        organizationsWithProjects: [],
        login: (user?: User, organization?: OrganizationWithProjects) =>
          set({ isAuthenticated: true, user: user ?? null, selectedOrganization: organization ?? null }),
        logout: () => set({ isAuthenticated: false, user: null, selectedOrganization: null, organizationsWithProjects: [] }),
        setUser: (user) => set({ user }),
        setSelectedOrganization: (org) => set({ selectedOrganization: org }),
        setOrganizations: (orgs) => set({ organizations: orgs }),
      setOrganizationsWithProjects: (orgs) => set({ organizationsWithProjects: orgs }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
);
