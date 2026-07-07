"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className = "", onClick, hover = false }: CardProps) {
  return (
    <div
      className={`glass-card p-6 ${hover ? "cursor-pointer transition-all duration-300 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
