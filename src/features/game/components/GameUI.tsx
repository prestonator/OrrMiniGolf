import { useNavigate } from "react-router-dom";
import { useKioskStore } from "../../../store/useKioskStore";

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
  session: any;
}

export function GameUI({ currentStage, totalStages, session }: GameUIProps) {
  const navigate = useNavigate();
  const clearSession = useKioskStore((state: any) => state.clearSession);

  const handleLogout = () => {
    clearSession();
    navigate("/");
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
          {currentStage === 26
            ? "Congratulations! You have proved your homestead and are now eligible for the 20k mini golf tournament"
            : `Reach Tier ${currentStage + 1} to unlock the ${getItemNameForTier(currentStage + 1)}!`}
        </div>
      </div>

      {/* Celebration Pop-up */}
      {currentStage === 26 && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none p-4 mt-20 sm:mt-0">
          <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-sm text-center border-4 border-yellow-500 pointer-events-auto animate-[pop-up_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Congratulations!
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mb-6">
              You have proven up your 160-acre plot! You are eligible for the
              $20,000 Land Rush Tournament!
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2.5 sm:p-3 border rounded mb-4 text-black text-sm sm:text-base"
            />
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 sm:py-3 rounded transition-colors text-sm sm:text-base">
              Claim Certificate of Homestead
            </button>
          </div>
        </div>
      )}
    </>
  );
}
