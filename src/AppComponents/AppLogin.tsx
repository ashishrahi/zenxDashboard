"use client";

import { useState } from "react";
import { GalleryVerticalEnd, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required"),
});

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (values: LoginFormValues) => {
    console.log("Login data:", values);
    // Add your login logic here
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-6 p-6 max-w-md mx-auto border rounded-lg shadow-sm bg-background",
        className
      )}
      {...props}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Logo and Heading */}
        <div className="flex flex-col items-center gap-3">
          <a href="#" className="flex flex-col items-center gap-2 font-medium">
            <div className="flex w-10 h-10 items-center justify-center rounded-md bg-primary">
              <GalleryVerticalEnd className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="sr-only">Zen Inc.</span>
          </a>
          <h1 className="text-2xl font-bold text-primary">Welcome to Zex-X Inc.</h1>
        </div>

        {/* Email Input */}
        <div className="grid gap-2 text-primary">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register("email")}
            autoComplete="email"
            className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.email && <div className="text-destructive text-sm mt-1">{errors.email.message}</div>}
        </div>

        {/* Password Input */}
        <div className="grid gap-2 text-primary">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password")}
              autoComplete="current-password"
              className={errors.password ? "border-destructive focus-visible:ring-destructive pr-10" : "pr-10"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <div className="text-destructive text-sm mt-1">{errors.password.message}</div>}
        </div>

        {/* Forgot Password Link */}
        <div className="text-right text-sm">
          <a href="#" className="text-primary hover:underline">
            Forgot your password?
          </a>
        </div>

        {/* Login Button */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>

        {/* Terms */}
        <div className="text-muted-foreground text-center text-xs">
          By clicking continue, you agree to our{" "}
          <a href="#" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </a>
          .
        </div>
      </form>
    </div>
  );
}
