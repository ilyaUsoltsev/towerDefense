const lib: Record<string, HTMLAudioElement> = {
  backgroundMusic: new Audio('/audio/music.mp3'),
  click: new Audio('/audio/click.wav'),
  win: new Audio('/audio/win.wav'),
  lose: new Audio('/audio/lose.wav'),

  enemyDeath: new Audio('/audio/enemy-death.wav'),
  enemySpawn: new Audio('/audio/spawn.wav'),
  enemyDespawn: new Audio('/audio/despawn.wav'),
  placeCannon: new Audio('/audio/place-cannon.wav'),
  basic: new Audio('/audio/basic-shot.wav'),
  fast: new Audio('/audio/fast-shot.wav'),
  rocket: new Audio('/audio/rocket-shot.wav'),
  sniper: new Audio('/audio/sniper-shot.wav'),
  freeze: new Audio('/audio/freeze-shot.wav'),
  upgrade: new Audio('/audio/upgrade.wav'),
};

export function SoundLib(name: string, vol?: number) {
  const audio = lib[name];
  if (!audio) throw new Error(`Sound "${name}" not found`);

  if (name === 'backgroundMusic') audio.autoplay = true;

  audio.volume = vol ? vol : 1;

  audio.currentTime = 0;
  audio.play();
}
