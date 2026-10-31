'use client';

// ============================================
// GameCanvas — Main Game Component
// ============================================

import { useRef, useEffect, useCallback, useState } from 'react';
import { createInitialState, updateGame, renderGame, CANVAS_WIDTH, CANVAS_HEIGHT } from '../lib/gameEngine';
import { mockEmails } from '../lib/mockEmails';
import { Email, GameState } from '../types';

interface GameCanvasProps {
  onGameOver: (results: { kills: number; captures: number; emails: Email[] }) => void;
}

export default function GameCanvas({ onGameOver }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>(createInitialState());
  const keysRef = useRef<Set<string>>(new Set());
  const emailsRef = useRef<Email[]>(JSON.parse(JSON.stringify(mockEmails)));
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const gameOverFiredRef = useRef(false);
  const [mobileAction, setMobileAction] = useState<string | null>(null);

  const handleEmailAction = useCallback((id: string, action: 'trashed' | 'captured') => {
    const email = emailsRef.current.find(e => e.id === id);
    if (email) {
      email.action = action;
      email.status = action;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());
      // Prevent scrolling with arrow keys
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // ── GAME LOOP ──
    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = timestamp;

      // Update
      stateRef.current = updateGame(
        stateRef.current,
        keysRef.current,
        emailsRef.current,
        dt,
        handleEmailAction
      );

      // Render
      renderGame(ctx, stateRef.current, emailsRef.current.length);

      // Check game over
      if (stateRef.current.gameOver && !gameOverFiredRef.current) {
        gameOverFiredRef.current = true;
        setTimeout(() => {
          onGameOver({
            kills: stateRef.current.killScore,
            captures: stateRef.current.captureScore,
            emails: emailsRef.current,
          });
        }, 2500);
      }

      animFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [onGameOver, handleEmailAction]);

  // Mobile touch handlers
  const handleMobileButton = (action: string, pressed: boolean) => {
    if (pressed) {
      keysRef.current.add(action);
      setMobileAction(action);
    } else {
      keysRef.current.delete(action);
      setMobileAction(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Canvas */}
      <div className="relative border-2 border-yellow-500/50 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(255,215,0,0.2)]">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block bg-black"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      {/* Mobile Controls */}
      <div className="flex gap-3 md:hidden">
        <button
          className="px-6 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white font-mono text-lg active:bg-gray-700 select-none"
          onTouchStart={() => handleMobileButton('arrowleft', true)}
          onTouchEnd={() => handleMobileButton('arrowleft', false)}
        >
          ← LEFT
        </button>
        <button
          className={`px-6 py-3 border rounded-lg font-mono text-lg select-none ${
            mobileAction === 'z'
              ? 'bg-red-900 border-red-500 text-red-300'
              : 'bg-red-950 border-red-800 text-red-400'
          }`}
          onTouchStart={() => handleMobileButton('z', true)}
          onTouchEnd={() => handleMobileButton('z', false)}
        >
          💀 KILL
        </button>
        <button
          className={`px-6 py-3 border rounded-lg font-mono text-lg select-none ${
            mobileAction === 'x'
              ? 'bg-emerald-900 border-emerald-500 text-emerald-300'
              : 'bg-emerald-950 border-emerald-800 text-emerald-400'
          }`}
          onTouchStart={() => handleMobileButton('x', true)}
          onTouchEnd={() => handleMobileButton('x', false)}
        >
          🪤 CAPTURE
        </button>
        <button
          className="px-6 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white font-mono text-lg active:bg-gray-700 select-none"
          onTouchStart={() => handleMobileButton('arrowright', true)}
          onTouchEnd={() => handleMobileButton('arrowright', false)}
        >
          RIGHT →
        </button>
      </div>

      {/* Desktop hint */}
      <div className="hidden md:flex gap-6 text-sm font-mono text-gray-500">
        <span>⬅ ➡ <span className="text-gray-400">Move</span></span>
        <span className="text-red-500">Z <span className="text-red-400">Kill (Shoot)</span></span>
        <span className="text-emerald-500">X <span className="text-emerald-400">Capture (Net)</span></span>
      </div>
    </div>
  );
}
