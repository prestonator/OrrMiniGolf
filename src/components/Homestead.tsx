import { Stages } from "./homestead/Stages";
import { useState, useEffect } from "react";
import { useGLTF, Sparkles } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";

interface AnimatedGroupProps {
  children: React.ReactNode;
  stage: number;
  currentStage: number;
  dropHeight?: number;
  animType?: "drop" | "grow" | "wobble";
}

export function AnimatedGroup({
  children,
  stage,
  currentStage,
  dropHeight = 3000,
  animType = "drop",
}: AnimatedGroupProps) {
  const active = currentStage >= stage;
  const [visible, setVisible] = useState(active);
  const [initialStage] = useState(currentStage);

  let delay = 0;
  if (active) {
    if (stage <= initialStage) {
      const maxDelay = 2000;
      delay =
        initialStage > 1 ? ((stage - 1) / (initialStage - 1)) * maxDelay : 0;
    } else {
      delay = 200;
    }
  }

  // The Drop Animation (Buildings/Objects)
  const { y } = useSpring({
    from: { y: dropHeight },
    y: active ? stage * 0.5 : dropHeight,
    delay: delay,
    config: { mass: 6, tension: 40, friction: 22, clamp: true },
    onChange: ({ value }) => {
      if (!active && value.y >= dropHeight - 0.05) {
        setVisible(false);
      }
    },
  });

  // The Grow Animation (Plants/Crops)
  const { scale } = useSpring({
    from: { scale: 0 },
    scale: active ? 1 : 0,
    delay: delay,
    config: { mass: 1, tension: 120, friction: 14 },
    onChange: ({ value }) => {
      if (!active && value.scale <= 0.01) {
        setVisible(false);
      }
    },
  });

  // The Wobble Animation (Outhouse)
  const { rotateZ } = useSpring({
    from: { rotateZ: 0.5 },
    rotateZ: active ? 0 : 0.5, // Starts tilted
    delay: delay,
    config: { mass: 3, tension: 200, friction: 5 }, // Highly bouncy/wobbly
  });

  if (active && !visible) setVisible(true);

  if (animType === "grow") {
    return (
      <animated.group scale={scale} visible={visible}>
        {children}
      </animated.group>
    );
  }

  if (animType === "wobble") {
    return (
      <animated.group position-y={y} rotation-z={rotateZ} visible={visible}>
        {children}
      </animated.group>
    );
  }

  return (
    <animated.group position-y={y} visible={visible}>
      {children}
    </animated.group>
  );
}

export function CelebrationEffect({ currentStage }: { currentStage: number }) {
  const active = currentStage === 26;
  if (!active) return null;

  return (
    <group>
      <Sparkles count={500} scale={100} size={40} speed={0.4} color="#ffdf00" />
    </group>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Homestead2({
  currentStage,
  ...props
}: React.ComponentPropsWithoutRef<"group"> & { currentStage: number }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { scene, nodes, materials } = useGLTF("/homestead.glb") as any;

  // THE MAGIC SLEEK UPGRADE
  useEffect(() => {
    if (!scene) return;

    scene.traverse((child: THREE.Object3D) => {
      // If the item is a mesh (building, ground, tractor)
      if (child instanceof THREE.Mesh) {
        // 1. Turn on shadows!
        child.castShadow = true;
        child.receiveShadow = true;

        // 2. Make it look sleek, flat, and low-poly
        if (child.material) {
          child.material.flatShading = true; // Gives that crisp, faceted look
          child.material.roughness = 0.9; // Makes it perfectly matte like clay/paper
          child.material.metalness = 0.0; // Removes weird AI glossiness
          child.material.needsUpdate = true; // Tells React to redraw the material
        }
      }
    });
  }, [scene]);

  return (
    <group {...props} dispose={null}>
      <CelebrationEffect currentStage={currentStage} />
      <Stages nodes={nodes} materials={materials} currentStage={currentStage} />
    </group>
  );
}
