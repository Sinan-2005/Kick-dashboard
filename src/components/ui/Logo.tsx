"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  iconOnly?: boolean;
}

export function Logo({ className, size = "md", iconOnly = false }: LogoProps) {
  const sizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-6xl",
  };

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <div className={cn("flex items-center gap-2 select-none group", className)}>
      <div className={cn(
        "bg-primary rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300",
        iconSizes[size]
      )}>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className={cn("text-black", size === "sm" ? "w-4 h-4" : "w-5 h-5")}
        >
          <path 
            d="M5 4H9V10.5L13.5 4H18L11.5 12L19 20H14.5L9 13.5V20H5V4Z" 
            fill="currentColor"
          />
        </svg>
      </div>
      {!iconOnly && (
        <div className={cn("font-black italic tracking-tighter uppercase", sizes[size])}>
          KICK<span className="text-primary">.</span>
        </div>
      )}
    </div>
  );
}
