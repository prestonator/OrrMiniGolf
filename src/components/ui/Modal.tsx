import type { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  badgeText?: string;
}

export function Modal({ children, className = "", innerClassName = "", badgeText }: ModalProps) {
  return (
    <div className={`relative w-full bg-cream p-1 shadow-2xl overflow-hidden ${className}`}>
      {badgeText && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center z-20">
          <div className="bg-red text-cream px-4 py-1.5 rounded-sm text-sm sm:text-base font-bold tracking-widest shadow-md font-serif">
            {badgeText}
          </div>
        </div>
      )}
      <div className="border border-dark-blue/60 p-[3px] h-full w-full">
        <div className={`border border-dark-blue/60 p-6 sm:p-8 bg-cream flex flex-col ${innerClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
