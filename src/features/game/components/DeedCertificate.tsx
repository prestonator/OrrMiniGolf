import React from "react";

interface DeedCertificateProps {
  name: string;
}

export const DeedCertificate = React.forwardRef<
  HTMLDivElement,
  DeedCertificateProps
>(({ name }, ref) => {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      ref={ref}
      className="relative w-full max-w-5xl mx-auto shadow-2xl overflow-hidden"
      // Maintain the intrinsic aspect ratio of the 3250x2511 background image
      style={{ aspectRatio: "3250 / 2511" }}
    >
      {/* Base Background Image */}
      <img
        src="/deed-base.png"
        alt="Homestead Deed"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        crossOrigin="anonymous" // Ensure html-to-image doesn't hit CORS issues if served strangely
      />

      {/* Dynamic Text Overlay Container */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Name Field */}
        <div
          className="absolute flex items-center justify-center text-center"
          style={{
            // EDIT THESE PERCENTAGES TO PERFECTLY ALIGN THE NAME
            top: "30%", 
            left: "10%",
            width: "80%",
            // Dynamic scaling relative to container width using container queries or vw, 
            // but for html-to-image on a fixed-width container, em/rem/px or % works.
            // Using a large responsive text size since the container can be quite big:
            fontSize: "clamp(2rem, 5vw, 6rem)", 
            fontFamily: "var(--font-imfell), serif",
            color: "#2c1c11", // Dark brown/black ink color
          }}
        >
          {name}
        </div>

        {/* Date Field */}
        <div
          className="absolute flex items-center justify-center text-center"
          style={{
            // EDIT THESE PERCENTAGES TO PERFECTLY ALIGN THE DATE
            top: "77%", 
            left: "10%",
            width: "80%",
            fontSize: "clamp(0.5rem, 2vw, 3rem)",
            fontFamily: "var(--font-imfell), serif",
            color: "#2c1c11",
          }}
        >
          {today}
        </div>
      </div>
    </div>
  );
});

DeedCertificate.displayName = "DeedCertificate";
