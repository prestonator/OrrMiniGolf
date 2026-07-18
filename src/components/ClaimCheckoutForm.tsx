import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { useKioskStore } from '../store/useKioskStore';

interface ClaimCheckoutFormProps {
  onCancel: () => void;
  plotId: number;
}

export default function ClaimCheckoutForm({ onCancel, plotId }: ClaimCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const setIsProcessingPayment = useKioskStore(state => state.setIsProcessingPayment);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessingPayment(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    setIsProcessingPayment(false);

    if (error) {
      setErrorMessage(error.message || 'An unexpected error occurred.');
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment successful, redirect to 3D plot screen
      navigate('/game');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <PaymentElement />
      {errorMessage && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
          {errorMessage}
        </div>
      )}
      <div className="flex gap-3 justify-center mt-6">
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={!stripe}
          className="flex-[2] py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 active:scale-[0.98] disabled:opacity-70"
        >
          Pay $15.00 for Plot #{plotId}
        </button>
      </div>
    </form>
  );
}
