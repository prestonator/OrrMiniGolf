import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useKioskStore } from "../store/useKioskStore";

export default function Payment() {
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success"
  >("idle");
  const [receiptCode, setReceiptCode] = useState<string>("");
  const navigate = useNavigate();
  const setTimerPaused = useKioskStore((state) => state.setTimerPaused);

  useEffect(() => {
    // Pause the global 45s timer while on this mock checkout screen
    setTimerPaused(true);
    return () => setTimerPaused(false);
  }, [setTimerPaused]);

  const handlePayment = () => {
    setPaymentStatus("processing");
    // Simulate payment processing time (mock Stripe Edge function call)
    setTimeout(() => {
      // Generate a random 5-character receipt code
      const code = Math.random().toString(36).substring(2, 7).toUpperCase();
      setReceiptCode(code);
      setPaymentStatus("success");
    }, 2000);
  };

  // Automatic redirect back to home after 30 seconds on the success screen
  useEffect(() => {
    if (paymentStatus === "success") {
      const timer = setTimeout(() => {
        navigate("/");
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus, navigate]);

  return (
    <div className="min-h-screen bg-[#d9c5a0] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] mix-blend-multiply pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#f4ecd8] border-[6px] border-double border-[#5c3a21] shadow-2xl rounded-sm p-8 z-10 text-center">
        {paymentStatus === "idle" && (
          <>
            <h2 className="text-3xl font-bold text-[#3a2212] mb-6 font-serif uppercase tracking-wider">
              Quick Round
            </h2>
            <div className="bg-[#e8dcc4] p-6 rounded border border-[#8c7462] mb-8 text-left">
              <p className="text-[#5c3a21] font-semibold text-lg flex justify-between">
                <span>1x 18-Hole Round</span>
                <span>$15.00</span>
              </p>
              <div className="border-t border-[#8c7462] my-4 border-dashed"></div>
              <p className="text-[#3a2212] font-bold text-xl flex justify-between">
                <span>Total</span>
                <span>$15.00</span>
              </p>
            </div>

            <button
              onClick={handlePayment}
              className="w-full bg-[#5c3a21] hover:bg-[#4a2e1a] text-[#f4ecd8] font-bold text-xl py-4 px-4 rounded-sm border-2 border-[#3a2212] shadow-md transition-all active:translate-y-1 uppercase tracking-wide mb-4"
            >
              Pay with Card
            </button>
            <Link
              to="/"
              className="text-[#8b2e1f] font-semibold underline hover:text-[#6e2418]"
            >
              Cancel
            </Link>
          </>
        )}

        {paymentStatus === "processing" && (
          <div className="py-12">
            <h2 className="text-2xl font-bold text-[#3a2212] mb-4 font-serif uppercase tracking-wider animate-pulse">
              Processing Payment...
            </h2>
            <p className="text-[#5c3a21] italic">
              Please do not remove your card.
            </p>
          </div>
        )}

        {paymentStatus === "success" && (
          <div className="py-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-[#3a2212] mb-2 font-serif uppercase tracking-wider">
              Payment Successful!
            </h2>
            <p className="text-[#5c3a21] mb-6">
              Present this receipt code to the attendant to receive your
              equipment.
            </p>

            <div className="bg-white border-2 border-[#3a2212] border-dashed p-6 mb-8 transform -rotate-1">
              <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">
                Receipt Code
              </p>
              <p className="text-5xl font-mono font-bold text-black tracking-widest">
                {receiptCode}
              </p>
            </div>

            <Link
              to="/"
              className="inline-block bg-[#8b2e1f] hover:bg-[#6e2418] text-[#f4ecd8] font-bold text-lg py-3 px-8 rounded-sm border-2 border-[#3a2212] shadow-md transition-all active:translate-y-1 uppercase tracking-wide"
            >
              Done
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
