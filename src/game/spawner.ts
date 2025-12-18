import { Obstacle, EnergyOrb, ObstacleType } from './types';
import { OBSTACLE_CONFIGS, ORB_RADIUS, ORB_COLOR } from './constants';
import { randomRange, randomChoice } from '../utils/math';

let obstacleIdCounter = 0;
let orbIdCounter = 0;

export function spawnObstacle(
  screenWidth: number,
  screenHeight: number,
  elapsedTime: number
): Obstacle {
  // Determine available obstacle types based on elapsed time
  const availableTypes = Object.entries(OBSTACLE_CONFIGS)
    .filter(([_, config]) => elapsedTime >= config.availableFrom)
    .map(([type]) => type as ObstacleType);

  const type = randomChoice(availableTypes);
  const config = OBSTACLE_CONFIGS[type];

  // Spawn from edges
  const edge = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left
  let x: number, y: number;
  let vx: number, vy: number;

  switch (edge) {
    case 0: // top
      x = randomRange(0, screenWidth);
      y = -config.size;
      vx = randomRange(-1, 1);
      vy = config.speed;
      break;
    case 1: // right
      x = screenWidth + config.size;
      y = randomRange(0, screenHeight);
      vx = -config.speed;
      vy = randomRange(-1, 1);
      break;
    case 2: // bottom
      x = randomRange(0, screenWidth);
      y = screenHeight + config.size;
      vx = randomRange(-1, 1);
      vy = -config.speed;
      break;
    case 3: // left
    default:
      x = -config.size;
      y = randomRange(0, screenHeight);
      vx = config.speed;
      vy = randomRange(-1, 1);
      break;
  }

  return {
    id: `obstacle-${obstacleIdCounter++}`,
    type,
    position: { x, y },
    velocity: { x: vx, y: vy },
    size: config.size,
    color: config.color,
  };
}

export function spawnEnergyOrb(
  screenWidth: number,
  screenHeight: number
): EnergyOrb {
  // Spawn in safe zone (middle 60% of screen)
  const margin = 0.2;
  const x = randomRange(screenWidth * margin, screenWidth * (1 - margin));
  const y = randomRange(screenHeight * margin, screenHeight * (1 - margin));

  return {
    id: `orb-${orbIdCounter++}`,
    position: { x, y },
    radius: ORB_RADIUS,
  };
}
