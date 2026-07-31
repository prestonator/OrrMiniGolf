import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

interface VisitCheckoutProps {
  alias?: string;
  isProcessing: boolean;
  onSimulatePayment: () => void;
  onCancel: () => void;
}

export function VisitCheckout({ alias, isProcessing, onSimulatePayment, onCancel }: VisitCheckoutProps) {
  return (
    <>
      <h2 className="text-3xl font-bold text-dark-blue mb-6 font-serif uppercase tracking-wider">
        Return Visit
      </h2>
      <p className="text-dark-blue mb-6 font-medium text-lg">
        Welcome back, <span className="font-serif font-bold">{alias}</span>! Ready to hit the links again?
      </p>
      <div className="text-left">
        <Card className="mb-6">
          <p className="text-dark-blue/90 font-semibold text-lg flex justify-between">
            <span>Homestead Visit</span>
            <span>$15.00</span>
          </p>
          <div className="border-t border-dark-blue/30 my-4 border-dashed"></div>
          <p className="text-dark-blue font-bold text-xl flex justify-between">
            <span>Total</span>
            <span>$15.00</span>
          </p>
        </Card>
        <div className="flex flex-col gap-4">
          <Button variant="primary" onClick={onSimulatePayment} disabled={isProcessing}>
            Pay $15.00
          </Button>
          <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
}
