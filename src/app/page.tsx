'use client';

// ============================================
// Email Slayers — Main Root Page (State Machine)
// Manages: 'menu' | 'game' | 'dashboard'
// ============================================

import { useState, useCallback, useEffect } from 'react';
import StartScreen from '../components/StartScreen';
import GameCanvas from '../components/GameCanvas';
import Scoreboard from '../components/Dashboard/Scoreboard';
import ReviewRoom from '../components/Dashboard/ReviewRoom';
import { Email, GameResults } from '../types';

export default function Home() {
  const [currentView, setCurrentView] = useState<'menu' | 'game' | 'dashboard'>('menu');
  const [gameResults, setGameResults] = useState<GameResults | null>(null);

  // Keyboard shortcut: Press ENTER or SPACE on Start Screen to start
  useEffect(() => {
    if (currentView !== 'menu') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        setCurrentView('game');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView]);

  // Handle Game Completion (Phase 1 & 2 -> Phase 3 transition)
  const handleGameOver = useCallback((results: { kills: number; captures: number; emails: Email[] }) => {
    setGameResults(results);

    // Sync to API handlers in background
    results.emails.forEach((email) => {
      if (email.action) {
        fetch('/api/emails', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emailId: email.id, action: email.action }),
        }).catch(console.error);
      }
    });

    // Seamlessly transition to Dashboard
    setCurrentView('dashboard');
  }, []);

  const handleRestartGame = () => {
    setGameResults(null);
    setCurrentView('game');
  };

  const handleBackToMenu = () => {
    setGameResults(null);
    setCurrentView('menu');
  };

  return (
    <main className="min-h-screen w-full bg-[#060714] text-white flex flex-col justify-center items-center relative overflow-hidden transition-colors duration-700">
      
      {/* VIEW 1: START SCREEN / MENU */}
      {currentView === 'menu' && (
        <div className="w-full flex justify-center items-center animate-fadeIn">
          <StartScreen onStart={() => setCurrentView('game')} />
        </div>
      )}

      {/* VIEW 2: PHASE 1 GAME LOOP (FALLING MONSTER ACTION) */}
      {currentView === 'game' && (
        <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 py-8 animate-fadeIn">
          {/* Top Quick Nav */}
          <div className="w-full max-w-[800px] flex items-center justify-between pb-3 px-2 text-xs font-mono text-slate-400">
            <button
              onClick={handleBackToMenu}
              className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              ◀ ESCAPE TO MENU
            </button>
            <span className="text-slate-500">
              EMAIL SLAYERS • INBOX BATTLE FIELD
            </span>
          </div>

          {/* Canvas Game Loop */}
          <GameCanvas onGameOver={handleGameOver} />
        </div>
      )}

      {/* VIEW 3: POST-GAME DASHBOARD & REVIEW ROOM */}
      {currentView === 'dashboard' && gameResults && (
        <div className="w-full min-h-screen py-10 px-4 max-w-4xl mx-auto flex flex-col gap-8 animate-fadeIn">
          {/* Dashboard Header */}
          <div className="text-center">
            <span className="inline-block px-3 py-1 rounded-full border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 font-mono text-xs tracking-widest uppercase mb-3">
              ★ BATTLE CONCLUDED ★
            </span>
            <h1
              className="arcade-font text-4xl sm:text-6xl font-black text-yellow-400 uppercase tracking-tight"
              style={{ textShadow: '0 0 25px rgba(255, 215, 0, 0.45)' }}
            >
              MISSION ACCOMPLISHED
            </h1>
            <p className="text-slate-400 font-mono text-sm mt-1">
              Your inbox is clear! Review captured emails or finalize trashes below.
            </p>
          </div>

          {/* Phase 3 Scoreboard */}
          <Scoreboard
            kills={gameResults.kills}
            captures={gameResults.captures}
            total={gameResults.emails.length}
          />

          {/* Trashed Summary Badge List */}
          <div className="bg-black/40 border border-red-500/20 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-mono font-bold text-red-400 tracking-wider uppercase flex items-center gap-2">
                <span>💀 KILLED IN BATTLE</span>
                <span className="text-[11px] text-red-500/70 font-normal">
                  (Automatically marked for Trash)
                </span>
              </h3>
              <span className="text-xs font-mono text-red-400">
                {gameResults.emails.filter((e) => e.action === 'trashed').length} Emails
              </span>
            </div>

            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto">
              {gameResults.emails
                .filter((e) => e.action === 'trashed')
                .map((e) => (
                  <span
                    key={e.id}
                    className="px-2.5 py-1 bg-red-950/40 border border-red-800/40 rounded text-red-300 font-mono text-xs flex items-center gap-1.5"
                  >
                    <span className="text-red-500">✕</span> {e.sender}
                  </span>
                ))}
              {gameResults.emails.filter((e) => e.action === 'trashed').length === 0 && (
                <span className="text-slate-500 font-mono text-xs italic">
                  No emails slain — zero casualties!
                </span>
              )}
            </div>
          </div>

          {/* Phase 3 Review Room for Captured Emails */}
          <ReviewRoom
            emails={gameResults.emails.filter((e) => e.action === 'captured')}
          />

          {/* Action Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 pb-12">
            <button
              onClick={handleRestartGame}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 rounded-xl font-mono font-bold text-lg text-white tracking-wider transition-all hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(0,240,255,0.35)] border border-cyan-400/30 cursor-pointer"
            >
              🔄 PLAY AGAIN
            </button>
            <button
              onClick={handleBackToMenu}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl font-mono font-bold text-lg text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              ◀ TITLE SCREEN
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
