"use client"

export interface IUser {
  email: string;
  password: string;
  _id?: string;
  name?: string;
}

export interface IAuthState {
  token: string | null;
  email: string | null;
  user: IUser | null; // ✅ Make sure this exists
  loading: boolean;
  error: string | null;
}

export interface ILoginResponse {
  token: string;
  user: IUser; // ✅ This should match your API response structure
}