// ============================================
// Inbox Slayer — Type Definitions
// ============================================

export interface Email {
  id: string;
  sender: string;
  subject: string;
  status: 'unread' | 'trashed' | 'captured' | 'archived';
  action?: 'trashed' | 'captured' | null;
}

export interface Monster {
  id: string;
  email: Email;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
  eyeOffset: number;
  rockVariant: number; // 0-2 for visual variety
  alive: boolean;
  captured: boolean;
  deathTimer: number;
  captureTimer: number;
}

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  facingLeft: boolean;
  shooting: boolean;
  netting: boolean;
  shootTimer: number;
  netTimer: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'explosion' | 'net' | 'spark';
}

export interface Projectile {
  x: number;
  y: number;
  vy: number;
  type: 'bullet' | 'net';
  width: number;
  height: number;
  active: boolean;
}

export interface GameState {
  player: Player;
  monsters: Monster[];
  particles: Particle[];
  projectiles: Projectile[];
  killScore: number;
  captureScore: number;
  emailIndex: number;
  gameOver: boolean;
  paused: boolean;
  spawnTimer: number;
  spawnInterval: number;
}

export interface GameResults {
  kills: number;
  captures: number;
  emails: Email[];
}
