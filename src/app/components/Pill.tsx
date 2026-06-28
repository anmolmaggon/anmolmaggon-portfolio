import type { ReactNode, CSSProperties, ElementType } from "react";

/**
 * Pill — the actionable chip/CTA (DESIGN.md G5: pills are allowed only when they
 * *do* something — open a draft, navigate, filter). Built on tokens.
 *
 * Polymorphic: renders <a> when `href` is set, else <button>; pass `as="span"`
 * when it must sit inside another interactive element (e.g. a card button).
 *
 * Variants:
 *   outline — hairline border, fills with ink on hover (modal question chips)
 *   solid   — filled ink, lifts/scales on hover (mobile "Know more" CTA)
 *
 * Arrows differ per use, so pass them as children:
 *   <Pill … >Ask <span aria-hidden className="… group-hover/pill:translate-x-0.5">→</span></Pill>
 */
type Variant = "outline" | "solid";
type Size = "sm" | "md" | "lg";

const BASE =
  "group/pill inline-flex items-center gap-2 rounded-control font-sans whitespace-nowrap";

const VARIANT: Record<Variant, string> = {
  outline:
    "border border-ink-ghost text-ink-strong transition-colors duration-300 hover:bg-ink hover:text-brand-light hover:border-black",
  solid:
    "bg-ink text-white font-medium transition-all duration-300 hover:bg-scrim-strong hover:scale-105 active:scale-95",
};

const SIZE: Record<Size, string> = {
  sm: "px-4 py-2 text-meta leading-[1.25]",
  md: "px-5 py-2.5 text-label",
  lg: "px-6 py-3 text-pill leading-[1.25]",
};

type PillProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  as?: "a" | "button" | "span";
  href?: string;
  className?: string;
  style?: CSSProperties;
  [key: string]: unknown;
};

export function Pill({
  children,
  variant = "outline",
  size = "sm",
  as,
  href,
  className = "",
  ...rest
}: PillProps) {
  const Tag = (as ?? (href ? "a" : "button")) as ElementType;
  const tagProps: Record<string, unknown> = { ...rest };
  if (Tag === "a") tagProps.href = href;
  if (Tag === "button" && tagProps.type === undefined) tagProps.type = "button";
  return (
    <Tag className={`${BASE} ${VARIANT[variant]} ${SIZE[size]} ${className}`.trim()} {...tagProps}>
      {children}
    </Tag>
  );
}
