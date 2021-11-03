import React, { useState, FC } from "react";
import { Interactive } from "@react-three/xr";
import { Text } from "@react-three/drei";
import "@react-three/fiber";

// TODO: Type
function Box({ color, size, scale, children, ...rest }: any) {
  return (
    <mesh scale={scale} {...rest}>
      <boxBufferGeometry attach="geometry" args={size} />
      <meshPhongMaterial attach="material" color={color} />
      {children}
    </mesh>
  );
}

interface StartButtonProps {
  onClick: () => void;
  label: string;
  boxProps?: any; // TODO: Type
}

export const StartButton: FC<StartButtonProps> = ({
  onClick,
  label,
  boxProps
}) => {
  const [hover, setHover] = useState(false);
  const [color, setColor] = useState(0xffffff);

  const onSelect = () => {
    setColor((Math.random() * 0xffffff) | 0);
    onClick();
  };

  return (
    <Interactive
      onSelect={onSelect}
      onHover={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <Box
        color={color}
        scale={hover ? [1.5, 1.5, 1.5] : [1, 1, 1]}
        size={[0.4, 0.1, 0.1]}
        {...boxProps}
      >
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.05}
          color="#000"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </Box>
    </Interactive>
  );
};
