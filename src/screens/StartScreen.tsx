import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { ToggleRow } from '../components/ToggleRow';
import { GameSettings } from '../game/types';

interface StartScreenProps {
  settings: GameSettings;
  highScore: number;
  onStart: () => void;
  onToggleSound: () => void;
  onToggleReducedMotion: () => void;
}

const { width } = Dimensions.get('window');

export const StartScreen: React.FC<StartScreenProps> = ({
  settings,
  highScore,
  onStart,
  onToggleSound,
  onToggleReducedMotion,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>NEON DODGE</Text>
        <Text style={styles.subtitle}>60-Second Rush</Text>

        <View style={styles.highScoreContainer}>
          <Text style={styles.highScoreLabel}>HIGH SCORE</Text>
          <Text style={styles.highScoreValue}>{highScore}</Text>
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionText}>• Move with joystick to dodge obstacles</Text>
          <Text style={styles.instructionText}>• Collect energy orbs for bonus points</Text>
          <Text style={styles.instructionText}>• Build combos without getting hit</Text>
          <Text style={styles.instructionText}>• Survive for 60 seconds!</Text>
        </View>

        <TouchableOpacity style={styles.playButton} onPress={onStart} activeOpacity={0.8}>
          <Text style={styles.playButtonText}>PLAY</Text>
        </TouchableOpacity>

        <View style={styles.settingsContainer}>
          <Text style={styles.settingsTitle}>SETTINGS</Text>
          <ToggleRow
            label="Sound"
            value={settings.soundEnabled}
            onToggle={onToggleSound}
          />
          <ToggleRow
            label="Reduced Motion"
            value={settings.reducedMotion}
            onToggle={onToggleReducedMotion}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a14',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 56,
    fontWeight: '900',
    color: '#00ff88',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: '#00ff88',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ff00ff',
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: 2,
  },
  highScoreContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  highScoreLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 6,
  },
  highScoreValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
  },
  instructions: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  instructionText: {
    fontSize: 15,
    color: '#ffffff',
    marginBottom: 10,
    lineHeight: 22,
  },
  playButton: {
    backgroundColor: '#00ff88',
    paddingVertical: 20,
    paddingHorizontal: 80,
    borderRadius: 16,
    marginBottom: 40,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 10,
  },
  playButtonText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0a0a14',
    letterSpacing: 3,
  },
  settingsContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 2,
  },
});
