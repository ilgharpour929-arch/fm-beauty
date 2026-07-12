"use client";

import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
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
    ghost: "bg-transparent text-text-muted hover:text-text-primary border-none",
  };

  const MotionButton = motion.button as any;

  return (
    <MotionButton
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`${variantClasses[variant]} ${sizeClasses[size]} rounded-xl font-medium ${className}`}
      {...props}
    >
      {children}
    </MotionButton>
  );
}
