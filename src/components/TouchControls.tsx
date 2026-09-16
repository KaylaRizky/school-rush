import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

interface TouchControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onJump: () => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onJump,
}) => {
  return (
    <div 
      id="touch-controls-container" 
      className="absolute bottom-4 left-0 right-0 px-4 flex items-center justify-between z-20 pointer-events-none sm:hidden"
    >
      {/* Left and Right directional buttons */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <button
          id="touch-btn-left"
          type="button"
          onTouchStart={(e) => { e.preventDefault(); onMoveLeft(); }}
          onClick={onMoveLeft}
          className="w-16 h-16 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-white flex items-center justify-center active:bg-sky-600 active:scale-95 shadow-xl transition-transform"
          aria-label="Geser Kiri"
        >
          <ArrowLeft className="w-8 h-8" />
        </button>

        <button
          id="touch-btn-right"
          type="button"
          onTouchStart={(e) => { e.preventDefault(); onMoveRight(); }}
          onClick={onMoveRight}
          className="w-16 h-16 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-white flex items-center justify-center active:bg-sky-600 active:scale-95 shadow-xl transition-transform"
          aria-label="Geser Kanan"
        >
          <ArrowRight className="w-8 h-8" />
        </button>
      </div>

      {/* Jump Button (large and distinct) */}
      <div className="pointer-events-auto">
        <button
          id="touch-btn-jump"
          type="button"
          onTouchStart={(e) => { e.preventDefault(); onJump(); }}
          onClick={onJump}
          className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-black flex flex-col items-center justify-center active:scale-95 active:from-amber-600 shadow-2xl transition-transform border border-amber-300/40"
          aria-label="Melompat"
        >
          <ArrowUp className="w-7 h-7 stroke-[3]" />
          <span className="text-[11px] font-black uppercase tracking-wider -mt-1">LOMPAT</span>
        </button>
      </div>
    </div>
  );
};
