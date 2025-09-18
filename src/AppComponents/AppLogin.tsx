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

interface LoginFormProps extends React.ComponentProps<"div"> {}

interface LoginFormValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Required"),
});

export function LoginForm({ className, ...props }: LoginFormProps) {
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
    <div className={cn("flex flex-col gap-6 p-6 max-w-md mx-auto border rounded-lg shadow-sm bg-background", className)} {...props}>
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
          {/* <div className="text-center text-sm text-foreground">
            Don&apos;t have an account?{" "}
            <a href="#" className="font-medium text-primary hover:underline">
              Sign up
            </a>
          </div> */}
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
          {errors.email && (
            <div className="text-destructive text-sm mt-1">{errors.email.message}</div>
          )}
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
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <div className="text-destructive text-sm mt-1">{errors.password.message}</div>
          )}
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

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          {/* <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div> */}
        </div>

        {/* Social Login Buttons
        // <div className="grid gap-3 sm:grid-cols-2">
        //   <Button variant="outline" type="button" className="w-full">
        //     <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="apple" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        //       <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.1-27.8 44.5-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path>
        //     </svg>
        //     Apple
        //   </Button>
        //   <Button variant="outline" type="button" className="w-full">
        //     <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        //       <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
        //     </svg>
        //     Google
        //   </Button>
        // </div> */}
      </form>

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
    </div>
  );
}