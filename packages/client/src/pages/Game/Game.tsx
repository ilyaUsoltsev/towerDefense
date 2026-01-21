import { useEffect, useRef } from 'react';
import GameEngine from './core/gameEngine';
import { GameEngineAdapter } from './adapters/GameEngineAdapter';
import { useStore } from '../../store';
import { NotificationService } from '../../utils/NotificationService';

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const store = useStore();

  useEffect(() => {
    NotificationService.requestPermission().catch(console.warn);

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
