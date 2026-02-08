import {
  DocumentWithFullscreen,
  HTMLElementWithFullscreen,
} from './webApiTypes';

export interface IFullscreenService {
  isSupported(): boolean;
  requestFullscreen(element: HTMLElement): Promise<void>;
  exitFullscreen(): Promise<void>;
  isFullscreen(): boolean;
  subscribe(handler: () => void): () => void;
}

const FULLSCREEN_EVENTS = [
  'fullscreenchange',
  'webkitfullscreenchange',
  'mozfullscreenchange',
  'MSFullscreenChange',
];

function getRequestMethod(
  elem: HTMLElementWithFullscreen
): (() => Promise<void>) | undefined {
  return (
    elem.requestFullscreen ??
    elem.webkitRequestFullscreen ??
    elem.mozRequestFullScreen ??
    elem.msRequestFullscreen
  );
}

function getExitMethod(
  doc: DocumentWithFullscreen
): (() => Promise<void>) | undefined {
  return (
    doc.exitFullscreen ??
    doc.webkitExitFullscreen ??
    doc.mozCancelFullScreen ??
    doc.msExitFullscreen
  );
}

export class FullscreenService implements IFullscreenService {
  isSupported(): boolean {
    const doc = document as DocumentWithFullscreen;
    return (
      doc.fullscreenEnabled ||
      doc.webkitFullscreenElement !== undefined ||
      doc.mozFullScreenElement !== undefined ||
      doc.msFullscreenElement !== undefined
    );
  }

  async requestFullscreen(element: HTMLElement): Promise<void> {
    const request = getRequestMethod(element as HTMLElementWithFullscreen);
    if (!request) {
      throw new Error('Fullscreen API не поддерживается');
    }
    await request.call(element);
  }

  async exitFullscreen(): Promise<void> {
    const exit = getExitMethod(document as DocumentWithFullscreen);
    if (!exit) {
      throw new Error('Fullscreen API не поддерживается');
    }
    await exit.call(document);
  }

  isFullscreen(): boolean {
    const doc = document as DocumentWithFullscreen;
    return (
      !!doc.fullscreenElement ||
      !!doc.webkitFullscreenElement ||
      !!doc.mozFullScreenElement ||
      !!doc.msFullscreenElement
    );
  }

  subscribe(handler: () => void): () => void {
    FULLSCREEN_EVENTS.forEach(event => {
      document.addEventListener(event, handler);
    });

    return () => {
      FULLSCREEN_EVENTS.forEach(event => {
        document.removeEventListener(event, handler);
      });
    };
  }
}

export const fullscreenService = new FullscreenService();
