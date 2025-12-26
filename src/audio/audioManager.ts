import { Audio } from 'expo-av';

class AudioManager {
  private soundEnabled: boolean = true;
  private sounds: Map<string, Audio.Sound> = new Map();

  async init(): Promise<void> {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  }

  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  async playBeep(frequency: number = 440, duration: number = 100): Promise<void> {
    if (!this.soundEnabled) return;
    // Audio disabled for now - no sound assets needed
    // In production, add sound files to assets/ and uncomment below
    /*
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/beep.mp3'),
        { shouldPlay: true, volume: 0.3 }
      );
      setTimeout(() => {
        sound.unloadAsync();
      }, duration);
    } catch (error) {
      console.log('Audio not available');
    }
    */
  }

  async playHit(): Promise<void> {
    if (!this.soundEnabled) return;
    // Lower pitch beep for hit
    await this.playBeep(220, 150);
  }

  async playOrb(): Promise<void> {
    if (!this.soundEnabled) return;
    // Higher pitch beep for orb
    await this.playBeep(660, 100);
  }

  async playGameOver(): Promise<void> {
    if (!this.soundEnabled) return;
    // Descending beep
    await this.playBeep(440, 200);
  }

  cleanup(): void {
    this.sounds.forEach((sound) => {
      sound.unloadAsync();
    });
    this.sounds.clear();
  }
}

export const audioManager = new AudioManager();
