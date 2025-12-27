import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameSettings } from '../game/types';

const HIGH_SCORE_KEY = '@neon_dodge_high_score';
const SETTINGS_KEY = '@neon_dodge_settings';

export async function loadHighScore(): Promise<number> {
  try {
    const value = await AsyncStorage.getItem(HIGH_SCORE_KEY);
    return value ? parseInt(value, 10) : 0;
  } catch (error) {
    console.error('Error loading high score:', error);
    return 0;
  }
}

export async function saveHighScore(score: number): Promise<void> {
  try {
    await AsyncStorage.setItem(HIGH_SCORE_KEY, score.toString());
  } catch (error) {
    console.error('Error saving high score:', error);
  }
}

export async function loadSettings(): Promise<GameSettings> {
  try {
    const value = await AsyncStorage.getItem(SETTINGS_KEY);
    return value
      ? JSON.parse(value)
      : { soundEnabled: true, reducedMotion: false };
  } catch (error) {
    console.error('Error loading settings:', error);
    return { soundEnabled: true, reducedMotion: false };
  }
}

export async function saveSettings(settings: GameSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}
