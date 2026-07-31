import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white/40 p-6 rounded border border-dark-blue/30 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
