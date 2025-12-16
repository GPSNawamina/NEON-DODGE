import { ObstacleType } from './types';

export const GAME_DURATION = 60; // seconds
export const FRAME_RATE = 60;
export const FRAME_TIME = 1000 / FRAME_RATE;

// Player
export const PLAYER_RADIUS = 15;
export const PLAYER_HITBOX_RADIUS = 12; // Forgiving hitbox
export const PLAYER_MAX_SPEED = 5;
export const PLAYER_ACCELERATION = 0.8;
export const PLAYER_FRICTION = 0.85;

// Dash
export const DASH_SPEED = 12;
export const DASH_DURATION = 150; // ms
export const DASH_COOLDOWN = 2000; // ms

// Scoring
export const SCORE_PER_SECOND = 1;
export const SCORE_PER_ORB = 10;
export const MULTIPLIER_INCREMENT = 0.1;

// Spawning
export const INITIAL_OBSTACLE_SPAWN_INTERVAL = 1200; // ms
export const MIN_OBSTACLE_SPAWN_INTERVAL = 400; // ms
export const SPAWN_INTERVAL_DECREASE = 50; // decrease per difficulty level
export const ORB_SPAWN_INTERVAL = 5000; // ms

// Difficulty progression
export const DIFFICULTY_INCREASE_INTERVAL = 10; // seconds

// Obstacle configs
export const OBSTACLE_CONFIGS = {
  [ObstacleType.DRIFTER]: {
    size: 25,
    speed: 2.5,
    color: '#ff00ff',
    availableFrom: 0, // seconds
  },
  [ObstacleType.BIG_BLOCK]: {
    size: 40,
    speed: 1.5,
    color: '#ff6600',
    availableFrom: 20,
  },
  [ObstacleType.FAST_DART]: {
    size: 15,
    speed: 5,
    color: '#00ffff',
    availableFrom: 40,
  },
};

// Energy orbs
export const ORB_RADIUS = 10;
export const ORB_COLOR = '#00ff88';

// Screen shake
export const SHAKE_INTENSITY = 8;
export const SHAKE_DURATION = 200; // ms
