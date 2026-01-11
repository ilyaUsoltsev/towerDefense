import { useEffect, useRef } from 'react';
import GameEngine from './core/gameEngine';
import { GameEngineAdapter } from './adapters/GameEngineAdapter';
import { useStore } from '../../store';

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const store = useStore();

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const gameEngine = new GameEngine(canvasRef.current);
    const adapter = new GameEngineAdapter(gameEngine, store);

    const unsubscribeFromStore = store.subscribe(() => {
      adapter.syncState(store.getState());
    });

    adapter.init();
    gameEngine.start();

    return () => {
      adapter.removeSubscriptions();
      gameEngine.stop();
      unsubscribeFromStore();
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default Game;
