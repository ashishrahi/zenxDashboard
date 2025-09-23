"use client"
export interface IUser {
  email: string;
  password?: string;
}

export interface IAuthState {
  token: string | null;
  email: string | null;
  loading: boolean;
  error: string | null;
}

export interface ILoginResponse {
  token: string;
  email: string;
}
