import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "icon";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:ring-primary/30",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-ring/25",
  ghost: "bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/25",
  danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/25",
  outline: "border border-border bg-card text-foreground hover:bg-accent focus-visible:ring-ring/25",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 px-3 text-xs",
  md: "h-10 gap-2 px-4 text-sm",
  icon: "size-9 p-0",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}) {
  return (
    <button
      className={`inline-flex shrink-0 items-center justify-center rounded-md font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-45 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
