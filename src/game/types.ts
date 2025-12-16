export interface Vector2 {
  x: number;
  y: number;
}

export interface Player {
  position: Vector2;
  velocity: Vector2;
  radius: number;
  hitboxRadius: number;
}

export enum ObstacleType {
  DRIFTER = 'drifter',
  BIG_BLOCK = 'big_block',
  FAST_DART = 'fast_dart',
}

export interface Obstacle {
  id: string;
  type: ObstacleType;
  position: Vector2;
  velocity: Vector2;
  size: number;
  color: string;
}

export interface EnergyOrb {
  id: string;
  position: Vector2;
  radius: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  reducedMotion: boolean;
}

export interface GameState {
  player: Player;
  obstacles: Obstacle[];
  orbs: EnergyOrb[];
  score: number;
  multiplier: number;
  timeRemaining: number;
  isGameOver: boolean;
  isPaused: boolean;
  settings: GameSettings;
  highScore: number;
}
