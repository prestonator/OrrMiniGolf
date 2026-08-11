import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

interface QuickRoundCheckoutProps {
  paymentStatus: "idle" | "success";
  receiptCode: string;
  isProcessing: boolean;
  onSimulatePayment: (quantity: number) => void;
  onCancel: () => void;
}

export function QuickRoundCheckout({
  paymentStatus,
  receiptCode,
  isProcessing,
  onSimulatePayment,
  onCancel,
}: QuickRoundCheckoutProps) {
  const [quantity, setQuantity] = useState(1);
  const pricePerRound = 15.0;
  const total = quantity * pricePerRound;

  if (paymentStatus === "success") {
    return (
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
          Present this receipt code to the attendant to receive your equipment.
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
    );
  }

  return (
    <>
      <h2 className="text-3xl font-bold text-dark-blue mb-6 font-serif uppercase tracking-wider">
        Quick Round
      </h2>
      <div className="text-left">
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-dark-blue font-bold text-lg">Quantity</span>
            <div className="flex items-center gap-2 bg-white/50 border border-dark-blue/30 rounded p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1 || isProcessing}
                className="w-8 h-8 flex items-center justify-center text-xl font-bold text-dark-blue bg-white rounded shadow-sm hover:bg-gray-50 disabled:opacity-50"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max="100"
                value={quantity || ""}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (isNaN(val)) {
                    setQuantity(0 as any); // allow empty state briefly while typing
                  } else {
                    setQuantity(Math.min(100, Math.max(1, val)));
                  }
                }}
                onBlur={(e) => {
                  const val = parseInt(e.target.value);
                  if (isNaN(val) || val < 1) setQuantity(1);
                }}
                disabled={isProcessing}
                className="w-16 font-mono text-lg font-bold text-center text-dark-blue bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-dark-blue/30 rounded px-1 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none m-0"
              />
              <button
                onClick={() => setQuantity(Math.min(100, quantity + 1))}
                disabled={quantity >= 100 || isProcessing}
                className="w-8 h-8 flex items-center justify-center text-xl font-bold text-dark-blue bg-white rounded shadow-sm hover:bg-gray-50 disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>
          <div className="border-t border-dark-blue/30 my-4 border-dashed"></div>
          <p className="text-dark-blue/90 font-semibold text-lg flex justify-between">
            <span>{quantity}x 18-Hole Round</span>
            <span>${total.toFixed(2)}</span>
          </p>
          <div className="border-t border-dark-blue/30 my-4 border-dashed"></div>
          <p className="text-dark-blue font-bold text-xl flex justify-between">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </p>
        </Card>
      </div>
      <div className="flex flex-col gap-4 text-center">
        <Button
          variant="primary"
          onClick={() => onSimulatePayment(quantity)}
          disabled={isProcessing}
        >
          Pay ${total.toFixed(2)}
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
          Cancel
        </Button>
      </div>
    </>
  );
}
