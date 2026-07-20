import { UserDTO } from '@project/types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: UserDTO;
  token: string;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}
