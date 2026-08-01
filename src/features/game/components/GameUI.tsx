import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useKioskStore } from "../../../store/useKioskStore";
import { DeedCertificate } from "./DeedCertificate";
import { toJpeg } from "html-to-image";
import { jsPDF } from "jspdf";
import { supabase } from "../../../utils/supabase";

const getItemNameForTier = (tier: number) => {
  const items: Record<number, string> = {
    1: "Base Land",
    2: "Wild Grass",
    3: "Settler's Tent",
    4: "Bonfire",
    5: "Outhouse",
    6: "Shovel",
    7: "Cleared Land",
    8: "Water Well",
    9: "Tilled Soil",
    10: "Watering Equipment",
    11: "Firewood",
    12: "Chicken Coop",
    13: "Lantern",
    14: "Sprouting Crops",
    15: "Perimeter Fence",
    16: "Well Bucket",
    17: "Chickens",
    18: "Wheelbarrow",
    19: "Windmill",
    20: "Hay Storage",
    21: "Horse & Wagon",
    22: "Completed Residence",
    23: "Storm Shelter",
    24: "Clothesline",
    25: "Big Red Barn",
    26: "Pitchforks",
  };
  return items[tier] || "Mystery Item";
};

interface GameUIProps {
  currentStage: number;
  totalStages: number;
  session: { pioneerId: string; alias: string } | null;
}

export function GameUI({ currentStage, totalStages, session }: GameUIProps) {
  const navigate = useNavigate();
  const clearSession = useKioskStore((state) => state.clearSession);

  // Email state
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const deedRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    clearSession();
    navigate("/");
  };

  const handleEmailDeed = async () => {
    if (!email || !deedRef.current) return;
    setIsSending(true);
    try {
      // 1. Capture the DOM node using html-to-image which handles modern CSS (like oklch) better
      const width = deedRef.current.offsetWidth;
      const height = deedRef.current.offsetHeight;
      const imgData = await toJpeg(deedRef.current, {
        quality: 0.8,
        pixelRatio: 1,
      });

      // 2. Create PDF
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [width, height],
      });
      pdf.addImage(imgData, "JPEG", 0, 0, width, height);
      const pdfBase64 = pdf.output("datauristring").split(",")[1];

      // 3. Send to Edge Function using Supabase client
      const { error } = await supabase.functions.invoke("send-deed", {
        body: {
          email,
          pdfBase64,
          name: session?.alias || "Pioneer",
        },
      });

      if (error) throw error;
      setSendSuccess(true);
      setTimeout(() => {
        setShowEmailPrompt(false);
      }, 3000);
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error
          ? e.message
          : typeof e === "object" && e !== null && "message" in e
          ? String((e as { message: unknown }).message)
          : JSON.stringify(e);
      alert(`Error sending email: ${errorMessage}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* 1. Welcome Banner (Top Header) */}
      <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 max-w-xl w-[95vw] sm:w-auto pointer-events-auto">
        <div className="bg-cream border border-dark-blue/60 p-[3px] shadow-2xl rounded-sm w-full">
          <div className="border border-dark-blue/60 p-3 sm:p-4 bg-cream text-center flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-lg sm:text-xl font-bold text-dark-blue font-serif uppercase tracking-wide">
                Welcome to your Stage {currentStage} Homestead,{" "}
                {session?.alias || "Pioneer"}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-dark-blue/80">
                Stage {currentStage} / {totalStages}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-xs sm:text-sm bg-dark-blue hover:bg-dark-blue/90 text-cream font-bold rounded border border-dark-blue transition-colors shadow uppercase tracking-wide shrink-0"
            >
              Done (Log Out)
            </button>
          </div>
        </div>
      </div>

      {/* 2 & 3. Bottom Unlock Banner & Next Milestone Tease */}
      {currentStage < totalStages && (
        <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-auto text-center px-4 w-full max-w-md">
          {currentStage > 0 && (
            <div className="bg-[#99182a] border-2 border-[#e69e45] text-[#f2e3da] px-6 py-3 rounded-xl shadow-2xl animate-in zoom-in-95 duration-300 w-full">
              <p className="font-rye text-xl sm:text-2xl uppercase tracking-wider text-center">
                Tier {currentStage} Achieved! +1{" "}
                {getItemNameForTier(currentStage)}
              </p>
            </div>
          )}
          <div className="bg-[#132c3f]/90 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20 text-amber-200 text-xs sm:text-sm font-medium tracking-wide shadow-md">
            Reach Tier {currentStage + 1} to unlock the{" "}
            {getItemNameForTier(currentStage + 1)}!
          </div>
        </div>
      )}

      {/* Final Tier Reward Sequence */}
      {currentStage === 26 && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none p-4 bg-black/60 backdrop-blur-sm overflow-y-auto pt-24 sm:pt-4">
          <div className="pointer-events-auto flex flex-col items-center w-full max-w-5xl animate-[pop-up_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            {/* The Deed */}
            <div className="w-full flex justify-center transform scale-90 sm:scale-100 origin-top">
              <DeedCertificate
                ref={deedRef}
                name={session?.alias || "Pioneer"}
              />
            </div>

            {/* Actions below the deed */}
            <div className="mt-8 bg-white/95 p-6 rounded-xl shadow-2xl w-full max-w-md text-center border-4 border-[#8b5a2b]">
              {!showEmailPrompt ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 font-serif">
                    Congratulations!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    You have proven up your 160-acre plot! Claim your official
                    Certificate of Homestead.
                  </p>
                  <button
                    onClick={() => setShowEmailPrompt(true)}
                    className="w-full bg-[#8b5a2b] hover:bg-[#6b441f] text-white font-bold py-3 rounded transition-colors uppercase tracking-widest"
                  >
                    Email My Deed
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full mt-3 text-gray-500 hover:text-gray-800 underline text-sm"
                  >
                    No thanks, just log out
                  </button>
                </>
              ) : sendSuccess ? (
                <div className="text-green-700 font-bold p-4 bg-green-50 rounded">
                  <p className="text-xl mb-2">Success!</p>
                  <p className="text-sm">Your deed has been sent to {email}.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-bold text-gray-800">
                    Send to Email
                  </h3>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded text-black focus:border-[#8b5a2b] focus:outline-none"
                    disabled={isSending}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowEmailPrompt(false)}
                      className="w-1/3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded transition-colors"
                      disabled={isSending}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEmailDeed}
                      className="w-2/3 bg-[#8b5a2b] hover:bg-[#6b441f] text-white font-bold py-3 rounded transition-colors disabled:opacity-50"
                      disabled={isSending || !email.includes("@")}
                    >
                      {isSending ? "Generating PDF..." : "Send Email"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
