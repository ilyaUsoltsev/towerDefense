import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from '../store';
import { gameSetFullscreen, selectIsFullscreen } from '../slices/gameSlice';
import { fullscreenService } from '../utils/FullscreenService';

export function useFullscreenToggle() {
  const isFullscreen = useSelector(selectIsFullscreen);
  const dispatch = useDispatch();

  const enterFullscreen = useCallback(async () => {
    await fullscreenService.requestFullscreen(document.documentElement);
  }, []);

  const exitFullscreen = useCallback(async () => {
    await fullscreenService.exitFullscreen();
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (fullscreenService.isFullscreen()) {
        await exitFullscreen();
      } else {
        await enterFullscreen();
      }
    } catch (error) {
      console.error('Ошибка при переключении полноэкранного режима:', error);
    }
  }, [enterFullscreen, exitFullscreen]);

  useEffect(() => {
    const unsubscribe = fullscreenService.subscribe(() => {
      dispatch(gameSetFullscreen(fullscreenService.isFullscreen()));
    });
    return unsubscribe;
  }, [dispatch]);

  return {
    isFullscreen,
    toggleFullscreen,
    isSupported: fullscreenService.isSupported(),
  };
}
