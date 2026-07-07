"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({ variant = "primary", size = "md", className = "", children, ...props }: ButtonProps) {
  const sizeClasses = {
    sm: "py-1.5 px-3 text-xs",
    md: "py-2.5 px-5 text-sm",
    lg: "py-3 px-7 text-base",
  };

  const variantClasses = {
    primary: "btn-primary",
    outline: "btn-outline",
    danger: "btn-danger",
    ghost: "bg-transparent text-cream/70 hover:text-cream border-none",
  };

  return (
    <button
      className={`${variantClasses[variant]} ${sizeClasses[size]} rounded-xl font-medium transition-all ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
