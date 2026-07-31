import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useKioskStore } from "../../../store/useKioskStore";
import { PaymentLayout } from "../Payment/PaymentLayout";
import { VisitCheckout } from "../Payment/VisitCheckout";
import { QuickRoundCheckout } from "../Payment/QuickRoundCheckout";
import { usePurchaseRounds } from "../api/usePurchaseRounds";

export interface PaymentProps {
  mode?: "quick-round" | "visit";
}

export default function Payment({ mode = "quick-round" }: PaymentProps) {
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success">(
    "idle",
  );
  const [receiptCode, setReceiptCode] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();
  const session = useKioskStore((state) => state.session);
  const setTimerPaused = useKioskStore((state) => state.setTimerPaused);

  useEffect(() => {
    setTimerPaused(true);
    return () => setTimerPaused(false);
  }, [setTimerPaused]);

  useEffect(() => {
    if (mode === "visit" && !session?.pioneerId) {
      navigate("/");
    }
  }, [mode, session, navigate]);

  const { mutateAsync: purchaseRounds } = usePurchaseRounds();

  const handleSimulatePayment = (quantity: number) => {
    setIsProcessing(true);
    setTimeout(async () => {
      if (mode === "visit" && session?.pioneerId) {
        try {
          await purchaseRounds({ userId: session.pioneerId, quantity });
        } catch (error) {
          console.error("Failed to purchase rounds", error);
        }
      }
      setIsProcessing(false);
      handleSuccess();
    }, 1500);
  };

  const handleSuccess = () => {
    if (mode === "visit") {
      navigate("/map");
    } else {
      const code = Math.random().toString(36).substring(2, 7).toUpperCase();
      setReceiptCode(code);
      setPaymentStatus("success");
    }
  };

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

  return (
    <PaymentLayout isProcessing={isProcessing}>
      {mode === "visit" ? (
        <VisitCheckout
          alias={session?.alias}
          isProcessing={isProcessing}
          onSimulatePayment={handleSimulatePayment}
          onCancel={handleCancel}
        />
      ) : (
        <QuickRoundCheckout
          paymentStatus={paymentStatus}
          receiptCode={receiptCode}
          isProcessing={isProcessing}
          onSimulatePayment={handleSimulatePayment}
          onCancel={handleCancel}
        />
      )}
    </PaymentLayout>
  );
}
