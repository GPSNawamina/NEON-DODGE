import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { ToggleRow } from './ToggleRow';
import { GameSettings } from '../game/types';

interface PauseOverlayProps {
  visible: boolean;
  settings: GameSettings;
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
  onToggleSound: () => void;
  onToggleReducedMotion: () => void;
}

export const PauseOverlay: React.FC<PauseOverlayProps> = ({
  visible,
  settings,
  onResume,
  onRestart,
  onQuit,
  onToggleSound,
  onToggleReducedMotion,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.menu}>
          <Text style={styles.title}>PAUSED</Text>

          <View style={styles.settingsSection}>
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

          <TouchableOpacity style={styles.button} onPress={onResume}>
            <Text style={styles.buttonText}>RESUME</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={onRestart}
          >
            <Text style={styles.buttonText}>RESTART</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={onQuit}
          >
            <Text style={styles.buttonText}>QUIT TO MENU</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    backgroundColor: 'rgba(20, 20, 40, 0.95)',
    borderRadius: 20,
    padding: 30,
    width: '85%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: '#00ff88',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#00ff88',
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: '#00ff88',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  settingsSection: {
    marginBottom: 30,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  button: {
    backgroundColor: '#00ff88',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: 'transparent',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 1,
  },
});
