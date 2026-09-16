import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  HORIZON_Y,
  ROAD_TOP_WIDTH,
  ROAD_BOTTOM_WIDTH,
  ROAD_CENTER_X,
  PLAYER_SCREEN_Y,
} from './constants';
import {
  PlayerState,
  CollectibleItem,
  ObstacleItem,
  Particle,
  SceneryElement,
} from '../types';

/**
 * Maps 3D pseudo-coordinates (lane, z) to 2D screen coordinates (x, y, scale)
 * z ranges from 0 (at player) to ~1400 (at horizon)
 */
export function project3D(lane: number, z: number, elevation: number = 0) {
  // Normalized depth factor: 0 at player screen level, 1 at horizon
  const depthFactor = Math.min(Math.max(z / 1200, 0), 1);
  
  // y position on screen
  const screenY = PLAYER_SCREEN_Y - depthFactor * (PLAYER_SCREEN_Y - HORIZON_Y);
  
  // Road width at this depth
  const currentRoadWidth = ROAD_BOTTOM_WIDTH - depthFactor * (ROAD_BOTTOM_WIDTH - ROAD_TOP_WIDTH);
  
  // Lane positions: -1 (left), 0 (center), 1 (right)
  const laneOffsetRatio = (lane - 1); // 0 -> -1, 1 -> 0, 2 -> 1
  const laneSpacing = currentRoadWidth * 0.32;
  const screenX = ROAD_CENTER_X + laneOffsetRatio * laneSpacing;
  
  // Scale factor (1.0 at player, down to 0.18 at horizon)
  const scale = Math.max(0.15, 1 - depthFactor * 0.82);

  return {
    x: screenX,
    y: screenY - elevation * scale,
    groundY: screenY,
    scale,
    depthFactor,
  };
}

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  roadOffset: number,
  progress: number // 0 to 1
) {
  // 1. Sky with morning sunrise gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, HORIZON_Y);
  skyGrad.addColorStop(0, '#38bdf8');   // Sky blue
  skyGrad.addColorStop(0.5, '#7dd3fc'); // Light sky blue
  skyGrad.addColorStop(0.85, '#fde68a'); // Morning golden
  skyGrad.addColorStop(1, '#fed7aa');   // Peach horizon
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, HORIZON_Y);

  // 2. Morning Sun
  const sunX = CANVAS_WIDTH * 0.78;
  const sunY = 70;
  const sunGrad = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, 48);
  sunGrad.addColorStop(0, '#ffffff');
  sunGrad.addColorStop(0.3, '#fef08a');
  sunGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 48, 0, Math.PI * 2);
  ctx.fill();

  // 3. Fluffy Clouds (slow drifting)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  const cloudOffset = (roadOffset * 0.15) % (CANVAS_WIDTH + 200);
  drawCloud(ctx, (120 - cloudOffset + CANVAS_WIDTH) % CANVAS_WIDTH, 45, 0.8);
  drawCloud(ctx, (380 - cloudOffset + CANVAS_WIDTH) % CANVAS_WIDTH, 75, 1.1);
  drawCloud(ctx, (620 - cloudOffset + CANVAS_WIDTH) % CANVAS_WIDTH, 35, 0.7);

  // 4. Distant Mountains
  ctx.fillStyle = '#93c5fd';
  ctx.beginPath();
  ctx.moveTo(0, HORIZON_Y);
  ctx.lineTo(80, HORIZON_Y - 45);
  ctx.lineTo(200, HORIZON_Y);
  ctx.lineTo(340, HORIZON_Y - 60);
  ctx.lineTo(460, HORIZON_Y);
  ctx.lineTo(600, HORIZON_Y - 50);
  ctx.lineTo(740, HORIZON_Y);
  ctx.lineTo(CANVAS_WIDTH, HORIZON_Y - 30);
  ctx.lineTo(CANVAS_WIDTH, HORIZON_Y);
  ctx.closePath();
  ctx.fill();

  // 5. City & Trees horizon line
  ctx.fillStyle = '#6ee7b7';
  ctx.fillRect(0, HORIZON_Y - 14, CANVAS_WIDTH, 14);

  // 6. School Building in distance (SMA NUSANTARA)
  drawSchoolInDistance(ctx, progress);

  // 7. Ground / Grass on sides
  const groundGrad = ctx.createLinearGradient(0, HORIZON_Y, 0, CANVAS_HEIGHT);
  groundGrad.addColorStop(0, '#34d399'); // Bright grass green
  groundGrad.addColorStop(1, '#059669'); // Deeper grass green
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, HORIZON_Y, CANVAS_WIDTH, CANVAS_HEIGHT - HORIZON_Y);

  // 8. Sidewalks & Road
  drawRoad(ctx, roadOffset);
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.arc(15, -8, 22, 0, Math.PI * 2);
  ctx.arc(35, -4, 18, 0, Math.PI * 2);
  ctx.arc(45, 4, 14, 0, Math.PI * 2);
  ctx.arc(20, 10, 16, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawSchoolInDistance(ctx: CanvasRenderingContext2D, progress: number) {
  ctx.save();
  // As progress goes from 0 to 1, school building appears clearer and grows slightly
  const baseScale = 0.5 + progress * 0.45;
  const centerX = ROAD_CENTER_X;
  const baseY = HORIZON_Y + 4;

  ctx.translate(centerX, baseY);
  ctx.scale(baseScale, baseScale);

  // Main School Hall
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-60, -50, 120, 50);

  // Roof (Terracotta school tiles)
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.moveTo(-75, -50);
  ctx.lineTo(0, -78);
  ctx.lineTo(75, -50);
  ctx.closePath();
  ctx.fill();

  // Clock Tower
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(-18, -95, 36, 45);
  // Clock roof
  ctx.fillStyle = '#c2410c';
  ctx.beginPath();
  ctx.moveTo(-22, -95);
  ctx.lineTo(0, -112);
  ctx.lineTo(22, -95);
  ctx.closePath();
  ctx.fill();
  // Clock face
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, -75, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Flagpole with Indonesian Flag 🇮🇩
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -112);
  ctx.lineTo(0, -135);
  ctx.stroke();
  // Flag red top
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(0, -135, 16, 7);
  // Flag white bottom
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, -128, 16, 7);

  // Windows
  ctx.fillStyle = '#38bdf8';
  for (let row = 0; row < 2; row++) {
    for (let col = -2; col <= 2; col++) {
      if (col === 0 && row === 1) continue; // Door area
      ctx.fillRect(col * 22 - 7, -42 + row * 18, 14, 12);
    }
  }

  // School Gate Arch ("SMA")
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(-14, -18, 28, 18);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 9px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SEKOLAH', 0, -5);

  ctx.restore();
}

