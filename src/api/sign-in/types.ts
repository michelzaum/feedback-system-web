export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignInResponse {
  message: string;
}

export interface UserResponse {
  id: string;
  message: string;
  name: string;
  email: string;
  avatar?: string;
}
