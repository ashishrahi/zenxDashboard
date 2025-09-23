// src/AppComponents/AppProtectedRoute.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface Props {
  children: React.ReactNode;
}

export default function AppProtectedRoute({ children }: Props) {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);
  console.log('token', token)

  useEffect(() => {
    if (!token) {
      router.push("/login"); // redirect to login if not authenticated
    }
  }, [token, router]);

  if (!token) return null; // prevents unauthorized flash

  return <>{children}</>;
}
