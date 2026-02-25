type SoundName =
  | 'backgroundMusic'
  | 'click'
  | 'win'
  | 'lose'
  | 'enemy-death'
  | 'spawn'
  | 'despawn'
  | 'place-cannon'
  | 'basic'
  | 'fast'
  | 'rocket'
  | 'sniper'
  | 'freeze'
  | 'upgrade';

class SoundManager {
  private sounds: Record<SoundName, HTMLAudioElement | null> = {
    backgroundMusic: null,
    click: null,
    win: null,
    lose: null,
    'enemy-death': null,
    spawn: null,
    despawn: null,
    'place-cannon': null,
    basic: null,
    fast: null,
    rocket: null,
    sniper: null,
    freeze: null,
    upgrade: null,
  };
  private volume: Record<SoundName, number> = {
    backgroundMusic: 0.2,
    click: 1,
    win: 1,
    lose: 1,
    'enemy-death': 1,
    spawn: 1,
    despawn: 1,
    'place-cannon': 0.3,
    basic: 1,
    fast: 1,
    rocket: 1,
    sniper: 1,
    freeze: 1,
    upgrade: 1,
  };
  private isClient: boolean;

  constructor() {
    this.isClient = typeof window !== 'undefined';
    if (this.isClient) this.initSounds();
  }

  private initSounds() {
    (Object.keys(this.volume) as SoundName[]).forEach(name => {
      if (name === 'backgroundMusic') {
        this.sounds[name] = new Audio(`/audio/background-music.mp3`);
      } else {
        this.sounds[name] = new Audio(`/audio/${name}.wav`);
      }
    });
  }

  play(name: SoundName) {
    if (!this.isClient) {
      console.debug(`[SSR] Sound "${name}" would play on client`);
      return;
    }

    const audio = this.sounds[name];
    if (!audio) throw new Error(`Sound "${name}" not found`);

    if (name === 'backgroundMusic') audio.loop = true;
    audio.volume = this.volume[name] ?? 1;
    audio.currentTime = 0;
    audio.play().catch(err => console.error('Audio play error:', err));
  }

  stop(name: SoundName) {
    if (!this.isClient || !this.sounds[name]) return;
    this.sounds[name]?.pause();
  }
}

export const soundManager = new SoundManager();

// Экспорт функций для обратной совместимости
export const SoundLib = soundManager.play.bind(soundManager);
export const StopSound = soundManager.stop.bind(soundManager);
