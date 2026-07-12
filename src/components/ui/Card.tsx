"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className = "", onClick, hover = false }: CardProps) {
  const MotionDiv = motion.div as any;

  return (
    <MotionDiv
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      whileTap={hover ? { scale: 0.99 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`glass-card p-6 ${hover ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </MotionDiv>
  );
}
