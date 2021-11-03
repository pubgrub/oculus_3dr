///<reference path="trystero.d.ts" />

import React, { useRef, FC } from "react";
import * as THREE from "three";
import { Box } from "@react-three/drei";

import { useShadowHelper } from "./useShadowHelper";

interface PlaySpotLightProps {
  targetPosition: THREE.Vector3;
  boxRef: React.MutableRefObject<typeof THREE.Object3D | undefined>;
}
export const PlaySpotLight: FC<PlaySpotLightProps> = ({
  targetPosition,
  boxRef
}) => {
  const spotlightRef = useRef<THREE.SpotLight>();
  // useShadowHelper(spotlightRef);

  const lightTarget = new THREE.Mesh();

  return (
    <group>
      <primitive object={lightTarget} position={targetPosition} />

      <Box ref={boxRef} position={[0, 18, 0]} scale={[1, 1, 1]}>
        <meshPhongMaterial
          attach="material"
          color={0x48ff40}
          flatShading={true}
        />
      </Box>

      <spotLight
        ref={spotlightRef}
        position={[0, 17, 0]}
        target={lightTarget}
        color="#ffffff"
        intensity={3}
        shadow-mapSize-height={1024}
        shadow-mapSize-width={1024}
        shadow-camera-far={40}
        shadow-camera-near={5}
        penumbra={0.5}
        angle={0.5}
        castShadow
      />
    </group>
  );
};
