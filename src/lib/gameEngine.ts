// ============================================
// Game Engine — Core Game Loop & Logic
// ============================================

import { GameState, Monster, Projectile, Email } from '../types';
import { renderPlayer, renderMonster, renderProjectile } from './sprites';
import { createExplosionParticles, createNetParticles, createMuzzleFlash, updateParticles, renderParticles } from './particles';
import { soundManager } from './sounds';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 64;
const MONSTER_WIDTH = 50;
const MONSTER_HEIGHT = 50;
const PLAYER_SPEED = 6;
const MONSTER_BASE_SPEED = 1.2;
const SPAWN_INTERVAL_BASE = 100;  // frames
const BULLET_SPEED = -10;
const NET_SPEED = -6;
const SHOOT_COOLDOWN = 15;
const NET_COOLDOWN = 20;

const MONSTER_COLORS = [
  '#8B6B4A', '#7B8B6B', '#6B5B8B', '#8B5B5B', '#5B7B8B',
  '#9B7B5B', '#6B8B7B', '#8B6B7B', '#7B6B5B', '#5B6B8B',
];

export function createInitialState(): GameState {
  return {
    player: {
      x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
      y: CANVAS_HEIGHT - PLAYER_HEIGHT - 30,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      speed: PLAYER_SPEED,
      facingLeft: false,
      shooting: false,
      netting: false,
      shootTimer: 0,
      netTimer: 0,
    },
    monsters: [],
    particles: [],
    projectiles: [],
    killScore: 0,
    captureScore: 0,
    emailIndex: 0,
    gameOver: false,
    paused: false,
    spawnTimer: 0,
    spawnInterval: SPAWN_INTERVAL_BASE,
  };
}

export function spawnMonster(state: GameState, email: Email): Monster {
  const x = Math.random() * (CANVAS_WIDTH - MONSTER_WIDTH - 40) + 20;
  return {
    id: email.id,
    email,
    x,
    y: -MONSTER_HEIGHT - 30,
    width: MONSTER_WIDTH,
    height: MONSTER_HEIGHT,
    speed: MONSTER_BASE_SPEED + Math.random() * 0.6,
    color: MONSTER_COLORS[Math.floor(Math.random() * MONSTER_COLORS.length)],
    eyeOffset: 0,
    rockVariant: Math.floor(Math.random() * 3),
    alive: true,
    captured: false,
    deathTimer: 0,
    captureTimer: 0,
  };
}

