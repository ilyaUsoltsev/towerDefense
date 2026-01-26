import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector, RootState } from '../store';
import { gameSetFullscreen } from '../slices/gameSlice';
import { FullscreenService } from '../utils/FullscreenService';

export function useFullscreen() {
  const isFullscreen = useSelector(
    (state: RootState) => state.game.isFullscreen
  );
  const dispatch = useDispatch();

  const toggleFullscreen = useCallback(async () => {
    try {
      if (FullscreenService.isFullscreen()) {
        await FullscreenService.exitFullscreen();
        dispatch(gameSetFullscreen(false));
      } else {
        await FullscreenService.requestFullscreen(document.documentElement);
        dispatch(gameSetFullscreen(true));
      }
    } catch (error) {
      console.error('Ошибка при переключении полноэкранного режима:', error);
    }
  }, [dispatch]);

  // Синхронизация с браузером (обработка ESC)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = FullscreenService.isFullscreen();
      dispatch(gameSetFullscreen(isCurrentlyFullscreen));
    };

    const cleanup = FullscreenService.addEventListener(handleFullscreenChange);
    return cleanup;
  }, [dispatch]);

  return {
    isFullscreen,
    toggleFullscreen,
    isSupported: FullscreenService.isSupported(),
  };
}
