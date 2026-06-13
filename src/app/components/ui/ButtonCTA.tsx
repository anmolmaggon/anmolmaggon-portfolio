import React from "react";

type ButtonCTAProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant: "dark" | "light" | "transparent";
};

export function ButtonCTA({ variant, children, className = "", ...props }: ButtonCTAProps) {
  const baseClasses = "flex items-center gap-2 rounded-full backdrop-blur-sm transition-all duration-300 border font-sans font-medium text-[15px]";
  
  let variantClasses = "";
  if (variant === "dark") {
    variantClasses = "bg-white text-black border-white hover:bg-white/90 hover:scale-105";
  } else if (variant === "light") {
    variantClasses = "bg-black text-white border-black hover:bg-black/80 hover:scale-105";
  } else {
    variantClasses = "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]";
  }

  return (
    <a className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
      {children}
    </a>
  );
}
