'use client';

// ============================================
// Dashboard Page — Post-Game Results
// ============================================

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Scoreboard from '../../components/Dashboard/Scoreboard';
import ReviewRoom from '../../components/Dashboard/ReviewRoom';
import { Email, GameResults } from '../../types';

export default function DashboardPage() {
  const router = useRouter();
  const [results, setResults] = useState<GameResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('gameResults');
    if (stored) {
      const parsed = JSON.parse(stored) as GameResults;
      setResults(parsed);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2a] to-[#141428] flex items-center justify-center">
        <div className="text-yellow-400 font-mono text-xl animate-pulse">
          Loading battle results...
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2a] to-[#141428] flex flex-col items-center justify-center gap-6">
        <div className="text-gray-500 font-mono text-lg text-center">
          <div className="text-4xl mb-4">⚠️</div>
          No game results found.<br />
          You need to play the game first!
        </div>
        <button
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700
            rounded-lg font-mono font-bold text-white transition-all hover:scale-105"
        >
          ▶ START GAME
        </button>
      </div>
    );
  }

  const capturedEmails = results.emails.filter((e: Email) => e.action === 'captured');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2a] to-[#141428]">
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(100, 50, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 50, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-mono text-yellow-400 mb-2"
            style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.5)' }}
          >
            ⚔️ MISSION COMPLETE
          </h1>
          <p className="text-gray-500 font-mono text-sm">
            Your inbox has been cleared. Review your captured emails below.
          </p>
        </div>

        {/* Scoreboard */}
        <div className="mb-8">
          <Scoreboard
            kills={results.kills}
            captures={results.captures}
            total={results.emails.length}
          />
        </div>

        {/* Killed emails summary */}
        <div className="mb-8 bg-black/40 border border-red-500/20 rounded-xl p-4">
          <h3 className="text-sm font-mono text-red-400 mb-2">💀 KILLED (AUTO-TRASHED)</h3>
          <div className="flex flex-wrap gap-2">
            {results.emails
              .filter((e: Email) => e.action === 'trashed')
              .map((e: Email) => (
                <span key={e.id} className="px-3 py-1 bg-red-950/50 border border-red-900/50 rounded-full text-red-400 font-mono text-xs">
                  {e.sender}
                </span>
              ))}
            {results.emails.filter((e: Email) => e.action === 'trashed').length === 0 && (
              <span className="text-gray-600 font-mono text-xs">None killed — merciful warrior! 🕊️</span>
            )}
          </div>
        </div>

        {/* Review Room */}
        <div className="mb-8">
          <ReviewRoom emails={capturedEmails} />
        </div>

        {/* Play Again */}
        <div className="text-center py-6">
          <button
            onClick={() => {
              sessionStorage.removeItem('gameResults');
              router.push('/');
            }}
            className="px-10 py-4 bg-gradient-to-r from-purple-600 to-purple-800
              hover:from-purple-500 hover:to-purple-700 rounded-xl font-mono font-bold text-lg
              text-white tracking-wider transition-all hover:scale-105 active:scale-95
              shadow-[0_0_20px_rgba(100,50,255,0.3)] hover:shadow-[0_0_40px_rgba(100,50,255,0.5)]
              border border-purple-400/30"
          >
            🔄 PLAY AGAIN
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-700 font-mono text-xs py-4">
          INBOX SLAYER v1.0 — Gamified Email Productivity
        </div>
      </div>
    </div>
  );
}
