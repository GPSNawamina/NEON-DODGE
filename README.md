# NEON DODGE: 60-Second Rush

A polished mobile arcade game built with Expo, React Native, and TypeScript.

## 🎮 Game Overview

Survive for 60 seconds by dodging obstacles and collecting energy orbs. The game features:
- **Dynamic difficulty**: Obstacles spawn faster and new types appear every 10 seconds
- **Combo system**: Build multipliers by collecting orbs without getting hit
- **Smooth 60fps gameplay**: Optimized rendering with minimal React re-renders
- **Mobile-first controls**: Intuitive joystick controls with optional dash ability
- **Accessibility**: Reduced motion toggle, big touch targets, and haptic feedback options

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Expo Go app on your mobile device (iOS or Android)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on Device

1. Open Expo Go on your phone
2. Scan the QR code from the terminal
3. The game will load on your device

### Running on Emulator

```bash
# iOS (requires macOS)
npx expo start --ios

# Android
npx expo start --android
```

## 📁 Project Structure

```
/App.tsx                    # Main app component with screen navigation
/src/
  /screens/
    StartScreen.tsx         # Main menu with settings
    GameScreen.tsx          # Main gameplay screen
    GameOverScreen.tsx      # Results and replay options
  /components/
    HUD.tsx                 # In-game heads-up display
    Joystick.tsx            # Virtual joystick control
    PauseOverlay.tsx        # Pause menu
    ToggleRow.tsx           # Settings toggle component
  /game/
    engine.ts               # Main game loop and state management
    entities.ts             # Player and obstacle updates
    spawner.ts              # Obstacle and orb spawning logic
    collision.ts            # Collision detection
    constants.ts            # Game configuration values
    types.ts                # TypeScript type definitions
  /storage/
    storage.ts              # AsyncStorage helpers for persistence
  /audio/
    audioManager.ts         # Sound effects management
  /utils/
    math.ts                 # Math utility functions
```

## 🎯 Game Mechanics

### Scoring
- **+1 point** per second survived
- **+10 points** per energy orb (multiplied by combo multiplier)
- **Multiplier** increases by +0.1 per orb collected, resets on hit

### Obstacles
- **Drifters** (0s+): Medium-sized blocks moving at moderate speed
- **Big Blocks** (20s+): Larger, slower obstacles
- **Fast Darts** (40s+): Small, fast-moving projectiles

### Difficulty Progression
- Every 10 seconds, obstacle spawn rate increases
- New obstacle types unlock at 20s and 40s
- Game duration: 60 seconds

## 🎨 Technical Features

### Performance Optimization
- Game state stored in refs (not React state) for 60fps updates
- Minimal React re-renders: HUD updates at lower frequency
- Efficient SVG rendering with react-native-svg
- Smooth animations using Animated API

### Accessibility
- **Reduced Motion** toggle: Disables screen shake, particles, and intense animations
- **Sound toggle**: Mute all audio effects
- Large, high-contrast UI elements
- Forgiving hitboxes (player hitbox smaller than visual size)

### Mobile Features
- Portrait orientation lock
- Safe area support (iPhone notch, etc.)
- Android hardware back button support
- Haptic feedback on hits and orb collection
- Touch-optimized controls

## 🔧 Customization

Game parameters can be adjusted in [src/game/constants.ts](src/game/constants.ts):

```typescript
export const GAME_DURATION = 60; // Game length in seconds
export const PLAYER_MAX_SPEED = 5; // Player movement speed
export const SCORE_PER_ORB = 10; // Points per orb
// ... and many more
```

## 📱 Building for Production

### iOS
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

Requires an Expo account and EAS CLI. See [Expo documentation](https://docs.expo.dev/build/setup/) for details.

## 🐛 Troubleshooting

### Audio doesn't work
The game includes fallback handling for missing audio assets. For production, add sound files to `/assets/beep.mp3` or implement web audio synthesis.

### Performance issues
- Ensure you're testing on a physical device (emulators are slower)
- Check that "Reduced Motion" is OFF for full visual effects
- Close other apps to free up device resources

## 📄 License

MIT License - Feel free to use this code for your own projects!

## 🙏 Credits

Built with:
- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [react-native-svg](https://github.com/software-mansion/react-native-svg)

---

**Enjoy the game! 🎮✨**
