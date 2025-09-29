"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";

// ===== Types =====
export interface IAuth {
  _id: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserProfile {
  _id: string;
  authId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ILoginResponse {
  auth: IAuth;
  userProfile: IUserProfile;
  token: string;
  refreshToken: string;
}

export interface IUser {
  email: string;
  password: string;
}

export interface IAuthState {
  token: string | null;
  refreshToken: string | null;
  auth: IAuth | null;
  user: IUserProfile | null;
  loading: boolean;
  error: string | null;
}

// ===== Initial State =====
const initialState: IAuthState = {
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  refreshToken: typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null,
  auth: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("auth") || "null") : null,
  user: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null,
  loading: false,
  error: null,
};

// ===== Thunks =====
export const loginUser = createAsyncThunk<ILoginResponse, IUser, { rejectValue: string }>(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", userData);
      if (!response.data || !response.data.data) throw new Error("Invalid API response");
      return response?.data?.data;
    } catch (err: unknown) {
  let message = "Refresh token failed";

  if (err instanceof AxiosError) {
    message = err.response?.data?.message || message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  return rejectWithValue(message);
}
  }
);

export const refreshTokenThunk = createAsyncThunk<{ token: string }, void, { rejectValue: string }>(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    if (typeof window === "undefined") return rejectWithValue("No refresh token");

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return rejectWithValue("No refresh token");

    try {
      const { data } = await axiosInstance.post("/auth/refresh-token", { refreshToken });
      localStorage.setItem("token", data.data.token);
      return { token: data.data.token };
    } catch (err: unknown) {
  let message = "Refresh token failed";

  if (err instanceof AxiosError) {
    message = err.response?.data?.message || message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  return rejectWithValue(message);
}
  }
);

// ===== Slice =====
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.refreshToken = null;
      state.auth = null;
      state.user = null;
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("auth");
        localStorage.removeItem("user");
      }
    },
    clearError(state) {
      state.error = null;
    },
    setAuthState(state, action: PayloadAction<Partial<IAuthState>>) {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== Login =====
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<ILoginResponse>) => {
        state.loading = false;
        state.error = null;
        const { token, refreshToken, auth, userProfile } = action.payload;

        state.token = token;
        state.refreshToken = refreshToken;
        state.auth = auth;
        state.user = userProfile;

        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("auth", JSON.stringify(auth));
          localStorage.setItem("user", JSON.stringify(userProfile));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.token = null;
        state.refreshToken = null;
        state.auth = null;
        state.user = null;
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("auth");
          localStorage.removeItem("user");
        }
      })
      // ===== Refresh Token =====
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        state.token = action.payload.token;
      })
      .addCase(refreshTokenThunk.rejected, (state) => {
        state.token = null;
        state.refreshToken = null;
        state.auth = null;
        state.user = null;
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("auth");
          localStorage.removeItem("user");
        }
      });
  },
});

// ===== Export =====
export const { logout, clearError, setAuthState } = authSlice.actions;
export default authSlice.reducer;
