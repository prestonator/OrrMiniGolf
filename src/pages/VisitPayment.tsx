import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useKioskStore } from "../store/useKioskStore";
import { supabase } from "../utils/supabase";
import StripeCheckoutForm from "../components/StripeCheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export default function VisitPayment() {
  const navigate = useNavigate();
  const session = useKioskStore((state) => state.session);
  const setTimerPaused = useKioskStore((state) => state.setTimerPaused);
  
  const [clientSecret, setClientSecret] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isFetchingIntent, setIsFetchingIntent] = useState(true);

  useEffect(() => {
    // Pause the global 45s timer while on this checkout screen
    setTimerPaused(true);
    return () => setTimerPaused(false);
  }, [setTimerPaused]);

  useEffect(() => {
    async function initPayment() {
      if (!session?.pioneerId) {
        navigate('/');
        return;
      }
      try {
        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
          body: { pioneerId: session.pioneerId, alias: session.alias || 'Anonymous', type: 'visit' }
        });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        if (data?.clientSecret) {
          setClientSecret(data.clientSecret);
        }
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Failed to initiate payment');
      } finally {
        setIsFetchingIntent(false);
      }
    }
    initPayment();
  }, [session, navigate]);

  const handleCancel = () => {
    navigate('/');
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

        {isFetchingIntent ? (
          <div className="py-12">
            <h2 className="text-2xl font-bold text-[#3a2212] mb-4 font-serif uppercase tracking-wider animate-pulse">
              Loading Payment...
            </h2>
          </div>
        ) : errorMsg ? (
          <div className="py-12">
            <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 mb-6">
              {errorMsg}
            </div>
            <button
              onClick={handleCancel}
              className="w-full bg-[#5c3a21] hover:bg-[#4a2e1a] text-[#f4ecd8] font-bold text-xl py-4 px-4 rounded-sm border-2 border-[#3a2212] shadow-md transition-all active:translate-y-1 uppercase tracking-wide"
            >
              Back to Home
            </button>
          </div>
        ) : clientSecret ? (
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
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
              <StripeCheckoutForm 
                onCancel={handleCancel} 
                onSuccess={handleSuccess}
                buttonLabel="Pay $15.00"
              />
            </Elements>
          </div>
        ) : null}
      </div>
    </div>
  );
}
