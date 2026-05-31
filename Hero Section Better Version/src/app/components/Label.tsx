import type { HTMLAttributes, ReactNode } from "react";

type Variant = "dark" | "light" | "outline";
type Size = "sm" | "md";

type Props = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
};

const variants: Record<Variant, string> = {
  dark: "bg-black text-white",
  light: "bg-white text-black ring-1 ring-black/10",
  outline: "bg-transparent text-black ring-1 ring-black/30",
};

const sizes: Record<Size, string> = {
  sm: "px-2.5 py-1 text-[11px]",
  md: "px-3 py-1.5 text-[12px]",
};

export function Label({ children, variant = "dark", size = "md", className = "", ...rest }: Props) {
  return (
    <span
      {...rest}
      className={`inline-flex items-center gap-1.5 rounded-full whitespace-nowrap leading-none ${variants[variant]} ${sizes[size]} ${className}`}
      style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif", fontWeight: 500, letterSpacing: 0, ...rest.style }}
    >
      {children}
    </span>
  );
}
