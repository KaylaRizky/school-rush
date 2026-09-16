import React from 'react';
import { Play, RotateCcw, Home } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onMainMenu,
}) => {
  return (
    <div 
      id="modal-pause" 
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div 
        className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 text-white flex flex-col items-center text-center"
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
          <span className="text-xl">⏸️</span>
        </div>

        <h2 className="text-2xl font-black font-game text-white tracking-wide">
          GAME DI-PAUSE
        </h2>

        <p className="text-xs text-slate-400 mt-1 mb-5">
          Permainan sedang dihentikan sementara.
        </p>

        <div className="w-full flex flex-col gap-2.5">
          <button
            id="btn-pause-resume"
            onClick={onResume}
            className="w-full py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Lanjutkan</span>
          </button>

          <button
            id="btn-pause-restart"
            onClick={onRestart}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Mulai Ulang</span>
          </button>

          <button
            id="btn-pause-main-menu"
            onClick={onMainMenu}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-white font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Menu Utama</span>
          </button>
        </div>
      </div>
    </div>
  );
};
