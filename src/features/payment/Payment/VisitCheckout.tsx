import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

interface VisitCheckoutProps {
  alias?: string;
  isProcessing: boolean;
  onSimulatePayment: (quantity: number) => void;
  onCancel: () => void;
}

export function VisitCheckout({
  alias,
  isProcessing,
  onSimulatePayment,
  onCancel,
}: VisitCheckoutProps) {
  const [quantity, setQuantity] = useState(1);
  const pricePerRound = 15.0;
  const total = quantity * pricePerRound;

  return (
    <>
      <h2 className="text-3xl font-bold text-dark-blue mb-6 font-serif uppercase tracking-wider">
        Return Visit
      </h2>
      <p className="text-dark-blue mb-6 font-medium text-lg">
        Welcome back, <span className="font-serif font-bold">{alias}</span>!
        Ready to hit the links again?
      </p>
      <div className="text-left">
        <Card className="mb-6">
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
            <span>{quantity}x Homestead Visit</span>
            <span>${total.toFixed(2)}</span>
          </p>
          <div className="border-t border-dark-blue/30 my-4 border-dashed"></div>
          <p className="text-dark-blue font-bold text-xl flex justify-between">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </p>
        </Card>
        <div className="flex flex-col gap-4">
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
      </div>
    </>
  );
}
