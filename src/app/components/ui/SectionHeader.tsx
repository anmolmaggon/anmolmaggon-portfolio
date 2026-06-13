import React from "react";

type SectionHeaderProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  theme?: "light" | "dark";
};

export function SectionHeader({ title, subtitle, theme = "light" }: SectionHeaderProps) {
  const isDark = theme === "dark";
  return (
    <div className="mb-12 md:mb-16 max-w-4xl">
      <h2 className={`font-[Nyght_Serif] text-fluid-h4 font-normal tracking-tight leading-[1.1] ${isDark ? "text-white/90" : "text-brand-dark/70"}`}>
        {title}
        <em className="italic">.</em>
      </h2>
      {subtitle && (
        <p className={`md:hidden mt-3 font-sans italic text-sm ${isDark ? "text-white/60" : "text-brand-dark/45"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
