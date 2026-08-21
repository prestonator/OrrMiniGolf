import { useState } from "react";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Spinner } from "../../../components/ui/Spinner";

interface ClaimModalProps {
  activePlot: number | null;
  isProcessing: boolean;
  errorMsg: string;
  onCancel: () => void;
  onConfirm: (quantity: number) => void;
}

export function ClaimModal({
  activePlot,
  isProcessing,
  errorMsg,
  onCancel,
  onConfirm,
}: ClaimModalProps) {
  const [quantity, setQuantity] = useState(1);
  const pricePerRound = 15.0;
  const total = quantity * pricePerRound;

  if (activePlot === null) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200 p-4">
      <div className="w-full max-w-md transform animate-in zoom-in-95 duration-200">
        <Modal innerClassName="text-center">
          {isProcessing && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
              <Spinner size="lg" />
            </div>
          )}
          <h2 className="text-2xl font-bold text-dark-blue mb-3 font-serif uppercase tracking-wider">
            Confirm Claim
          </h2>
          <p className="text-dark-blue/90 mb-4 font-medium text-base">
            You are about to claim{" "}
            <strong className="font-bold text-red font-serif">
              Plot #{activePlot}
            </strong>
            . <br />
            Confirm your claim to take ownership and increase your tier.
          </p>

          <div className="flex items-center justify-between mb-6 bg-white/30 p-3 rounded-lg border border-dark-blue/20">
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
                    setQuantity(0 as any);
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

          {errorMsg && (
            <div className="mb-4 p-3 bg-red/10 text-red text-sm rounded font-bold border border-red/30">
              {errorMsg}
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => onConfirm(quantity)}
              disabled={isProcessing}
              className="flex-[2]"
            >
              Pay ${total.toFixed(2)}
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
