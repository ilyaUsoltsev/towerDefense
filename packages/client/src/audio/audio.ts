const sounds: Record<string, HTMLAudioElement> = {
  backgroundMusic: new Audio('/audio/music.mp3'),
  click: new Audio('/audio/click.wav'),
  win: new Audio('/audio/win.wav'),
  loss: new Audio('/audio/lose.wav'),

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
const volume: Record<string, number> = {
  backgroundMusic: 0.2,
  click: 1,
  win: 1,
  lose: 1,

  enemyDeath: 1,
  enemySpawn: 1,
  enemyDespawn: 1,
  placeCannon: 0.3,
  basic: 1,
  fast: 1,
  rocket: 1,
  sniper: 1,
  freeze: 1,
  upgrade: 1,
};

export function SoundLib(name: keyof typeof sounds) {
  const audio = sounds[name];
  if (!audio) throw new Error(`Sound "${name}" not found`);

  if (name === 'backgroundMusic') audio.loop = true;

  const vol = volume[name];
  audio.volume = typeof vol === 'number' ? vol : 1;

  audio.currentTime = 0;
  audio.play();
}

export function StopSound(name: keyof typeof sounds) {
  if (!sounds[name]) throw new Error(`Sound "${name}" not found`);
  sounds[name].pause();
}
