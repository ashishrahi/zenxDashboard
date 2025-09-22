// AppButton.tsx
import * as React from "react";
import { Button } from "@/components/ui/button";

type CustomVariant = "primary" | "secondary" | "outline";

interface AppButtonProps extends Omit<React.ComponentProps<typeof Button>, "variant"> {
  children: React.ReactNode;
  variant?: CustomVariant;
  className?: string;
}

// Map custom variants to shadcn variants
const variantMap: Record<CustomVariant, NonNullable<React.ComponentProps<typeof Button>["variant"]>> = {
  primary: "default",       // 'primary' maps to shadcn 'default'
  secondary: "secondary",
  outline: "outline",
};

export const AppButton: React.FC<AppButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  return (
    <Button
      variant={variantMap[variant]} // Type-safe mapping
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
};
