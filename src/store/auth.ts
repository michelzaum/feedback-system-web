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

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  selectedOrganization: Organization | null;
  login: (user?: User, organization?: Organization) => void;
  logout: () => void;
  setSelectedOrganization: (org: Organization) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      selectedOrganization: null,
      login: (user?: User, organization?: Organization) =>
        set({ isAuthenticated: true, user: user ?? null, selectedOrganization: organization ?? null }),
      logout: () => set({ isAuthenticated: false, user: null, selectedOrganization: null }),
      setSelectedOrganization: (org) => set({ selectedOrganization: org }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
