export interface Profile {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  password?: string;
}
