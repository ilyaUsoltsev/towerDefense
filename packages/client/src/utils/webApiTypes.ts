export interface DocumentWithFullscreen extends Document {
  readonly fullscreenElement: Element | null;
  exitFullscreen: () => Promise<void>;

  readonly webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;

  readonly mozFullScreenElement?: Element | null;
  mozCancelFullScreen?: () => Promise<void>;

  readonly msFullscreenElement?: Element | null;
  msExitFullscreen?: () => Promise<void>;
}

export interface HTMLElementWithFullscreen extends HTMLElement {
  requestFullscreen: () => Promise<void>;

  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}
