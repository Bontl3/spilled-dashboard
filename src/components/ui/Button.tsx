// src/components/ui/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-green-600 text-white hover:bg-green-700": variant === "default",
            "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50":
              variant === "outline",
            "text-gray-700 hover:bg-gray-100": variant === "ghost",
          },
          {
            "h-9 px-4 text-sm": size === "default",
            "h-8 px-3 text-sm": size === "sm",
            "h-10 px-6": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
