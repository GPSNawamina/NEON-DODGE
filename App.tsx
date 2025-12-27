import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StartScreen } from './src/screens/StartScreen';
import { GameScreen } from './src/screens/GameScreen';
import { GameOverScreen } from './src/screens/GameOverScreen';
import { GameSettings } from './src/game/types';
import { loadHighScore, saveHighScore, loadSettings, saveSettings } from './src/storage/storage';
import { audioManager } from './src/audio/audioManager';

type Screen = 'start' | 'game' | 'gameOver';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('start');
  const [highScore, setHighScore] = useState(0);
  const [lastScore, setLastScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [settings, setSettings] = useState<GameSettings>({
    soundEnabled: true,
    reducedMotion: false,
  });

  // Load saved data on mount
  useEffect(() => {
    const loadData = async () => {
      const savedHighScore = await loadHighScore();
      const savedSettings = await loadSettings();
      
      setHighScore(savedHighScore);
      setSettings(savedSettings);
      
      // Initialize audio manager
      await audioManager.init();
      audioManager.setSoundEnabled(savedSettings.soundEnabled);
    };

    loadData();

    return () => {
      audioManager.cleanup();
    };
  }, []);

  const handleStart = useCallback(() => {
    setCurrentScreen('game');
  }, []);

  const handleGameOver = useCallback(async (score: number, isNewHigh: boolean) => {
    setLastScore(score);
    setIsNewHighScore(isNewHigh);
    
    if (isNewHigh) {
      setHighScore(score);
      await saveHighScore(score);
    }
    
    setCurrentScreen('gameOver');
  }, []);

  const handlePlayAgain = useCallback(() => {
    setCurrentScreen('game');
  }, []);

  const handleMainMenu = useCallback(() => {
    setCurrentScreen('start');
  }, []);

  const handleSettingsChange = useCallback(async (newSettings: GameSettings) => {
    setSettings(newSettings);
    await saveSettings(newSettings);
    audioManager.setSoundEnabled(newSettings.soundEnabled);
  }, []);

  const handleToggleSound = useCallback(() => {
    handleSettingsChange({ ...settings, soundEnabled: !settings.soundEnabled });
  }, [settings, handleSettingsChange]);

  const handleToggleReducedMotion = useCallback(() => {
    handleSettingsChange({ ...settings, reducedMotion: !settings.reducedMotion });
  }, [settings, handleSettingsChange]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        {currentScreen === 'start' && (
          <StartScreen
            settings={settings}
            highScore={highScore}
            onStart={handleStart}
            onToggleSound={handleToggleSound}
            onToggleReducedMotion={handleToggleReducedMotion}
          />
        )}

        {currentScreen === 'game' && (
          <GameScreen
            settings={settings}
            highScore={highScore}
            onGameOver={handleGameOver}
            onQuit={handleMainMenu}
            onSettingsChange={handleSettingsChange}
          />
        )}

        {currentScreen === 'gameOver' && (
          <GameOverScreen
            score={lastScore}
            highScore={highScore}
            isNewHighScore={isNewHighScore}
            onPlayAgain={handlePlayAgain}
            onMainMenu={handleMainMenu}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a14',
  },
  content: {
    flex: 1,
  },
});
