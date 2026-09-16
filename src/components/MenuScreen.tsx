import React from 'react';
import { Play, HelpCircle, Trophy, GraduationCap, Volume2, VolumeX } from 'lucide-react';

interface MenuScreenProps {
  onStartGame: () => void;
  onOpenHelp: () => void;
  highScore: number;
  targetScore: number;
  onChangeTargetScore: (target: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({
  onStartGame,
  onOpenHelp,
  highScore,
  targetScore,
  onChangeTargetScore,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <div 
      id="menu-screen-container" 
      className="absolute inset-0 z-30 flex flex-col items-center justify-between p-6 sm:p-8 bg-gradient-to-b from-sky-900/90 via-slate-900/95 to-slate-950/98 backdrop-blur-md text-white overflow-y-auto"
    >
      {/* Top bar: Class project badge & Sound button */}
      <div className="w-full max-w-md flex items-center justify-between">
        <div 
          id="badge-class-project" 
          className="flex items-center gap-1.5 bg-sky-500/20 text-sky-300 border border-sky-400/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide"
        >
          <GraduationCap className="w-4 h-4 text-sky-400" />
          <span>Tugas Kelas XI RPL / Gim</span>
        </div>

        <button
          id="menu-btn-sound-toggle"
          onClick={onToggleSound}
          aria-label={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
          className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      {/* Main Title & Hero Center */}
      <div className="flex flex-col items-center text-center my-auto py-6">
        {/* Animated Badge Icon */}
        <div className="relative mb-3 animate-float">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 via-sky-500 to-emerald-400 p-1 shadow-[0_0_30px_rgba(56,189,248,0.4)] flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center text-4xl">
              🏃‍♂️📚
            </div>
          </div>
          <span className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
            SMA
          </span>
        </div>

        <h1 
          id="game-main-title" 
          className="text-5xl sm:text-6xl font-black tracking-tight text-white font-game drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] bg-gradient-to-r from-amber-300 via-sky-200 to-white bg-clip-text text-transparent"
        >
          School Rush
        </h1>

        <p id="game-main-subtitle" className="mt-2 text-sm sm:text-base text-slate-300 max-w-sm font-medium leading-relaxed">
          Bantu siswa berlari ke sekolah tepat waktu! Kumpulkan buku pelajaran dan hindari berbagai rintangan di jalan.
        </p>

        {/* High Score banner */}
        {highScore > 0 && (
          <div 
            id="badge-high-score" 
            className="mt-4 inline-flex items-center gap-2 bg-amber-500/15 border border-amber-400/40 text-amber-300 px-3.5 py-1.5 rounded-xl text-xs font-bold"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Skor Tertinggi Kamu: <strong className="font-mono text-sm text-white">{highScore}</strong></span>
          </div>
        )}

        {/* Target Score Selector */}
        <div className="mt-5 flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Target Skor Menang:</span>
          <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            {[100, 150, 200].map((scoreOption) => (
              <button
                key={scoreOption}
                type="button"
                onClick={() => onChangeTargetScore(scoreOption)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  targetScore === scoreOption
                    ? 'bg-amber-400 text-slate-950 shadow'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                {scoreOption} Poin
              </button>
            ))}
          </div>
        </div>

        {/* Main Action Buttons */}
        <div className="mt-8 flex flex-col w-full max-w-xs gap-3">
          <button
            id="btn-start-game"
            onClick={onStartGame}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-slate-950 font-black text-lg tracking-wide uppercase shadow-[0_0_25px_rgba(251,191,36,0.5)] hover:shadow-[0_0_35px_rgba(251,191,36,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-amber-200"
          >
            <Play className="w-6 h-6 fill-slate-950" />
            <span>MULAI GAME</span>
          </button>

          <button
            id="btn-how-to-play"
            onClick={onOpenHelp}
            className="w-full py-3 px-6 rounded-2xl bg-slate-800/90 text-slate-200 hover:text-white hover:bg-slate-700 font-bold text-sm tracking-wide transition-all border border-slate-700 flex items-center justify-center gap-2 active:scale-95"
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span>CARA BERMAIN</span>
          </button>
        </div>
      </div>

      {/* Footer info */}
      <footer className="w-full max-w-md text-center text-xs text-slate-300 font-medium">
        Gunakan Keyboard Desktop (<kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">W</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">A</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">D</kbd> atau Panah)
      </footer>
    </div>
  );
};
