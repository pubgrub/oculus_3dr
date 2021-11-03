import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { softShadows } from "@react-three/drei";

softShadows({
  frustum: 3.75, // Frustum width (default: 3.75) must be a float
  size: 0.005, // World size (default: 0.005) must be a float
  near: 9.5, // Near plane (default: 9.5) must be a float
  samples: 17, // Samples (default: 17) must be a int
  rings: 11 // Rings (default: 11) must be a int
});

export const useShadowHelper = (
  ref: React.MutableRefObject<THREE.Light | undefined>
) => {
  const helper = useRef<THREE.CameraHelper>();
  const scene = useThree((state) => state.scene);

  React.useEffect(() => {
    if (!ref.current) return;

    helper.current = new THREE.CameraHelper(ref.current?.shadow.camera);
    if (helper.current) {
      scene.add(helper.current);
    }

    return () => {
      if (helper.current) {
        scene.remove(helper.current);
      }
    };
  }, [ref, scene]);

  useFrame(() => {
    if (helper.current?.update) {
      helper.current.update();
    }
  });
};
