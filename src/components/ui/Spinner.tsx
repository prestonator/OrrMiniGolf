import React from "react";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  color?: string; // Retained for backwards compatibility
  text?: React.ReactNode;
  subtext?: React.ReactNode;
}

export function Spinner({
  size = "md",
  className = "",
  text,
  subtext,
}: SpinnerProps) {
  // Only show default text for large spinners
  const defaultText = size === "lg" ? "Loading" : null;
  const defaultSubtext = size === "lg" ? "Pioneering the frontier..." : null;

  const displayText = text !== undefined ? text : defaultText;
  const displaySubtext = subtext !== undefined ? subtext : defaultSubtext;

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16 sm:w-20 sm:h-20",
  };

  return (
    <>
      <style>
        {`
          .wagon-spinner {
            animation: wagon-spin 2.5s linear infinite;
          }
          @keyframes wagon-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .wagon-pulse-text {
            animation: wagon-pulse-opacity 2s ease-in-out infinite;
          }
          @keyframes wagon-pulse-opacity {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
        `}
      </style>

      <div
        className={`flex flex-col items-center justify-center gap-6 font-serif ${className}`}
      >
        {/* The Spinner Container */}
        <div
          className={`relative ${sizeClasses[size]} flex items-center justify-center drop-shadow-md wagon-spinner`}
        >
          {/* SVG representation of the 1800s wagon wheel */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 1. Spokes (Back layer) */}
            <g stroke="#5C4533" strokeWidth={4.5} strokeLinecap="round">
              <line x1="50" y1="14" x2="50" y2="86" />
              <line
                x1="50"
                y1="14"
                x2="50"
                y2="86"
                transform="rotate(30 50 50)"
              />
              <line
                x1="50"
                y1="14"
                x2="50"
                y2="86"
                transform="rotate(60 50 50)"
              />
              <line
                x1="50"
                y1="14"
                x2="50"
                y2="86"
                transform="rotate(90 50 50)"
              />
              <line
                x1="50"
                y1="14"
                x2="50"
                y2="86"
                transform="rotate(120 50 50)"
              />
              <line
                x1="50"
                y1="14"
                x2="50"
                y2="86"
                transform="rotate(150 50 50)"
              />
            </g>

            {/* 2. Wooden Felloes (Thick wooden part of the rim) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#5C4533"
              strokeWidth={7}
            />

            {/* 3. Outer Iron Tire */}
            <circle
              cx="50"
              cy="50"
              r="43.5"
              fill="none"
              stroke="#2C2724"
              strokeWidth={2}
            />

            {/* 4. Inner Iron Band */}
            <circle
              cx="50"
              cy="50"
              r="36.5"
              fill="none"
              stroke="#2C2724"
              strokeWidth={1}
              opacity={0.8}
            />

            {/* 5. The Hub */}
            <circle
              cx="50"
              cy="50"
              r="14"
              fill="#5C4533"
              stroke="#2C2724"
              strokeWidth={2}
            />
            <circle
              cx="50"
              cy="50"
              r="9"
              fill="none"
              stroke="#3A2A20"
              strokeWidth={1}
            />

            {/* 6. Axle Pin / Linchpin */}
            <circle cx="50" cy="50" r="4.5" fill="#2C2724" />
            <circle cx="50" cy="50" r="1.5" fill="#110F0E" />
          </svg>
        </div>

        {/* Elegant text accompanying the spinner */}
        {(displayText || displaySubtext) && (
          <div className="flex flex-col items-center gap-1 text-center">
            {displayText && (
              <span className="text-lg tracking-[0.2em] uppercase font-semibold text-[#2C2724] wagon-pulse-text">
                {displayText}
              </span>
            )}
            {displaySubtext && (
              <span className="text-xs italic text-[#4A3D34] opacity-75 tracking-wider">
                {displaySubtext}
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Spinner;
