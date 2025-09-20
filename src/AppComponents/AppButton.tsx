// AppButton.tsx
import React from "react";
import { Button } from "@/components/ui/button"; // assuming you're wrapping your UI button

interface AppButtonProps {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}

export const AppButton: React.FC<AppButtonProps> = ({ onClick, className = "", children }) => {
  return (
    <Button onClick={onClick} className={className}>
      {children}
    </Button>
  );
};

