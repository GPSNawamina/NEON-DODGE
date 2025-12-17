import { Player, Obstacle, Vector2 } from './types';
import {
  PLAYER_RADIUS,
  PLAYER_HITBOX_RADIUS,
  PLAYER_MAX_SPEED,
  PLAYER_ACCELERATION,
  PLAYER_FRICTION,
} from './constants';
import { clamp, magnitude } from '../utils/math';

export function createPlayer(screenWidth: number, screenHeight: number): Player {
  return {
    position: { x: screenWidth / 2, y: screenHeight / 2 },
    velocity: { x: 0, y: 0 },
    radius: PLAYER_RADIUS,
    hitboxRadius: PLAYER_HITBOX_RADIUS,
  };
}

export function updatePlayerMovement(
  player: Player,
  joystickInput: Vector2,
  screenWidth: number,
  screenHeight: number,
  isDashing: boolean
): void {
  // Apply acceleration based on joystick input
  if (magnitude(joystickInput) > 0.1) {
    player.velocity.x += joystickInput.x * PLAYER_ACCELERATION;
    player.velocity.y += joystickInput.y * PLAYER_ACCELERATION;
  }

  // Apply friction
  player.velocity.x *= PLAYER_FRICTION;
  player.velocity.y *= PLAYER_FRICTION;

  // Clamp to max speed (unless dashing)
  if (!isDashing) {
    const speed = magnitude(player.velocity);
    if (speed > PLAYER_MAX_SPEED) {
      const scale = PLAYER_MAX_SPEED / speed;
      player.velocity.x *= scale;
      player.velocity.y *= scale;
    }
  }

  // Update position
  player.position.x += player.velocity.x;
  player.position.y += player.velocity.y;

  // Keep player on screen
  player.position.x = clamp(player.position.x, player.radius, screenWidth - player.radius);
  player.position.y = clamp(player.position.y, player.radius, screenHeight - player.radius);
}

export function updateObstacle(obstacle: Obstacle): void {
  obstacle.position.x += obstacle.velocity.x;
  obstacle.position.y += obstacle.velocity.y;
}
