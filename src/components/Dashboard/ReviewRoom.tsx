'use client';

// ============================================
// Review Room — Captured Emails Grid
// ============================================

import { useState } from 'react';
import { Email } from '../../types';

interface ReviewRoomProps {
  emails: Email[];
}

export default function ReviewRoom({ emails }: ReviewRoomProps) {
  const [emailStates, setEmailStates] = useState<Record<string, 'pending' | 'trashed' | 'released'>>(
    () => {
      const initial: Record<string, 'pending' | 'trashed' | 'released'> = {};
      emails.forEach(e => { initial[e.id] = 'pending'; });
      return initial;
    }
  );
  const [processing, setProcessing] = useState<string | null>(null);

  const handleKill = async (id: string) => {
    setProcessing(id);
    try {
      const res = await fetch('/api/emails/trash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailId: id }),
      });
      if (res.ok) {
        setEmailStates(prev => ({ ...prev, [id]: 'trashed' }));
      }
    } catch (err) {
      console.error('Failed to trash email:', err);
    }
    setProcessing(null);
  };

  const handleRelease = async (id: string) => {
    setProcessing(id);
    try {
      const res = await fetch('/api/emails/archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailId: id }),
      });
      if (res.ok) {
        setEmailStates(prev => ({ ...prev, [id]: 'released' }));
      }
    } catch (err) {
      console.error('Failed to archive email:', err);
    }
    setProcessing(null);
  };

  const pendingCount = Object.values(emailStates).filter(s => s === 'pending').length;

  return (
    <div className="bg-black/60 border border-emerald-500/30 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-mono font-bold text-emerald-400 tracking-wider">
          🪤 THE REVIEW ROOM
        </h2>
        <span className="text-xs font-mono text-gray-500">
          {pendingCount} email{pendingCount !== 1 ? 's' : ''} awaiting judgment
        </span>
      </div>

      {emails.length === 0 ? (
        <div className="text-center py-8 text-gray-600 font-mono">
          <div className="text-4xl mb-3">🎯</div>
          <p>No emails captured — you killed them all!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {emails.map(email => {
            const state = emailStates[email.id];
            const isProcessing = processing === email.id;

            return (
              <div
                key={email.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 ${
                  state === 'trashed'
                    ? 'bg-red-950/30 border-red-800/30 opacity-60'
                    : state === 'released'
                    ? 'bg-emerald-950/30 border-emerald-800/30 opacity-60'
                    : 'bg-gray-900/50 border-gray-700/50 hover:border-gray-600/50'
                }`}
              >
                {/* Email info */}
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-yellow-400 font-mono font-bold text-sm truncate">
                      {email.sender}
                    </span>
                    {state !== 'pending' && (
                      <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                        state === 'trashed'
                          ? 'bg-red-900/50 text-red-400'
                          : 'bg-emerald-900/50 text-emerald-400'
                      }`}>
                        {state === 'trashed' ? '🗑️ TRASHED' : '📥 SAVED'}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm font-mono truncate">
                    {email.subject}
                  </p>
                </div>

                {/* Action buttons */}
                {state === 'pending' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleKill(email.id)}
                      disabled={isProcessing}
                      className="px-4 py-2 bg-red-900/50 hover:bg-red-800/70 border border-red-700
                        rounded-lg font-mono text-sm text-red-400 hover:text-red-300
                        transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? '...' : '💀 KILL'}
                    </button>
                    <button
                      onClick={() => handleRelease(email.id)}
                      disabled={isProcessing}
                      className="px-4 py-2 bg-emerald-900/50 hover:bg-emerald-800/70 border border-emerald-700
                        rounded-lg font-mono text-sm text-emerald-400 hover:text-emerald-300
                        transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? '...' : '📥 RELEASE'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
