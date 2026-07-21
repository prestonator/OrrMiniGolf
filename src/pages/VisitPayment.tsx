import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useKioskStore } from "../store/useKioskStore";

export default function VisitPayment() {
  const navigate = useNavigate();
  const session = useKioskStore((state) => state.session);
  const setTimerPaused = useKioskStore((state) => state.setTimerPaused);
  
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Pause the global 45s timer while on this checkout screen
    setTimerPaused(true);
    return () => setTimerPaused(false);
  }, [setTimerPaused]);

  useEffect(() => {
    if (!session?.pioneerId) {
      navigate('/');
    }
  }, [session, navigate]);

  const handleCancel = () => {
    navigate('/');
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      handleSuccess();
    }, 1500);
  };

  const handleSuccess = () => {
    navigate('/map');
  };

  return (
    <div className="min-h-screen bg-[#d9c5a0] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] mix-blend-multiply pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#f4ecd8] border-[6px] border-double border-[#5c3a21] shadow-2xl rounded-sm p-8 z-10 text-center">
        <h2 className="text-3xl font-bold text-[#3a2212] mb-6 font-serif uppercase tracking-wider">
          Return Visit
        </h2>
        
        <p className="text-[#5c3a21] mb-6 font-serif text-lg">
          Welcome back, {session?.alias}! Ready to hit the links again?
        </p>

        <div className="text-left">
          <div className="bg-[#e8dcc4] p-6 rounded border border-[#8c7462] mb-6">
            <p className="text-[#5c3a21] font-semibold text-lg flex justify-between">
              <span>Homestead Visit</span>
              <span>$15.00</span>
            </p>
            <div className="border-t border-[#8c7462] my-4 border-dashed"></div>
            <p className="text-[#3a2212] font-bold text-xl flex justify-between">
              <span>Total</span>
              <span>$15.00</span>
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <button
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className="w-full bg-[#3a2212] hover:bg-[#5c3a21] disabled:bg-[#8c7462] text-[#f4ecd8] font-bold text-xl py-4 px-4 rounded-sm border-2 border-[#3a2212] shadow-md transition-all active:translate-y-1 uppercase tracking-wide flex justify-center items-center"
            >
              {isProcessing ? (
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Pay $15.00"
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={isProcessing}
              className="w-full bg-transparent hover:bg-[#e8dcc4] text-[#5c3a21] font-bold text-lg py-3 px-4 rounded-sm border-2 border-[#5c3a21] transition-all disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
