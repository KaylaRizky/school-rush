export type GameStatus = 'MENU' | 'PLAYING' | 'PAUSED' | 'GAMEOVER' | 'VICTORY';

export type LaneIndex = 0 | 1 | 2; // 0 = Kiri, 1 = Tengah, 2 = Kanan

export type ItemType = 'BOOK_BLUE' | 'BOOK_GOLD' | 'BOOK_RED';

export type ObstacleType = 'BACKPACK' | 'TRASH_CAN' | 'ROCK' | 'CONE';

export interface CollectibleItem {
  id: number;
  type: ItemType;
  lane: LaneIndex;
  z: number; // Position along road (starts far ahead, e.g., 1000 and moves toward player at 0)
  elevation: number; // 0 for ground level, 60 for aerial (requires jump)
  points: number;
  collected: boolean;
  rotation: number;
}

export interface ObstacleItem {
  id: number;
  type: ObstacleType;
  lane: LaneIndex;
  z: number; // Position along road
  width: number;
  height: number;
  canJumpOver: boolean; // all low obstacles can be jumped over with Arrow Up!
  hit: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  text?: string;
}

export interface PlayerState {
  lane: LaneIndex;
  currentX: number; // Smoothly moves toward target lane X
  groundY: number; // Base position on screen
  jumpY: number; // Altitude above ground
  jumpVelocity: number;
  isJumping: boolean;
  invulnerableTimer: number; // Remaining time in ms where player flashes and can't be hit again
  runFrameTimer: number;
  runCycle: number; // 0 to 1 cycle for leg movement
  lives: number;
  score: number;
  booksCollected: number;
}

export interface SceneryElement {
  id: number;
  z: number;
  type: 'TREE' | 'STREETLIGHT' | 'BENCH';
  side: 'LEFT' | 'RIGHT';
}

export interface GameSettings {
  targetScore: number;
  soundEnabled: boolean;
}
