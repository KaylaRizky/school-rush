import React from 'react';
import { Heart, Volume2, VolumeX, Pause, BookOpen } from 'lucide-react';
import { soundManager } from '../audio';

interface GameHudProps {
  score: number;
  targetScore: number;
  booksCollected: number;
  lives: number;
  onPause: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const GameHud: React.FC<GameHudProps> = ({
  score,
  targetScore,
  booksCollected,
  lives,
  onPause,
  soundEnabled,
  onToggleSound,
}) => {
  const progress = Math.min(Math.round((score / targetScore) * 100), 100);

  return (
    <header className="absolute top-0 left-0 right-0 p-3 sm:p-4 z-20 flex flex-col gap-2 pointer-events-none" aria-label="Game HUD">
      <div className="flex items-center justify-between gap-3 w-full">
        {/* Lives (Nyawa) */}
        <div 
          id="hud-lives-container" 
          className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700/60 shadow-lg pointer-events-auto"
        >
          <span className="text-xs font-bold text-slate-300 mr-1 uppercase tracking-wider hidden sm:inline">Nyawa:</span>
          {[1, 2, 3].map((heartIndex) => {
            const isAlive = heartIndex <= lives;
            return (
              <Heart
                key={heartIndex}
                className={`w-6 h-6 transition-all duration-300 ${
                  isAlive
                    ? 'fill-rose-500 text-rose-500 scale-100 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                    : 'fill-slate-700/50 text-slate-600 scale-90'
                } ${lives === 1 && isAlive ? 'animate-pulse' : ''}`}
              />
            );
          })}
        </div>

        {/* Score and Books Collected */}
        <div 
          id="hud-score-container" 
          className="flex items-center gap-4 bg-slate-900/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700/60 shadow-lg pointer-events-auto"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-semibold text-slate-300 hidden md:inline">Buku:</span>
            <span className="text-base font-bold text-amber-300 font-mono">{booksCollected}</span>
          </div>
          <div className="w-px h-5 bg-slate-700" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skor:</span>
            <span className="text-lg sm:text-xl font-black text-white font-mono">{score}</span>
            <span className="text-xs font-bold text-slate-400">/{targetScore}</span>
          </div>
        </div>

        {/* Controls: Sound & Pause */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            id="btn-sound-toggle"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
            className="p-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-all shadow-md active:scale-95"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
          </button>
          <button
            id="btn-game-pause"
            onClick={onPause}
            aria-label="Pause Permainan"
            className="p-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-all shadow-md active:scale-95"
          >
            <Pause className="w-5 h-5 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Progress Bar to School */}
      <div 
        id="hud-progress-bar-container" 
        className="w-full max-w-md mx-auto bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/60 shadow-md pointer-events-auto"
      >
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 mb-1 px-1">
          <span>Perjalanan Siswa</span>
          <span className="text-sky-400">{progress}% Tiba di Sekolah 🏫</span>
        </div>
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 via-amber-400 to-emerald-400 transition-all duration-300 shadow-[0_0_10px_rgba(56,189,248,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </header>
  );
};
