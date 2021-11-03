import React, { FC, Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { Plane } from "@react-three/drei";
import { Texture, Vector2 } from "three";
import { TextureLoader } from "three/src/loaders/TextureLoader";

interface PlayBoxProps {
  boxSizeX: number;
  boxSizeY: number;
  boxSizeZ: number;
}

export const PlayBox: FC<PlayBoxProps> = ({ boxSizeX, boxSizeY, boxSizeZ }) => {
  const [
    wallDiffuseMap,
    wallBumpMap,
    wallRoughnessMap
  ] = useLoader(TextureLoader, [
    "textures/brick_diffuse.jpg",
    "textures/brick_bump.jpg",
    "textures/brick_roughness.jpg"
  ]);

  useEffect(() => {
    wallDiffuseMap.wrapS = THREE.RepeatWrapping;
    wallDiffuseMap.wrapT = THREE.RepeatWrapping;
    wallDiffuseMap.repeat.set(2, 1);

    wallBumpMap.wrapS = THREE.RepeatWrapping;
    wallBumpMap.wrapT = THREE.RepeatWrapping;
    wallBumpMap.repeat.set(2, 1);
    wallRoughnessMap.wrapS = THREE.RepeatWrapping;
    wallRoughnessMap.wrapT = THREE.RepeatWrapping;
    wallRoughnessMap.repeat.set(2, 1);
  }, [wallDiffuseMap]);

  const [
    floorDiffuseMap,
    floorBumpMap,
    floorRoughnessMap
  ] = useLoader(TextureLoader, [
    "textures/hardwood2_diffuse.jpg",
    "textures/hardwood2_bump.jpg",
    "textures/hardwood2_roughness.jpg"
  ]);

  useEffect(() => {
    floorDiffuseMap.wrapS = THREE.RepeatWrapping;
    floorDiffuseMap.wrapT = THREE.RepeatWrapping;
    floorDiffuseMap.rotation = Math.PI / 2;
    floorDiffuseMap.repeat.set(8, 3);
    floorBumpMap.wrapS = THREE.RepeatWrapping;
    floorBumpMap.wrapT = THREE.RepeatWrapping;
    floorBumpMap.rotation = Math.PI / 2;
    floorBumpMap.repeat.set(8, 3);
    floorRoughnessMap.wrapS = THREE.RepeatWrapping;
    floorRoughnessMap.wrapT = THREE.RepeatWrapping;
    floorRoughnessMap.rotation = Math.PI / 2;
    floorRoughnessMap.repeat.set(8, 3);
    console.log("useEffect");
  }, [floorDiffuseMap]);

  return (
    <group>
      <Plane
        args={[boxSizeX, boxSizeZ]}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          map={floorDiffuseMap}
          roughnessMap={floorRoughnessMap}
          bumpMap={floorBumpMap}
          needsUpdate={true}
        />
      </Plane>
      <Plane
        args={[boxSizeX, boxSizeZ]}
        position={[0, boxSizeY, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial attach="material" color="blue" />
      </Plane>
      <Plane
        args={[boxSizeZ, boxSizeY]}
        position={[-boxSizeX / 2, boxSizeY / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          map={wallDiffuseMap}
          roughnessMap={wallRoughnessMap}
          bumpMap={wallBumpMap}
          needsUpdate={true}
          color="white"
        />
      </Plane>
      <Plane
        args={[boxSizeZ, boxSizeY]}
        position={[boxSizeX / 2, boxSizeY / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          map={wallDiffuseMap}
          roughnessMap={wallRoughnessMap}
          bumpMap={wallBumpMap}
          needsUpdate={true}
        />
      </Plane>
    </group>
  );
};