export function updateGame(
  state: GameState,
  keys: Set<string>,
  emails: Email[],
  dt: number,
  onEmailAction: (id: string, action: 'trashed' | 'captured') => void
): GameState {
  if (state.gameOver || state.paused) return state;

  const newState = { ...state };
  const player = { ...newState.player };

  // ── PLAYER MOVEMENT ──
  if (keys.has('ArrowLeft') || keys.has('a')) {
    player.x = Math.max(0, player.x - player.speed);
    player.facingLeft = true;
  }
  if (keys.has('ArrowRight') || keys.has('d')) {
    player.x = Math.min(CANVAS_WIDTH - player.width, player.x + player.speed);
    player.facingLeft = false;
  }

  // Cooldown timers
  if (player.shootTimer > 0) player.shootTimer--;
  if (player.netTimer > 0) player.netTimer--;
  if (player.shootTimer <= SHOOT_COOLDOWN - 6) player.shooting = false;
  if (player.netTimer <= NET_COOLDOWN - 8) player.netting = false;

  newState.player = player;

  // ── SHOOTING (Z key) ──
  if (keys.has('z') && player.shootTimer <= 0) {
    player.shooting = true;
    player.shootTimer = SHOOT_COOLDOWN;
    const bullet: Projectile = {
      x: player.x + player.width / 2,
      y: player.y,
      vy: BULLET_SPEED,
      type: 'bullet',
      width: 4,
      height: 12,
      active: true,
    };
    newState.projectiles = [...newState.projectiles, bullet];
    newState.particles = [
      ...newState.particles,
      ...createMuzzleFlash(player.x + player.width / 2, player.y),
    ];
    soundManager.playGunshot();
  }

  // ── NETTING (X key) ──
  if (keys.has('x') && player.netTimer <= 0) {
    player.netting = true;
    player.netTimer = NET_COOLDOWN;
    const net: Projectile = {
      x: player.x + player.width / 2,
      y: player.y,
      vy: NET_SPEED,
      type: 'net',
      width: 24,
      height: 24,
      active: true,
    };
    newState.projectiles = [...newState.projectiles, net];
    soundManager.playNetThrow();
  }

  // ── SPAWN MONSTERS ──
  newState.spawnTimer++;
  if (newState.spawnTimer >= newState.spawnInterval && newState.emailIndex < emails.length) {
    const email = emails[newState.emailIndex];
    newState.monsters = [...newState.monsters, spawnMonster(newState, email)];
    newState.emailIndex++;
    newState.spawnTimer = 0;
    // Speed up spawning slightly over time
    newState.spawnInterval = Math.max(50, SPAWN_INTERVAL_BASE - newState.emailIndex * 2);
  }

  // ── UPDATE MONSTERS ──
  newState.monsters = newState.monsters
    .map(m => {
      if (!m.alive) {
        return { ...m, deathTimer: m.deathTimer - dt * 2 };
      }
      if (m.captured) {
        return { ...m, captureTimer: m.captureTimer - dt * 1.5 };
      }
      return {
        ...m,
        y: m.y + m.speed,
        eyeOffset: Math.sin(Date.now() * 0.005 + parseInt(m.id) * 2) * 2,
      };
    })
    .filter(m => {
      if (!m.alive && m.deathTimer <= 0) return false;
      if (m.captured && m.captureTimer <= 0) return false;
      if (m.alive && !m.captured && m.y > CANVAS_HEIGHT + 50) {
        // Monster escaped — auto-mark as captured (it fell through, player missed)
        return false;
      }
      return true;
    });

  // ── UPDATE PROJECTILES ──
  newState.projectiles = newState.projectiles
    .map(p => ({ ...p, y: p.y + p.vy }))
    .filter(p => p.y > -50 && p.active);

  // ── COLLISION DETECTION ──
  const survivingProjectiles: Projectile[] = [];
  const updatedMonsters = [...newState.monsters];

  for (const proj of newState.projectiles) {
    let hit = false;
    for (let i = 0; i < updatedMonsters.length; i++) {
      const m = updatedMonsters[i];
      if (!m.alive || m.captured) continue;

      const mCx = m.x + m.width / 2;
      const mCy = m.y + m.height / 2;
      const pCx = proj.x;
      const pCy = proj.y;

      const dx = Math.abs(mCx - pCx);
      const dy = Math.abs(mCy - pCy);

      if (dx < (m.width / 2 + proj.width / 2) && dy < (m.height / 2 + proj.height / 2)) {
        hit = true;

        if (proj.type === 'bullet') {
          // KILL
          updatedMonsters[i] = { ...m, alive: false, deathTimer: 1 };
          newState.killScore++;
          newState.particles = [
            ...newState.particles,
            ...createExplosionParticles(mCx, mCy),
          ];
          soundManager.playExplosion();
          onEmailAction(m.email.id, 'trashed');
        } else {
          // CAPTURE
          updatedMonsters[i] = { ...m, captured: true, captureTimer: 1 };
          newState.captureScore++;
          newState.particles = [
            ...newState.particles,
            ...createNetParticles(mCx, mCy),
          ];
          soundManager.playCapture();
          onEmailAction(m.email.id, 'captured');
        }
        break;
      }
    }
    if (!hit) {
      survivingProjectiles.push(proj);
    }
  }

  newState.monsters = updatedMonsters;
  newState.projectiles = survivingProjectiles;

  // ── UPDATE PARTICLES ──
  newState.particles = updateParticles(newState.particles, dt);

  // ── CHECK GAME OVER ──
  if (
    newState.emailIndex >= emails.length &&
    newState.monsters.filter(m => m.alive && !m.captured).length === 0
  ) {
    // Small delay before game over
    if (newState.monsters.length === 0) {
      newState.gameOver = true;
      soundManager.playGameOver();
    }
  }

  return newState;
}

