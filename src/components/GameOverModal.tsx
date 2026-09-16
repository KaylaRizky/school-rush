import React from 'react';
import { RotateCcw, Home, Trophy, BookOpen, Skull } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  booksCollected: number;
  highScore: number;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  booksCollected,
  highScore,
  onRestart,
  onMainMenu,
}) => {
  const isNewHighScore = score > 0 && score >= highScore;

  return (
    <div 
      id="modal-game-over" 
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div 
        className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border border-rose-500/40 rounded-3xl shadow-[0_0_50px_rgba(244,63,94,0.25)] p-6 sm:p-7 text-white flex flex-col items-center text-center"
      >
        {/* Icon & Title */}
        <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 mb-3">
          <Skull className="w-9 h-9" />
        </div>

        <h2 
          id="text-game-over-title" 
          className="text-4xl font-black font-game text-rose-500 tracking-wider drop-shadow-[0_2px_10px_rgba(244,63,94,0.5)]"
        >
          GAME OVER
        </h2>

        <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
          Nyawa kamu habis! Jangan berkecil hati, ayo coba lari lagi ke sekolah.
        </p>

        {/* Stats card */}
        <div className="w-full bg-slate-850/90 rounded-2xl p-4 my-5 border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Skor Akhir</span>
            <span id="game-over-final-score" className="text-2xl font-black font-mono text-white">
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

          {isNewHighScore && (
            <div className="mt-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 py-1 px-2 rounded-lg text-xs font-bold animate-pulse">
              🎉 Rekor Skor Baru Tercapai!
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            id="btn-game-over-restart"
            onClick={onRestart}
            className="w-full py-3.5 px-5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm tracking-wide uppercase shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 stroke-[3]" />
            <span>MAIN LAGI</span>
          </button>

          <button
            id="btn-game-over-menu"
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
