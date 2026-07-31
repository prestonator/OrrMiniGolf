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
import { ToneMappingMode } from "postprocessing";
import { Spinner } from "../../../components/ui/Spinner";
import { CameraPanController } from "./CameraPanController";

function CustomEnvironment() {
  const texture = useTexture("/bgSky3.png");
  texture.mapping = THREE.EquirectangularReflectionMapping;

  return (
    <>
      <Environment preset="forest" />
      <Environment
        map={texture}
        background="only"
        blur={0.05}
        backgroundRotation={[0, Math.PI, 0]}
      />
    </>
  );
}

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

interface SceneProps {
  currentStage: number;
}

export default function Scene({ currentStage }: SceneProps) {
  return (
    <div className="relative w-full h-full">
      <LoadingOverlay />
      {/* 3D Canvas */}
      <Canvas shadows camera={{ position: [30, 8, 44], fov: 50 }}>
        {/* Lighting Setup */}
        <directionalLight
          castShadow
          color="#ff8c42"
          position={[-50, 15, -50]}
          intensity={2.5}
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0005}
        >
          <orthographicCamera
            attach="shadow-camera"
            args={[-40, 40, 40, -40, 0.1, 500]}
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
          <Bloom luminanceThreshold={1.1} mipmapBlur intensity={0.5} />
          <Vignette eskil={false} offset={0.05} darkness={0.9} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
