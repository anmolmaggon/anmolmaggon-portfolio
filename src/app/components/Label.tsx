import type { HTMLAttributes, ReactNode } from "react";

type Variant = "dark" | "light" | "outline";
type Size = "sm" | "md";

type Props = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
};

const variants: Record<Variant, string> = {
  dark: "bg-ink text-white",
  light: "bg-white text-ink ring-1 ring-hairline",
  outline: "bg-transparent text-ink ring-1 ring-ink-faint",
};

const sizes: Record<Size, string> = {
  sm: "px-2.5 py-1 text-micro",
  md: "px-3 py-1.5 text-caption",
};

export function Label({ children, variant = "dark", size = "md", className = "", ...rest }: Props) {
  return (
    <span
      {...rest}
      className={`inline-flex items-center gap-1.5 rounded-control whitespace-nowrap leading-none ${variants[variant]} ${sizes[size]} ${className}`}
      style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif", fontWeight: 500, letterSpacing: 0, ...rest.style }}
    >
      {children}
    </span>
  );
}
