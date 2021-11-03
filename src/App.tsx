///<reference path="trystero.d.ts" />

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  FC,
  Suspense
} from "react";
import * as THREE from "three";
import {
  Interactive,
  VRCanvas,
  DefaultXRControllers,
  Hands,
  useXR
} from "@react-three/xr";
import { useThree } from "@react-three/fiber";
import { Text, Box, OrbitControls, Sky } from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import { useConnection } from "./useConnection";
import { StartButton } from "./StartButton";
import { PlayBox } from "./PlayBox";
import { PlaySpotLight } from "./PlaySpotLight";
import { CoordHelper } from "./CoordHelper";

const Scene: FC = () => {
  const boxSizeX = 60;
  const boxSizeY = 24;
  const boxSizeZ = 80;

  const CoordHelperX = 0;
  const CoordHelperY = 0;
  const CoordHelperZ = 0;
  const CoordHelperDist = 5;
  const CoordHelperVisibility = true;

  const speed = 100;

  const [hoverBoxIndex, setHoverBoxIndex] = useState(-1);
  const [counter, setCounter] = useState(-1);
  const { gl, camera, clock, vr } = useThree();
  const { player } = useXR();

  const [ballPosition, setBallPosition] = useState<THREE.Vector3>(
    () => new THREE.Vector3(0, 10, 0)
  );
  const [ballDir, setBallDir] = useState<THREE.Vector3>(
    () => new THREE.Vector3(0, 0, 1)
  );

  const receiveData = useCallback((isMaster, data) => {
    if (typeof data === "object" && data !== null) {
      console.log(
        !isMaster,
        data.type === "ballpos",
        typeof data.position === "object",
        data.position !== null
      );
      if (
        !isMaster &&
        data.type === "ballpos" &&
        typeof data.position === "object" &&
        data.position !== null
      ) {
        setBallPosition(
          new THREE.Vector3(
            data.position[0],
            data.position[1],
            data.position[2]
          )
        );
      }
    }
  }, []);

  const { ready, peerReady, isMaster, sendData, buttonProps } = useConnection(
    receiveData
  );

  const boxRef = useRef<typeof THREE.Object3D>();

  const controlsRef = React.useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // setCounter(Date.now() / 1000);

      // setCounter(counter + clock.getDelta());

      if (isMaster) {
        const newBallPosition = ballPosition
          .clone()
          .addScaledVector(ballDir, clock.getDelta() * speed);
        if (ballDir.z > 0 && ballPosition.z > boxSizeZ / 2) {
          ballPosition.setZ(boxSizeZ - ballPosition.z);
          setBallDir(ballDir.clone().setZ(-ballDir.z));
        } else if (ballDir.z < 0 && ballPosition.z < -boxSizeZ / 2) {
          ballPosition.setZ(ballPosition.z - boxSizeZ);
          setBallDir(ballDir.clone().setZ(-ballDir.z));
        }
        setBallPosition(newBallPosition);
        sendData({
          type: "ballpos",
          position: newBallPosition.toArray()
        });
      }
    }, 15);
    return () => clearInterval(interval);
  }, [
    isMaster,
    setCounter,
    clock,
    counter,
    setBallPosition,
    ballPosition,
    ballDir,
    sendData
  ]);

  useEffect(() => {
    if (vr) {
      player.position.z += boxSizeZ / 2;
      player.position.y += 6;
    }
  }, [player, vr]);

  const buttonClick = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "a" && buttonProps.onClick) {
        console.log("CLICK SIMULATED");
        buttonProps.onClick();
      }
    },
    [buttonProps]
  );

  useEffect(() => {
    console.log("HU");
    window.addEventListener("keypress", buttonClick);
    return () => window.removeEventListener("keypress", buttonClick);
  }, [buttonClick]);

  useEffect(() => {
    console.log(
      "Connection:",
      "ready =",
      ready ? "YES" : "NO",
      "peerReady =",
      peerReady ? "YES" : "NO",
      "isMaster =",
      isMaster ? "YES" : "NO"
    );
  }, [isMaster, ready, peerReady]);

  let startButton = buttonProps.onClick ? (
    <StartButton onClick={buttonProps.onClick} label={buttonProps.label} />
  ) : (
    <Text>{buttonProps.label}</Text>
  );

  const cam = gl?.xr.isPresenting ? gl.xr.getCamera(camera) : camera;
  const dir = new THREE.Vector3();
  const toDeg = (rad: number) => Math.round((rad * 180) / Math.PI);
  // eslint-disable-next-line no-unused-expressions
  cam?.getWorldDirection(dir);

  const quat = new THREE.Quaternion();
  // eslint-disable-next-line no-unused-expressions
  cam?.getWorldQuaternion(quat);

  const i = 0;
  const hovered = hoverBoxIndex === i;
  const rotY = quat.z * 6 + counter * 0.4;
  const rotZ = quat.z * 4;

  const box = (
    <Interactive
      key={i}
      onHover={() => setHoverBoxIndex(i)}
      onBlur={() => setHoverBoxIndex(-1)}
    >
      <Box
        key={i}
        position={ballPosition}
        rotation={[0, rotY, rotZ]}
        scale={hoverBoxIndex === i ? [3, 3, 3] : [2, 2, 2]}
        castShadow
      >
        <meshPhongMaterial
          attach="material"
          color={hovered ? 0xce21a7 : 0x48ff40}
          flatShading={true}
        />
      </Box>
    </Interactive>
  );

  const dirStr = toDeg(dir?.x) + " " + toDeg(dir?.y) + " " + toDeg(dir?.z);
  const quatStr =
    toDeg(quat?.x) +
    " " +
    toDeg(quat?.y) +
    " " +
    toDeg(quat?.z) +
    " " +
    toDeg(quat?.w);

  //  return <></>;

  return (
    <group>
      <OrbitControls ref={controlsRef} />
      <DefaultXRControllers />
      <Sky sunPosition={[0, 1, 0]} />
      <ambientLight intensity={0.3} />
      <Hands />

      <PlayBox {...{ boxSizeX, boxSizeY, boxSizeZ }} />
      <PlaySpotLight targetPosition={ballPosition} boxRef={boxRef} />
      <CoordHelper
        {...{
          CoordHelperX,
          CoordHelperY,
          CoordHelperZ,
          CoordHelperDist,
          CoordHelperVisibility
        }}
      />

      <group scale={[5, 5, 5]} position={[0, boxSizeY / 2, 10]}>
        {startButton}
      </group>

      <Text scale={[5, 5, 5]} position={[0, -3, -10]}>
        dir[{dirStr}]
      </Text>
      <Text scale={[5, 5, 5]} position={[0, -3.6, -10]}>
        quat[{quatStr}]
      </Text>
      {box}
    </group>
  );
};

export const App = () => {
  return (
    <VRCanvas
      shadows
      camera={{ position: [0, 6, 20], fov: 90 }}
      onCreated={({ gl, camera }) => {
        // gl.physicallyCorrectLights = true;
      }}
    >
      <Suspense fallback={<Box />}>
        <Scene />
      </Suspense>
    </VRCanvas>
  );
};
