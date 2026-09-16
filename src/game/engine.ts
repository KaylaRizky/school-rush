import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PLAYER_SCREEN_Y,
  JUMP_VELOCITY,
  GRAVITY,
  BASE_SPEED,
  MAX_SPEED,
  INVULNERABLE_DURATION,
  BOOK_POINTS,
  GOLD_BOOK_POINTS,
} from './constants';
import {
  LaneIndex,
  PlayerState,
  CollectibleItem,
  ObstacleItem,
  SceneryElement,
  Particle,
  GameStatus,
} from '../types';
import { project3D } from './canvasRenderer';
import { soundManager } from '../audio';

export class GameEngine {
  public player: PlayerState;
  public collectibles: CollectibleItem[] = [];
  public obstacles: ObstacleItem[] = [];
  public scenery: SceneryElement[] = [];
  public particles: Particle[] = [];
  
  public roadOffset: number = 0;
  public targetScore: number = 150;
  public status: GameStatus = 'MENU';
  
  public screenShake: number = 0;
  private nextItemId: number = 1;
  private spawnTimer: number = 0;
  private scenerySpawnTimer: number = 0;
  private lastTime: number = 0;

  public onStatusChange?: (status: GameStatus) => void;
  public onScoreUpdate?: (score: number, books: number) => void;
  public onLivesUpdate?: (lives: number) => void;

  constructor(targetScore: number = 150) {
    this.targetScore = targetScore;
    this.player = this.createInitialPlayer();
    this.initScenery();
  }

  private createInitialPlayer(): PlayerState {
    const centerProj = project3D(1, 0);
    return {
      lane: 1,
      currentX: centerProj.x,
      groundY: PLAYER_SCREEN_Y,
      jumpY: 0,
      jumpVelocity: 0,
      isJumping: false,
      invulnerableTimer: 0,
      runFrameTimer: 0,
      runCycle: 0,
      lives: 3,
      score: 0,
      booksCollected: 0,
    };
  }

  private initScenery() {
    this.scenery = [];
    for (let z = 100; z < 1400; z += 120) {
      this.scenery.push({
        id: this.nextItemId++,
        z,
        type: Math.random() > 0.4 ? 'TREE' : 'STREETLIGHT',
        side: Math.random() > 0.5 ? 'LEFT' : 'RIGHT',
      });
    }
  }

  public startGame() {
    this.player = this.createInitialPlayer();
    this.collectibles = [];
    this.obstacles = [];
    this.particles = [];
    this.roadOffset = 0;
    this.screenShake = 0;
    this.spawnTimer = 60; // Initial delay before first obstacle
    this.initScenery();
    this.status = 'PLAYING';
    this.lastTime = performance.now();

    if (this.onStatusChange) this.onStatusChange('PLAYING');
    if (this.onScoreUpdate) this.onScoreUpdate(0, 0);
    if (this.onLivesUpdate) this.onLivesUpdate(3);
  }

  public pauseGame() {
    if (this.status === 'PLAYING') {
      this.status = 'PAUSED';
      if (this.onStatusChange) this.onStatusChange('PAUSED');
    }
  }

  public resumeGame() {
    if (this.status === 'PAUSED') {
      this.status = 'PLAYING';
      this.lastTime = performance.now();
      if (this.onStatusChange) this.onStatusChange('PLAYING');
    }
  }

  public restartGame() {
    this.startGame();
  }

  public moveLeft() {
    if (this.status !== 'PLAYING') return;
    if (this.player.lane > 0) {
      this.player.lane = (this.player.lane - 1) as LaneIndex;
    }
  }

  public moveRight() {
    if (this.status !== 'PLAYING') return;
    if (this.player.lane < 2) {
      this.player.lane = (this.player.lane + 1) as LaneIndex;
    }
  }

  public jump() {
    if (this.status !== 'PLAYING') return;
    if (!this.player.isJumping) {
      this.player.isJumping = true;
      this.player.jumpVelocity = JUMP_VELOCITY;
      soundManager.playJump();

      // Spawn small dust puff when launching jump
      this.spawnDust(this.player.currentX, this.player.groundY);
    }
  }

