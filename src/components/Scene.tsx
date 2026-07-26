import { useState, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, useTexture, useProgress } from "@react-three/drei";
import { Model } from "./Homestead-final";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ToneMapping,
} from "@react-three/postprocessing";
import * as THREE from "three";
import { getUserTier } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useKioskStore } from "../store/useKioskStore";
import { ToneMappingMode } from "postprocessing";
import { Spinner } from "./Spinner";
import { CameraPanController } from "./CameraPanController";

function CustomEnvironment() {
  const texture = useTexture("/bgSky.png");
  texture.mapping = THREE.EquirectangularReflectionMapping;

  return (
    <>
      <Environment preset="forest" />
      <Environment map={texture} background="only" blur={0.05} />
    </>
  );
}

const getItemNameForTier = (tier: number) => {
  const items: Record<number, string> = {
    1: "Wild Grass",
    2: "Fertile Soil",
    3: "Oak Trees & Timber",
    4: "Log Cabin",
    5: "Windmill",
    6: "Pine Orchard",
    7: "Water Well",
  };
  return items[tier] || "Log Cabin";
};

const getNextItemNameForStage = (stage: number) => {
  const items: Record<number, string> = {
    2: "Fertile Soil",
    3: "Oak Trees & Timber",
    4: "Log Cabin",
    5: "Windmill",
    6: "Pine Orchard",
    7: "Water Well",
  };
  return items[stage] || "Windmill";
};

function LoadingOverlay() {
  const { active, progress } = useProgress();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!active && progress === 100) {
      const t = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(t);
    } else if (active) {
      setVisible(true);
    }
  }, [active, progress]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-50 bg-cream flex flex-col items-center justify-center transition-opacity duration-500">
      <Spinner 
        size="lg" 
        text={`Loading Homestead... ${progress > 0 ? `${Math.round(progress)}%` : ""}`} 
        subtext="Pioneering the frontier..."
      />
    </div>
  );
}

export default function Scene() {
  const navigate = useNavigate();
  const session = useKioskStore((state) => state.session);
  const clearSession = useKioskStore((state) => state.clearSession);

  const [currentStage, setCurrentStage] = useState(1);
  const [loading, setLoading] = useState(true);
  const totalStages = 26;

  useEffect(() => {
    async function load() {
      if (!session?.pioneerId) {
        setLoading(false);
        return;
      }
      const tier = await getUserTier(session.pioneerId);
      // Tier 0 -> Stage 1, Tier 1 -> Stage 2, etc. Max 26.
      setCurrentStage(Math.min(totalStages, tier + 1));
      setLoading(false);
    }
    load();
  }, [session?.pioneerId]);

  const handleLogout = () => {
    clearSession();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-cream flex flex-col items-center justify-center">
        <Spinner 
          size="lg" 
          text="Loading Homestead..." 
          subtext="Pioneering the frontier..." 
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <LoadingOverlay />
      {/* 1. Welcome Banner (Top Header) */}
      <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 max-w-xl w-[95vw] sm:w-auto pointer-events-auto">
        <div className="bg-cream border border-dark-blue/60 p-[3px] shadow-2xl rounded-sm w-full">
          <div className="border border-dark-blue/60 p-3 sm:p-4 bg-cream text-center flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-lg sm:text-xl font-bold text-dark-blue font-serif uppercase tracking-wide">
                Welcome to your level {currentStage - 1} Homestead, {session?.alias || 'Pioneer'}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-dark-blue/80">
                Current Tier: {currentStage - 1} / {totalStages - 1}
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
        <div className="bg-[#99182a] border-2 border-[#e69e45] text-[#f2e3da] px-6 py-3 rounded-xl shadow-2xl animate-in zoom-in-95 duration-300 w-full">
          <p className="font-rye text-xl sm:text-2xl uppercase tracking-wider text-center">
            Tier {currentStage - 1} Achieved! +1 {getItemNameForTier(currentStage - 1)}
          </p>
        </div>
        <div className="bg-[#132c3f]/90 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20 text-amber-200 text-xs sm:text-sm font-medium tracking-wide shadow-md">
          Reach Tier {currentStage} to unlock the {getNextItemNameForStage(currentStage)}!
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

      {/* 3D Canvas */}
      <Canvas shadows camera={{ position: [30, 8, 44], fov: 50 }}>
        {/* Lighting Setup */}
        <directionalLight
          castShadow
          color="#ff8c42"
          position={[-50, 20, -40]}
          intensity={2}
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0005}
        >
          <orthographicCamera
            attach="shadow-camera"
            args={[-30, 30, 30, -30]}
          />
        </directionalLight>
        <Suspense fallback={null}>
          <Model currentStage={currentStage} />
          <CustomEnvironment />
        </Suspense>
        {/* Camera Pan Animation and Interactive Orbit Controls */}
        <CameraPanController />
        {/* Post Processing Composer applies to everything */}
        <EffectComposer enableNormalPass={false}>
          <ToneMapping mode={ToneMappingMode.NEUTRAL} />
          <Bloom luminanceThreshold={1.2} mipmapBlur intensity={0.5} />
          <Vignette eskil={false} offset={0.05} darkness={0.9} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
