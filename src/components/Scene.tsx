import { useState, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useTexture } from "@react-three/drei";
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
      <div className="w-full h-screen bg-[#e69e45] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/50 border-t-white"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      {/* UI Overlay */}
      <div className="absolute top-4 sm:top-10 left-1/2 -translate-x-1/2 z-10 flex flex-wrap gap-2 sm:gap-4 bg-white/80 backdrop-blur-md p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl border border-white/20 items-center justify-center w-[95vw] sm:w-auto max-w-lg">
        <span className="flex items-center text-sm sm:text-base font-bold text-gray-800 tracking-wide px-4 justify-center">
          Current Tier: {currentStage - 1} / {totalStages - 1}
        </span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base bg-gray-800 hover:bg-gray-900 active:scale-95 transition-all text-white font-semibold rounded-lg sm:rounded-xl shadow-md"
        >
          Done (Log Out)
        </button>
      </div>

      {/* Celebration Pop-up */}
      {currentStage === 26 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none p-4 mt-20 sm:mt-0">
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
          color="#ff8c42" // Classic golden-hour orange
          position={[-50, 20, -40]} // Y lowered from 30 to 10 for long, stretching shadows
          intensity={2} // Bumped up slightly to punch through the warm colors
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0005}
        >
          {/* These define the "volume" the sun covers. Increase if shadows get clipped */}
          <orthographicCamera
            attach="shadow-camera"
            args={[-30, 30, 30, -30]}
          />
        </directionalLight>
        <Suspense fallback={null}>
          <Model currentStage={currentStage} />
          <CustomEnvironment />
        </Suspense>
        {/* Allows the user to rotate around the land */}
        <OrbitControls makeDefault />
        {/* Post Processing Composer applies to everything */}
        <EffectComposer enableNormalPass={false}>
          {/* 
          ToneMapping: 
          - mode: Controls how the colors are mapped to the screen 
          - good modes:LINEAR,NEUTRAL
        */}
          <ToneMapping mode={ToneMappingMode.NEUTRAL} />
          {/* 
          Bloom: 
          - luminanceThreshold: Controls how bright something must be to glow. (1+ prevents the whole screen from glowing)
          - mipmapBlur: Creates a very smooth, cinematic glow rather than a harsh blur
          - intensity: How strong the glow is
        */}
          <Bloom luminanceThreshold={1.2} mipmapBlur intensity={0.5} />

          {/* 
          Vignette: 
          - offset & darkness: Controls the size and opacity of the darkened edges 
        */}
          <Vignette eskil={false} offset={0.05} darkness={0.9} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
