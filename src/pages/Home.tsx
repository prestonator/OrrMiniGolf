import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#d9c5a0] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] mix-blend-multiply pointer-events-none" />

      <div className="relative w-full max-w-2xl bg-[#f4ecd8] border-[6px] border-double border-[#5c3a21] shadow-2xl rounded-sm p-8 sm:p-12 z-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#3a2212] mb-4 uppercase tracking-widest font-serif drop-shadow-sm">
          Welcome to
          <br />
          <span className="text-[#8b2e1f] mt-2 block">Homestead Mini Golf</span>
        </h1>

        <p className="text-[#5c3a21] mb-10 text-lg italic">
          Select an option below to begin your adventure.
        </p>

        <div className="space-y-6 flex flex-col">
          <Link
            to="/quick-round-payment"
            className="w-full bg-[#5c3a21] hover:bg-[#4a2e1a] text-[#f4ecd8] font-bold text-xl py-6 px-4 rounded-sm border-2 border-[#3a2212] shadow-md transition-all active:translate-y-1 block uppercase tracking-wide"
          >
            Pay for a Quick Round
          </Link>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-[#8c7462]"></div>
            <span className="flex-shrink-0 mx-4 text-[#8c7462] font-semibold text-sm uppercase">
              Or
            </span>
            <div className="flex-grow border-t border-[#8c7462]"></div>
          </div>

          <Link
            to="/login"
            className="w-full bg-[#8b2e1f] hover:bg-[#6e2418] text-[#f4ecd8] font-bold text-xl py-6 px-4 rounded-sm border-2 border-[#3a2212] shadow-md transition-all active:translate-y-1 block uppercase tracking-wide"
          >
            Register / Login for the Homestead Challenge
          </Link>
        </div>
      </div>
    </div>
  );
}
