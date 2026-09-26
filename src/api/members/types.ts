export interface OrganizationMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface MemberOrganization {
  id: string;
  name: string;
  role: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  organizations: MemberOrganization[];
}

export interface MemberInfo {
  userId: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface CreateMemberPayload {
  userId: string;
  role: "ADMIN" | "MEMBER";
}
