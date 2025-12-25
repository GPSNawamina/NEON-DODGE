import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  BackHandler,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Circle, Rect, Defs, RadialGradient, Stop } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { GameEngine } from '../game/engine';
import { GameSettings, Vector2 } from '../game/types';
import { HUD } from '../components/HUD';
import { Joystick } from '../components/Joystick';
import { PauseOverlay } from '../components/PauseOverlay';
import { audioManager } from '../audio/audioManager';

interface GameScreenProps {
  settings: GameSettings;
  highScore: number;
  onGameOver: (score: number, isNewHighScore: boolean) => void;
  onQuit: () => void;
  onSettingsChange: (settings: GameSettings) => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const GameScreen: React.FC<GameScreenProps> = ({
  settings,
  highScore,
  onGameOver,
  onQuit,
  onSettingsChange,
}) => {
  const engineRef = useRef<GameEngine | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const joystickInputRef = useRef<Vector2>({ x: 0, y: 0 });

  const [time, setTime] = useState(60);
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [renderTrigger, setRenderTrigger] = useState(0);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Initialize engine
  useEffect(() => {
    const engine = new GameEngine(SCREEN_WIDTH, SCREEN_HEIGHT, settings, highScore);
    
    engine.setCallbacks({
      onTimeUpdate: setTime,
      onScoreUpdate: setScore,
      onMultiplierUpdate: setMultiplier,
      onGameOver: (finalScore, isNewHighScore) => {
        if (settings.soundEnabled) {
          audioManager.playGameOver();
        }
        onGameOver(finalScore, isNewHighScore);
      },
      onHit: () => {
        if (settings.soundEnabled) {
          audioManager.playHit();
        }
        if (!settings.reducedMotion) {
          // Haptic feedback
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          // Screen shake
          Animated.sequence([
            Animated.timing(shakeAnim, {
              toValue: 10,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
              toValue: -10,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
              toValue: 0,
              duration: 50,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
      onOrbCollect: () => {
        if (settings.soundEnabled) {
          audioManager.playOrb();
        }
        if (!settings.reducedMotion) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      },
    });

    engineRef.current = engine;

    // Game loop
    const gameLoop = (currentTime: number) => {
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = currentTime;
      }

      const deltaTime = currentTime - lastFrameTimeRef.current;
      lastFrameTimeRef.current = currentTime;

      if (engineRef.current) {
        engineRef.current.update(deltaTime, joystickInputRef.current);
        setRenderTrigger((prev) => prev + 1);
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    // Android back button handler
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (engineRef.current) {
        engineRef.current.pause();
        setIsPaused(true);
      }
      return true;
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      backHandler.remove();
    };
  }, []);

  const handleJoystickMove = useCallback((direction: Vector2) => {
    joystickInputRef.current = direction;
  }, []);

  const handlePause = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.pause();
      setIsPaused(true);
    }
  }, []);

  const handleResume = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.resume();
      setIsPaused(false);
      lastFrameTimeRef.current = 0; // Reset timing to avoid jump
    }
  }, []);

  const handleRestart = useCallback(() => {
    // Navigate back and restart
    onQuit();
    // The parent will handle restarting
  }, [onQuit]);

  const handleToggleSound = useCallback(() => {
    const newSettings = { ...settings, soundEnabled: !settings.soundEnabled };
    onSettingsChange(newSettings);
    audioManager.setSoundEnabled(newSettings.soundEnabled);
  }, [settings, onSettingsChange]);

  const handleToggleReducedMotion = useCallback(() => {
    const newSettings = { ...settings, reducedMotion: !settings.reducedMotion };
    onSettingsChange(newSettings);
  }, [settings, onSettingsChange]);

  const gameState = engineRef.current?.getState();

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      <Animated.View
        style={[
          styles.gameArea,
          {
            transform: [{ translateX: shakeAnim }],
          },
        ]}
      >
        <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT} style={styles.svg}>
          <Defs>
            <RadialGradient id="playerGrad" cx="50%" cy="50%">
              <Stop offset="0%" stopColor="#00ff88" stopOpacity="1" />
              <Stop offset="100%" stopColor="#00cc66" stopOpacity="0.8" />
            </RadialGradient>
            <RadialGradient id="orbGrad" cx="50%" cy="50%">
              <Stop offset="0%" stopColor="#00ff88" stopOpacity="1" />
              <Stop offset="70%" stopColor="#00ff88" stopOpacity="0.6" />
              <Stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Energy orbs */}
          {gameState?.orbs.map((orb) => (
            <React.Fragment key={orb.id}>
              <Circle
                cx={orb.position.x}
                cy={orb.position.y}
                r={orb.radius * 2}
                fill="url(#orbGrad)"
                opacity="0.3"
              />
              <Circle
                cx={orb.position.x}
                cy={orb.position.y}
                r={orb.radius}
                fill="#00ff88"
                stroke="#00ff88"
                strokeWidth="2"
              />
            </React.Fragment>
          ))}

          {/* Obstacles */}
          {gameState?.obstacles.map((obstacle) => (
            <Rect
              key={obstacle.id}
              x={obstacle.position.x - obstacle.size / 2}
              y={obstacle.position.y - obstacle.size / 2}
              width={obstacle.size}
              height={obstacle.size}
              fill={obstacle.color}
              stroke={obstacle.color}
              strokeWidth="2"
              opacity="0.9"
            />
          ))}

          {/* Player */}
          {gameState?.player && (
            <>
              <Circle
                cx={gameState.player.position.x}
                cy={gameState.player.position.y}
                r={gameState.player.radius * 1.5}
                fill="url(#playerGrad)"
                opacity="0.3"
              />
              <Circle
                cx={gameState.player.position.x}
                cy={gameState.player.position.y}
                r={gameState.player.radius}
                fill="url(#playerGrad)"
                stroke="#00ff88"
                strokeWidth="3"
              />
            </>
          )}
        </Svg>
      </Animated.View>

      {/* HUD */}
      <HUD
        time={time}
        score={score}
        multiplier={multiplier}
        highScore={highScore}
      />

      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.joystickContainer}>
          <Joystick onMove={handleJoystickMove} size={140} />
        </View>

        <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
          <Text style={styles.pauseButtonText}>❚❚</Text>
        </TouchableOpacity>
      </View>

      {/* Pause overlay */}
      <PauseOverlay
        visible={isPaused}
        settings={settings}
        onResume={handleResume}
        onRestart={handleRestart}
        onQuit={onQuit}
        onToggleSound={handleToggleSound}
        onToggleReducedMotion={handleToggleReducedMotion}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a14',
  },
  gameArea: {
    flex: 1,
  },
  svg: {
    backgroundColor: '#0a0a14',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  joystickContainer: {
    alignItems: 'flex-start',
  },
  pauseButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignSelf: 'flex-end',
  },
  pauseButtonText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '700',
  },
});
