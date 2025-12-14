"use client";
import React from "react";

type Variant = "hero" | "outline" | "default";
type Size = "xl" | "md" | "sm";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "md",
  className = "",
  children,
  ...props
}) => {
  let base =
    "inline-flex items-center justify-center font-semibold rounded-md transition-all";

  if (size === "xl") base += " px-6 py-3 text-lg";
  else if (size === "md") base += " px-4 py-2 text-sm";
  else base += " px-3 py-1 text-sm";

  if (variant === "hero") base += " bg-primary text-white shadow";
  else if (variant === "outline")
    base += " border border-border bg-transparent text-foreground";
  else base += " bg-muted text-foreground";

  return (
    <button {...props} className={`${base} ${className}`.trim()}>
      {children}
    </button>
  );
};

export default Button;
