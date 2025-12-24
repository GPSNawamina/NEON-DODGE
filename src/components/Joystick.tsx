import React, { useRef, useState } from 'react';
import { View, StyleSheet, PanResponder } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Vector2 } from '../game/types';

interface JoystickProps {
  onMove: (direction: Vector2) => void;
  size?: number;
}

export const Joystick: React.FC<JoystickProps> = ({ onMove, size = 120 }) => {
  const baseRadius = size / 2;
  const thumbRadius = size / 4;
  const maxDistance = baseRadius - thumbRadius;

  const [thumbPosition, setThumbPosition] = useState<Vector2>({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Reset to center on touch start
        setThumbPosition({ x: 0, y: 0 });
        onMove({ x: 0, y: 0 });
      },
      onPanResponderMove: (_, gestureState) => {
        const distance = Math.sqrt(
          gestureState.dx * gestureState.dx + gestureState.dy * gestureState.dy
        );

        let newPos: Vector2;
        if (distance > maxDistance) {
          const angle = Math.atan2(gestureState.dy, gestureState.dx);
          newPos = {
            x: Math.cos(angle) * maxDistance,
            y: Math.sin(angle) * maxDistance,
          };
        } else {
          newPos = {
            x: gestureState.dx,
            y: gestureState.dy,
          };
        }

        setThumbPosition(newPos);

        // Normalize to -1 to 1 range
        const normalized: Vector2 = {
          x: newPos.x / maxDistance,
          y: newPos.y / maxDistance,
        };

        onMove(normalized);
      },
      onPanResponderRelease: () => {
        setThumbPosition({ x: 0, y: 0 });
        onMove({ x: 0, y: 0 });
      },
    })
  ).current;

  return (
    <View style={[styles.container, { width: size, height: size }]} {...panResponder.panHandlers}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id="baseGrad" cx="50%" cy="50%">
            <Stop offset="0%" stopColor="rgba(255, 255, 255, 0.15)" />
            <Stop offset="100%" stopColor="rgba(255, 255, 255, 0.05)" />
          </RadialGradient>
          <RadialGradient id="thumbGrad" cx="50%" cy="50%">
            <Stop offset="0%" stopColor="#00ff88" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#00cc66" stopOpacity="0.9" />
          </RadialGradient>
        </Defs>
        
        {/* Base */}
        <Circle
          cx={baseRadius}
          cy={baseRadius}
          r={baseRadius - 5}
          fill="url(#baseGrad)"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="2"
        />
        
        {/* Thumb */}
        <Circle
          cx={baseRadius + thumbPosition.x}
          cy={baseRadius + thumbPosition.y}
          r={thumbRadius}
          fill="url(#thumbGrad)"
          stroke="#00ff88"
          strokeWidth="2"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
