import type { ReactNode } from "react";
import { Spinner } from "../../../components/ui/Spinner";
import { Modal } from "../../../components/ui/Modal";

interface PaymentLayoutProps {
  children: ReactNode;
  isProcessing: boolean;
}

export function PaymentLayout({ children, isProcessing }: PaymentLayoutProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative font-sans"
      style={{
        backgroundImage: "url('/landingBackground.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="z-10 flex flex-col items-center max-w-md w-full mt-8">
        <Modal innerClassName="text-center">
          {isProcessing && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
              <Spinner size="lg" />
            </div>
          )}
          {children}
        </Modal>
      </div>
    </div>
  );
}
