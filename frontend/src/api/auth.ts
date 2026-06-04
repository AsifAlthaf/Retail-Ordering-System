import api from './axios';
import type { AuthUser } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface AuthResponse {
  id: number;
  email: string;
  name: string;
  role: string;
  token?: string;
}

export const loginUser = async (email: string, password: string): Promise<AuthUser> => {
  const response = await api.post<AuthResponse>('/api/auth/login', {
    email,
    password,
  });

  const { id, email: responseEmail, name, role, token } = response.data;
  return {
    id,
    email: responseEmail,
    name,
    role: role.toUpperCase() as 'ADMIN' | 'USER',
    token,
  };
};

export const signupUser = async (payload: SignupRequest): Promise<AuthUser> => {
  const response = await api.post<AuthResponse>('/api/auth/signup', {
    ...payload,
  });

  const { id, email: responseEmail, name, role, token } = response.data;
  return {
    id,
    email: responseEmail,
    name,
    role: role.toUpperCase() as 'ADMIN' | 'USER',
    token,
    address: payload.address,
    city: payload.city,
    state: payload.state,
    postalCode: payload.postalCode,
  };
};
