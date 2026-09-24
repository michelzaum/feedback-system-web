import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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
  projects: import("@/api/auth").Project[];
}

interface Store {
  isAuthenticated: boolean;
  user: User | null;
  selectedOrganization: Organization | null;
  organizationsWithProjects: OrganizationWithProjects[];
}

interface Actions {
  login: (user?: User, organization?: Organization) => void;
  logout: () => void;
  setSelectedOrganization: (org: Organization) => void;
  setOrganizationsWithProjects: (orgs: OrganizationWithProjects[]) => void;

}

export const useAuthStore = create<Store & Actions>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      selectedOrganization: null,
      organizationsWithProjects: [],
      login: (user?: User, organization?: Organization) =>
        set({ isAuthenticated: true, user: user ?? null, selectedOrganization: organization ?? null }),
      logout: () => set({ isAuthenticated: false, user: null, selectedOrganization: null, organizationsWithProjects: [] }),
      setSelectedOrganization: (org) => set({ selectedOrganization: org }),
      setOrganizationsWithProjects: (orgs) => set({ organizationsWithProjects: orgs }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
