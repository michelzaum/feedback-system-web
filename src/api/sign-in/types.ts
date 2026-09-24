export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignInResponse {
  message: string;
}

export interface SignOutResponse {
  message: string;
}

export interface UserResponse {
  message: string;
  name: string;
  email: string;
  avatar?: string;
}
