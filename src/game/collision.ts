import { Vector2, Player, Obstacle, EnergyOrb } from './types';
import { distance } from '../utils/math';

export function checkPlayerObstacleCollision(
  player: Player,
  obstacle: Obstacle
): boolean {
  const dist = distance(player.position, obstacle.position);
  const combinedRadius = player.hitboxRadius + obstacle.size / 2;
  return dist < combinedRadius;
}

export function checkPlayerOrbCollision(
  player: Player,
  orb: EnergyOrb
): boolean {
  const dist = distance(player.position, orb.position);
  const combinedRadius = player.hitboxRadius + orb.radius;
  return dist < combinedRadius;
}

export function isOffScreen(
  position: Vector2,
  size: number,
  screenWidth: number,
  screenHeight: number
): boolean {
  const margin = size;
  return (
    position.x < -margin ||
    position.x > screenWidth + margin ||
    position.y < -margin ||
    position.y > screenHeight + margin
  );
}
