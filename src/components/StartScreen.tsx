'use client';

// ============================================
// Start Screen — "Email Slayers" Upgraded Menu
// ============================================

import { useState } from 'react';
import { soundManager } from '../lib/sounds';

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const [isStarting, setIsStarting] = useState(false);

  const handleStartGame = () => {
    if (isStarting) return;
    setIsStarting(true);

    // Play retro arcade coin chime & battle launch sequence
    soundManager.playCoin();
    setTimeout(() => {
      soundManager.playGameStart();
    }, 120);

    // Smooth transition into the falling-monster gameplay
    setTimeout(() => {
      onStart();
    }, 400);
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center min-h-screen w-full bg-[#04050d] text-white px-4 py-6 overflow-x-hidden transition-all duration-500 ${
        isStarting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Dark Arcade Grid Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 240, 255, 0.22) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 150, 255, 0.22) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Deep ambient vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#04050d]/70 to-[#04050d]" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl mx-auto gap-5 text-center">

        {/* 1. TOP BADGE & STAGE INDICATOR */}
        <div className="flex items-center gap-3 text-xs font-mono tracking-widest uppercase">
          <span className="px-3 py-1 rounded-full border border-cyan-400/40 bg-cyan-950/50 text-cyan-300 font-bold shadow-[0_0_12px_rgba(0,240,255,0.25)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
            ARCADE EDITION • 20 UNREAD EMAILS
          </span>
          <span className="hidden sm:inline text-cyan-600 font-bold">•</span>
          <span className="hidden sm:inline px-3 py-1 rounded-full border border-yellow-500/30 bg-yellow-950/40 text-yellow-300 font-bold arcade-blink">
            CREDITS: 01 [FREE PLAY]
          </span>
        </div>

        {/* ========================================================
            REQUIREMENT 1: "EMAIL SLAYERS" TITLE LARGER & BRIGHTER
            Dominates the top half with extra-bold font weight,
            layered text-shadow, and a large blurred radial gradient.
            ======================================================== */}
        <div className="relative w-full flex items-center justify-center pt-2 pb-1">
          {/* Large blurred radial blue/cyan gradient backdrop */}
          <div className="neon-giant-backlight blur-3xl pointer-events-none" aria-hidden="true" />
          <div
            className="absolute w-[500px] h-[180px] bg-cyan-400/25 rounded-full blur-[80px] pointer-events-none -z-10"
            aria-hidden="true"
          />

          {/* Aggressive Large Title */}
          <h1 className="relative z-10 arcade-font text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-wider select-none transform -skew-x-3 transition-transform">
            <span className="neon-blue-title-glow block">
              EMAIL SLAYERS
            </span>
          </h1>
        </div>

        {/* Subtitle / Punchy Hook */}
        <div className="flex flex-col items-center -mt-2 mb-1">
          <p className="text-sm sm:text-base md:text-lg font-mono text-cyan-300 font-bold tracking-widest uppercase drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">
            ⚔️ THE 2D CATCH-AND-SHOOT INBOX CLEANER ⚔️
          </p>
          <p className="text-xs sm:text-sm font-mono text-slate-400 max-w-lg mt-0.5">
            Play as a martial artist fighting falling email rock monsters. Slay junk or capture important mail!
          </p>
        </div>

        {/* ========================================================
            REQUIREMENT 2: BOOST VISIBILITY OF "PLAY GAME" & MENU
            High-contrast bright cyan-to-blue gradient background,
            bold dark text, solid white/neon border, strong outer glow.
            ======================================================== */}
        <div className="flex flex-col items-center gap-2 w-full max-w-lg">
          <button
            onClick={handleStartGame}
            disabled={isStarting}
            className={`btn-play-game-glow w-full py-4 sm:py-5 px-8 rounded-2xl font-mono font-black text-2xl sm:text-3xl tracking-widest uppercase
              border-2 border-white shadow-[0_0_35px_rgba(0,240,255,0.9)] cursor-pointer select-none
              flex items-center justify-center gap-3 relative overflow-hidden group ${
                isStarting ? 'opacity-85 scale-95' : ''
              }`}
          >
            {/* Shimmer sweep animation */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

            <span className="text-2xl sm:text-3xl animate-bounce">🪙</span>
            <span className="text-slate-950 font-black drop-shadow-[0_1px_2px_rgba(255,255,255,0.4)]">
              {isStarting ? 'INITIALIZING...' : 'PLAY GAME'}
            </span>
            <span className="hidden sm:inline-block text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-slate-950 text-cyan-300 border border-slate-900 shadow-inner">
              ENTER ↵
            </span>
          </button>

          {/* Secondary Quick Controls Prompt */}
          <div className="flex items-center justify-between w-full px-2 text-[11px] sm:text-xs font-mono text-cyan-400/90">
            <span className="arcade-blink font-semibold">
              ▼ CLICK BUTTON OR PRESS [ENTER] TO LAUNCH ▼
            </span>
            <span className="text-slate-400">
              AUDIO: <span className="text-emerald-400 font-bold">SYNTH ON 🔊</span>
            </span>
          </div>
        </div>

        {/* ========================================================
            REQUIREMENT 3: STRUCTURED "HOW TO PLAY" INSTRUCTION TABLE
            Clean semi-transparent dark card with glowing neon border.
            Columns: Control / Input | Character Action | Monster Effect | Real Email Action
            Rows: Move (Cyan) | KILL (Red) | CAPTURE (Green) | Review Room (Purple)
            ======================================================== */}
        <div className="how-to-play-card w-full rounded-2xl p-4 sm:p-5 mt-1 text-left border border-cyan-400/40">
          {/* Card Header */}
          <div className="flex items-center justify-between mb-3 border-b border-cyan-500/20 pb-2">
            <h2 className="arcade-font text-base sm:text-lg text-cyan-300 font-bold tracking-wide flex items-center gap-2">
              <span>🕹️</span>
              <span>HOW TO PLAY & CONTROLS</span>
            </h2>
            <span className="text-[11px] font-mono text-slate-400">
              4 Battle Rules • Instant Inbox Results
            </span>
          </div>

          {/* Responsive HTML / Tailwind Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono border-collapse">
              <thead>
                <tr className="border-b border-slate-700/80 text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider bg-slate-900/60">
                  <th className="py-2.5 px-3 font-bold w-[22%]">Control / Input</th>
                  <th className="py-2.5 px-3 font-bold w-[26%]">Character Action</th>
                  <th className="py-2.5 px-3 font-bold w-[26%]">Monster Effect</th>
                  <th className="py-2.5 px-3 font-bold w-[26%]">Real Email Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs sm:text-[13px]">
                
                {/* ROW 1: MOVE (CYAN THEME) */}
                <tr className="bg-cyan-950/20 hover:bg-cyan-950/40 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-cyan-300 align-top">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                      <span className="px-2 py-0.5 rounded bg-cyan-900/60 border border-cyan-500/40 text-cyan-200 text-xs">
                        Left / Right Arrow Keys
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-200 align-top">
                    Moves the <span className="text-cyan-300 font-semibold">Jin Kazama-style</span> character left and right
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 align-top">
                    Lines up beneath falling rock monsters
                  </td>
                  <td className="py-2.5 px-3 text-cyan-200/90 font-medium align-top">
                    Lets you read the <span className="text-amber-300 font-bold">Sender Name</span> floating above the monster.
                  </td>
                </tr>

                {/* ROW 2: KILL (RED THEME) */}
                <tr className="bg-red-950/20 hover:bg-red-950/40 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-red-400 align-top">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="inline-block w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                      <span className="px-2 py-0.5 rounded bg-red-900/60 border border-red-500/40 text-red-200 text-xs">
                        Z Key or KILL Button
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-200 align-top">
                    Character <span className="text-red-400 font-semibold">shoots gun</span> upward
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 align-top">
                    <span className="text-red-300 font-semibold">Destroys the monster</span> with explosion & gunshot sound
                  </td>
                  <td className="py-2.5 px-3 text-red-200/90 font-medium align-top">
                    Sends the email to the <span className="text-red-400 font-bold underline decoration-red-500/50">Recycle Bin / Trash</span>.
                  </td>
                </tr>

                {/* ROW 3: CAPTURE (GREEN THEME) */}
                <tr className="bg-emerald-950/20 hover:bg-emerald-950/40 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-emerald-400 align-top">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                      <span className="px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 text-xs">
                        X Key or CAPTURE Button
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-200 align-top">
                    Character <span className="text-emerald-400 font-semibold">throws net</span> upward
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 align-top">
                    <span className="text-emerald-300 font-semibold">Traps the monster</span> with net visual & sound effect
                  </td>
                  <td className="py-2.5 px-3 text-emerald-200/90 font-medium align-top">
                    Saves the email for the <span className="text-emerald-300 font-bold underline decoration-emerald-500/50">Post-Game Review Room</span>.
                  </td>
                </tr>

                {/* ROW 4: REVIEW ROOM (PURPLE THEME) */}
                <tr className="bg-purple-950/20 hover:bg-purple-950/40 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-purple-300 align-top">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="inline-block w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />
                      <span className="px-2 py-0.5 rounded bg-purple-900/60 border border-purple-500/40 text-purple-200 text-xs">
                        End-of-Game Dashboard
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-200 align-top">
                    Inspect all <span className="text-purple-300 font-semibold">captured monsters</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 align-top">
                    Choose to <span className="text-red-400 font-bold">Kill</span> or <span className="text-emerald-400 font-bold">Release</span> each captured monster
                  </td>
                  <td className="py-2.5 px-3 text-purple-200/90 font-medium align-top">
                    <span className="text-red-400 font-bold">Kill</span> deletes the email to Recycle Bin; <span className="text-emerald-400 font-bold">Release</span> keeps it safely in your Inbox.
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Credit / Subtle Hero Note */}
        <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-slate-500 pb-2">
          <span>CHARACTER: JIN KAZAMA MARTIAL ARTIST</span>
          <span>•</span>
          <span>FALLING ROCK MONSTERS (GEODUDE STYLE)</span>
          <span>•</span>
          <span>HTML5 CANVAS 60FPS</span>
        </div>

      </div>
    </div>
  );
}
