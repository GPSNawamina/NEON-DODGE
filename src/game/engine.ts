import { GameState, Vector2 } from './types';
import {
  GAME_DURATION,
  FRAME_TIME,
  INITIAL_OBSTACLE_SPAWN_INTERVAL,
  MIN_OBSTACLE_SPAWN_INTERVAL,
  SPAWN_INTERVAL_DECREASE,
  ORB_SPAWN_INTERVAL,
  DIFFICULTY_INCREASE_INTERVAL,
  SCORE_PER_ORB,
  MULTIPLIER_INCREMENT,
  DASH_SPEED,
} from './constants';
import { createPlayer, updatePlayerMovement, updateObstacle } from './entities';
import { spawnObstacle, spawnEnergyOrb } from './spawner';
import {
  checkPlayerObstacleCollision,
  checkPlayerOrbCollision,
  isOffScreen,
} from './collision';
import { normalize } from '../utils/math';

export class GameEngine {
  private gameState: GameState;
  private screenWidth: number;
  private screenHeight: number;
  private lastFrameTime: number = 0;
  private obstacleSpawnTimer: number = 0;
  private orbSpawnTimer: number = 0;
  private scoreTimer: number = 0;
  private dashTimer: number = 0;
  private dashCooldownTimer: number = 0;
  private isDashing: boolean = false;

  // Callbacks
  private onScoreUpdate?: (score: number) => void;
  private onMultiplierUpdate?: (multiplier: number) => void;
  private onTimeUpdate?: (time: number) => void;
  private onGameOver?: (score: number, isNewHighScore: boolean) => void;
  private onHit?: () => void;
  private onOrbCollect?: () => void;

  constructor(
    screenWidth: number,
    screenHeight: number,
    initialSettings: GameState['settings'],
    highScore: number
  ) {
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;

    this.gameState = {
      player: createPlayer(screenWidth, screenHeight),
      obstacles: [],
      orbs: [],
      score: 0,
      multiplier: 1,
      timeRemaining: GAME_DURATION,
      isGameOver: false,
      isPaused: false,
      settings: initialSettings,
      highScore,
    };
  }

  getState(): GameState {
    return this.gameState;
  }

  setCallbacks(callbacks: {
    onScoreUpdate?: (score: number) => void;
    onMultiplierUpdate?: (multiplier: number) => void;
    onTimeUpdate?: (time: number) => void;
    onGameOver?: (score: number, isNewHighScore: boolean) => void;
    onHit?: () => void;
    onOrbCollect?: () => void;
  }): void {
    this.onScoreUpdate = callbacks.onScoreUpdate;
    this.onMultiplierUpdate = callbacks.onMultiplierUpdate;
    this.onTimeUpdate = callbacks.onTimeUpdate;
    this.onGameOver = callbacks.onGameOver;
    this.onHit = callbacks.onHit;
    this.onOrbCollect = callbacks.onOrbCollect;
  }