  public update(currentTime: number) {
    if (this.status !== 'PLAYING') return;

    if (!this.lastTime) {
      this.lastTime = currentTime;
      return;
    }
    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    // Current speed scales gently with progress
    const progress = Math.min(this.player.score / this.targetScore, 1);
    const speed = BASE_SPEED + progress * (MAX_SPEED - BASE_SPEED);

    // Update road & animation offset
    this.roadOffset += speed * 60 * dt;
    this.player.runCycle = (this.player.runCycle + speed * 1.5 * dt) % 1;

    // Smooth horizontal position interpolation
    const targetProj = project3D(this.player.lane, 0);
    this.player.currentX += (targetProj.x - this.player.currentX) * 14 * dt;

    // Jump Physics
    if (this.player.isJumping) {
      this.player.jumpY += this.player.jumpVelocity * 60 * dt;
      this.player.jumpVelocity -= GRAVITY * 60 * dt;

      if (this.player.jumpY <= 0) {
        this.player.jumpY = 0;
        this.player.isJumping = false;
        this.player.jumpVelocity = 0;
        // Dust when landing
        this.spawnDust(this.player.currentX, this.player.groundY);
      }
    }

    // Invulnerability timer countdown
    if (this.player.invulnerableTimer > 0) {
      this.player.invulnerableTimer = Math.max(0, this.player.invulnerableTimer - dt * 1000);
    }

    // Screen Shake decay
    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - dt * 25);
    }

    // Move scenery elements
    this.scenery.forEach((elem) => {
      elem.z -= speed * 60 * dt * 0.9;
      if (elem.z < 10) {
        elem.z = 1350;
        elem.type = Math.random() > 0.4 ? 'TREE' : 'STREETLIGHT';
        elem.side = Math.random() > 0.5 ? 'LEFT' : 'RIGHT';
      }
    });

    // Move obstacles towards player
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.z -= speed * 60 * dt;

      // Collision detection with player
      // Player is at z ~ 0 to 30
      if (!obs.hit && obs.z > -20 && obs.z < 45) {
        const laneDist = Math.abs(obs.lane - this.player.lane);
        // Direct lane hit or halfway through transition
        const isSameLane = laneDist === 0 || (laneDist === 1 && Math.abs(this.player.currentX - project3D(obs.lane, 0).x) < 32);

        if (isSameLane) {
          // Check if player jumped over it
          if (this.player.jumpY > 42) {
            // Cleared the obstacle safely!
          } else if (this.player.invulnerableTimer <= 0) {
            // Hit obstacle!
            obs.hit = true;
            this.handleHit();
          }
        }
      }

      // Remove past screen
      if (obs.z < -60) {
        this.obstacles.splice(i, 1);
      }
    }

    // Move collectibles towards player
    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const col = this.collectibles[i];
      col.z -= speed * 60 * dt;

      if (!col.collected && col.z > -25 && col.z < 50) {
        const laneDist = Math.abs(col.lane - this.player.lane);
        const isSameLane = laneDist === 0 || (laneDist === 1 && Math.abs(this.player.currentX - project3D(col.lane, 0).x) < 35);

        if (isSameLane) {
          // Check altitude match
          const requiresJump = col.elevation > 25;
          const jumpMatches = requiresJump ? this.player.jumpY > 20 : this.player.jumpY < 65;

          if (jumpMatches) {
            col.collected = true;
            this.handleCollect(col);
          }
        }
      }

      // Remove past screen
      if (col.z < -60) {
        this.collectibles.splice(i, 1);
      }
    }

    // Spawning new items & obstacles
    this.spawnTimer -= 60 * dt;
    if (this.spawnTimer <= 0) {
      this.spawnPattern();
      // Next spawn in 50-85 frames
      this.spawnTimer = 55 + Math.random() * 35;
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * 60 * dt;
      p.y += p.vy * 60 * dt;
      p.life -= dt;
      p.alpha = Math.max(0, p.life / p.maxLife);

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  private handleHit() {
    this.player.lives -= 1;
    this.player.invulnerableTimer = INVULNERABLE_DURATION;
    this.screenShake = 12;

    soundManager.playHit();
    if (this.onLivesUpdate) this.onLivesUpdate(this.player.lives);

    // Hit impact sparks
    for (let i = 0; i < 15; i++) {
      this.particles.push({
        x: this.player.currentX,
        y: this.player.groundY - this.player.jumpY - 35,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        color: Math.random() > 0.5 ? '#ef4444' : '#fbbf24',
        size: 3 + Math.random() * 3,
        alpha: 1,
        life: 0.5,
        maxLife: 0.5,
      });
    }

    // Check Game Over
    if (this.player.lives <= 0) {
      this.status = 'GAMEOVER';
      soundManager.playGameOver();
      if (this.onStatusChange) this.onStatusChange('GAMEOVER');
    }
  }

  private handleCollect(item: CollectibleItem) {
    this.player.score += item.points;
    this.player.booksCollected += 1;

    soundManager.playCollect();
    if (this.onScoreUpdate) {
      this.onScoreUpdate(this.player.score, this.player.booksCollected);
    }

    // Floating text "+10" or "+25"
    const proj = project3D(item.lane, 0);
    this.particles.push({
      x: proj.x,
      y: this.player.groundY - this.player.jumpY - 45,
      vx: 0,
      vy: -1.8,
      color: item.type === 'BOOK_GOLD' ? '#facc15' : '#38bdf8',
      size: 16,
      alpha: 1,
      life: 0.8,
      maxLife: 0.8,
      text: `+${item.points}`,
    });

    // Sparkle burst
    for (let i = 0; i < 10; i++) {
      this.particles.push({
        x: proj.x,
        y: this.player.groundY - this.player.jumpY - 30,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        color: item.type === 'BOOK_GOLD' ? '#fde047' : '#93c5fd',
        size: 2.5 + Math.random() * 2,
        alpha: 1,
        life: 0.45,
        maxLife: 0.45,
      });
    }

    // Check Victory
    if (this.player.score >= this.targetScore) {
      this.status = 'VICTORY';
      soundManager.playWin();
      this.spawnVictoryConfetti();
      if (this.onStatusChange) this.onStatusChange('VICTORY');
    }
  }

  private spawnPattern() {
    const patternType = Math.random();
    const spawnZ = 1350;

    // Pattern 1: Single Obstacle + Collectible Book in another lane
    if (patternType < 0.45) {
      const obstacleLane = Math.floor(Math.random() * 3) as LaneIndex;
      const types: ('BACKPACK' | 'TRASH_CAN' | 'ROCK' | 'CONE')[] = ['BACKPACK', 'TRASH_CAN', 'ROCK', 'CONE'];
      const chosenType = types[Math.floor(Math.random() * types.length)];

      this.obstacles.push({
        id: this.nextItemId++,
        type: chosenType,
        lane: obstacleLane,
        z: spawnZ,
        width: 40,
        height: 35,
        canJumpOver: true,
        hit: false,
      });

      // Spawn book in one of the other lanes
      const availableLanes = [0, 1, 2].filter((l) => l !== obstacleLane) as LaneIndex[];
      const bookLane = availableLanes[Math.floor(Math.random() * availableLanes.length)];
      const isGold = Math.random() > 0.8;

      this.collectibles.push({
        id: this.nextItemId++,
        type: isGold ? 'BOOK_GOLD' : 'BOOK_BLUE',
        lane: bookLane,
        z: spawnZ,
        elevation: 0,
        points: isGold ? GOLD_BOOK_POINTS : BOOK_POINTS,
        collected: false,
        rotation: 0,
      });

    // Pattern 2: Obstacle with high book directly over it (reward for jumping over the obstacle!)
    } else if (patternType < 0.75) {
      const lane = Math.floor(Math.random() * 3) as LaneIndex;
      this.obstacles.push({
        id: this.nextItemId++,
        type: Math.random() > 0.5 ? 'BACKPACK' : 'ROCK',
        lane,
        z: spawnZ,
        width: 40,
        height: 35,
        canJumpOver: true,
        hit: false,
      });

      // Elevated book right above the obstacle requiring jump!
      this.collectibles.push({
        id: this.nextItemId++,
        type: 'BOOK_GOLD',
        lane,
        z: spawnZ,
        elevation: 55,
        points: GOLD_BOOK_POINTS,
        collected: false,
        rotation: 0,
      });

    // Pattern 3: Line of 2-3 books in a single lane
    } else {
      const bookLane = Math.floor(Math.random() * 3) as LaneIndex;
      for (let step = 0; step < 3; step++) {
        this.collectibles.push({
          id: this.nextItemId++,
          type: step === 2 && Math.random() > 0.5 ? 'BOOK_RED' : 'BOOK_BLUE',
          lane: bookLane,
          z: spawnZ + step * 90,
          elevation: 0,
          points: BOOK_POINTS,
          collected: false,
          rotation: 0,
        });
      }

      // Add one obstacle in a different lane further back
      const obstacleLane = ((bookLane + 1 + Math.floor(Math.random() * 2)) % 3) as LaneIndex;
      this.obstacles.push({
        id: this.nextItemId++,
        type: 'CONE',
        lane: obstacleLane,
        z: spawnZ + 120,
        width: 35,
        height: 35,
        canJumpOver: true,
        hit: false,
      });
    }
  }

  private spawnDust(x: number, y: number) {
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y - 2,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 2,
        color: '#cbd5e1',
        size: 2.5 + Math.random() * 2,
        alpha: 0.7,
        life: 0.35,
        maxLife: 0.35,
      });
    }
  }

  public spawnVictoryConfetti() {
    const colors = ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'];
    for (let i = 0; i < 80; i++) {
      this.particles.push({
        x: Math.random() * CANVAS_WIDTH,
        y: -10 - Math.random() * 150,
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 4,
        alpha: 1,
        life: 3.5,
        maxLife: 3.5,
      });
    }
  }
}
