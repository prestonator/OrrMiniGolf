import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useKioskStore } from "../store/useKioskStore";
import { Spinner } from "../components/Spinner";

export interface PaymentProps {
  mode?: "quick-round" | "visit";
}

export default function Payment({ mode = "quick-round" }: PaymentProps) {
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success">("idle");
  const [receiptCode, setReceiptCode] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();
  const session = useKioskStore((state) => state.session);
  const setTimerPaused = useKioskStore((state) => state.setTimerPaused);

  useEffect(() => {
    // Pause the global 45s timer while on this checkout screen
    setTimerPaused(true);
    return () => setTimerPaused(false);
  }, [setTimerPaused]);

  useEffect(() => {
    if (mode === "visit" && !session?.pioneerId) {
      navigate("/");
    }
  }, [mode, session, navigate]);

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      handleSuccess();
    }, 1500); // Simulate network delay
  };

  const handleSuccess = () => {
    if (mode === "visit") {
      navigate("/map");
    } else {
      // Generate a random 5-character receipt code
      const code = Math.random().toString(36).substring(2, 7).toUpperCase();
      setReceiptCode(code);
      setPaymentStatus("success");
    }
  };

  // Automatic redirect back to home after 30 seconds on the success screen
  useEffect(() => {
    if (mode !== "visit" && paymentStatus === "success") {
      const timer = setTimeout(() => {
        navigate("/");
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [mode, paymentStatus, navigate]);

  const handleCancel = () => {
    navigate("/");
  };

  if (mode === "visit") {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-4 relative font-sans"
        style={{ backgroundImage: "url('/landingBackground.webp')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="z-10 flex flex-col items-center max-w-md w-full mt-8">
        {/* Modal Container */}
        <div className="relative w-full bg-cream p-1 shadow-2xl overflow-hidden">
          {isProcessing && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
              <Spinner size="lg" />
            </div>
          )}
          {/* Double Border Inner Container */}
          <div className="border border-dark-blue/60 p-[3px] h-full w-full">
              <div className="border border-dark-blue/60 p-6 sm:p-8 bg-cream text-center flex flex-col">
                <h2 className="text-3xl font-bold text-dark-blue mb-6 font-serif uppercase tracking-wider">
                  Return Visit
                </h2>

                <p className="text-dark-blue mb-6 font-medium text-lg">
                  Welcome back, <span className="font-serif font-bold">{session?.alias}</span>! Ready to hit the links again?
                </p>

                <div className="text-left">
                  <div className="bg-white/40 p-6 rounded border border-dark-blue/30 mb-6 shadow-sm">
                    <p className="text-dark-blue/90 font-semibold text-lg flex justify-between">
                      <span>Homestead Visit</span>
                      <span>$15.00</span>
                    </p>
                    <div className="border-t border-dark-blue/30 my-4 border-dashed"></div>
                    <p className="text-dark-blue font-bold text-xl flex justify-between">
                      <span>Total</span>
                      <span>$15.00</span>
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <button
                      onClick={handleSimulatePayment}
                      disabled={isProcessing}
                      className="w-full bg-light-blue hover:bg-light-blue/90 disabled:bg-dark-blue/40 text-cream font-bold text-xl py-4 px-4 rounded shadow-lg shadow-light-blue/30 transition-all active:translate-y-1 uppercase tracking-wide flex justify-center items-center gap-2"
                    >
                      Pay $15.00
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isProcessing}
                      className="w-full bg-transparent hover:bg-dark-blue/5 text-dark-blue font-bold text-lg py-3 px-4 rounded border-2 border-dark-blue transition-all disabled:opacity-50 uppercase tracking-wide"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative font-sans"
      style={{ backgroundImage: "url('/landingBackground.webp')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="z-10 flex flex-col items-center max-w-md w-full mt-8">
        {/* Modal Container */}
        <div className="relative w-full bg-cream p-1 shadow-2xl overflow-hidden">
          {isProcessing && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
              <Spinner size="lg" />
            </div>
          )}
          {/* Double Border Inner Container */}
          <div className="border border-dark-blue/60 p-[3px] h-full w-full">
            <div className="border border-dark-blue/60 p-6 sm:p-8 bg-cream text-center flex flex-col">
              {paymentStatus === "idle" && (
                <>
                  <h2 className="text-3xl font-bold text-dark-blue mb-6 font-serif uppercase tracking-wider">
                    Quick Round
                  </h2>
                  <div className="bg-white/40 p-6 rounded border border-dark-blue/30 mb-8 text-left shadow-sm">
                    <p className="text-dark-blue/90 font-semibold text-lg flex justify-between">
                      <span>1x 18-Hole Round</span>
                      <span>$15.00</span>
                    </p>
                    <div className="border-t border-dark-blue/30 my-4 border-dashed"></div>
                    <p className="text-dark-blue font-bold text-xl flex justify-between">
                      <span>Total</span>
                      <span>$15.00</span>
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <button
                      onClick={handleSimulatePayment}
                      disabled={isProcessing}
                      className="w-full bg-light-blue hover:bg-light-blue/90 disabled:bg-dark-blue/40 text-cream font-bold text-xl py-4 px-4 rounded shadow-lg shadow-light-blue/30 transition-all active:translate-y-1 uppercase tracking-wide flex justify-center items-center gap-2"
                    >
                      Pay $15.00
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isProcessing}
                      className="w-full bg-transparent hover:bg-dark-blue/5 text-dark-blue font-bold text-lg py-3 px-4 rounded border-2 border-dark-blue transition-all disabled:opacity-50 uppercase tracking-wide"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}

              {paymentStatus === "success" && (
                <div className="py-4">
                  <div className="w-16 h-16 bg-light-blue rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-md">
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
                  <h2 className="text-3xl font-bold text-dark-blue mb-2 font-serif uppercase tracking-wider">
                    Payment Successful!
                  </h2>
                  <p className="text-dark-blue/80 mb-6">
                    Present this receipt code to the attendant to receive your
                    equipment.
                  </p>

                  <div className="bg-white border-2 border-dark-blue border-dashed p-6 mb-8 transform -rotate-1 shadow-sm">
                    <p className="text-sm text-dark-blue/60 uppercase tracking-widest mb-1">
                      Receipt Code
                    </p>
                    <p className="text-5xl font-mono font-bold text-dark-blue tracking-widest">
                      {receiptCode}
                    </p>
                  </div>

                  <Link
                    to="/"
                    className="inline-block bg-light-blue hover:bg-light-blue/90 text-cream font-bold text-lg py-3 px-8 rounded shadow-lg shadow-light-blue/30 transition-all active:translate-y-1 uppercase tracking-wide"
                  >
                    Done
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