function drawRoad(ctx: CanvasRenderingContext2D, roadOffset: number) {
  // Road polygon
  const halfTop = ROAD_TOP_WIDTH / 2;
  const halfBottom = ROAD_BOTTOM_WIDTH / 2;

  // Sidewalk curb left
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.moveTo(ROAD_CENTER_X - halfTop - 18, HORIZON_Y);
  ctx.lineTo(ROAD_CENTER_X - halfTop, HORIZON_Y);
  ctx.lineTo(ROAD_CENTER_X - halfBottom, CANVAS_HEIGHT);
  ctx.lineTo(ROAD_CENTER_X - halfBottom - 45, CANVAS_HEIGHT);
  ctx.closePath();
  ctx.fill();

  // Sidewalk curb right
  ctx.beginPath();
  ctx.moveTo(ROAD_CENTER_X + halfTop, HORIZON_Y);
  ctx.lineTo(ROAD_CENTER_X + halfTop + 18, HORIZON_Y);
  ctx.lineTo(ROAD_CENTER_X + halfBottom + 45, CANVAS_HEIGHT);
  ctx.lineTo(ROAD_CENTER_X + halfBottom, CANVAS_HEIGHT);
  ctx.closePath();
  ctx.fill();

  // Asphalt Main Road
  const roadGrad = ctx.createLinearGradient(0, HORIZON_Y, 0, CANVAS_HEIGHT);
  roadGrad.addColorStop(0, '#475569');
  roadGrad.addColorStop(1, '#1e293b');
  ctx.fillStyle = roadGrad;
  ctx.beginPath();
  ctx.moveTo(ROAD_CENTER_X - halfTop, HORIZON_Y);
  ctx.lineTo(ROAD_CENTER_X + halfTop, HORIZON_Y);
  ctx.lineTo(ROAD_CENTER_X + halfBottom, CANVAS_HEIGHT);
  ctx.lineTo(ROAD_CENTER_X - halfBottom, CANVAS_HEIGHT);
  ctx.closePath();
  ctx.fill();

  // Road Lane Divider Dashes (2 divider lines separating the 3 lanes)
  const segments = 12;
  const cycle = (roadOffset % 80) / 80;

  for (let i = 0; i < segments; i++) {
    const rawProgress = (i + cycle) / segments;
    if (rawProgress < 0.05 || rawProgress > 1.05) continue;

    // Perspective depth calculation
    const z = (1 - rawProgress) * 1200;
    const pLeftLine = project3D(0.5, z);
    const pRightLine = project3D(1.5, z);

    const dashH = Math.max(3, 30 * pLeftLine.scale);
    const dashW = Math.max(2, 6 * pLeftLine.scale);

    ctx.fillStyle = 'rgba(254, 240, 138, 0.85)'; // Yellow dashed line
    ctx.fillRect(pLeftLine.x - dashW / 2, pLeftLine.y, dashW, dashH);
    ctx.fillRect(pRightLine.x - dashW / 2, pRightLine.y, dashW, dashH);
  }
}

