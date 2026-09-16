import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameStatus } from './types';
import { GameEngine } from './game/engine';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from './game/constants';
import {
  drawBackground,
  drawScenery,
  drawObstacle,
  drawCollectible,
  drawPlayer,
  drawParticles,
} from './game/canvasRenderer';
import { soundManager } from './audio';

import { MenuScreen } from './components/MenuScreen';
import { GameHud } from './components/GameHud';
import { HowToPlayModal } from './components/HowToPlayModal';
import { GameOverModal } from './components/GameOverModal';
import { VictoryModal } from './components/VictoryModal';
import { PauseModal } from './components/PauseModal';
import { TouchControls } from './components/TouchControls';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const [status, setStatus] = useState<GameStatus>('MENU');
  const [score, setScore] = useState<number>(0);
  const [booksCollected, setBooksCollected] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('school_rush_highscore');
    return saved ? parseInt(saved, 10) || 0 : 0;
  });
  const [targetScore, setTargetScore] = useState<number>(() => {
    const saved = localStorage.getItem('school_rush_target_score');
    return saved ? parseInt(saved, 10) || 150 : 150;
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => soundManager.isEnabled());
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Initialize GameEngine
  useEffect(() => {
    const engine = new GameEngine(targetScore);
    engineRef.current = engine;

    engine.onStatusChange = (newStatus) => {
      setStatus(newStatus);
      if (newStatus === 'GAMEOVER' || newStatus === 'VICTORY') {
        const currentScore = engine.player.score;
        setHighScore((prev) => {
          if (currentScore > prev) {
            localStorage.setItem('school_rush_highscore', String(currentScore));
            return currentScore;
          }
          return prev;
        });
      }
    };

    engine.onScoreUpdate = (newScore, books) => {
      setScore(newScore);
      setBooksCollected(books);
    };

    engine.onLivesUpdate = (newLives) => {
      setLives(newLives);
    };

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [targetScore]);

  // Main Render & Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const renderLoop = (time: number) => {
      if (!isRunning) return;

      const engine = engineRef.current;
      if (engine) {
        // Update game state
        engine.update(time);

        // Clear canvas
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Apply screen shake if active
        ctx.save();
        if (engine.screenShake > 0) {
          const shakeX = (Math.random() - 0.5) * engine.screenShake;
          const shakeY = (Math.random() - 0.5) * engine.screenShake;
          ctx.translate(shakeX, shakeY);
        }

        // 1. Draw Background (Sky, Mountains, Road, distant school)
        const progress = Math.min(engine.player.score / engine.targetScore, 1);
        drawBackground(ctx, engine.roadOffset, progress);

        // 2. Draw Side Scenery (Trees, Lampposts)
        drawScenery(ctx, engine.scenery);

        // 3. Draw Collectibles & Obstacles sorted by depth z (furthest first)
        type RenderableItem = 
          | { kind: 'obstacle'; item: (typeof engine.obstacles)[0] }
          | { kind: 'collectible'; item: (typeof engine.collectibles)[0] };

        const itemsToDraw: RenderableItem[] = [
          ...engine.obstacles.map((item) => ({ kind: 'obstacle' as const, item })),
          ...engine.collectibles.map((item) => ({ kind: 'collectible' as const, item })),
        ];

        itemsToDraw.sort((a, b) => b.item.z - a.item.z);

        itemsToDraw.forEach((entry) => {
          if (entry.kind === 'obstacle') {
            drawObstacle(ctx, entry.item);
          } else {
            drawCollectible(ctx, entry.item, time);
          }
        });

        // 4. Draw Student Character
        drawPlayer(ctx, engine.player, time);

        // 5. Draw Particle effects & Floating text
        drawParticles(ctx, engine.particles);

        // Restore context from screen shake
        ctx.restore();
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const engine = engineRef.current;
      if (!engine) return;

      // Handle pause toggle
      if (e.code === 'KeyP' || e.code === 'Escape') {
        if (engine.status === 'PLAYING') {
          engine.pauseGame();
        } else if (engine.status === 'PAUSED') {
          engine.resumeGame();
        }
        return;
      }

      if (engine.status !== 'PLAYING') return;

      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          e.preventDefault();
          engine.moveLeft();
          break;
        case 'ArrowRight':
        case 'KeyD':
          e.preventDefault();
          engine.moveRight();
          break;
        case 'ArrowUp':
        case 'KeyW':
        case 'Space':
          e.preventDefault();
          engine.jump();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Controls Callbacks
  const handleStartGame = useCallback(() => {
    setIsHelpOpen(false);
    if (engineRef.current) {
      engineRef.current.targetScore = targetScore;
      engineRef.current.startGame();
    }
  }, [targetScore]);

  const handlePause = useCallback(() => {
    if (engineRef.current) engineRef.current.pauseGame();
  }, []);

  const handleResume = useCallback(() => {
    if (engineRef.current) engineRef.current.resumeGame();
  }, []);

  const handleRestart = useCallback(() => {
    if (engineRef.current) engineRef.current.restartGame();
  }, []);

  const handleMainMenu = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.status = 'MENU';
      setStatus('MENU');
    }
  }, []);

  const handleMoveLeft = useCallback(() => {
    if (engineRef.current) engineRef.current.moveLeft();
  }, []);

  const handleMoveRight = useCallback(() => {
    if (engineRef.current) engineRef.current.moveRight();
  }, []);

  const handleJump = useCallback(() => {
    if (engineRef.current) engineRef.current.jump();
  }, []);

  const handleToggleSound = useCallback(() => {
    const newSoundState = soundManager.toggleSound();
    setSoundEnabled(newSoundState);
  }, []);

  const handleChangeTargetScore = useCallback((newTarget: number) => {
    setTargetScore(newTarget);
    localStorage.setItem('school_rush_target_score', String(newTarget));
    if (engineRef.current) {
      engineRef.current.targetScore = newTarget;
    }
  }, []);

  return (
    <main className="w-screen h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden select-none">
      {/* Game Stage Container */}
      <div className="relative w-full h-full max-w-[900px] max-h-[675px] aspect-[4/3] bg-slate-900 shadow-2xl overflow-hidden flex items-center justify-center sm:rounded-2xl sm:border sm:border-slate-800">
        {/* Canvas Engine */}
        <canvas
          ref={canvasRef}
          id="school-rush-canvas"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="w-full h-full object-cover block"
        />

        {/* HUD (In-game score, lives, progress) */}
        {status === 'PLAYING' && (
          <>
            <GameHud
              score={score}
              targetScore={targetScore}
              booksCollected={booksCollected}
              lives={lives}
              onPause={handlePause}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
            />
            <TouchControls
              onMoveLeft={handleMoveLeft}
              onMoveRight={handleMoveRight}
              onJump={handleJump}
            />
          </>
        )}

        {/* Menu Screen */}
        {status === 'MENU' && (
          <MenuScreen
            onStartGame={handleStartGame}
            onOpenHelp={() => setIsHelpOpen(true)}
            highScore={highScore}
            targetScore={targetScore}
            onChangeTargetScore={handleChangeTargetScore}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
        )}

        {/* Pause Modal */}
        {status === 'PAUSED' && (
          <PauseModal
            onResume={handleResume}
            onRestart={handleRestart}
            onMainMenu={handleMainMenu}
          />
        )}

        {/* Game Over Modal */}
        {status === 'GAMEOVER' && (
          <GameOverModal
            score={score}
            booksCollected={booksCollected}
            highScore={highScore}
            onRestart={handleRestart}
            onMainMenu={handleMainMenu}
          />
        )}

        {/* Victory Modal */}
        {status === 'VICTORY' && (
          <VictoryModal
            score={score}
            booksCollected={booksCollected}
            lives={lives}
            highScore={highScore}
            onRestart={handleRestart}
            onMainMenu={handleMainMenu}
          />
        )}

        {/* How to Play Modal */}
        <HowToPlayModal
          isOpen={isHelpOpen}
          onClose={() => setIsHelpOpen(false)}
          onStartGame={handleStartGame}
        />
      </div>
    </main>
  );
}
