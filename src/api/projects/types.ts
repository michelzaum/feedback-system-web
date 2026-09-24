export interface Project {
  id: string;
  name: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
  organizationId: string;
}

export interface UpdateProjectPayload {
  name: string;
}
