export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export interface UserResponse {
  message: string;
  name: string;
  email: string;
  avatar?: string;
}
