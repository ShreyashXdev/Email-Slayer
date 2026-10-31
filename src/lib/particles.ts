// ============================================
// Particle Effects System
// ============================================

import { Particle } from '../types';

export function createExplosionParticles(x: number, y: number): Particle[] {
  const particles: Particle[] = [];
  const colors = ['#FF4444', '#FF8800', '#FFCC00', '#FF6622', '#FFFFFF'];

  for (let i = 0; i < 20; i++) {
    const angle = (Math.PI * 2 * i) / 20 + Math.random() * 0.3;
    const speed = 2 + Math.random() * 5;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 3 + Math.random() * 5,
      type: 'explosion',
    });
  }

  // Sparks
  for (let i = 0; i < 10; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 6;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: 1,
      color: '#FFFF88',
      size: 2,
      type: 'spark',
    });
  }

  return particles;
}

export function createNetParticles(x: number, y: number): Particle[] {
  const particles: Particle[] = [];
  const colors = ['#44FFAA', '#22DDFF', '#88FF88', '#AAFFDD'];

  // Net grid effect
  for (let i = 0; i < 16; i++) {
    const angle = (Math.PI * 2 * i) / 16;
    const speed = 1 + Math.random() * 2;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1,
      life: 1,
      maxLife: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 3,
      type: 'net',
    });
  }

  return particles;
}

export function createMuzzleFlash(x: number, y: number): Particle[] {
  const particles: Particle[] = [];

  for (let i = 0; i < 6; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.8;
    const speed = 3 + Math.random() * 4;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: 1,
      color: '#FFFF44',
      size: 3 + Math.random() * 3,
      type: 'spark',
    });
  }

  return particles;
}

export function updateParticles(particles: Particle[], dt: number): Particle[] {
  return particles
    .map(p => ({
      ...p,
      x: p.x + p.vx * dt * 60,
      y: p.y + p.vy * dt * 60,
      vx: p.vx * 0.96,
      vy: p.vy * 0.96 + (p.type === 'explosion' ? 0.05 : 0),
      life: p.life - dt * (p.type === 'spark' ? 3 : 1.5),
      size: p.size * (p.type === 'net' ? 0.98 : 0.97),
    }))
    .filter(p => p.life > 0);
}

export function renderParticles(ctx: CanvasRenderingContext2D, particles: Particle[]): void {
  particles.forEach(p => {
    const alpha = Math.max(0, p.life / p.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;

    if (p.type === 'net') {
      // Diamond shapes for net
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - p.size);
      ctx.lineTo(p.x + p.size, p.y);
      ctx.lineTo(p.x, p.y + p.size);
      ctx.lineTo(p.x - p.size, p.y);
      ctx.closePath();
      ctx.fill();
    } else if (p.type === 'spark') {
      // Small bright dots
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Explosion circles
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  });
}
