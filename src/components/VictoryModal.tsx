import React from 'react';
import { RotateCcw, Home, Trophy, BookOpen, Star, Sparkles } from 'lucide-react';

interface VictoryModalProps {
  score: number;
  booksCollected: number;
  lives: number;
  highScore: number;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  score,
  booksCollected,
  lives,
  highScore,
  onRestart,
  onMainMenu,
}) => {
  return (
    <div 
      id="modal-victory" 
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div 
        className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-400/50 rounded-3xl shadow-[0_0_60px_rgba(251,191,36,0.3)] p-6 sm:p-7 text-white flex flex-col items-center text-center relative overflow-hidden"
      >
        {/* Confetti decoration / glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* Trophy icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 mb-2 shadow-inner">
          <Trophy className="w-9 h-9" />
        </div>

        {/* Stars based on remaining lives */}
        <div className="flex items-center gap-1.5 my-1.5">
          {[1, 2, 3].map((starIndex) => (
            <Star
              key={starIndex}
              className={`w-6 h-6 ${
                starIndex <= lives
                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)]'
                  : 'fill-slate-800 text-slate-700'
              }`}
            />
          ))}
        </div>

        <h2 
          id="text-victory-title" 
          className="text-4xl font-black font-game text-amber-300 tracking-wider drop-shadow-[0_2px_12px_rgba(251,191,36,0.6)]"
        >
          SELAMAT!
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium flex items-center gap-1.5 justify-center">
          <Sparkles className="w-4 h-4 text-emerald-400 inline" />
          Kamu tiba di sekolah tepat waktu sebelum bel masuk! 🔔
        </p>

        {/* Stats card */}
        <div className="w-full bg-slate-850/90 rounded-2xl p-4 my-5 border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Skor Akhir</span>
            <span id="victory-final-score" className="text-2xl font-black font-mono text-emerald-400">
              {score}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              Buku Terkumpul
            </span>
            <span className="font-mono font-bold text-amber-300">
              {booksCollected} Buku
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-sky-400" />
              Skor Tertinggi
            </span>
            <span className="font-mono font-bold text-sky-300">
              {highScore}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            id="btn-victory-restart"
            onClick={onRestart}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-400 via-amber-400 to-emerald-400 text-slate-950 font-black text-sm tracking-wide uppercase shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 stroke-[3]" />
            <span>MAIN LAGI</span>
          </button>

          <button
            id="btn-victory-menu"
            onClick={onMainMenu}
            className="w-full py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs tracking-wide uppercase transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>MENU UTAMA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
