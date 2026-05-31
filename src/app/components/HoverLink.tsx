import type { AnchorHTMLAttributes, ReactNode } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
};

export function HoverLink({ children, className = "", ...rest }: Props) {
  return (
    <a
      {...rest}
      className={`relative inline-block after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-px after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100 ${className}`}
    >
      {children}
    </a>
  );
}
