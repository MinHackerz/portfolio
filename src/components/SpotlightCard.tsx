import { useState, useRef, type MouseEvent, type ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColorLight?: string;
  spotlightColorDark?: string;
  borderColorLight?: string;
  borderColorDark?: string;
}

export const SpotlightCard = ({
  children,
  className = "",
  spotlightColorLight = "rgba(0, 0, 0, 0.03)",
  spotlightColorDark = "rgba(255, 255, 255, 0.04)",
  borderColorLight = "rgba(113, 113, 122, 0.25)",
  borderColorDark = "rgba(255, 255, 255, 0.15)"
}: SpotlightCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`group relative rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-900/30 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/60 transition-colors duration-300 shadow-none overflow-hidden ${className}`}
    >
      {/* 1. Cursor Spotlight Radial Background Layer (Light Mode - Dark Spotlight) */}
      <div
        className="dark:hidden absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${spotlightColorLight}, transparent 60%)`
        }}
      />

      {/* 2. Cursor Spotlight Radial Background Layer (Dark Mode - Deep Dark Spotlight) */}
      <div
        className="hidden dark:block absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${spotlightColorDark}, transparent 60%)`
        }}
      />

      {/* 3. Cursor Spotlight Border Glow (Light Mode) */}
      <div
        className="dark:hidden absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
        style={{
          background: `radial-gradient(350px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${borderColorLight}, transparent 50%)`,
          maskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px'
        }}
      />

      {/* 4. Cursor Spotlight Border Glow (Dark Mode) */}
      <div
        className="hidden dark:block absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
        style={{
          background: `radial-gradient(350px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${borderColorDark}, transparent 50%)`,
          maskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px'
        }}
      />

      {/* 5. Card Content Wrapper */}
      <div className="relative z-20 flex flex-col justify-between h-full space-y-4 p-5 sm:p-6">
        {children}
      </div>
    </div>
  );
};