export function drawScenery(
  ctx: CanvasRenderingContext2D,
  elements: SceneryElement[]
) {
  // Sort back to front
  const sorted = [...elements].sort((a, b) => b.z - a.z);

  sorted.forEach((elem) => {
    const depthFactor = elem.z / 1200;
    if (depthFactor > 1 || depthFactor < 0) return;

    const screenY = PLAYER_SCREEN_Y - depthFactor * (PLAYER_SCREEN_Y - HORIZON_Y);
    const roadW = ROAD_BOTTOM_WIDTH - depthFactor * (ROAD_BOTTOM_WIDTH - ROAD_TOP_WIDTH);
    const scale = Math.max(0.18, 1 - depthFactor * 0.82);

    const sideMult = elem.side === 'LEFT' ? -1 : 1;
    const screenX = ROAD_CENTER_X + sideMult * (roadW / 2 + 35 * scale + (1 - depthFactor) * 20);

    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.scale(scale, scale);

    if (elem.type === 'TREE') {
      // Tree trunk
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-7, -40, 14, 40);
      // Leaves (round lush green)
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(0, -60, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(-8, -68, 22, 0, Math.PI * 2);
      ctx.fill();
    } else if (elem.type === 'STREETLIGHT') {
      // Streetlamp pole
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -75);
      ctx.lineTo(sideMult * -15, -85);
      ctx.stroke();
      // Lamp bulb
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(sideMult * -15, -83, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  });
}

export function drawObstacle(ctx: CanvasRenderingContext2D, item: ObstacleItem) {
  if (item.z < -60 || item.z > 1400) return;

  const proj = project3D(item.lane, item.z);
  ctx.save();
  ctx.translate(proj.x, proj.y);
  ctx.scale(proj.scale, proj.scale);

  // Ground Shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
  ctx.beginPath();
  ctx.ellipse(0, 5, 26, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  if (item.type === 'BACKPACK') {
    // Tas Sekolah Terjatuh (Red / Blue school backpack)
    ctx.fillStyle = '#ef4444'; // Red backpack body
    ctx.beginPath();
    ctx.roundRect(-22, -32, 44, 32, 8);
    ctx.fill();

    // Front pocket
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.roundRect(-16, -22, 32, 20, 5);
    ctx.fill();

    // Yellow zipper & badge
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-12, -20, 24, 3);
    ctx.beginPath();
    ctx.arc(0, -10, 4, 0, Math.PI * 2);
    ctx.fill();

    // Straps
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-16, -32);
    ctx.lineTo(-20, -5);
    ctx.moveTo(16, -32);
    ctx.lineTo(20, -5);
    ctx.stroke();

  } else if (item.type === 'TRASH_CAN') {
    // Tempat Sampah Hijau Sekolah
    ctx.fillStyle = '#16a34a'; // Green trash bin body
    ctx.beginPath();
    ctx.moveTo(-18, -48);
    ctx.lineTo(18, -48);
    ctx.lineTo(14, 0);
    ctx.lineTo(-14, 0);
    ctx.closePath();
    ctx.fill();

    // Bin lid
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.roundRect(-22, -56, 44, 10, 4);
    ctx.fill();

    // Handle
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(-6, -60, 12, 4);

    // Recycle symbol logo (white badge)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -24, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#16a34a';
    ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('♻', 0, -21);

  } else if (item.type === 'ROCK') {
    // Batu Trotoar
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(-24, 0);
    ctx.lineTo(-20, -22);
    ctx.lineTo(-6, -32);
    ctx.lineTo(15, -28);
    ctx.lineTo(25, -12);
    ctx.lineTo(22, 0);
    ctx.closePath();
    ctx.fill();

    // Rock highlight facets
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(-20, -22);
    ctx.lineTo(-6, -32);
    ctx.lineTo(4, -18);
    ctx.lineTo(-10, -10);
    ctx.closePath();
    ctx.fill();

  } else if (item.type === 'CONE') {
    // Traffic cone
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(-6, -42);
    ctx.lineTo(6, -42);
    ctx.lineTo(18, 0);
    ctx.lineTo(-18, 0);
    ctx.closePath();
    ctx.fill();

    // Base square
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(-22, -4, 44, 6);

    // White reflective stripes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-10, -28);
    ctx.lineTo(10, -28);
    ctx.lineTo(13, -20);
    ctx.lineTo(-13, -20);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

export function drawCollectible(
  ctx: CanvasRenderingContext2D,
  item: CollectibleItem,
  globalTime: number
) {
  if (item.collected || item.z < -40 || item.z > 1400) return;

  // Floating bob animation
  const bobY = Math.sin(globalTime * 0.006 + item.id) * 8;
  const proj = project3D(item.lane, item.z, item.elevation + bobY);

  ctx.save();
  ctx.translate(proj.x, proj.y);
  ctx.scale(proj.scale, proj.scale);

  // Ground Shadow (independent of float height)
  const shadowScale = Math.max(0.3, 1 - (item.elevation + bobY) / 120);
  ctx.fillStyle = `rgba(15, 23, 42, ${0.35 * shadowScale})`;
  ctx.beginPath();
  ctx.ellipse(0, item.elevation + bobY + 5, 20 * shadowScale, 8 * shadowScale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Glow Aura
  const auraColor = item.type === 'BOOK_GOLD' ? 'rgba(250, 204, 21, 0.4)' : 'rgba(56, 189, 248, 0.35)';
  ctx.fillStyle = auraColor;
  ctx.beginPath();
  ctx.arc(0, -18, 30, 0, Math.PI * 2);
  ctx.fill();

  // Book rotation tilt
  const tilt = Math.sin(globalTime * 0.004 + item.id) * 0.15;
  ctx.rotate(tilt);

  // Book Cover Colors
  let coverColor = '#2563eb'; // Blue textbook
  let ribbonColor = '#fbbf24';
  let titleText = 'BUKU';

  if (item.type === 'BOOK_GOLD') {
    coverColor = '#eab308'; // Gold book (+25 pts)
    ribbonColor = '#dc2626';
    titleText = '★ +25';
  } else if (item.type === 'BOOK_RED') {
    coverColor = '#e11d48';
    ribbonColor = '#facc15';
    titleText = 'KAMUS';
  }

  // Draw Book Spine & Cover (Isometric 3D book look)
  ctx.fillStyle = coverColor;
  ctx.beginPath();
  ctx.roundRect(-18, -36, 36, 36, 4);
  ctx.fill();

  // Pages edge (white paper stack)
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-14, -34, 28, 6);

  // Cover inner border
  ctx.strokeStyle = ribbonColor;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-15, -26, 30, 22);

  // Bookmark ribbon dangling out
  ctx.fillStyle = ribbonColor;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(6, 12);
  ctx.lineTo(0, 9);
  ctx.lineTo(-6, 12);
  ctx.closePath();
  ctx.fill();

  // Book label
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 8px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(titleText, 0, -14);

  // Sparkle stars around book
  ctx.fillStyle = '#ffffff';
  const sparkleTime = (globalTime * 0.005 + item.id) % (Math.PI * 2);
  const sx = Math.cos(sparkleTime) * 22;
  const sy = Math.sin(sparkleTime) * 22 - 18;
  ctx.beginPath();
  ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Draws the student character (SMA uniform: white shirt + grey pants/skirt + red backpack)
 */
export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  player: PlayerState,
  _globalTime: number
) {
  const isBlinking = player.invulnerableTimer > 0 && Math.floor(player.invulnerableTimer / 100) % 2 === 0;
  if (isBlinking) return; // Flash effect when damaged

  const footY = player.groundY - player.jumpY;
  const x = player.currentX;

  ctx.save();
  ctx.translate(x, footY);

  // 1. Ground Shadow (stays on road, shrinks & fades as player jumps)
  const jumpHeight = Math.max(0, player.jumpY);
  const shadowScale = Math.max(0.35, 1 - jumpHeight / 160);
  const shadowAlpha = Math.max(0.12, 0.45 * shadowScale);

  ctx.fillStyle = `rgba(15, 23, 42, ${shadowAlpha})`;
  ctx.beginPath();
  ctx.ellipse(0, player.jumpY + 5, 24 * shadowScale, 9 * shadowScale, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Leg movement cycle
  const legCycle = player.isJumping ? 0.3 : Math.sin(player.runCycle * Math.PI * 2);
  const leftLegOffset = legCycle * 14;
  const rightLegOffset = -legCycle * 14;

  // Legs & Shoes (Grey SMA pants + black/white sneakers)
  // Left Leg
  ctx.fillStyle = '#64748b'; // SMA Grey Pants
  ctx.fillRect(-14, -28, 10, 24 + leftLegOffset * 0.3);
  // Left Shoe
  ctx.fillStyle = '#0f172a'; // Black sneaker
  ctx.fillRect(-16, -4 + leftLegOffset * 0.3, 14, 8);
  ctx.fillStyle = '#ffffff'; // White sneaker sole
  ctx.fillRect(-16, 2 + leftLegOffset * 0.3, 14, 3);

  // Right Leg
  ctx.fillStyle = '#64748b';
  ctx.fillRect(4, -28, 10, 24 + rightLegOffset * 0.3);
  // Right Shoe
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(2, -4 + rightLegOffset * 0.3, 14, 8);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(2, 2 + rightLegOffset * 0.3, 14, 3);

  // 3. Body: White School Uniform Shirt (Kemeja Putih Siswa)
  ctx.fillStyle = '#f8fafc'; // Crisp white shirt
  ctx.beginPath();
  ctx.roundRect(-18, -62, 36, 36, 5);
  ctx.fill();

  // Shirt collar
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-10, -62);
  ctx.lineTo(0, -52);
  ctx.lineTo(10, -62);
  ctx.stroke();

  // OSIS Badge / Pocket on left chest
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(-14, -54, 8, 8);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(-12, -52, 4, 4);

  // 4. Red School Backpack (Tas Ransel Merah) on student's back
  // Backpack bobs gently when running
  const backpackBob = player.isJumping ? -3 : Math.abs(Math.sin(player.runCycle * Math.PI * 2)) * 4;
  ctx.fillStyle = '#dc2626'; // Vibrant Red Backpack
  ctx.beginPath();
  ctx.roundRect(-14, -58 + backpackBob, 28, 28, 6);
  ctx.fill();

  // Backpack pocket & yellow zipper
  ctx.fillStyle = '#991b1b';
  ctx.beginPath();
  ctx.roundRect(-10, -48 + backpackBob, 20, 15, 3);
  ctx.fill();
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(-8, -46 + backpackBob, 16, 2);

  // Backpack straps over shoulders
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-16, -62, 4, 32);
  ctx.fillRect(12, -62, 4, 32);

  // 5. Arms swing naturally
  const armSwing = player.isJumping ? 8 : legCycle * 10;
  // Left arm
  ctx.fillStyle = '#f8fafc'; // White sleeve
  ctx.fillRect(-22, -60, 6, 16);
  ctx.fillStyle = '#fcd34d'; // Skin hand
  ctx.fillRect(-22, -44 + armSwing, 6, 8);

  // Right arm
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(16, -60, 6, 16);
  ctx.fillStyle = '#fcd34d';
  ctx.fillRect(16, -44 - armSwing, 6, 8);

  // 6. Head & Hair (Back/Side View of Student)
  // Neck
  ctx.fillStyle = '#fcd34d';
  ctx.fillRect(-6, -66, 12, 6);

  // Head base
  ctx.fillStyle = '#fde68a';
  ctx.beginPath();
  ctx.arc(0, -74, 14, 0, Math.PI * 2);
  ctx.fill();

  // Dark Hair (Siswa RPL haircut)
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(0, -77, 15, Math.PI, Math.PI * 2);
  ctx.lineTo(15, -70);
  ctx.lineTo(-15, -70);
  ctx.closePath();
  ctx.fill();

  // Hair bangs & top tufts
  ctx.beginPath();
  ctx.arc(-5, -82, 9, 0, Math.PI * 2);
  ctx.arc(6, -81, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  particles.forEach((p) => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);

    if (p.text) {
      // Floating text e.g. "+10"
      ctx.fillStyle = p.color;
      ctx.font = '900 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3;
      ctx.strokeText(p.text, p.x, p.y);
      ctx.fillText(p.text, p.x, p.y);
    } else {
      // Particle dot / star
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  });
}
