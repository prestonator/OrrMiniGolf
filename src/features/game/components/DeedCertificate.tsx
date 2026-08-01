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
      className="relative bg-[#f4ebd0] text-[#2c1c11] p-8 w-full max-w-4xl mx-auto shadow-2xl font-serif overflow-hidden"
      style={{
        border: "12px double #8b5a2b",
        backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(139, 90, 43, 0.05) 0%, transparent 20%),
            radial-gradient(circle at 80% 80%, rgba(139, 90, 43, 0.05) 0%, transparent 20%)
          `,
        boxShadow: "inset 0 0 50px rgba(139, 90, 43, 0.2)",
      }}
    >
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0JyBoZWlnaHQ9JzQnPgo8cmVjdCB3aWR0aD0nNCcgaGVpZ2h0PSc0JyBmaWxsPScjZmZmJy8+CjxwYXRoIGQ9J00xIDFoMnYySDF6JyBmaWxsPScjMDAwJyBmaWxsLW9wYWNpdHk9JzAuMDUnLz4KPC9zdmc+')",
          backgroundSize: "4px 4px",
        }}
      />

      {/* 1890s Watermark */}
      <div
        className="absolute top-8 right-8 text-[#8b5a2b] opacity-20 text-6xl font-black rotate-12 pointer-events-none"
        style={{ fontFamily: "serif" }}
      >
        1890s
      </div>

      <div className="relative z-10 flex flex-col items-center border border-[#8b5a2b] p-6 text-center">
        <h1
          className="text-4xl md:text-5xl font-bold mb-2 uppercase tracking-wide"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          United States of America.
        </h1>
        <h2
          className="text-2xl md:text-3xl font-bold mb-6 uppercase tracking-wider"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Homestead Deed & Certificate of Completion.
        </h2>

        <p className="text-sm italic mb-8 max-w-2xl mx-auto border-b border-[#8b5a2b] pb-2">
          GRANTED under the Acts of Congress, for the encouragement of actual
          Settlement of the Public Domain, approved May 20, 1862.
        </p>

        <p className="text-lg mb-6 leading-relaxed text-justify px-4">
          <span className="font-bold text-xl">
            Know All Men by These Presents
          </span>
          , that <span className="font-bold uppercase text-xl">{name}</span>,
          having faithfully complied with all provisions and regulations
          governing the establishment of a settlement, and having successfully
          improved the lands hereinafter described, is hereby granted this
          patent of ownership and completion.
        </p>

        <div className="text-left w-full px-4 mb-8 space-y-4">
          <p>
            <strong className="uppercase">Property Description:</strong> A
            lawful Homestead Settlement established upon the premises known as
            "THE ORR FAMILY FARM" in Norman, Cleveland County, State of
            Oklahoma.
          </p>
          <p>
            <strong className="uppercase">Improvements:</strong> The creation
            and completion of an authentic 18-hole Homestead-Themed Mini Golf
            Course, including a functional Water Mill, Log Cabin, Schoolhouse,
            Barn, Farming Implements, and various challenges representing
            pioneer life.
          </p>
        </div>

        <div
          className="text-3xl font-bold uppercase tracking-widest mb-4 mt-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          ~ {name} ~
        </div>

        <p className="text-lg font-bold mb-12">DATE OF COMPLETION: {today}</p>

        <div className="flex justify-between w-full px-8 items-end mt-8 relative">
          {/* Fake Seal */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-32 h-32 bg-[#7b1f20] rounded-full flex flex-col items-center justify-center text-[#f4ebd0] shadow-xl border-4 border-[#5a1516] rotate-[-5deg]">
            <div className="w-28 h-28 border border-dashed border-[#f4ebd0] rounded-full flex flex-col items-center justify-center p-2 text-center">
              <span className="text-[10px] uppercase font-bold tracking-widest">
                Orr Family Farm
              </span>
              <span className="text-xs my-1 text-yellow-500">★</span>
              <span className="text-sm font-bold uppercase leading-tight">
                Homestead
                <br />
                Mini Golf
              </span>
              <span className="text-[8px] mt-1 border-t border-[#f4ebd0] pt-1">
                EST. 2026
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center text-center">
            <span className="text-xs font-bold mb-2">
              REGISTER OF THE LAND OFFICE:
            </span>
            <span
              className="text-2xl"
              style={{ fontFamily: "'Brush Script MT', cursive" }}
            >
              John Q. Adams
            </span>
            <span className="text-xs border-t border-[#2c1c11] pt-1 w-48">
              (Signed, faded ink)
            </span>
          </div>

          <div className="flex flex-col items-center text-center">
            <span className="text-xs font-bold mb-2">RECEIVER:</span>
            <span
              className="text-2xl"
              style={{ fontFamily: "'Brush Script MT', cursive" }}
            >
              Eleanor V. Stone
            </span>
            <span className="text-xs border-t border-[#2c1c11] pt-1 w-48">
              (Signed)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
DeedCertificate.displayName = "DeedCertificate";
