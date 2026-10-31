'use client';

// ============================================
// Game Page — Hosts the Canvas Game
// ============================================

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import GameCanvas from '../../components/GameCanvas';
import { Email } from '../../types';

export default function GamePage() {
  const router = useRouter();

  const handleGameOver = useCallback((results: { kills: number; captures: number; emails: Email[] }) => {
    // Store results in sessionStorage for the dashboard
    sessionStorage.setItem('gameResults', JSON.stringify(results));

    // Also sync to API
    results.emails.forEach(email => {
      if (email.action) {
        fetch('/api/emails', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emailId: email.id, action: email.action }),
        }).catch(console.error);
      }
    });

    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2a] to-[#141428] flex flex-col items-center justify-center p-4">
      <GameCanvas onGameOver={handleGameOver} />
    </div>
  );
}
