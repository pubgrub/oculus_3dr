import React, { FC, Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { Plane, Sphere } from "@react-three/drei";
import { Texture, Vector2 } from "three";
import { TextureLoader } from "three/src/loaders/TextureLoader";

interface CoordHelperProps {
  CoordHelperX: number;
  CoordHelperY: number;
  CoordHelperZ: number;
  CoordHelperDist: number;
  CoordHelperVisibility: boolean;
}

export const CoordHelper: FC<CoordHelperProps> = ({
  CoordHelperX,
  CoordHelperY,
  CoordHelperZ,
  CoordHelperDist,
  CoordHelperVisibility
}) => {
  return (
    <group>
      <Sphere
        position={[CoordHelperX, CoordHelperY, CoordHelperZ]}
        visible={CoordHelperVisibility}
      >
        <meshStandardMaterial attach="material" color="white" />
      </Sphere>
      <Sphere
        position={[CoordHelperX + CoordHelperDist, CoordHelperY, CoordHelperZ]}
        visible={CoordHelperVisibility}
      >
        <meshStandardMaterial attach="material" color="red" />
      </Sphere>
      <Sphere
        position={[CoordHelperX, CoordHelperY + CoordHelperDist, CoordHelperZ]}
        visible={CoordHelperVisibility}
      >
        <meshStandardMaterial attach="material" color="green" />
      </Sphere>
      <Sphere
        position={[CoordHelperX, CoordHelperY, CoordHelperZ + CoordHelperDist]}
        visible={CoordHelperVisibility}
      >
        <meshStandardMaterial attach="material" color="blue" />
      </Sphere>
    </group>
  );
};
