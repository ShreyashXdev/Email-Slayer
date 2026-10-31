'use client';

// ============================================
// Scoreboard — Kill / Capture Totals
// ============================================

interface ScoreboardProps {
  kills: number;
  captures: number;
  total: number;
}

export default function Scoreboard({ kills, captures, total }: ScoreboardProps) {
  const killPercent = total > 0 ? Math.round((kills / total) * 100) : 0;
  const capturePercent = total > 0 ? Math.round((captures / total) * 100) : 0;

  return (
    <div className="bg-black/60 border border-yellow-500/30 rounded-xl p-6">
      <h2 className="text-xl font-mono font-bold text-yellow-400 mb-4 text-center tracking-wider">
        ⚔️ BATTLE REPORT
      </h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Kills */}
        <div className="text-center">
          <div className="text-5xl mb-2">💀</div>
          <div className="text-4xl font-bold font-mono text-red-400">{kills}</div>
          <div className="text-sm font-mono text-red-600 mt-1">KILLED</div>
          <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-1000"
              style={{ width: `${killPercent}%` }}
            />
          </div>
          <div className="text-xs font-mono text-gray-600 mt-1">{killPercent}% of inbox</div>
        </div>

        {/* Captures */}
        <div className="text-center">
          <div className="text-5xl mb-2">🪤</div>
          <div className="text-4xl font-bold font-mono text-emerald-400">{captures}</div>
          <div className="text-sm font-mono text-emerald-600 mt-1">CAPTURED</div>
          <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000"
              style={{ width: `${capturePercent}%` }}
            />
          </div>
          <div className="text-xs font-mono text-gray-600 mt-1">{capturePercent}% of inbox</div>
        </div>
      </div>

      {/* Total */}
      <div className="mt-4 pt-4 border-t border-gray-800 text-center">
        <span className="font-mono text-gray-500 text-sm">
          📧 {total} emails processed in battle
        </span>
      </div>
    </div>
  );
}