// ── BACKGROUND RENDERING ──────────────────────────
function renderBackground(ctx: CanvasRenderingContext2D, time: number): void {
  // Dark gradient background
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  grad.addColorStop(0, '#0a0a1a');
  grad.addColorStop(0.5, '#0f0f2a');
  grad.addColorStop(1, '#141428');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Stars
  ctx.fillStyle = '#FFFFFF';
  for (let i = 0; i < 50; i++) {
    const sx = (i * 137.5 + 50) % CANVAS_WIDTH;
    const sy = (i * 89.3 + 30) % (CANVAS_HEIGHT * 0.6);
    const brightness = 0.3 + 0.3 * Math.sin(time * 0.002 + i);
    ctx.globalAlpha = brightness;
    ctx.fillRect(sx, sy, 1.5, 1.5);
  }
  ctx.globalAlpha = 1;

  // Grid floor
  ctx.strokeStyle = 'rgba(100, 50, 255, 0.15)';
  ctx.lineWidth = 1;
  const floorY = CANVAS_HEIGHT - 25;
  for (let x = 0; x < CANVAS_WIDTH; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, floorY);
    ctx.lineTo(x, CANVAS_HEIGHT);
    ctx.stroke();
  }
  for (let y = floorY; y < CANVAS_HEIGHT; y += 10) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_WIDTH, y);
    ctx.stroke();
  }

  // Neon floor line
  ctx.strokeStyle = '#6644FF';
  ctx.shadowColor = '#6644FF';
  ctx.shadowBlur = 10;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, floorY);
  ctx.lineTo(CANVAS_WIDTH, floorY);
  ctx.stroke();
  ctx.shadowBlur = 0;
}

// ── HUD RENDERING ──────────────────────────────────
function renderHUD(ctx: CanvasRenderingContext2D, state: GameState, totalEmails: number): void {
  // Score panel
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(10, 10, 200, 70);
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 1;
  ctx.strokeRect(10, 10, 200, 70);

  ctx.font = 'bold 14px "Courier New", monospace';
  ctx.textAlign = 'left';

  ctx.fillStyle = '#FF4444';
  ctx.fillText(`💀 KILLS:    ${state.killScore}`, 20, 35);

  ctx.fillStyle = '#44FFAA';
  ctx.fillText(`🪤 CAPTURES: ${state.captureScore}`, 20, 55);

  ctx.fillStyle = '#AAAAAA';
  ctx.fillText(`📧 ${state.emailIndex}/${totalEmails}`, 20, 72);

  // Title
  ctx.font = 'bold 16px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFD700';
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = 6;
  ctx.fillText('⚔️ INBOX SLAYER ⚔️', CANVAS_WIDTH / 2, 28);
  ctx.shadowBlur = 0;

  // Controls hint
  ctx.font = '11px "Courier New", monospace';
  ctx.textAlign = 'right';
  ctx.fillStyle = '#666688';
  ctx.fillText('← → Move  |  Z Shoot  |  X Net', CANVAS_WIDTH - 15, 25);
}

// ── GAME OVER SCREEN ──────────────────────────────
function renderGameOver(ctx: CanvasRenderingContext2D, state: GameState): void {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.textAlign = 'center';
  ctx.font = 'bold 48px "Courier New", monospace';
  ctx.fillStyle = '#FFD700';
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = 20;
  ctx.fillText('INBOX CLEARED!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60);
  ctx.shadowBlur = 0;

  ctx.font = 'bold 24px "Courier New", monospace';
  ctx.fillStyle = '#FF4444';
  ctx.fillText(`Kills: ${state.killScore}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  ctx.fillStyle = '#44FFAA';
  ctx.fillText(`Captures: ${state.captureScore}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 35);

  ctx.font = '18px "Courier New", monospace';
  ctx.fillStyle = '#AAAACC';
  const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.004);
  ctx.globalAlpha = pulse;
  ctx.fillText('Redirecting to Dashboard...', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 90);
  ctx.globalAlpha = 1;
}

// ── MAIN RENDER FUNCTION ──────────────────────────
export function renderGame(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  totalEmails: number
): void {
  const time = Date.now();

  // Background
  renderBackground(ctx, time);

  // Monsters
  state.monsters.forEach(m => renderMonster(ctx, m));

  // Projectiles
  state.projectiles.forEach(p => renderProjectile(ctx, p));

  // Player
  renderPlayer(ctx, state.player);

  // Particles (on top of everything)
  renderParticles(ctx, state.particles);

  // HUD
  renderHUD(ctx, state, totalEmails);

  // Game Over overlay
  if (state.gameOver) {
    renderGameOver(ctx, state);
  }
}

export { CANVAS_WIDTH, CANVAS_HEIGHT };
