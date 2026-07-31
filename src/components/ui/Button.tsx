import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline";
  children: ReactNode;
  className?: string;
}

export function Button({ variant = "primary", children, className = "", ...props }: ButtonProps) {
  let baseStyles = "w-full font-bold rounded transition-all active:translate-y-1 uppercase tracking-wide flex justify-center items-center gap-2 disabled:opacity-50 disabled:active:translate-y-0 ";
  
  switch (variant) {
    case "primary":
      baseStyles += "bg-light-blue hover:bg-light-blue/90 disabled:bg-dark-blue/40 text-cream text-xl py-4 px-4 shadow-lg shadow-light-blue/30";
      break;
    case "danger":
      baseStyles += "bg-red hover:bg-red/90 text-cream text-xl sm:text-2xl py-6 px-4 shadow-lg shadow-red/30 leading-tight";
      break;
    case "outline":
      baseStyles += "bg-transparent hover:bg-dark-blue/5 text-dark-blue text-lg py-3 px-4 border-2 border-dark-blue";
      break;
    case "secondary":
      baseStyles += "bg-gray-800 hover:bg-gray-900 text-white px-4 py-1.5 shadow-md text-sm";
      break;
  }

  return (
    <button className={`${baseStyles} ${className}`} {...props}>
      {children}
    </button>
  );
}
