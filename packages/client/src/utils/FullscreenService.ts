import {
  DocumentWithFullscreen,
  HTMLElementWithFullscreen,
} from './webApiTypes';

export class FullscreenService {
  static isSupported(): boolean {
    const doc = document as DocumentWithFullscreen;
    return !!(
      doc.fullscreenEnabled ||
      doc.webkitFullscreenElement !== undefined ||
      doc.mozFullScreenElement !== undefined ||
      doc.msFullscreenElement !== undefined
    );
  }

  static async requestFullscreen(element: HTMLElement): Promise<void> {
    const elem = element as HTMLElementWithFullscreen;

    try {
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        await elem.mozRequestFullScreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      } else {
        throw new Error('Fullscreen API не поддерживается');
      }
    } catch (error) {
      console.error('Ошибка при входе в полноэкранный режим:', error);
      throw error;
    }
  }

  static async exitFullscreen(): Promise<void> {
    const doc = document as DocumentWithFullscreen;

    try {
      if (doc.exitFullscreen) {
        await doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        await doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        await doc.msExitFullscreen();
      } else {
        throw new Error('Fullscreen API не поддерживается');
      }
    } catch (error) {
      console.error('Ошибка при выходе из полноэкранного режима:', error);
      throw error;
    }
  }

  static isFullscreen(): boolean {
    const doc = document as DocumentWithFullscreen;
    return !!(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    );
  }

  static addEventListener(handler: () => void): () => void {
    const events = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'MSFullscreenChange',
    ];

    events.forEach(event => {
      document.addEventListener(event, handler);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handler);
      });
    };
  }
}
