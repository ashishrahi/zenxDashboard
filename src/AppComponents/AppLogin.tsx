"use client";

import { useState } from "react";
import { Eye, EyeOff, GalleryVerticalEnd } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppDispatch, RootState } from "@/store/store";
import { loginUser } from "@/store/authSlice";
import { toast } from "sonner";

interface LoginFormValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Required"),
});

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: yupResolver(validationSchema),
  });


const onSubmit = async (values: LoginFormValues) => {
  const resultAction = await dispatch(loginUser(values));
  
  if (loginUser.fulfilled.match(resultAction)) {
    // Login successful
    const { userProfile } = resultAction.payload;
    
    toast.success("Login successful!", {
      description: `Welcome back, ${userProfile.name}!`,
    });
    
    setTimeout(() => {
      router.push("/");
    }, 1000);
    
  } else if (loginUser.rejected.match(resultAction)) {
    // Login failed - show the error message from backend
    const errorMessage = resultAction.payload;
    
    toast.error("Login Failed", {
      description: errorMessage || "Invalid credentials",
      duration: 5000,
    });
  }
};

  return (
    <div className={cn("flex flex-col gap-6 p-8 max-w-md mx-auto border border-gray-700 rounded-lg shadow-lg bg-black text-white", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3">
          <a href="#" className="flex flex-col items-center gap-2 font-medium">
            <div className="flex w-12 h-12 items-center justify-center rounded-md bg-red-600">
              <GalleryVerticalEnd className="w-6 h-6 text-white" />
            </div>
            <span className="sr-only">Company Logo</span>
          </a>
          <h1 className="text-2xl font-bold text-red-600">Welcome to Zex-X Inc.</h1>
        </div>

        {/* Email Input */}
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-gray-200">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            autoComplete="email"
            className={cn(
              "bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus-visible:ring-red-600",
              errors.email && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email.message}</div>}
        </div>

        {/* Password Input */}
        <div className="grid gap-2">
          <Label htmlFor="password" className="text-gray-200">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password")}
              autoComplete="current-password"
              className={cn(
                "bg-gray-900 border-gray-700 text-white placeholder-gray-400 pr-10 focus-visible:ring-red-600",
                errors.password && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password.message}</div>}
        </div>

        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>

        {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
      </form>
    </div>
  );
}
