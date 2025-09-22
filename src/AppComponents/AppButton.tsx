// AppButton.tsx
import React, { ButtonHTMLAttributes } from "react";

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "outline" | "primary" | "secondary"; // example
  className?: string;
}

export const AppButton: React.FC<AppButtonProps> = ({
  children,
  className,
  variant,
  ...props
}) => {
  const variantClass = variant === "outline" ? "border" : "bg-blue-600 text-white";
  return (
    <button
      className={`${variantClass} ${className}`}
      {...props} // this now includes 'type', 'onClick', etc.
    >
      {children}
    </button>
  );
};
