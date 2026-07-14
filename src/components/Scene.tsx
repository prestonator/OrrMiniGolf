import { useState, Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Homestead2 } from "./Homestead";
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { getUserTier } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useKioskStore } from '../store/useKioskStore';

function ResponsiveCamera() {
  const { camera, size } = useThree()
  
  useEffect(() => {
    // Check if we are on a narrow mobile screen
    const isMobile = size.width < 768;
    
    // Type assertion used since we know it's a PerspectiveCamera
    const cam = camera as THREE.PerspectiveCamera;

    // Drastically lower FOV for the sleek, flat "isometric diorama" look
    cam.fov = isMobile ? 35 : 20; 
    
    // Because we lowered the FOV, we must pull the camera further back to fit the scene.
    // Positioned in the negative-X corner to get a nice diagonal strategy-game angle.
    if (isMobile) {
      cam.position.set(-200, 160, 200);
    } else {
      cam.position.set(-160, 120, 160);
    }
    
    cam.updateProjectionMatrix();
  }, [size, camera]);
  
  return null;
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
    navigate('/');
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
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Congratulations!</h2>
            <p className="text-gray-600 text-sm sm:text-base mb-6">
              You have proven up your 160-acre plot! You are eligible for the $20,000 Land Rush Tournament!
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
      <Canvas gl={{ logarithmicDepthBuffer: true }} shadows={{ type: THREE.PCFShadowMap }} dpr={[1, 2]}>
        {/* 1. The Warm Sunrise Background */}
        <color attach="background" args={["#e69e45"]} />

        <ResponsiveCamera />

        {/* 3. Hemisphere Light to warm up the dark side of the shadows */}
        <hemisphereLight intensity={0.4} color="#ffffff" groundColor="#a35d1a" />
        
        {/* 4. The Golden Sun (Directional Light) casting the long shadows */}
        <directionalLight 
          position={[-40, 30, -20]} // Low angle to push shadows beautifully across the map
          intensity={2.5} 
          color="#ffc777"
          castShadow 
          shadow-mapSize={[2048, 2048]} 
          shadow-bias={-0.0001}
        >
          {/* Shadow camera bounds strictly defining the shadow rendering area */}
          <orthographicCamera 
            attach="shadow-camera" 
            args={[-120, 120, 120, -120, 0.1, 500]} 
          />
        </directionalLight>
        
        {/* Allows the user to rotate around the land */}
        <OrbitControls 
          target={[0, 0, 0]} 
          maxPolarAngle={Math.PI / 2.1} 
          minDistance={10} 
          maxDistance={300}
          makeDefault 
        />

        <Suspense fallback={null}>
          <Homestead2 currentStage={currentStage} />
          
          {/* Post Processing Composer applies to everything */}
          <EffectComposer>
            {/* Tiny bit of film grain makes the flat lighting feel cinematic */}
            <Noise opacity={0.03} /> 
            
            {/* Darkens the screen edges to frame the diorama */}
            <Vignette eskil={false} offset={0.1} darkness={0.9} />
            
            {/* The magic glow only fires on the final stage */}
            <Bloom 
              enabled={currentStage === 26} 
              luminanceThreshold={0.5} 
              luminanceSmoothing={0.9} 
              height={300} 
              intensity={1.5} 
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}