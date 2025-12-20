import { useEffect, useRef } from 'react';
import GameEngine from './core/gameEngine';

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameEngine | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      gameRef.current = new GameEngine(canvasRef.current);
      gameRef.current.start();
    }

    return () => {
      gameRef.current?.stop();
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default Game;
