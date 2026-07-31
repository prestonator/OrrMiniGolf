import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Spinner } from '../Spinner';

interface ClaimModalProps {
  activePlot: number | null;
  isProcessing: boolean;
  errorMsg: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ClaimModal({ activePlot, isProcessing, errorMsg, onCancel, onConfirm }: ClaimModalProps) {
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
          <p className="text-dark-blue/90 mb-6 font-medium text-base">
            You are about to claim <strong className="font-bold text-red font-serif">Plot #{activePlot}</strong>. <br /> 
            Confirm your claim to take ownership and increase your tier.
          </p>

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
              onClick={onConfirm}
              disabled={isProcessing}
              className="flex-[2]"
            >
              {`Pay $15.00 for Plot #${activePlot}`}
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