  update(deltaTime: number, joystickInput: Vector2): void {
    if (this.gameState.isPaused || this.gameState.isGameOver) return;

    const dt = deltaTime;

    // Update timers
    this.gameState.timeRemaining -= dt / 1000;
    this.scoreTimer += dt;
    this.obstacleSpawnTimer += dt;
    this.orbSpawnTimer += dt;

    if (this.isDashing) {
      this.dashTimer += dt;
    }
    if (this.dashCooldownTimer > 0) {
      this.dashCooldownTimer -= dt;
    }

    // Check game over
    if (this.gameState.timeRemaining <= 0) {
      this.gameState.timeRemaining = 0;
      this.gameState.isGameOver = true;
      const isNewHighScore = this.gameState.score > this.gameState.highScore;
      this.onGameOver?.(this.gameState.score, isNewHighScore);
      return;
    }

    // Update score (1 point per second)
    if (this.scoreTimer >= 1000) {
      this.gameState.score += 1;
      this.scoreTimer -= 1000;
      this.onScoreUpdate?.(this.gameState.score);
    }

    // Update time display
    this.onTimeUpdate?.(Math.ceil(this.gameState.timeRemaining));

    // Calculate current difficulty level
    const elapsedTime = GAME_DURATION - this.gameState.timeRemaining;
    const difficultyLevel = Math.floor(elapsedTime / DIFFICULTY_INCREASE_INTERVAL);
    const spawnInterval = Math.max(
      MIN_OBSTACLE_SPAWN_INTERVAL,
      INITIAL_OBSTACLE_SPAWN_INTERVAL - difficultyLevel * SPAWN_INTERVAL_DECREASE
    );

    // Spawn obstacles
    if (this.obstacleSpawnTimer >= spawnInterval) {
      this.gameState.obstacles.push(
        spawnObstacle(this.screenWidth, this.screenHeight, elapsedTime)
      );
      this.obstacleSpawnTimer = 0;
    }

    // Spawn energy orbs
    if (this.orbSpawnTimer >= ORB_SPAWN_INTERVAL) {
      if (this.gameState.orbs.length < 2) {
        this.gameState.orbs.push(
          spawnEnergyOrb(this.screenWidth, this.screenHeight)
        );
      }
      this.orbSpawnTimer = 0;
    }

    // Update player
    updatePlayerMovement(
      this.gameState.player,
      joystickInput,
      this.screenWidth,
      this.screenHeight,
      this.isDashing
    );

    // Update obstacles
    this.gameState.obstacles.forEach((obstacle) => {
      updateObstacle(obstacle);
    });

    // Remove off-screen obstacles
    this.gameState.obstacles = this.gameState.obstacles.filter(
      (obstacle) =>
        !isOffScreen(
          obstacle.position,
          obstacle.size,
          this.screenWidth,
          this.screenHeight
        )
    );

    // Check collisions with obstacles
    for (const obstacle of this.gameState.obstacles) {
      if (
        checkPlayerObstacleCollision(this.gameState.player, obstacle) &&
        !this.isDashing
      ) {
        // Hit! Reset multiplier
        this.gameState.multiplier = 1;
        this.onMultiplierUpdate?.(this.gameState.multiplier);
        this.onHit?.();
        break; // Only one hit per frame
      }
    }

    // Check collisions with orbs
    for (let i = this.gameState.orbs.length - 1; i >= 0; i--) {
      const orb = this.gameState.orbs[i];
      if (checkPlayerOrbCollision(this.gameState.player, orb)) {
        // Collect orb
        this.gameState.score += Math.floor(SCORE_PER_ORB * this.gameState.multiplier);
        this.gameState.multiplier += MULTIPLIER_INCREMENT;
        this.gameState.orbs.splice(i, 1);
        this.onScoreUpdate?.(this.gameState.score);
        this.onMultiplierUpdate?.(this.gameState.multiplier);
        this.onOrbCollect?.();
      }
    }

    // End dash
    if (this.isDashing && this.dashTimer >= 150) {
      this.isDashing = false;
      this.dashTimer = 0;
    }
  }

  activateDash(direction: Vector2): boolean {
    if (this.dashCooldownTimer > 0 || this.isDashing) return false;

    const normalized = normalize(direction);
    if (normalized.x === 0 && normalized.y === 0) return false;

    this.gameState.player.velocity.x = normalized.x * DASH_SPEED;
    this.gameState.player.velocity.y = normalized.y * DASH_SPEED;
    this.isDashing = true;
    this.dashTimer = 0;
    this.dashCooldownTimer = 2000;

    return true;
  }

  getDashCooldownPercent(): number {
    return Math.max(0, 1 - this.dashCooldownTimer / 2000);
  }

  pause(): void {
    this.gameState.isPaused = true;
  }

  resume(): void {
    this.gameState.isPaused = false;
  }

  togglePause(): void {
    this.gameState.isPaused = !this.gameState.isPaused;
  }
}
