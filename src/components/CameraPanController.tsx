import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface CameraPanProps {
  startPos?: [number, number, number];
  targetPos?: [number, number, number];
  targetRot?: [number, number, number];
  holdDelayMs?: number;
  durationMs?: number;
}

export function CameraPanController({
  startPos = [30, 8, 44],
  targetPos = [46.01, 19.54, 58.72],
  targetRot = [-0.32, 0.64, 0.2],
  holdDelayMs = 1000,
  durationMs = 3000,
}: CameraPanProps) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const startTimeRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(true);

  const startEuler = useRef(new THREE.Euler());
  const targetQuaternion = useRef(
    new THREE.Quaternion().setFromEuler(new THREE.Euler(targetRot[0], targetRot[1], targetRot[2]))
  );

  useEffect(() => {
    camera.position.set(startPos[0], startPos[1], startPos[2]);
    camera.lookAt(0, 0, 0);
    startEuler.current.copy(camera.rotation);
  }, [camera, startPos]);

  useFrame((state) => {
    if (!isAnimatingRef.current) return;

    if (startTimeRef.current === null) {
      startTimeRef.current = state.clock.getElapsedTime();
    }

    const elapsedMs = (state.clock.getElapsedTime() - startTimeRef.current) * 1000;

    if (elapsedMs < holdDelayMs) {
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      return;
    }

    const progress = Math.min((elapsedMs - holdDelayMs) / durationMs, 1);
    const easeProgress = THREE.MathUtils.smoothstep(progress, 0, 1);

    camera.position.x = THREE.MathUtils.lerp(startPos[0], targetPos[0], easeProgress);
    camera.position.y = THREE.MathUtils.lerp(startPos[1], targetPos[1], easeProgress);
    camera.position.z = THREE.MathUtils.lerp(startPos[2], targetPos[2], easeProgress);

    const startQuat = new THREE.Quaternion().setFromEuler(startEuler.current);
    camera.quaternion.copy(startQuat).slerp(targetQuaternion.current, easeProgress);

    if (controlsRef.current) {
      controlsRef.current.update();
    }

    if (progress >= 1) {
      isAnimatingRef.current = false;
    }
  });

  return <OrbitControls ref={controlsRef} makeDefault />;
}

export default CameraPanController;
