// ============================================
// Sprite Rendering — Player & Monsters
// ============================================

import { Player, Monster } from '../types';

// ── JIN KAZAMA-STYLE PLAYER SPRITE ──────────────────
export function renderPlayer(ctx: CanvasRenderingContext2D, player: Player): void {
  const { x, y, width, height, facingLeft, shooting, netting } = player;
  const cx = x + width / 2;
  const cy = y + height / 2;

  ctx.save();
  if (facingLeft) {
    ctx.translate(cx, 0);
    ctx.scale(-1, 1);
    ctx.translate(-cx, 0);
  }

  // ── LEGS (dark pants) ──
  ctx.fillStyle = '#1a1a2e';
  // Left leg
  ctx.fillRect(cx - 12, y + height - 20, 8, 20);
  // Right leg
  ctx.fillRect(cx + 4, y + height - 20, 8, 20);
  // Boots
  ctx.fillStyle = '#333355';
  ctx.fillRect(cx - 14, y + height - 4, 12, 4);
  ctx.fillRect(cx + 2, y + height - 4, 12, 4);

  // ── BODY (red/black martial arts gi) ──
  ctx.fillStyle = '#CC2244';
  ctx.fillRect(cx - 14, y + 20, 28, 28);
  // Black belt
  ctx.fillStyle = '#111111';
  ctx.fillRect(cx - 14, y + 38, 28, 4);
  // Dark trim
  ctx.fillStyle = '#991133';
  ctx.fillRect(cx - 14, y + 20, 3, 28);
  ctx.fillRect(cx + 11, y + 20, 3, 28);

  // ── ARMS ──
  if (shooting) {
    // Shooting pose — arm extended up
    ctx.fillStyle = '#DDBB88';
    ctx.fillRect(cx + 14, y + 12, 8, 6);
    // Gun
    ctx.fillStyle = '#333333';
    ctx.fillRect(cx + 15, y + 2, 6, 12);
    ctx.fillStyle = '#555555';
    ctx.fillRect(cx + 16, y + 0, 4, 4);
    // Muzzle flash when shooting
    ctx.fillStyle = '#FFFF44';
    ctx.shadowColor = '#FFFF00';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(cx + 18, y - 2, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (netting) {
    // Net throw pose
    ctx.fillStyle = '#DDBB88';
    ctx.fillRect(cx + 14, y + 16, 10, 6);
    // Net
    ctx.fillStyle = '#44FFAA';
    ctx.strokeStyle = '#22DD88';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx + 24, y + 10, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 0.3;
    ctx.fill();
    ctx.globalAlpha = 1;
  } else {
    // Idle arms
    ctx.fillStyle = '#DDBB88';
    ctx.fillRect(cx - 18, y + 22, 6, 16);
    ctx.fillRect(cx + 12, y + 22, 6, 16);
    // Fists
    ctx.fillStyle = '#CC2244';
    ctx.fillRect(cx - 19, y + 36, 8, 6);
    ctx.fillRect(cx + 11, y + 36, 8, 6);
  }

  // ── HEAD ──
  ctx.fillStyle = '#DDBB88';
  ctx.fillRect(cx - 10, y + 4, 20, 18);
  // Hair (dark, spiky like Jin Kazama)
  ctx.fillStyle = '#111111';
  ctx.fillRect(cx - 12, y, 24, 8);
  ctx.fillRect(cx - 14, y + 2, 4, 10);
  ctx.fillRect(cx + 10, y + 2, 4, 10);
  // Spiky bangs
  ctx.beginPath();
  ctx.moveTo(cx - 8, y);
  ctx.lineTo(cx - 5, y - 6);
  ctx.lineTo(cx - 2, y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx, y);
  ctx.lineTo(cx + 3, y - 8);
  ctx.lineTo(cx + 6, y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + 6, y);
  ctx.lineTo(cx + 10, y - 5);
  ctx.lineTo(cx + 12, y + 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(cx - 7, y + 10, 5, 4);
  ctx.fillRect(cx + 2, y + 10, 5, 4);
  ctx.fillStyle = '#222222';
  ctx.fillRect(cx - 5, y + 11, 3, 3);
  ctx.fillRect(cx + 4, y + 11, 3, 3);

  // Red headband/marking (Jin Kazama's forehead tattoo reference)
  ctx.fillStyle = '#FF3344';
  ctx.fillRect(cx - 8, y + 7, 16, 2);

  ctx.restore();

  // ── ACTION ZONE LABELS ──
  const labelY = y + height + 8;
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'center';

  // KILL label (left)
  ctx.fillStyle = '#FF4444';
  ctx.shadowColor = '#FF0000';
  ctx.shadowBlur = 8;
  const killX = cx - 28;
  ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
  ctx.fillRect(killX - 22, labelY - 2, 44, 16);
  ctx.strokeStyle = '#FF4444';
  ctx.lineWidth = 1;
  ctx.strokeRect(killX - 22, labelY - 2, 44, 16);
  ctx.fillStyle = '#FF4444';
  ctx.fillText('[Z] KILL', killX, labelY + 10);

  // CAPTURE label (right)
  ctx.shadowColor = '#00FF88';
  ctx.shadowBlur = 8;
  const capX = cx + 28;
  ctx.fillStyle = 'rgba(0, 255, 100, 0.2)';
  ctx.fillRect(capX - 28, labelY - 2, 56, 16);
  ctx.strokeStyle = '#44FFAA';
  ctx.lineWidth = 1;
  ctx.strokeRect(capX - 28, labelY - 2, 56, 16);
  ctx.fillStyle = '#44FFAA';
  ctx.fillText('[X] CAPTURE', capX, labelY + 10);

  ctx.shadowBlur = 0;
}

// ── ROCK MONSTER SPRITE (Geodude/Golem style) ──────
export function renderMonster(ctx: CanvasRenderingContext2D, monster: Monster): void {
  if (!monster.alive && monster.deathTimer <= 0) return;

  const { x, y, width, height, color, rockVariant, email } = monster;
  const cx = x + width / 2;
  const cy = y + height / 2;

  ctx.save();

  // Death flash effect
  if (!monster.alive && monster.deathTimer > 0) {
    ctx.globalAlpha = monster.deathTimer;
  }

  // Capture glow effect
  if (monster.captured && monster.captureTimer > 0) {
    ctx.shadowColor = '#44FFAA';
    ctx.shadowBlur = 20 * monster.captureTimer;
    ctx.globalAlpha = monster.captureTimer;
  }

  // ── BODY — rocky boulder shape ──
  const bodyColors = [
    ['#8B7355', '#6B5335', '#A89070'],  // Brown rock
    ['#6B6B7B', '#4B4B5B', '#8B8B9B'],  // Gray rock
    ['#7B5B4B', '#5B3B2B', '#9B7B6B'],  // Red rock
  ];
  const [main, dark, light] = bodyColors[rockVariant % 3];

  // Main body (irregular rocky shape)
  ctx.fillStyle = color || main;
  ctx.beginPath();
  ctx.moveTo(cx - width * 0.4, cy + height * 0.3);
  ctx.lineTo(cx - width * 0.45, cy - height * 0.1);
  ctx.lineTo(cx - width * 0.3, cy - height * 0.4);
  ctx.lineTo(cx - width * 0.05, cy - height * 0.45);
  ctx.lineTo(cx + width * 0.15, cy - height * 0.42);
  ctx.lineTo(cx + width * 0.4, cy - height * 0.25);
  ctx.lineTo(cx + width * 0.45, cy + height * 0.05);
  ctx.lineTo(cx + width * 0.35, cy + height * 0.35);
  ctx.lineTo(cx, cy + height * 0.4);
  ctx.closePath();
  ctx.fill();

  // Rock cracks/details
  ctx.strokeStyle = dark;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 5, cy - height * 0.3);
  ctx.lineTo(cx, cy);
  ctx.lineTo(cx + 8, cy + 5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 10, cy - 10);
  ctx.lineTo(cx + 5, cy + 5);
  ctx.stroke();

  // Light highlight
  ctx.fillStyle = light;
  ctx.beginPath();
  ctx.arc(cx - 8, cy - 10, 5, 0, Math.PI * 2);
  ctx.fill();

  // ── ARMS (stubby rock arms) ──
  ctx.fillStyle = color || main;
  // Left arm
  ctx.beginPath();
  ctx.ellipse(cx - width * 0.5, cy + 2, 8, 12, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.arc(cx - width * 0.55, cy + 6, 4, 0, Math.PI * 2);
  ctx.fill();
  // Right arm
  ctx.fillStyle = color || main;
  ctx.beginPath();
  ctx.ellipse(cx + width * 0.5, cy + 2, 8, 12, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.arc(cx + width * 0.55, cy + 6, 4, 0, Math.PI * 2);
  ctx.fill();

  // ── FACE ──
  // Angry eyes
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(cx - 10, cy - 6, 7, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 10, cy - 6, 7, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pupils (with slight bounce animation)
  const eyeOff = monster.eyeOffset || 0;
  ctx.fillStyle = '#CC0000';
  ctx.beginPath();
  ctx.arc(cx - 10 + eyeOff, cy - 5, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 10 + eyeOff, cy - 5, 3, 0, Math.PI * 2);
  ctx.fill();

  // Angry eyebrows
  ctx.strokeStyle = dark;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - 16, cy - 14);
  ctx.lineTo(cx - 5, cy - 10);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 16, cy - 14);
  ctx.lineTo(cx + 5, cy - 10);
  ctx.stroke();

  // Mouth (grimace)
  ctx.fillStyle = '#331111';
  ctx.beginPath();
  ctx.moveTo(cx - 8, cy + 8);
  ctx.lineTo(cx - 4, cy + 14);
  ctx.lineTo(cx + 4, cy + 14);
  ctx.lineTo(cx + 8, cy + 8);
  ctx.lineTo(cx + 4, cy + 10);
  ctx.lineTo(cx - 4, cy + 10);
  ctx.closePath();
  ctx.fill();

  // ── SENDER LABEL (floating above monster) ──
  ctx.font = 'bold 13px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = '#000000';
  ctx.shadowBlur = 4;

  // Label background
  const labelText = email.sender;
  const metrics = ctx.measureText(labelText);
  const labelWidth = metrics.width + 16;
  const labelX = cx - labelWidth / 2;
  const labelY = y - 28;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 1;
  // Rounded rect
  const r = 4;
  ctx.beginPath();
  ctx.moveTo(labelX + r, labelY);
  ctx.lineTo(labelX + labelWidth - r, labelY);
  ctx.quadraticCurveTo(labelX + labelWidth, labelY, labelX + labelWidth, labelY + r);
  ctx.lineTo(labelX + labelWidth, labelY + 18 - r);
  ctx.quadraticCurveTo(labelX + labelWidth, labelY + 18, labelX + labelWidth - r, labelY + 18);
  ctx.lineTo(labelX + r, labelY + 18);
  ctx.quadraticCurveTo(labelX, labelY + 18, labelX, labelY + 18 - r);
  ctx.lineTo(labelX, labelY + r);
  ctx.quadraticCurveTo(labelX, labelY, labelX + r, labelY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Arrow pointing down to monster
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.beginPath();
  ctx.moveTo(cx - 5, labelY + 18);
  ctx.lineTo(cx, labelY + 24);
  ctx.lineTo(cx + 5, labelY + 18);
  ctx.fill();

  // Label text
  ctx.fillStyle = '#FFD700';
  ctx.shadowColor = '#000000';
  ctx.shadowBlur = 2;
  ctx.fillText(labelText, cx, labelY + 14);

  ctx.shadowBlur = 0;
  ctx.restore();
}

// ── PROJECTILE RENDERING ──────────────────────────
export function renderProjectile(ctx: CanvasRenderingContext2D, proj: { x: number; y: number; type: 'bullet' | 'net'; width: number; height: number }): void {
  ctx.save();

  if (proj.type === 'bullet') {
    // Bullet trail
    ctx.fillStyle = '#FFDD44';
    ctx.shadowColor = '#FFAA00';
    ctx.shadowBlur = 10;
    ctx.fillRect(proj.x - 2, proj.y, 4, 12);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(proj.x - 1, proj.y, 2, 6);
  } else {
    // Net projectile
    ctx.strokeStyle = '#44FFAA';
    ctx.shadowColor = '#22FF88';
    ctx.shadowBlur = 10;
    ctx.lineWidth = 2;

    // Net mesh pattern
    const s = 12;
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, s, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#44FFAA';
    ctx.fill();
    ctx.globalAlpha = 1;

    // Cross pattern
    ctx.beginPath();
    ctx.moveTo(proj.x - s, proj.y);
    ctx.lineTo(proj.x + s, proj.y);
    ctx.moveTo(proj.x, proj.y - s);
    ctx.lineTo(proj.x, proj.y + s);
    ctx.moveTo(proj.x - s * 0.7, proj.y - s * 0.7);
    ctx.lineTo(proj.x + s * 0.7, proj.y + s * 0.7);
    ctx.moveTo(proj.x + s * 0.7, proj.y - s * 0.7);
    ctx.lineTo(proj.x - s * 0.7, proj.y + s * 0.7);
    ctx.stroke();
  }

  ctx.restore();
}
