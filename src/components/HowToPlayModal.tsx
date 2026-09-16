import React from 'react';
import { X, ArrowUp, ArrowLeft, ArrowRight, Heart, Trophy, BookOpen, AlertTriangle, Play } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  onClose,
  onStartGame,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="modal-how-to-play" 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-7 text-white flex flex-col max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              ?
            </div>
            <div>
              <h2 className="text-xl font-black font-game text-white">Cara Bermain</h2>
              <p className="text-xs text-slate-400">Panduan lengkap bermain School Rush</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup Panduan"
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content sections */}
        <div className="flex flex-col gap-5 text-sm">
          {/* Section 1: Keyboard Controls */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5 flex items-center gap-1.5">
              <span>🎮</span> Kontrol Tombol (Keyboard & Layar)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 flex flex-col items-center text-center">
                <div className="flex items-center gap-1 mb-1.5">
                  <span className="px-2 py-1 rounded bg-slate-700 font-mono font-bold text-xs">W</span>
                  <span className="text-slate-400 text-xs">/</span>
                  <ArrowUp className="w-4 h-4 text-amber-400" />
                </div>
                <strong className="text-xs text-white">Melompat</strong>
                <span className="text-[11px] text-slate-400">Lewati rintangan di jalan</span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 flex flex-col items-center text-center">
                <div className="flex items-center gap-1 mb-1.5">
                  <span className="px-2 py-1 rounded bg-slate-700 font-mono font-bold text-xs">A</span>
                  <span className="text-slate-400 text-xs">/</span>
                  <ArrowLeft className="w-4 h-4 text-sky-400" />
                </div>
                <strong className="text-xs text-white">Geser Kiri</strong>
                <span className="text-[11px] text-slate-400">Pindah ke lajur kiri</span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 flex flex-col items-center text-center">
                <div className="flex items-center gap-1 mb-1.5">
                  <span className="px-2 py-1 rounded bg-slate-700 font-mono font-bold text-xs">D</span>
                  <span className="text-slate-400 text-xs">/</span>
                  <ArrowRight className="w-4 h-4 text-sky-400" />
                </div>
                <strong className="text-xs text-white">Geser Kanan</strong>
                <span className="text-[11px] text-slate-400">Pindah ke lajur kanan</span>
              </div>
            </div>
          </div>

          {/* Section 2: Items to Collect */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> Item Yang Harus Dikumpulkan
            </h3>
            <div className="bg-slate-800/50 rounded-2xl p-3.5 border border-slate-700/60 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📘</span>
                  <span className="font-semibold text-slate-200">Buku Pelajaran & Kamus</span>
                </div>
                <span className="font-mono font-bold text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded-md">+10 Poin</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⭐</span>
                  <span className="font-semibold text-amber-200">Buku Emas (Spesial Melayang)</span>
                </div>
                <span className="font-mono font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md">+25 Poin</span>
              </div>
            </div>
          </div>

          {/* Section 3: Obstacles */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Rintangan Yang Harus Dihindari
            </h3>
            <div className="bg-slate-800/50 rounded-2xl p-3.5 border border-slate-700/60 text-xs text-slate-300 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="text-lg">🎒 🗑️ 🪨 🚧</span>
                <span><strong>Tas Sekolah, Tempat Sampah, Batu & Kerucut</strong>: Menabrak akan mengurangi <strong>1 Nyawa</strong>! Hindari dengan geser lajur atau lompati!</span>
              </div>
            </div>
          </div>

          {/* Section 4: Rules & Win Condition */}
          <div className="bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-sky-500/15 p-4 rounded-2xl border border-amber-400/30 text-xs">
            <div className="flex items-start gap-2.5">
              <Trophy className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block text-sm mb-1">Target & Ketentuan Menang:</strong>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  <li>Pemain memiliki <strong className="text-rose-400">3 Nyawa</strong> ❤️. Jika habis, Game Over.</li>
                  <li>Capai target skor (default <strong className="text-amber-300">150 Poin</strong>) untuk memenangkan game dan tiba di gerbang sekolah! 🏫</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={() => {
              onClose();
              onStartGame();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Mulai Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
